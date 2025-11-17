/**
 * @summary
 * Retrieves a paginated list of products with filtering and sorting capabilities.
 * Supports filtering by code, description, category, and status.
 * 
 * @procedure spProductList
 * @schema functional
 * @type stored-procedure
 * 
 * @endpoints
 * - GET /api/v1/internal/product
 * 
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 * 
 * @param {VARCHAR(20)} filterCode
 *   - Required: No
 *   - Description: Filter by product code (partial match)
 * 
 * @param {NVARCHAR(200)} filterDescription
 *   - Required: No
 *   - Description: Filter by description (partial match)
 * 
 * @param {INT} filterIdCategory
 *   - Required: No
 *   - Description: Filter by category identifier
 * 
 * @param {BIT} filterActive
 *   - Required: No
 *   - Description: Filter by active status
 * 
 * @param {VARCHAR(50)} sortBy
 *   - Required: No
 *   - Description: Sort field (code, description, category, dateCreated)
 * 
 * @param {VARCHAR(4)} sortDirection
 *   - Required: No
 *   - Description: Sort direction (asc or desc)
 * 
 * @param {INT} pageNumber
 *   - Required: No
 *   - Description: Page number (default: 1)
 * 
 * @param {INT} pageSize
 *   - Required: No
 *   - Description: Items per page (default: 25)
 * 
 * @testScenarios
 * - List all products without filters
 * - Filter by code
 * - Filter by description
 * - Filter by category
 * - Filter by status
 * - Combined filters
 * - Sorting by different fields
 * - Pagination
 */
CREATE OR ALTER PROCEDURE [functional].[spProductList]
  @idAccount INT,
  @filterCode VARCHAR(20) = NULL,
  @filterDescription NVARCHAR(200) = NULL,
  @filterIdCategory INT = NULL,
  @filterActive BIT = NULL,
  @sortBy VARCHAR(50) = 'code',
  @sortDirection VARCHAR(4) = 'asc',
  @pageNumber INT = 1,
  @pageSize INT = 25
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
   * @validation Page number validation
   * @throw {pageNumberInvalid}
   */
  IF (@pageNumber < 1)
  BEGIN
    ;THROW 51000, 'pageNumberInvalid', 1;
  END;

  /**
   * @validation Page size validation
   * @throw {pageSizeInvalid}
   */
  IF (@pageSize NOT IN (10, 25, 50, 100))
  BEGIN
    SET @pageSize = 25;
  END;

  /**
   * @validation Sort field validation
   * @throw {sortFieldInvalid}
   */
  IF (@sortBy NOT IN ('code', 'description', 'category', 'dateCreated'))
  BEGIN
    SET @sortBy = 'code';
  END;

  /**
   * @validation Sort direction validation
   */
  IF (@sortDirection NOT IN ('asc', 'desc'))
  BEGIN
    SET @sortDirection = 'asc';
  END;

  DECLARE @offset INT = (@pageNumber - 1) * @pageSize;

  /**
   * @rule {fn-product-list} Build filtered and sorted product list
   */
  WITH [FilteredProducts] AS (
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
      [prd].[active],
      [prd].[dateCreated],
      [prd].[dateModified]
    FROM [functional].[product] [prd]
      JOIN [config].[category] [cat] ON ([cat].[idAccount] = [prd].[idAccount] AND [cat].[idCategory] = [prd].[idCategory])
      JOIN [config].[unitOfMeasure] [uom] ON ([uom].[idAccount] = [prd].[idAccount] AND [uom].[idUnitOfMeasure] = [prd].[idUnitOfMeasure])
    WHERE [prd].[idAccount] = @idAccount
      AND [prd].[deleted] = 0
      AND [cat].[deleted] = 0
      AND [uom].[deleted] = 0
      AND ((@filterCode IS NULL) OR ([prd].[code] LIKE '%' + @filterCode + '%'))
      AND ((@filterDescription IS NULL) OR ([prd].[description] LIKE '%' + @filterDescription + '%'))
      AND ((@filterIdCategory IS NULL) OR ([prd].[idCategory] = @filterIdCategory))
      AND ((@filterActive IS NULL) OR ([prd].[active] = @filterActive))
  )
  /**
   * @output {ProductList, n, n}
   * @column {INT} idProduct - Product identifier
   * @column {VARCHAR} code - Product code
   * @column {NVARCHAR} description - Product description
   * @column {INT} idCategory - Category identifier
   * @column {NVARCHAR} categoryName - Category name
   * @column {INT} idUnitOfMeasure - Unit of measure identifier
   * @column {VARCHAR} unitOfMeasureCode - Unit of measure code
   * @column {NVARCHAR} unitOfMeasureName - Unit of measure name
   * @column {INT} minimumStock - Minimum stock level
   * @column {BIT} active - Active status
   * @column {DATETIME2} dateCreated - Creation date
   * @column {DATETIME2} dateModified - Last modification date
   * @column {INT} totalCount - Total number of records
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
    [active],
    [dateCreated],
    [dateModified],
    COUNT(*) OVER() AS [totalCount]
  FROM [FilteredProducts]
  ORDER BY
    CASE WHEN (@sortBy = 'code' AND @sortDirection = 'asc') THEN [code] END ASC,
    CASE WHEN (@sortBy = 'code' AND @sortDirection = 'desc') THEN [code] END DESC,
    CASE WHEN (@sortBy = 'description' AND @sortDirection = 'asc') THEN [description] END ASC,
    CASE WHEN (@sortBy = 'description' AND @sortDirection = 'desc') THEN [description] END DESC,
    CASE WHEN (@sortBy = 'category' AND @sortDirection = 'asc') THEN [categoryName] END ASC,
    CASE WHEN (@sortBy = 'category' AND @sortDirection = 'desc') THEN [categoryName] END DESC,
    CASE WHEN (@sortBy = 'dateCreated' AND @sortDirection = 'asc') THEN [dateCreated] END ASC,
    CASE WHEN (@sortBy = 'dateCreated' AND @sortDirection = 'desc') THEN [dateCreated] END DESC
  OFFSET @offset ROWS
  FETCH NEXT @pageSize ROWS ONLY;
END;
GO