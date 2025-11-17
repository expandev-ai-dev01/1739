/**
 * @schema config
 * Configuration schema - system-wide settings and reference data
 */
CREATE SCHEMA [config];
GO

/**
 * @table category Product categories for classification
 * @multitenancy true
 * @softDelete true
 * @alias cat
 */
CREATE TABLE [config].[category] (
  [idCategory] INTEGER IDENTITY(1, 1) NOT NULL,
  [idAccount] INTEGER NOT NULL,
  [name] NVARCHAR(100) NOT NULL,
  [description] NVARCHAR(500) NOT NULL DEFAULT (''),
  [dateCreated] DATETIME2 NOT NULL DEFAULT (GETUTCDATE()),
  [dateModified] DATETIME2 NOT NULL DEFAULT (GETUTCDATE()),
  [deleted] BIT NOT NULL DEFAULT (0)
);
GO

/**
 * @table unitOfMeasure Units of measure for products
 * @multitenancy true
 * @softDelete true
 * @alias uom
 */
CREATE TABLE [config].[unitOfMeasure] (
  [idUnitOfMeasure] INTEGER IDENTITY(1, 1) NOT NULL,
  [idAccount] INTEGER NOT NULL,
  [code] VARCHAR(10) NOT NULL,
  [name] NVARCHAR(50) NOT NULL,
  [description] NVARCHAR(500) NOT NULL DEFAULT (''),
  [dateCreated] DATETIME2 NOT NULL DEFAULT (GETUTCDATE()),
  [dateModified] DATETIME2 NOT NULL DEFAULT (GETUTCDATE()),
  [deleted] BIT NOT NULL DEFAULT (0)
);
GO

/**
 * @primaryKey pkCategory
 * @keyType Object
 */
ALTER TABLE [config].[category]
ADD CONSTRAINT [pkCategory] PRIMARY KEY CLUSTERED ([idCategory]);
GO

/**
 * @primaryKey pkUnitOfMeasure
 * @keyType Object
 */
ALTER TABLE [config].[unitOfMeasure]
ADD CONSTRAINT [pkUnitOfMeasure] PRIMARY KEY CLUSTERED ([idUnitOfMeasure]);
GO

/**
 * @index ixCategory_Account
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixCategory_Account]
ON [config].[category]([idAccount])
WHERE [deleted] = 0;
GO

/**
 * @index ixCategory_Account_Name
 * @type Search
 * @unique true
 * @filter Active categories only
 */
CREATE UNIQUE NONCLUSTERED INDEX [uqCategory_Account_Name]
ON [config].[category]([idAccount], [name])
WHERE [deleted] = 0;
GO

/**
 * @index ixUnitOfMeasure_Account
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixUnitOfMeasure_Account]
ON [config].[unitOfMeasure]([idAccount])
WHERE [deleted] = 0;
GO

/**
 * @index ixUnitOfMeasure_Account_Code
 * @type Search
 * @unique true
 * @filter Active units only
 */
CREATE UNIQUE NONCLUSTERED INDEX [uqUnitOfMeasure_Account_Code]
ON [config].[unitOfMeasure]([idAccount], [code])
WHERE [deleted] = 0;
GO