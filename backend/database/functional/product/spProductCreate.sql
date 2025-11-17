/**
 * @summary
 * Creates a new product in the inventory system with validation of required fields,
 * uniqueness of product code, and proper category/unit of measure references.
 * 
 * @procedure spProductCreate
 * @schema functional
 * @type stored-procedure
 * 
 * @endpoints
 * - POST /api/v1/internal/product
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
 * @param {VARCHAR(20)} code
 *   - Required: Yes
 *   - Description: Unique product code (uppercase letters and numbers only)
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
 *   - Required: No
 *   - Description: Minimum stock level (default: 5)
 * 
 * @param {BIT} active
 *   - Required: No
 *   - Description: Product status (default: 1/active)
 * 
 * @returns {INT} idProduct - Created product identifier
 * 
 * @testScenarios
 * - Valid creation with all required parameters
 * - Duplicate code validation
 * - Invalid category reference
 * - Invalid unit of measure reference
 * - Code format validation
 * - Minimum stock validation
 */
CREATE OR ALTER PROCEDURE [functional].[spProductCreate]
  @idAccount INT,
  @idUser INT,
  @code VARCHAR(20),
  @description NVARCHAR(200),
  @idCategory INT,
  @idUnitOfMeasure INT,
  @minimumStock INT = 5,
  @active BIT = 1
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

  IF (@code IS NULL OR LTRIM(RTRIM(@code)) = '')
  BEGIN
    ;THROW 51000, 'codeRequired', 1;
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

  /**
   * @validation Code format validation
   * @throw {codeInvalidFormat}
   */
  IF (@code NOT LIKE '[A-Z0-9]%' OR @code LIKE '%[^A-Z0-9]%')
  BEGIN
    ;THROW 51000, 'codeInvalidFormat', 1;
  END;

  /**
   * @validation Code length validation
   * @throw {codeLengthInvalid}
   */
  IF (LEN(@code) < 3 OR LEN(@code) > 20)
  BEGIN
    ;THROW 51000, 'codeLengthInvalid', 1;
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

  /**
   * @validation Code uniqueness validation
   * @throw {codeAlreadyExists}
   */
  IF EXISTS (
    SELECT *
    FROM [functional].[product] [prd]
    WHERE [prd].[idAccount] = @idAccount
      AND [prd].[code] = @code
      AND [prd].[deleted] = 0
  )
  BEGIN
    ;THROW 51000, 'codeAlreadyExists', 1;
  END;

  BEGIN TRY
    BEGIN TRAN;

      /**
       * @rule {fn-product-create} Insert new product record
       */
      INSERT INTO [functional].[product] (
        [idAccount],
        [idCategory],
        [idUnitOfMeasure],
        [code],
        [description],
        [minimumStock],
        [active],
        [dateCreated],
        [dateModified]
      )
      VALUES (
        @idAccount,
        @idCategory,
        @idUnitOfMeasure,
        @code,
        @description,
        @minimumStock,
        @active,
        GETUTCDATE(),
        GETUTCDATE()
      );

      DECLARE @idProduct INT = SCOPE_IDENTITY();

      /**
       * @output {ProductCreated, 1, 1}
       * @column {INT} idProduct
       *   - Description: Created product identifier
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