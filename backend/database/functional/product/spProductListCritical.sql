/**
 * @summary
 * Retrieves a list of products in critical stock status with filtering and sorting capabilities.
 * Products are considered critical when their current quantity is less than or equal to minimum stock.
 * 
 * @procedure spProductListCritical
 * @schema functional
 * @type stored-procedure
 * 
 * @endpoints
 * - GET /api/v1/internal/product/critical
 * 
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 * 
 * @param {INT} filterIdCategory
 *   - Required: No
 *   - Description: Filter by category identifier
 * 
 * @param {VARCHAR(50)} sortBy
 *   - Required: No
 *   - Description: Sort field (quantity, code, description, category)
 * 
 * @param {VARCHAR(4)} sortDirection
 *   - Required: No
 *   - Description: Sort direction (asc or desc)
 * 
 * @testScenarios
 * - List all critical products without filters
 * - Filter by category
 * - Sort by quantity (ascending shows most critical first)
 * - Sort by code
 * - Sort by description
 * - Sort by category
 * - No critical products exist
 */
CREATE OR ALTER PROCEDURE [functional].[spProductListCritical]
  @idAccount INT,
  @filterIdCategory INT = NULL,
  @sortBy VARCHAR(50) = 'quantity',
  @sortDirection VARCHAR(4) = 'asc'
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

  /**
   * @validation Sort field validation
   */
  IF (@sortBy NOT IN ('quantity', 'code', 'description', 'category'))
  BEGIN
    SET @sortBy = 'quantity';
  END;

  /**
   * @validation Sort direction validation
   */
  IF (@sortDirection NOT IN ('asc', 'desc'))
  BEGIN
    SET @sortDirection = 'asc';
  END;

  /**
   * @rule {fn-critical-product-list} Build filtered and sorted critical product list
   */
  WITH [CriticalProducts] AS (
    SELECT
      [prd].[idProduct],
      [prd].[code],
      [prd].[description],
      [prd].[idCategory],
      [cat].[name] AS [categoryName],
      [prd].[idUnitOfMeasure],
      [uom].[code] AS [unitOfMeasureCode],
      [uom].[name] AS [unitOfMeasureName],
      [prd].[minimumStock],
      ISNULL([cst].[currentQuantity], 0) AS [currentQuantity],
      [prd].[criticalStatus],
      [prd].[dateModified] AS [lastUpdate]
    FROM [functional].[product] [prd]
      JOIN [config].[category] [cat] ON ([cat].[idAccount] = [prd].[idAccount] AND [cat].[idCategory] = [prd].[idCategory])
      JOIN [config].[unitOfMeasure] [uom] ON ([uom].[idAccount] = [prd].[idAccount] AND [uom].[idUnitOfMeasure] = [prd].[idUnitOfMeasure])
      LEFT JOIN [functional].[currentStock] [cst] ON ([cst].[idAccount] = [prd].[idAccount] AND [cst].[idProduct] = [prd].[idProduct])
    WHERE [prd].[idAccount] = @idAccount
      AND [prd].[deleted] = 0
      AND [cat].[deleted] = 0
      AND [uom].[deleted] = 0
      AND [prd].[criticalStatus] = 1
      AND ((@filterIdCategory IS NULL) OR ([prd].[idCategory] = @filterIdCategory))
  )
  /**
   * @output {CriticalProductList, n, n}
   * @column {INT} idProduct - Product identifier
   * @column {VARCHAR} code - Product code
   * @column {NVARCHAR} description - Product description
   * @column {INT} idCategory - Category identifier
   * @column {NVARCHAR} categoryName - Category name
   * @column {INT} idUnitOfMeasure - Unit of measure identifier
   * @column {VARCHAR} unitOfMeasureCode - Unit of measure code
   * @column {NVARCHAR} unitOfMeasureName - Unit of measure name
   * @column {INT} minimumStock - Minimum stock level
   * @column {INT} currentQuantity - Current stock quantity
   * @column {BIT} criticalStatus - Critical status flag
   * @column {BIT} zeroStock - Indicates if stock is completely depleted
   * @column {DATETIME2} lastUpdate - Last update timestamp
   */
  SELECT
    [idProduct],
    [code],
    [description],
    [idCategory],
    [categoryName],
    [idUnitOfMeasure],
    [unitOfMeasureCode],
    [unitOfMeasureName],
    [minimumStock],
    [currentQuantity],
    [criticalStatus],
    CASE WHEN [currentQuantity] = 0 THEN 1 ELSE 0 END AS [zeroStock],
    [lastUpdate]
  FROM [CriticalProducts]
  ORDER BY
    CASE WHEN (@sortBy = 'quantity' AND @sortDirection = 'asc') THEN [currentQuantity] END ASC,
    CASE WHEN (@sortBy = 'quantity' AND @sortDirection = 'desc') THEN [currentQuantity] END DESC,
    CASE WHEN (@sortBy = 'code' AND @sortDirection = 'asc') THEN [code] END ASC,
    CASE WHEN (@sortBy = 'code' AND @sortDirection = 'desc') THEN [code] END DESC,
    CASE WHEN (@sortBy = 'description' AND @sortDirection = 'asc') THEN [description] END ASC,
    CASE WHEN (@sortBy = 'description' AND @sortDirection = 'desc') THEN [description] END DESC,
    CASE WHEN (@sortBy = 'category' AND @sortDirection = 'asc') THEN [categoryName] END ASC,
    CASE WHEN (@sortBy = 'category' AND @sortDirection = 'desc') THEN [categoryName] END DESC;
END;
GO