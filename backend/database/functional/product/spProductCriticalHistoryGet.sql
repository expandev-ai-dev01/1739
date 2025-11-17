/**
 * @summary
 * Retrieves the complete history of critical stock periods for a specific product,
 * including entry dates, exit dates, and minimum quantities reached during each period.
 * 
 * @procedure spProductCriticalHistoryGet
 * @schema functional
 * @type stored-procedure
 * 
 * @endpoints
 * - GET /api/v1/internal/product/:id/critical-history
 * 
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 * 
 * @param {INT} idProduct
 *   - Required: Yes
 *   - Description: Product identifier
 * 
 * @testScenarios
 * - Retrieve history for product with multiple critical periods
 * - Retrieve history for product currently in critical status
 * - Retrieve history for product with no critical periods
 * - Product not found
 */
CREATE OR ALTER PROCEDURE [functional].[spProductCriticalHistoryGet]
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

  /**
   * @output {ProductInfo, 1, n}
   * @column {INT} idProduct - Product identifier
   * @column {VARCHAR} code - Product code
   * @column {NVARCHAR} description - Product description
   * @column {INT} minimumStock - Current minimum stock level
   * @column {BIT} criticalStatus - Current critical status
   */
  SELECT
    [prd].[idProduct],
    [prd].[code],
    [prd].[description],
    [prd].[minimumStock],
    [prd].[criticalStatus]
  FROM [functional].[product] [prd]
  WHERE [prd].[idProduct] = @idProduct
    AND [prd].[idAccount] = @idAccount;

  /**
   * @output {CriticalHistory, n, n}
   * @column {INT} idCriticalStockHistory - History record identifier
   * @column {DATETIME2} entryDate - Date product entered critical status
   * @column {DATETIME2} exitDate - Date product exited critical status (NULL if still critical)
   * @column {INT} minimumQuantity - Lowest quantity reached during period
   * @column {INT} durationDays - Number of days in critical status (NULL if still critical)
   * @column {BIT} isActive - Indicates if this is the current active critical period
   */
  SELECT
    [csh].[idCriticalStockHistory],
    [csh].[entryDate],
    [csh].[exitDate],
    [csh].[minimumQuantity],
    CASE
      WHEN [csh].[exitDate] IS NULL THEN NULL
      ELSE DATEDIFF(DAY, [csh].[entryDate], [csh].[exitDate])
    END AS [durationDays],
    CASE
      WHEN [csh].[exitDate] IS NULL THEN 1
      ELSE 0
    END AS [isActive]
  FROM [functional].[criticalStockHistory] [csh]
  WHERE [csh].[idAccount] = @idAccount
    AND [csh].[idProduct] = @idProduct
  ORDER BY
    [csh].[entryDate] DESC;
END;
GO