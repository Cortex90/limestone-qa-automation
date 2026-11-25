-- Part 3: SQL — Limestone Digital QA Assignment
-- Query 1: Customers whose orders were shipped by United Package.
-- Count distinct orders and calculate total order value.
SELECT c.CustomerName, c.Country,
       COUNT(DISTINCT o.OrderID) AS OrderCount,
       SUM(od.Quantity * p.Price) AS TotalValue
FROM Customers c
JOIN Orders o ON c.CustomerID = o.CustomerID
JOIN OrderDetails od ON o.OrderID = od.OrderID
JOIN Products p ON od.ProductID = p.ProductID
WHERE o.ShipperID = (
    SELECT ShipperID FROM Shippers
    WHERE ShipperName = 'United Package'
)
GROUP BY c.CustomerID, c.CustomerName, c.Country
ORDER BY TotalValue DESC;

-- Query 2: Customers who placed orders but never used United Package.
SELECT CustomerName, Country
FROM Customers
WHERE CustomerID IN (
    SELECT CustomerID FROM Orders
)
AND CustomerID NOT IN (
    SELECT o.CustomerID
    FROM Orders o
    JOIN Shippers s ON o.ShipperID = s.ShipperID
    WHERE s.ShipperName = 'United Package'
);
