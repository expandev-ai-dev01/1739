/**
 * @summary
 * Retrieves detailed information for a specific stock movement including
 * product details and current stock status.
 * 
 * @procedure spStockMovementGet
 * @schema functional
 * @type stored-procedure
 * 
 * @endpoints
 * - GET /api/v1/internal/stock-movement/:id
 * 
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 * 
 * @param {INT} idStockMovement
 *   - Required: Yes
 *   - Description: Stock movement identifier
 * 
 * @testScenarios
 * - Valid movement retrieval
 * - Movement not found
 * - Movement from different account
 */
CREATE OR ALTER PROCEDURE [functional].[spStockMovementGet]
  @idAccount INT,
  @idStockMovement INT
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

  IF (@idStockMovement IS NULL)
  BEGIN
    ;THROW 51000, 'idStockMovementRequired', 1;
  END;

  /**
   * @validation Stock movement existence validation
   * @throw {stockMovementDoesntExist}
   */
  IF NOT EXISTS (
    SELECT *
    FROM [functional].[stockMovement] [stk]
    WHERE [stk].[idStockMovement] = @idStockMovement
      AND [stk].[idAccount] = @idAccount
  )
  BEGIN
    ;THROW 51000, 'stockMovementDoesntExist', 1;
  END;

  /**
   * @output {StockMovementDetail, 1, n}
   * @column {INT} idStockMovement - Stock movement identifier
   * @column {INT} idProduct - Product identifier
   * @column {VARCHAR} productCode - Product code
   * @column {NVARCHAR} productDescription - Product description
   * @column {VARCHAR} movementType - Movement type (ENTRY or EXIT)
   * @column {INT} quantity - Quantity moved
   * @column {DATETIME2} movementDate - Movement date and time
   * @column {DATETIME2} dateCreated - Record creation date
   * @column {INT} currentQuantity - Current stock quantity after this movement
   */
  SELECT
    [stk].[idStockMovement],
    [stk].[idProduct],
    [prd].[code] AS [productCode],
    [prd].[description] AS [productDescription],
    [stk].[movementType],
    [stk].[quantity],
    [stk].[movementDate],
    [stk].[dateCreated],
    ISNULL([cst].[currentQuantity], 0) AS [currentQuantity]
  FROM [functional].[stockMovement] [stk]
    JOIN [functional].[product] [prd] ON ([prd].[idAccount] = [stk].[idAccount] AND [prd].[idProduct] = [stk].[idProduct])
    LEFT JOIN [functional].[currentStock] [cst] ON ([cst].[idAccount] = [stk].[idAccount] AND [cst].[idProduct] = [stk].[idProduct])
  WHERE [stk].[idStockMovement] = @idStockMovement
    AND [stk].[idAccount] = @idAccount;
END;
GO