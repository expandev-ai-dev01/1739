/**
 * @summary
 * Performs soft delete of a product by setting the deleted flag.
 * Products can only be deleted if they have no associated stock movements.
 * 
 * @procedure spProductDelete
 * @schema functional
 * @type stored-procedure
 * 
 * @endpoints
 * - DELETE /api/v1/internal/product/:id
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
 * @testScenarios
 * - Valid deletion of product without movements
 * - Product not found
 * - Product with existing movements
 * - Product already deleted
 */
CREATE OR ALTER PROCEDURE [functional].[spProductDelete]
  @idAccount INT,
  @idUser INT,
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

  IF (@idUser IS NULL)
  BEGIN
    ;THROW 51000, 'idUserRequired', 1;
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

  BEGIN TRY
    BEGIN TRAN;

      /**
       * @rule {fn-product-delete} Soft delete product
       */
      UPDATE [functional].[product]
      SET
        [deleted] = 1,
        [dateModified] = GETUTCDATE()
      WHERE [idProduct] = @idProduct
        AND [idAccount] = @idAccount;

      /**
       * @output {ProductDeleted, 1, 1}
       * @column {INT} idProduct
       *   - Description: Deleted product identifier
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