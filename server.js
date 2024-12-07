const mysql = require('mysql2');
const express = require('express');
const app = express();
const port = 5500;
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456789',
    database: 'inventory_ieee'
});

db.connect((err) => {
    if (err) {
        console.error('Could not connect to the database.', err.message);
    } else {
        console.log('Connected to the MySQL database.');
    }
});

app.get("/data", (req, res) => {
    const sql = "SELECT * FROM total_inventory";
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err.message);
            res.status(500).send("Error fetching data");
        } else
            res.json(results);
    });
})


app.post("/addData", (req, res) => {
    const { component_name, quantity } = req.body;

    if (!component_name || !quantity) {
        return res.status(400).json({ success: false, message: "Component name and quantity are required." });
    }

    const checkQuery = 'SELECT * FROM total_inventory WHERE component_name = ?';
    db.query(checkQuery, [component_name], (err, results) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ success: false, message: "Error checking existing component" });
        }

        if (results.length > 0) {
            return res.status(400).json({ success: false, message: "Component already exists" });
        }

        const insertQuery = 'INSERT INTO total_inventory (component_name, quantity) VALUES (?, ?)';
        db.query(insertQuery, [component_name, quantity], (err, result) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ success: false, message: "Error inserting component" });
            }

            console.log("Component added is successfully");
            return res.json({ success: true, message: "Component added is successfully" });
           
        });
    });
});

app.post("/deleteData", (req, res) => {
    const { component_name } = req.body;

    if (!component_name) {
        return res.status(400).json({ success: false, message: "Component name is required" });
    }

    const checkQuery = 'SELECT * FROM total_inventory WHERE component_name = ?';
    db.query(checkQuery, [component_name], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Error checking component" });
        }

        if (results.length === 0) {
            return res.status(400).json({ success: false, message: "Component not found" });
        }

        const deleteQuery = 'DELETE FROM total_inventory WHERE component_name = ?';
        db.query(deleteQuery, [component_name], (err, result) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Error deleting component" });
            }

            return res.json({ success: true, message: "Component deleted successfully" });
        });
    });
});


app.post("/updateData", (req, res) => {
    const { component_name, quantity } = req.body;
    if (!component_name || !quantity) {
        return res.status(400).json({ success: false, message: "Component name and quantity are required" }
        );
    }
    const updateQuery = 'UPDATE total_inventory SET quantity = ? WHERE component_name = ?';
    db.query(updateQuery, [quantity, component_name], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Error updating component" }
            );
        }
        console.log( "Component updated successfully");
         return res.json({ success: true, message: "Component updated successfully" }
         );
    });

})


app.post('/borrowData', (req, res) => {
    const { user_name, prn, component_name, quantity } = req.body;
    db.query('SELECT * FROM total_inventory WHERE component_name = ?', [component_name], (err, results) => {
        if (err) {
            console.error('Error fetching component:', err);
            return res.status(500).json({ success: false, message: 'Error fetching component' });
        }

        if (results.length === 0) {
            return res.status(400).json({ success: false, message: 'Component not found' });
        }

        const component = results[0];

        if (component.quantity < quantity) {
            return res.status(400).json({ success: false, message: 'Not enough stock available' });
        }

        db.query(
            'INSERT INTO borrow (prn, user_name, component_name, quantity) VALUES (?, ?, ?, ?)',
            [prn, user_name, component_name, quantity],
            (err, result) => {
                if (err) {
                    console.error('Error inserting borrow record:', err);
                    return res.status(500).json({ success: false, message: 'Error borrowing component' });
                }
                db.query(
                    'UPDATE total_inventory SET quantity = quantity - ? WHERE component_name = ?',
                    [quantity, component_name],
                    (err, updateResult) => {
                        if (err) {
                            console.error('Error updating inventory:', err);
                            return res.status(500).json({ success: false, message: 'Error updating inventory' });
                        }
                        return res.json({
                            success: true,
                            message: 'Component borrowed successfully',
                        });
                    }
                );
            }
        );
    });
});

app.get("/detailData", (req, res) => {
    const sql = "SELECT * FROM borrow ORDER BY prn";
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err.message);
            res.status(500).send("Error fetching data");
        } else {
            const groupedData = results.reduce((acc, row) => {
                const existingUser = acc.find(item => item.prn === row.prn);
                if (existingUser) {
                    existingUser.components.push({                      
                        component_name: row.component_name,
                        quantity: row.quantity,
                        borrow_date:row.borrow_date,                 
                    });
                } else {
                    acc.push({
                        user_name: row.user_name,
                        prn: row.prn,
                        components: [{
                            borrow_date:row.borrow_date,
                            component_name: row.component_name,
                            quantity: row.quantity
                        }]
                    });
                }
                
                return acc;
            }, []);
            
            res.json(groupedData);
        }
    });
});

app.post("/returnComponent", (req, res) => {
    const { prn, component_name, quantity } = req.body;

    if (!prn || !component_name || !quantity) {
        return res.status(400).json({ success: false, message: "Missing required fields." });
    }
    db.beginTransaction((err) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Error starting transaction." });
        }
        const fetchBorrowQuery = "SELECT quantity FROM borrow WHERE prn = ? AND component_name = ?";
        db.query(fetchBorrowQuery, [prn, component_name], (err, result) => {
            if (err) {
                return db.rollback(() => {
                    res.status(500).json({ success: false, message: "Error fetching borrow data." });
                });
            }

            if (result.length === 0) {
                return db.rollback(() => {
                    res.status(404).json({ success: false, message: "No borrow record found for this component." });
                });
            }

            const borrowedQuantity = result[0].quantity;
            if (quantity > borrowedQuantity) {
                return db.rollback(() => {
                    res.status(400).json({ success: false, message: "Returned quantity cannot exceed borrowed quantity." });
                });
            }
            const updateInventoryQuery = "UPDATE total_inventory SET quantity = quantity + ? WHERE component_name = ?";
            db.query(updateInventoryQuery, [quantity, component_name], (err, result) => {
                if (err) {
                    return db.rollback(() => {
                        res.status(500).json({ success: false, message: "Error updating inventory." });
                    });
                }
                const insertReturnQuery = "INSERT INTO return_table (prn, user_name, component_name, quantity) SELECT prn, user_name, component_name, ? FROM borrow WHERE prn = ? AND component_name = ?";
                db.query(insertReturnQuery, [quantity, prn, component_name], (err, result) => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).json({ success: false, message: "Error inserting return record." });
                        });
                    }
                    const remainingQuantity = borrowedQuantity - quantity;
                    if (remainingQuantity > 0) {
                        const updateBorrowQuery = "UPDATE borrow SET quantity = ? WHERE prn = ? AND component_name = ?";
                        db.query(updateBorrowQuery, [remainingQuantity, prn, component_name], (err, result) => {
                            if (err) {
                                return db.rollback(() => {
                                    res.status(500).json({ success: false, message: "Error updating borrow record." });
                                });
                            }
                            db.commit((err) => {
                                if (err) {
                                    return db.rollback(() => {
                                        res.status(500).json({ success: false, message: "Error committing transaction." });
                                    });
                                }

                                res.json({ success: true, message: "Component returned successfully." });
                            });
                        });
                    } else {
                        const deleteBorrowQuery = "DELETE FROM borrow WHERE prn = ? AND component_name = ?";
                        db.query(deleteBorrowQuery, [prn, component_name], (err, result) => {
                            if (err) {
                                return db.rollback(() => {
                                    res.status(500).json({ success: false, message: "Error deleting borrow record." });
                                });
                            }

                            db.commit((err) => {
                                if (err) {
                                    return db.rollback(() => {
                                        res.status(500).json({ success: false, message: "Error committing transaction." });
                                    });
                                }

                                res.json({ success: true, message: "Component returned successfully." });
                            });
                        });
                    }
                });
            });
        });
    });
});


app.get("/returnShowData", (req, res) => {
    const sql = "SELECT * FROM return_table ORDER BY prn";
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err.message);
            res.status(500).send("Error fetching data");
        } else {
            const groupedData = results.reduce((acc, row) => {
                const existingUser = acc.find(item => item.prn === row.prn);
                if (existingUser) {
                    existingUser.components.push({                      
                        component_name: row.component_name,
                        quantity: row.quantity ,
                        return_date: row.return_date
                    });
                } else {
                    acc.push({
                        user_name: row.user_name,
                        prn: row.prn,
                        components: [{
                            return_date:row.return_date,
                            component_name: row.component_name,
                            quantity: row.quantity
                        }]
                    });
                }
                
                return acc;
            }, []);
            
            res.json(groupedData);
        }
    });
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})