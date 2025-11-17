/**
 * @summary
 * Retrieves a paginated list of stock movements with filtering and sorting capabilities.
 * Supports filtering by product, movement type, date range, and sorting options.
 * 
 * @procedure spStockMovementList
 * @schema functional
 * @type stored-procedure
 * 
 * @endpoints
 * - GET /api/v1/internal/stock-movement
 * 
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 * 
 * @param {INT} filterIdProduct
 *   - Required: No
 *   - Description: Filter by product identifier
 * 
 * @param {VARCHAR(10)} filterMovementType
 *   - Required: No
 *   - Description: Filter by movement type (ENTRY or EXIT)
 * 
 * @param {DATE} filterDateFrom
 *   - Required: No
 *   - Description: Filter movements from this date
 * 
 * @param {DATE} filterDateTo
 *   - Required: No
 *   - Description: Filter movements until this date
 * 
 * @param {VARCHAR(50)} sortBy
 *   - Required: No
 *   - Description: Sort field (movementDate, product, quantity, type)
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
 *   - Description: Items per page (default: 50)
 * 
 * @testScenarios
 * - List all movements without filters
 * - Filter by product
 * - Filter by movement type
 * - Filter by date range
 * - Combined filters
 * - Sorting by different fields
 * - Pagination
 */
CREATE OR ALTER PROCEDURE [functional].[spStockMovementList]
  @idAccount INT,
  @filterIdProduct INT = NULL,
  @filterMovementType VARCHAR(10) = NULL,
  @filterDateFrom DATE = NULL,
  @filterDateTo DATE = NULL,
  @sortBy VARCHAR(50) = 'movementDate',
  @sortDirection VARCHAR(4) = 'desc',
  @pageNumber INT = 1,
  @pageSize INT = 50
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
   */
  IF (@pageSize NOT IN (10, 25, 50, 100))
  BEGIN
    SET @pageSize = 50;
  END;

  /**
   * @validation Sort field validation
   */
  IF (@sortBy NOT IN ('movementDate', 'product', 'quantity', 'type'))
  BEGIN
    SET @sortBy = 'movementDate';
  END;

  /**
   * @validation Sort direction validation
   */
  IF (@sortDirection NOT IN ('asc', 'desc'))
  BEGIN
    SET @sortDirection = 'desc';
  END;

  /**
   * @validation Movement type filter validation
   */
  IF (@filterMovementType IS NOT NULL AND @filterMovementType NOT IN ('ENTRY', 'EXIT'))
  BEGIN
    ;THROW 51000, 'movementTypeInvalid', 1;
  END;

  /**
   * @validation Date range validation
   * @throw {dateRangeInvalid}
   */
  IF (@filterDateFrom IS NOT NULL AND @filterDateTo IS NOT NULL AND @filterDateFrom > @filterDateTo)
  BEGIN
    ;THROW 51000, 'dateRangeInvalid', 1;
  END;

  DECLARE @offset INT = (@pageNumber - 1) * @pageSize;

  /**
   * @rule {fn-stock-movement-list} Build filtered and sorted stock movement list
   */
  WITH [FilteredMovements] AS (
    SELECT
      [stk].[idStockMovement],
      [stk].[idProduct],
      [prd].[code] AS [productCode],
      [prd].[description] AS [productDescription],
      [stk].[movementType],
      [stk].[quantity],
      [stk].[movementDate],
      [stk].[dateCreated]
    FROM [functional].[stockMovement] [stk]
      JOIN [functional].[product] [prd] ON ([prd].[idAccount] = [stk].[idAccount] AND [prd].[idProduct] = [stk].[idProduct])
    WHERE [stk].[idAccount] = @idAccount
      AND [prd].[deleted] = 0
      AND ((@filterIdProduct IS NULL) OR ([stk].[idProduct] = @filterIdProduct))
      AND ((@filterMovementType IS NULL) OR ([stk].[movementType] = @filterMovementType))
      AND ((@filterDateFrom IS NULL) OR (CAST([stk].[movementDate] AS DATE) >= @filterDateFrom))
      AND ((@filterDateTo IS NULL) OR (CAST([stk].[movementDate] AS DATE) <= @filterDateTo))
  )
  /**
   * @output {StockMovementList, n, n}
   * @column {INT} idStockMovement - Stock movement identifier
   * @column {INT} idProduct - Product identifier
   * @column {VARCHAR} productCode - Product code
   * @column {NVARCHAR} productDescription - Product description
   * @column {VARCHAR} movementType - Movement type (ENTRY or EXIT)
   * @column {INT} quantity - Quantity moved
   * @column {DATETIME2} movementDate - Movement date and time
   * @column {DATETIME2} dateCreated - Record creation date
   * @column {INT} totalCount - Total number of records
   */
  SELECT
    [idStockMovement],
    [idProduct],
    [productCode],
    [productDescription],
    [movementType],
    [quantity],
    [movementDate],
    [dateCreated],
    COUNT(*) OVER() AS [totalCount]
  FROM [FilteredMovements]
  ORDER BY
    CASE WHEN (@sortBy = 'movementDate' AND @sortDirection = 'asc') THEN [movementDate] END ASC,
    CASE WHEN (@sortBy = 'movementDate' AND @sortDirection = 'desc') THEN [movementDate] END DESC,
    CASE WHEN (@sortBy = 'product' AND @sortDirection = 'asc') THEN [productCode] END ASC,
    CASE WHEN (@sortBy = 'product' AND @sortDirection = 'desc') THEN [productCode] END DESC,
    CASE WHEN (@sortBy = 'quantity' AND @sortDirection = 'asc') THEN [quantity] END ASC,
    CASE WHEN (@sortBy = 'quantity' AND @sortDirection = 'desc') THEN [quantity] END DESC,
    CASE WHEN (@sortBy = 'type' AND @sortDirection = 'asc') THEN [movementType] END ASC,
    CASE WHEN (@sortBy = 'type' AND @sortDirection = 'desc') THEN [movementType] END DESC
  OFFSET @offset ROWS
  FETCH NEXT @pageSize ROWS ONLY;
END;
GO