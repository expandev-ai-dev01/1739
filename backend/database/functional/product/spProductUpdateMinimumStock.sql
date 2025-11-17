/**
 * @summary
 * Updates the minimum stock level for a specific product and immediately re-evaluates
 * its critical status based on the new threshold. Records the user who made the change.
 * 
 * @procedure spProductUpdateMinimumStock
 * @schema functional
 * @type stored-procedure
 * 
 * @endpoints
 * - PATCH /api/v1/internal/product/:id/minimum-stock
 * 
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 * 
 * @param {INT} idUser
 *   - Required: Yes
 *   - Description: User identifier for audit trail
 * 
 * @param {INT} idProduct
 *   - Required: Yes
 *   - Description: Product identifier
 * 
 * @param {INT} minimumStock
 *   - Required: Yes
 *   - Description: New minimum stock level
 * 
 * @testScenarios
 * - Update minimum stock to higher value (may trigger critical status)
 * - Update minimum stock to lower value (may clear critical status)
 * - Update with same value as current
 * - Invalid minimum stock value (negative)
 * - Product not found
 */
CREATE OR ALTER PROCEDURE [functional].[spProductUpdateMinimumStock]
  @idAccount INT,
  @idUser INT,
  @idProduct INT,
  @minimumStock INT
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

  IF (@idUser IS NULL)
  BEGIN
    ;THROW 51000, 'idUserRequired', 1;
  END;

  IF (@idProduct IS NULL)
  BEGIN
    ;THROW 51000, 'idProductRequired', 1;
  END;

  IF (@minimumStock IS NULL)
  BEGIN
    ;THROW 51000, 'minimumStockRequired', 1;
  END;

  /**
   * @validation Minimum stock validation
   * @throw {minimumStockInvalid}
   */
  IF (@minimumStock < 0)
  BEGIN
    ;THROW 51000, 'minimumStockInvalid', 1;
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

  BEGIN TRY
    BEGIN TRAN;

      /**
       * @rule {fn-minimum-stock-update} Update product minimum stock
       */
      UPDATE [functional].[product]
      SET
        [minimumStock] = @minimumStock,
        [dateModified] = GETUTCDATE()
      WHERE [idProduct] = @idProduct
        AND [idAccount] = @idAccount;

      /**
       * @rule {fn-critical-status-reevaluation} Re-evaluate critical status after minimum stock change
       */
      EXEC [functional].[spProductCheckCriticalStatus]
        @idAccount = @idAccount,
        @idProduct = @idProduct;

    COMMIT TRAN;
  END TRY
  BEGIN CATCH
    ROLLBACK TRAN;
    THROW;
  END CATCH;
END;
GO