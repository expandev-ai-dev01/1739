/**
 * @summary
 * Creates a new stock movement record (entry or exit) and automatically updates
 * the current stock quantity for the product. Validates product existence and
 * quantity constraints based on movement type.
 * 
 * @procedure spStockMovementCreate
 * @schema functional
 * @type stored-procedure
 * 
 * @endpoints
 * - POST /api/v1/internal/stock-movement
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
 * @param {VARCHAR(10)} movementType
 *   - Required: Yes
 *   - Description: Type of movement (ENTRY or EXIT)
 * 
 * @param {INT} quantity
 *   - Required: Yes
 *   - Description: Quantity to add or remove from stock
 * 
 * @param {DATETIME2} movementDate
 *   - Required: No
 *   - Description: Date and time of movement (defaults to current UTC time)
 * 
 * @testScenarios
 * - Valid entry movement creation
 * - Valid exit movement creation
 * - Exit with insufficient stock
 * - Invalid movement type
 * - Product not found
 * - Negative quantity validation
 */
CREATE OR ALTER PROCEDURE [functional].[spStockMovementCreate]
  @idAccount INT,
  @idUser INT,
  @idProduct INT,
  @movementType VARCHAR(10),
  @quantity INT,
  @movementDate DATETIME2 = NULL
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

  IF (@movementType IS NULL OR LTRIM(RTRIM(@movementType)) = '')
  BEGIN
    ;THROW 51000, 'movementTypeRequired', 1;
  END;

  IF (@quantity IS NULL)
  BEGIN
    ;THROW 51000, 'quantityRequired', 1;
  END;

  /**
   * @validation Movement type validation
   * @throw {movementTypeInvalid}
   */
  IF (@movementType NOT IN ('ENTRY', 'EXIT'))
  BEGIN
    ;THROW 51000, 'movementTypeInvalid', 1;
  END;

  /**
   * @validation Quantity validation
   * @throw {quantityMustBePositive}
   */
  IF (@quantity <= 0)
  BEGIN
    ;THROW 51000, 'quantityMustBePositive', 1;
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

  IF (@movementDate IS NULL)
  BEGIN
    SET @movementDate = GETUTCDATE();
  END;

  DECLARE @currentQuantity INT = 0;
  DECLARE @newQuantity INT;

  /**
   * @rule {fn-current-stock-check} Get current stock quantity
   */
  SELECT @currentQuantity = ISNULL([cst].[currentQuantity], 0)
  FROM [functional].[currentStock] [cst]
  WHERE [cst].[idAccount] = @idAccount
    AND [cst].[idProduct] = @idProduct;

  /**
   * @validation Stock availability for exit movements
   * @throw {insufficientStock}
   */
  IF (@movementType = 'EXIT' AND @currentQuantity < @quantity)
  BEGIN
    ;THROW 51000, 'insufficientStock', 1;
  END;

  BEGIN TRY
    BEGIN TRAN;

      /**
       * @rule {fn-stock-movement-create} Insert stock movement record
       */
      INSERT INTO [functional].[stockMovement] (
        [idAccount],
        [idProduct],
        [movementType],
        [quantity],
        [movementDate],
        [dateCreated]
      )
      VALUES (
        @idAccount,
        @idProduct,
        @movementType,
        @quantity,
        @movementDate,
        GETUTCDATE()
      );

      DECLARE @idStockMovement INT = SCOPE_IDENTITY();

      /**
       * @rule {fn-current-stock-update} Calculate new stock quantity
       */
      IF (@movementType = 'ENTRY')
      BEGIN
        SET @newQuantity = @currentQuantity + @quantity;
      END
      ELSE
      BEGIN
        SET @newQuantity = @currentQuantity - @quantity;
      END;

      /**
       * @rule {fn-current-stock-upsert} Update or insert current stock record
       */
      IF EXISTS (
        SELECT *
        FROM [functional].[currentStock] [cst]
        WHERE [cst].[idAccount] = @idAccount
          AND [cst].[idProduct] = @idProduct
      )
      BEGIN
        UPDATE [functional].[currentStock]
        SET
          [currentQuantity] = @newQuantity,
          [dateModified] = GETUTCDATE()
        WHERE [idAccount] = @idAccount
          AND [idProduct] = @idProduct;
      END
      ELSE
      BEGIN
        INSERT INTO [functional].[currentStock] (
          [idAccount],
          [idProduct],
          [currentQuantity],
          [dateModified]
        )
        VALUES (
          @idAccount,
          @idProduct,
          @newQuantity,
          GETUTCDATE()
        );
      END;

      /**
       * @rule {fn-critical-status-check-after-movement} Check critical status after stock change
       */
      EXEC [functional].[spProductCheckCriticalStatus]
        @idAccount = @idAccount,
        @idProduct = @idProduct;

      /**
       * @output {StockMovementCreated, 1, 1}
       * @column {INT} idStockMovement
       *   - Description: Created stock movement identifier
       * @column {INT} newQuantity
       *   - Description: New current stock quantity after movement
       */
      SELECT
        @idStockMovement AS [idStockMovement],
        @newQuantity AS [newQuantity];

    COMMIT TRAN;
  END TRY
  BEGIN CATCH
    ROLLBACK TRAN;
    THROW;
  END CATCH;
END;
GO