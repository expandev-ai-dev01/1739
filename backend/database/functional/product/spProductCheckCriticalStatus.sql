/**
 * @summary
 * Checks and updates the critical status of a product based on current stock quantity
 * and configured minimum stock level. Creates or updates critical stock history records.
 * 
 * @procedure spProductCheckCriticalStatus
 * @schema functional
 * @type stored-procedure
 * 
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 * 
 * @param {INT} idProduct
 *   - Required: Yes
 *   - Description: Product identifier to check
 * 
 * @testScenarios
 * - Product enters critical status (quantity <= minimumStock)
 * - Product exits critical status (quantity > minimumStock)
 * - Product already in critical status with lower quantity
 * - Product not found
 * - No current stock record exists
 */
CREATE OR ALTER PROCEDURE [functional].[spProductCheckCriticalStatus]
  @idAccount INT,
  @idProduct INT
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Required parameter validation
   * @throw {parameterRequired}
   */
  IF (@idAccount IS NULL)
  BEGIN
    ;THROW 51000, 'idAccountRequired', 1;
  END;

  IF (@idProduct IS NULL)
  BEGIN
    ;THROW 51000, 'idProductRequired', 1;
  END;

  /**
   * @validation Product existence validation
   * @throw {productDoesntExist}
   */
  IF NOT EXISTS (
    SELECT *
    FROM [functional].[product] [prd]
    WHERE [prd].[idProduct] = @idProduct
      AND [prd].[idAccount] = @idAccount
      AND [prd].[deleted] = 0
  )
  BEGIN
    ;THROW 51000, 'productDoesntExist', 1;
  END;

  DECLARE @currentQuantity INT;
  DECLARE @minimumStock INT;
  DECLARE @currentCriticalStatus BIT;
  DECLARE @newCriticalStatus BIT;
  DECLARE @verificationDate DATETIME2 = GETUTCDATE();

  /**
   * @rule {fn-critical-status-check} Get current product data
   */
  SELECT
    @currentQuantity = ISNULL([cst].[currentQuantity], 0),
    @minimumStock = [prd].[minimumStock],
    @currentCriticalStatus = [prd].[criticalStatus]
  FROM [functional].[product] [prd]
    LEFT JOIN [functional].[currentStock] [cst] ON ([cst].[idAccount] = [prd].[idAccount] AND [cst].[idProduct] = [prd].[idProduct])
  WHERE [prd].[idProduct] = @idProduct
    AND [prd].[idAccount] = @idAccount;

  /**
   * @rule {fn-critical-status-determination} Determine new critical status
   * Product is critical when currentQuantity <= minimumStock
   */
  IF (@currentQuantity <= @minimumStock)
  BEGIN
    SET @newCriticalStatus = 1;
  END
  ELSE
  BEGIN
    SET @newCriticalStatus = 0;
  END;

  BEGIN TRY
    BEGIN TRAN;

      /**
       * @rule {fn-critical-status-update} Update product critical status if changed
       */
      IF (@currentCriticalStatus <> @newCriticalStatus)
      BEGIN
        UPDATE [functional].[product]
        SET
          [criticalStatus] = @newCriticalStatus,
          [dateModified] = @verificationDate
        WHERE [idProduct] = @idProduct
          AND [idAccount] = @idAccount;

        /**
         * @rule {fn-critical-history-entry} Handle critical status history
         */
        IF (@newCriticalStatus = 1)
        BEGIN
          -- Product entering critical status
          INSERT INTO [functional].[criticalStockHistory] (
            [idAccount],
            [idProduct],
            [entryDate],
            [exitDate],
            [minimumQuantity],
            [dateCreated],
            [dateModified]
          )
          VALUES (
            @idAccount,
            @idProduct,
            @verificationDate,
            NULL,
            @currentQuantity,
            @verificationDate,
            @verificationDate
          );
        END
        ELSE
        BEGIN
          -- Product exiting critical status
          UPDATE [functional].[criticalStockHistory]
          SET
            [exitDate] = @verificationDate,
            [dateModified] = @verificationDate
          WHERE [idAccount] = @idAccount
            AND [idProduct] = @idProduct
            AND [exitDate] IS NULL;
        END;
      END
      ELSE IF (@newCriticalStatus = 1)
      BEGIN
        /**
         * @rule {fn-critical-history-minimum-update} Update minimum quantity if still critical
         */
        UPDATE [functional].[criticalStockHistory]
        SET
          [minimumQuantity] = CASE
            WHEN @currentQuantity < [minimumQuantity] THEN @currentQuantity
            ELSE [minimumQuantity]
          END,
          [dateModified] = @verificationDate
        WHERE [idAccount] = @idAccount
          AND [idProduct] = @idProduct
          AND [exitDate] IS NULL;
      END;

      /**
       * @output {CriticalStatusCheck, 1, 1}
       * @column {INT} idProduct
       *   - Description: Product identifier
       * @column {BIT} criticalStatus
       *   - Description: Current critical status (0=normal, 1=critical)
       * @column {INT} currentQuantity
       *   - Description: Current stock quantity
       * @column {INT} minimumStock
       *   - Description: Configured minimum stock level
       * @column {DATETIME2} verificationDate
       *   - Description: Date and time of verification
       */
      SELECT
        @idProduct AS [idProduct],
        @newCriticalStatus AS [criticalStatus],
        @currentQuantity AS [currentQuantity],
        @minimumStock AS [minimumStock],
        @verificationDate AS [verificationDate];

    COMMIT TRAN;
  END TRY
  BEGIN CATCH
    ROLLBACK TRAN;
    THROW;
  END CATCH;
END;
GO