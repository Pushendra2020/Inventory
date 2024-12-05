const mysql = require('mysql2');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
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
            return res.status(200).json({ success: true, message: "Component added is successfully" });
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

            // return res.status(200).json({ success: true, message: "Component deleted successfully" });
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
        // return res.status(200).json({ success: true, message: "Component updated successfully" }
        // );
        console.log( "Component updated successfully");
    });

})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})