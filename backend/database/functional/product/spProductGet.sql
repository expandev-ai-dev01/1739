/**
 * @summary
 * Retrieves detailed information for a specific product including category
 * and unit of measure details.
 * 
 * @procedure spProductGet
 * @schema functional
 * @type stored-procedure
 * 
 * @endpoints
 * - GET /api/v1/internal/product/:id
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
 * - Valid product retrieval
 * - Product not found
 * - Product from different account
 * - Deleted product
 */
CREATE OR ALTER PROCEDURE [functional].[spProductGet]
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
   * @output {ProductDetail, 1, n}
   * @column {INT} idProduct - Product identifier
   * @column {VARCHAR} code - Product code
   * @column {NVARCHAR} description - Product description
   * @column {INT} idCategory - Category identifier
   * @column {NVARCHAR} categoryName - Category name
   * @column {NVARCHAR} categoryDescription - Category description
   * @column {INT} idUnitOfMeasure - Unit of measure identifier
   * @column {VARCHAR} unitOfMeasureCode - Unit of measure code
   * @column {NVARCHAR} unitOfMeasureName - Unit of measure name
   * @column {INT} minimumStock - Minimum stock level
   * @column {BIT} active - Active status
   * @column {DATETIME2} dateCreated - Creation date
   * @column {DATETIME2} dateModified - Last modification date
   */
  SELECT
    [prd].[idProduct],
    [prd].[code],
    [prd].[description],
    [prd].[idCategory],
    [cat].[name] AS [categoryName],
    [cat].[description] AS [categoryDescription],
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
  WHERE [prd].[idProduct] = @idProduct
    AND [prd].[idAccount] = @idAccount
    AND [prd].[deleted] = 0;
END;
GO