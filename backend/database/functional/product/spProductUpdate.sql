/**
 * @summary
 * Updates an existing product with validation of required fields and business rules.
 * Product code cannot be changed after creation.
 * 
 * @procedure spProductUpdate
 * @schema functional
 * @type stored-procedure
 * 
 * @endpoints
 * - PUT /api/v1/internal/product/:id
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
 * @param {NVARCHAR(200)} description
 *   - Required: Yes
 *   - Description: Product description
 * 
 * @param {INT} idCategory
 *   - Required: Yes
 *   - Description: Category identifier
 * 
 * @param {INT} idUnitOfMeasure
 *   - Required: Yes
 *   - Description: Unit of measure identifier
 * 
 * @param {INT} minimumStock
 *   - Required: Yes
 *   - Description: Minimum stock level
 * 
 * @param {BIT} active
 *   - Required: Yes
 *   - Description: Product status
 * 
 * @testScenarios
 * - Valid update with all parameters
 * - Product not found
 * - Invalid category reference
 * - Invalid unit of measure reference
 * - Description validation
 * - Minimum stock validation
 */
CREATE OR ALTER PROCEDURE [functional].[spProductUpdate]
  @idAccount INT,
  @idUser INT,
  @idProduct INT,
  @description NVARCHAR(200),
  @idCategory INT,
  @idUnitOfMeasure INT,
  @minimumStock INT,
  @active BIT
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

  IF (@description IS NULL OR LTRIM(RTRIM(@description)) = '')
  BEGIN
    ;THROW 51000, 'descriptionRequired', 1;
  END;

  IF (@idCategory IS NULL)
  BEGIN
    ;THROW 51000, 'idCategoryRequired', 1;
  END;

  IF (@idUnitOfMeasure IS NULL)
  BEGIN
    ;THROW 51000, 'idUnitOfMeasureRequired', 1;
  END;

  IF (@minimumStock IS NULL)
  BEGIN
    ;THROW 51000, 'minimumStockRequired', 1;
  END;

  IF (@active IS NULL)
  BEGIN
    ;THROW 51000, 'activeRequired', 1;
  END;

  /**
   * @validation Description length validation
   * @throw {descriptionTooShort}
   */
  IF (LEN(@description) < 5)
  BEGIN
    ;THROW 51000, 'descriptionTooShort', 1;
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

  /**
   * @validation Category existence validation
   * @throw {categoryDoesntExist}
   */
  IF NOT EXISTS (
    SELECT *
    FROM [config].[category] [cat]
    WHERE [cat].[idCategory] = @idCategory
      AND [cat].[idAccount] = @idAccount
      AND [cat].[deleted] = 0
  )
  BEGIN
    ;THROW 51000, 'categoryDoesntExist', 1;
  END;

  /**
   * @validation Unit of measure existence validation
   * @throw {unitOfMeasureDoesntExist}
   */
  IF NOT EXISTS (
    SELECT *
    FROM [config].[unitOfMeasure] [uom]
    WHERE [uom].[idUnitOfMeasure] = @idUnitOfMeasure
      AND [uom].[idAccount] = @idAccount
      AND [uom].[deleted] = 0
  )
  BEGIN
    ;THROW 51000, 'unitOfMeasureDoesntExist', 1;
  END;

  BEGIN TRY
    BEGIN TRAN;

      /**
       * @rule {fn-product-update} Update product record
       */
      UPDATE [functional].[product]
      SET
        [description] = @description,
        [idCategory] = @idCategory,
        [idUnitOfMeasure] = @idUnitOfMeasure,
        [minimumStock] = @minimumStock,
        [active] = @active,
        [dateModified] = GETUTCDATE()
      WHERE [idProduct] = @idProduct
        AND [idAccount] = @idAccount;

      /**
       * @output {ProductUpdated, 1, 1}
       * @column {INT} idProduct
       *   - Description: Updated product identifier
       */
      SELECT @idProduct AS [idProduct];

    COMMIT TRAN;
  END TRY
  BEGIN CATCH
    ROLLBACK TRAN;
    THROW;
  END CATCH;
END;
GO