    INSERT INTO Buyer (
        BuyerUserId ,
        FullName, 
        FirstName, 
        LastName, 
        BuyerName
        )
    SELECT 
        t.BuyerUserId ,
        t.FullName, 
        t.FirstName, 
        t.LastName, 
        t.Buyer
    FROM tempOrders t 
    WHERE t.Buyer != 'ryoung+ipp@etsy.com'
    AND NOT EXISTS (
        SELECT 1 FROM Buyer b 
        WHERE t.BuyerUserId = b.BuyerUserId 
        AND t.Buyer = b.BuyerName
        );



    UPDATE tempOrders t, Buyer b SET
    t.BuyerId = b.BuyerId
    WHERE CONCAT(b.BuyerUserId, b.BuyerName) = CONCAT(t.BuyerUserId, t.Buyer);