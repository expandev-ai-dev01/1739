/**
 * @schema functional
 * Functional schema - business logic and operational data
 */
CREATE SCHEMA [functional];
GO

/**
 * @table product Products in the inventory system
 * @multitenancy true
 * @softDelete true
 * @alias prd
 */
CREATE TABLE [functional].[product] (
  [idProduct] INTEGER IDENTITY(1, 1) NOT NULL,
  [idAccount] INTEGER NOT NULL,
  [idCategory] INTEGER NOT NULL,
  [idUnitOfMeasure] INTEGER NOT NULL,
  [code] VARCHAR(20) NOT NULL,
  [description] NVARCHAR(200) NOT NULL,
  [minimumStock] INTEGER NOT NULL DEFAULT (5),
  [criticalStatus] BIT NOT NULL DEFAULT (0),
  [active] BIT NOT NULL DEFAULT (1),
  [dateCreated] DATETIME2 NOT NULL DEFAULT (GETUTCDATE()),
  [dateModified] DATETIME2 NOT NULL DEFAULT (GETUTCDATE()),
  [deleted] BIT NOT NULL DEFAULT (0)
);
GO

/**
 * @table stockMovement Stock movements (entries and exits)
 * @multitenancy true
 * @softDelete false
 * @alias stk
 */
CREATE TABLE [functional].[stockMovement] (
  [idStockMovement] INTEGER IDENTITY(1, 1) NOT NULL,
  [idAccount] INTEGER NOT NULL,
  [idProduct] INTEGER NOT NULL,
  [movementType] VARCHAR(10) NOT NULL,
  [quantity] INTEGER NOT NULL,
  [movementDate] DATETIME2 NOT NULL DEFAULT (GETUTCDATE()),
  [dateCreated] DATETIME2 NOT NULL DEFAULT (GETUTCDATE())
);
GO

/**
 * @table criticalStockHistory History of critical stock status changes
 * @multitenancy true
 * @softDelete false
 * @alias csh
 */
CREATE TABLE [functional].[criticalStockHistory] (
  [idCriticalStockHistory] INTEGER IDENTITY(1, 1) NOT NULL,
  [idAccount] INTEGER NOT NULL,
  [idProduct] INTEGER NOT NULL,
  [entryDate] DATETIME2 NOT NULL,
  [exitDate] DATETIME2 NULL,
  [minimumQuantity] INTEGER NOT NULL,
  [dateCreated] DATETIME2 NOT NULL DEFAULT (GETUTCDATE()),
  [dateModified] DATETIME2 NOT NULL DEFAULT (GETUTCDATE())
);
GO

/**
 * @table currentStock Current stock levels per product
 * @multitenancy true
 * @softDelete false
 * @alias cst
 */
CREATE TABLE [functional].[currentStock] (
  [idCurrentStock] INTEGER IDENTITY(1, 1) NOT NULL,
  [idAccount] INTEGER NOT NULL,
  [idProduct] INTEGER NOT NULL,
  [currentQuantity] INTEGER NOT NULL DEFAULT (0),
  [dateModified] DATETIME2 NOT NULL DEFAULT (GETUTCDATE())
);
GO

/**
 * @primaryKey pkProduct
 * @keyType Object
 */
ALTER TABLE [functional].[product]
ADD CONSTRAINT [pkProduct] PRIMARY KEY CLUSTERED ([idProduct]);
GO

/**
 * @primaryKey pkStockMovement
 * @keyType Object
 */
ALTER TABLE [functional].[stockMovement]
ADD CONSTRAINT [pkStockMovement] PRIMARY KEY CLUSTERED ([idStockMovement]);
GO

/**
 * @primaryKey pkCriticalStockHistory
 * @keyType Object
 */
ALTER TABLE [functional].[criticalStockHistory]
ADD CONSTRAINT [pkCriticalStockHistory] PRIMARY KEY CLUSTERED ([idCriticalStockHistory]);
GO

/**
 * @primaryKey pkCurrentStock
 * @keyType Object
 */
ALTER TABLE [functional].[currentStock]
ADD CONSTRAINT [pkCurrentStock] PRIMARY KEY CLUSTERED ([idCurrentStock]);
GO

/**
 * @foreignKey fkProduct_Category
 * @target config.category
 */
ALTER TABLE [functional].[product]
ADD CONSTRAINT [fkProduct_Category] FOREIGN KEY ([idCategory])
REFERENCES [config].[category]([idCategory]);
GO

/**
 * @foreignKey fkProduct_UnitOfMeasure
 * @target config.unitOfMeasure
 */
ALTER TABLE [functional].[product]
ADD CONSTRAINT [fkProduct_UnitOfMeasure] FOREIGN KEY ([idUnitOfMeasure])
REFERENCES [config].[unitOfMeasure]([idUnitOfMeasure]);
GO

/**
 * @foreignKey fkStockMovement_Product
 * @target functional.product
 */
ALTER TABLE [functional].[stockMovement]
ADD CONSTRAINT [fkStockMovement_Product] FOREIGN KEY ([idProduct])
REFERENCES [functional].[product]([idProduct]);
GO

/**
 * @foreignKey fkCriticalStockHistory_Product
 * @target functional.product
 */
ALTER TABLE [functional].[criticalStockHistory]
ADD CONSTRAINT [fkCriticalStockHistory_Product] FOREIGN KEY ([idProduct])
REFERENCES [functional].[product]([idProduct]);
GO

/**
 * @foreignKey fkCurrentStock_Product
 * @target functional.product
 */
ALTER TABLE [functional].[currentStock]
ADD CONSTRAINT [fkCurrentStock_Product] FOREIGN KEY ([idProduct])
REFERENCES [functional].[product]([idProduct]);
GO

/**
 * @check chkProduct_MinimumStock
 * @enum {>=0} Minimum stock must be zero or positive
 */
ALTER TABLE [functional].[product]
ADD CONSTRAINT [chkProduct_MinimumStock] CHECK ([minimumStock] >= 0);
GO

/**
 * @check chkProduct_CriticalStatus
 * @enum {0} Normal
 * @enum {1} Critical
 */
ALTER TABLE [functional].[product]
ADD CONSTRAINT [chkProduct_CriticalStatus] CHECK ([criticalStatus] IN (0, 1));
GO

/**
 * @check chkProduct_Active
 * @enum {0} Inactive
 * @enum {1} Active
 */
ALTER TABLE [functional].[product]
ADD CONSTRAINT [chkProduct_Active] CHECK ([active] IN (0, 1));
GO

/**
 * @check chkStockMovement_MovementType
 * @enum {ENTRY} Stock entry
 * @enum {EXIT} Stock exit
 */
ALTER TABLE [functional].[stockMovement]
ADD CONSTRAINT [chkStockMovement_MovementType] CHECK ([movementType] IN ('ENTRY', 'EXIT'));
GO

/**
 * @check chkStockMovement_Quantity
 * @enum {>0} Quantity must be positive
 */
ALTER TABLE [functional].[stockMovement]
ADD CONSTRAINT [chkStockMovement_Quantity] CHECK ([quantity] > 0);
GO

/**
 * @check chkCurrentStock_CurrentQuantity
 * @enum {>=0} Current quantity must be zero or positive
 */
ALTER TABLE [functional].[currentStock]
ADD CONSTRAINT [chkCurrentStock_CurrentQuantity] CHECK ([currentQuantity] >= 0);
GO

/**
 * @index ixProduct_Account
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixProduct_Account]
ON [functional].[product]([idAccount])
WHERE [deleted] = 0;
GO

/**
 * @index ixProduct_Account_Code
 * @type Search
 * @unique true
 * @filter Active products only
 */
CREATE UNIQUE NONCLUSTERED INDEX [uqProduct_Account_Code]
ON [functional].[product]([idAccount], [code])
WHERE [deleted] = 0;
GO

/**
 * @index ixProduct_Account_Category
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixProduct_Account_Category]
ON [functional].[product]([idAccount], [idCategory])
INCLUDE ([code], [description], [active])
WHERE [deleted] = 0;
GO

/**
 * @index ixProduct_Account_Active
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixProduct_Account_Active]
ON [functional].[product]([idAccount], [active])
INCLUDE ([code], [description], [idCategory])
WHERE [deleted] = 0;
GO

/**
 * @index ixProduct_Account_CriticalStatus
 * @type Search
 * @filter Critical products only
 */
CREATE NONCLUSTERED INDEX [ixProduct_Account_CriticalStatus]
ON [functional].[product]([idAccount], [criticalStatus])
INCLUDE ([code], [description], [minimumStock])
WHERE [deleted] = 0 AND [criticalStatus] = 1;
GO

/**
 * @index ixStockMovement_Account
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixStockMovement_Account]
ON [functional].[stockMovement]([idAccount]);
GO

/**
 * @index ixStockMovement_Account_Product
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixStockMovement_Account_Product]
ON [functional].[stockMovement]([idAccount], [idProduct])
INCLUDE ([movementType], [quantity], [movementDate]);
GO

/**
 * @index ixStockMovement_Account_MovementDate
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixStockMovement_Account_MovementDate]
ON [functional].[stockMovement]([idAccount], [movementDate] DESC)
INCLUDE ([idProduct], [movementType], [quantity]);
GO

/**
 * @index ixCriticalStockHistory_Account
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixCriticalStockHistory_Account]
ON [functional].[criticalStockHistory]([idAccount]);
GO

/**
 * @index ixCriticalStockHistory_Account_Product
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixCriticalStockHistory_Account_Product]
ON [functional].[criticalStockHistory]([idAccount], [idProduct])
INCLUDE ([entryDate], [exitDate], [minimumQuantity]);
GO

/**
 * @index ixCriticalStockHistory_Account_EntryDate
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixCriticalStockHistory_Account_EntryDate]
ON [functional].[criticalStockHistory]([idAccount], [entryDate] DESC)
INCLUDE ([idProduct], [exitDate], [minimumQuantity]);
GO

/**
 * @index ixCurrentStock_Account
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixCurrentStock_Account]
ON [functional].[currentStock]([idAccount]);
GO

/**
 * @index ixCurrentStock_Account_Product
 * @type Search
 * @unique true
 */
CREATE UNIQUE NONCLUSTERED INDEX [uqCurrentStock_Account_Product]
ON [functional].[currentStock]([idAccount], [idProduct]);
GO