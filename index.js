    const express = require('express');
    const bodyParser = require('body-parser');
    const app = express();
    const mysql = require('mysql');
    const res = require('express/lib/response');
    const { Axios } = require('axios');
    const cors = require('cors');
    const db = mysql.createPool({
        host: 'database-2.cfjbivvdnqqy.us-east-1.rds.amazonaws.com',
        user: 'admin',
        password: 'uiMasterPass',
        database: 'main',
    });

    var corsOptions = {
        
    }

    app.use(cors());
    app.use(express.static("public"));
    app.use(express.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.get('/api/get', (req, res) => {

        //EXAMPLE SELECT
        const sqlSelect = "SELECT * FROM products";
        db.query(sqlSelect, (err, result) => {
            res.send(result)
        });
    })

    app.post('/api/insert', (req, res) => {

        const itemName = req.body.itemName;
        const itemID = req.body.itemID;
        const itemDescription = req.body.itemDescription;
        //const itemImage = req.body.itemImage;
        //const itemStock = req.body.itemStock;
        console.log(itemName);
        //EXAMPLE INSERT
        //const sqlInsert = "INSERT INTO items (ProductPrice, ProductDesc, ProductImage, ProductStock) VALUES (?, ?, ?, ?);";
        //db.query(sqlInsert, [item, itemDescription, itemImage, itemStock], (err, result) => {
        const sqlInsert = "INSERT INTO products (productID, description, name) values (?, ?, ?)";
        db.query(sqlInsert, [itemID, itemDescription, itemName], (err, res) => {
            if (err) throw err;
            else { console.log(res); }
        });
    });

    app.post('/api/signup', (req, res) => {

        const fName = req.body.fName;
        const lName = req.body.lName;
        const email = req.body.email;
        const password = req.body.password;

        const sqlInsert = "INSERT INTO users (FirstName, LastName, Email, Pass, Username) VALUES (?, ?, ?, ?, ?);";
        db.query(sqlInsert, [fName, lName, email, password, email], (err, result) => {
            if (err) throw err;
            else console.log(result);
        });
    });

    app.delete('/api/delete/:itemName', (req, res) => {
        const name = req.params.itemName;
        const sqlDelete = "DELETE FROM items WHERE name = ?";

        db.query(sqlDelete, name, (err, result) => {
            if (err) console.log(err);
        });
    });

    app.get('/api/getProduct', (req, res) => {
	const id = req.body.id;
	const sql = "SELECT * FROM products WHERE ProductID = ?";

	db.query(sql, id, (err, result) => {
		if(err) console.log(err);
		res.send(result);
    	});
    });

    app.post('/api/getProduct', (req, res) => {
	const id = req.body.id;

	const sql = 'SELECT * FROM products WHERE ProductID = ?';

	db.query(sql, id, (err, result) => {
		if(err) res.send({ err: err });
		res.send(result);
	});
    });
    app.post('/api/login', (req, res) => {
        //res.send({message: "This works"});

        const email = req.body.email;
        const password = req.body.password;

        const sqlSelect = "SELECT * FROM users WHERE Email = ? AND Pass = ?";
        db.query(sqlSelect, [email, password], (err, result) => {
            if (err) {
                res.send({ err: err });
            }
            if (result.length > 0) {
                res.send(result);
            } else {
                res.send({ message: "Wrong email/password!" });
            }
        });
    });

    app.post('/api/additem', (req, res) => {
        const name = req.body.name;
        const desc = req.body.desc;
        const price = req.body.price;
        const quantity = req.body.quantity;
        const imgPath = req.body.imgPath;

	if(!imagepath){
	   imagePath = 'images/null.png';
	}
        const sqlInsertItem = "INSERT INTO products (ProductName, ProductDesc, ProductPrice, ProductStock, ProductImage) VALUES (?, ?, ?, ?, ?);";
        db.query(sqlInsertItem, [name, desc, price, quantity, imgPath], (err, result) => {
            if (err) {
                res.send({ err: err });
            }
            if (result.length > 0) {
                res.send(result);
            }
        });
    });

    app.post('/api/cart', (req, res) => {
        const cartItems = req.body.cartItems;
        sqlGet = 'select * from products where ProductID = ?';
        products = []
        for (i = 0; i < cartItems.lenght; i++) {
            db.query(sqlGet, proID, (err, result) => {
                if (err) {
                    console.log(err);
                }
                if (result.length > 0) {
                    products.push(result);
                    console.log(result);
                }
            })
        }
        res.send(products);
    });

    app.get('/api/getUser/:uID', (req, res) => {
	const uID = req.params.uID;
	const sql = 'SELECT *  FROM users WHERE userID = ?';
	db.query(sql, [uID], (err, result) => {
		if (err) res.send({ err: err });
		if (result.length > 0) res.send(result);
	});
    });

    app.get('/api/getOrders/:orderID', (req,res) => {
	const orderID = req.params.orderID;
	const sql = 'SELECT * FROM orders WHERE OrderID = ?';

	db.query(sql, [orderID], (err, result) => {
		if(err) res.send({ err: err });
		if(result.length > 0) res.send(result);
	});
    });

    app.get('/api/getCodes', (req, res) => {
	const sql = 'SELECT * FROM codes';

	db.query(sql, (err, result) => {
		if(err) res.send({ err: err });
		if(result.length > 0) res.send(result);
	});
    });

    app.post('/api/addCode', (req, res) => {
	const disCode = req.body.code;
	const mult = req.body.mult;

	const sql = 'INSERT INTO codes (disCode, mult) VALUES (?, ?)';

	db.query(sql, [disCode, mult], (err, result) => {
		if(err) res.send({ err: err });
		if(result.length > 0) res.send(result);
	});
    });

    app.delete('/api/deleteCode/:codeID', (req, res) => {
	const codeID = req.params.codeID;
	const sql = 'DELETE FROM codes WHERE codeID = ?';

	db.query(sql, codeID, (err, result) => {
		if(err) res.send({ err: err });
	});
    });

    app.put('/api/updateAccount', (req, res) => {
	const userID = req.body.userID;
	const fName = req.body.fName;
	const lName = req.body.lName;
	const email = req.body.email;
	const pass = req.body.password;
	const address = req.body.address;

	const sql = 'UPDATE users SET FirstName = ?, LastName = ?, Email = ?, Username = ?, Pass = ?, shipAddress = ? WHERE UserID = ?'

	db.query(sql, [fName, lName, email, email, pass, address, userID], (err, result) => {
		if(err) res.send({ err: err });
		res.send(result);
	});
    });

    app.listen(80, () => {
        console.log("Running on port 80");
    });
