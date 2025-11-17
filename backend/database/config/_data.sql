/**
 * @load category
 */
INSERT INTO [config].[category]
([idAccount], [name], [description])
VALUES
(1, 'Electronics', 'Electronic devices and components'),
(1, 'Food', 'Food and beverage products'),
(1, 'Clothing', 'Apparel and accessories'),
(1, 'Tools', 'Hardware and tools'),
(1, 'Office Supplies', 'Office and stationery items');
GO

/**
 * @load unitOfMeasure
 */
INSERT INTO [config].[unitOfMeasure]
([idAccount], [code], [name], [description])
VALUES
(1, 'UN', 'Unit', 'Individual unit'),
(1, 'KG', 'Kilogram', 'Weight in kilograms'),
(1, 'L', 'Liter', 'Volume in liters'),
(1, 'M', 'Meter', 'Length in meters'),
(1, 'BOX', 'Box', 'Boxed items'),
(1, 'PKG', 'Package', 'Packaged items');
GO