const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mysql = require("mysql");
const res = require("express/lib/response");
const { Axios } = require("axios");
const cors = require("cors");

const db = mysql.createPool({
  host: "database-2.cfjbivvdnqqy.us-east-1.rds.amazonaws.com",
  user: "admin",
  password: "uiMasterPass",
  database: "main",
});

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.all("/", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.get("/api/get", (req, res, next) => {
  const sqlSelect = "SELECT * FROM products";
  db.query(sqlSelect, (err, result) => {
    res.send(result);
  });
});

//---------------------------ACCOUNT-----------------------------------

app.get("/api/getAllAccounts", (req, res, next) => {
  const sql = "Select * from users";
  db.query(sql, (err, result) => {
    if (err) res.send({ err: err });
    res.send(result);
  });
});

app.get("/api/getUser/:uID", (req, res, next) => {
  const userID = req.params.uID;

  const sql = "SELECT * FROM users where UserID = ?";
  db.query(sql, userID, (err, result) => {
    if (err) res.send({ err: err });
    res.send(result);
  });
});

app.post("/api/signup", (req, res, next) => {
  const fName = req.body.fName;
  const lName = req.body.lName;
  const email = req.body.email;
  const password = req.body.password;
  const address = req.body.address;

  const sqlInsert =
    "INSERT INTO users (FirstName, LastName, Email, Pass, Username, shipAddress) VALUES (?, ?, ?, ?, ?);";
  db.query(
    sqlInsert,
    [fName, lName, email, password, email, address],
    (err, result) => {
      if (err) throw err;
      else console.log(result);
    }
  );
});

app.put("/api/updateAccount", (req, res, next) => {
  const userID = req.body.userID;
  const fName = req.body.fName;
  const lName = req.body.lName;
  const email = req.body.email;
  const password = req.body.password;
  const address = req.body.address;

  const sqlInsert =
    "UPDATE users SET FirstName = ?, LastName = ?, Email = ?, Pass = ?, Username = ?, shipAddress = ? WHERE UserID = ?;";
  db.query(
    sqlInsert,
    [fName, lName, email, password, email, address, userID],
    (err, result) => {
      if (err) throw err;
      res.send(result);
    }
  );
});

app.post("/api/login", (req, res, next) => {
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

app.put("/api/updateAccount", (req, res, next) => {
  const UserID = req.body.UserID;
  const fName = req.body.fName;
  const lName = req.body.lName;
  const email = req.body.email;
  const pass = req.body.password;
  const address = req.body.address;

  const sql =
    "UPDATE users SET FirstName = ?, LastName = ?, Email = ?, Username = ?, Pass = ?, shipAddress = ? WHERE UserID = ?";

  db.query(
    sql,
    [fName, lName, email, email, pass, address, UserID],
    (err, result) => {
      if (err) res.send({ err: err });
      res.send(result);
    }
  );
});

//-----------------------------PRODUCTS------------------------------------

app.post("/api/additem", (req, res, next) => {
  const name = req.body.name;
  const desc = req.body.desc;
  const price = req.body.price;
  const quantity = req.body.quantity;
  let imgPath = req.body.imgPath;

  if (!imgPath) {
    imgPath = "https://mnapoli.fr/images/posts/null.png";
  }

  const sqlInsertItem =
    "INSERT INTO products (ProductName, ProductDesc, ProductPrice, ProductStock, ProductImage) VALUES (?, ?, ?, ?, ?);";
  db.query(
    sqlInsertItem,
    [name, desc, price, quantity, imgPath],
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      if (result.length > 0) {
        res.send(result);
      }
    }
  );
});

app.delete("/api/delete/:itemName", (req, res, next) => {
  const name = req.params.itemName;
  const sqlDelete = "DELETE FROM Products WHERE ProductName = ?";

  db.query(sqlDelete, name, (err, result) => {
    if (err) console.log(err);
  });
});

app.get("/api/getProduct", (req, res, next) => {
  const id = req.body.id;
  const sql = "SELECT * FROM products WHERE ProductID = ?";

  db.query(sql, id, (err, result) => {
    if (err) console.log(err);
    res.send(result);
  });
});
// This is a GET
app.get("/api/getProduct", (req, res, next) => {
  const id = req.body.id;
  const sql = "SELECT * FROM products WHERE ProductID = ?";

  db.query(sql, id, (err, result) => {
    if (err) console.log(err);
    res.send(result);
  });
});

// This is a POST
app.post("/api/getProduct", (req, res, next) => {
  const id = req.body.id;

  const sql = "SELECT * FROM products WHERE ProductID = ?";

  db.query(sql, id, (err, result) => {
    if (err) res.send({ err: err });
    res.send(result);
  });
});

app.delete("/api/delinstscart/:productID", (req, res, next) => {
  const productID = req.params.productID;

  const sql = "DELETE FROM cart WHERE ProductID = ?";

  db.query(sql, productID, (err, result) => {
    if (err) res.send({ err: err });
    res.send(result);
  });
});

app.delete("/api/deleteProduct/:productID", (req, res, next) => {
  const productID = req.params.productID;

  const sql = "DELETE FROM products WHERE ProductID = ?";

  db.query(sql, productID, (err, result) => {
    if (err) res.send({ err: err });
    res.send(result);
  });
});

app.post("/api/cart", (req, res, next) => {
  const cartItems = req.body.cartItems;
  sqlGet = "select * from products where ProductID = ?";
  products = [];
  for (i = 0; i < cartItems.lenght; i++) {
    db.query(sqlGet, proID, (err, result) => {
      if (err) {
        console.log(err);
      }
      if (result.length > 0) {
        products.push(result);
        console.log(result);
      }
    });
  }
  res.send(products);
});

app.get("/api/getUser/:uID", (req, res, next) => {
  const uID = req.params.uID;
  const sql = "SELECT *  FROM users WHERE UserID = ?";
  db.query(sql, [uID], (err, result) => {
    if (err) res.send({ err: err });
    if (result.length > 0) res.send(result);
  });
});

app.get("/api/getOrders/:orderID", (req, res, next) => {
  const orderID = req.params.orderID;
  const sql = "SELECT * FROM orders WHERE OrderID = ?";

  db.query(sql, [orderID], (err, result) => {
    if (err) res.send({ err: err });
    if (result.length > 0) res.send(result);
  });
});

app.put("/api/updateProduct", (req, res, next) => {
  const id = req.body.id;
  const name = req.body.name;
  const desc = req.body.req;
  const price = req.body.price;
  const stock = req.body.stock;

  const sql =
    "UPDATE products SET ProductName = ?, ProductDesc = ?, ProductPrice = ?, ProductStock = ? WHERE ProductID = ?";

  db.query(sql, [name, desc, price, stock, id], (err, result) => {
    if (err) res.send({ err: err });
    res.send(result);
  });
});

//---------------------------COUPON CODES------------------------------

app.get("/api/getCodes", (req, res, next) => {
  const sql = "SELECT * FROM codes";

  db.query(sql, (err, result) => {
    if (err) res.send({ err: err });
    if (result.length > 0) res.send(result);
  });
});

app.post("/api/addCode", (req, res, next) => {
  const disCode = req.body.code;
  const mult = req.body.mult;

  const sql = "INSERT INTO codes (dCode, mul) VALUES (?, ?)";

  db.query(sql, [disCode, mult], (err, result) => {
    if (err) res.send({ err: err });
    if (result.length > 0) res.send(result);
  });
});

app.delete("/api/deleteCode/:codeID", (req, res, next) => {
  const codeID = req.params.codeID;
  const sql = "DELETE FROM codes WHERE dCode = ?";

  db.query(sql, codeID, (err, result) => {
    if (err) res.send({ err: err });
    res.send(result);
  });
});

//------------------------------CART--------------------------------

app.post("/api/addToCart", function (req, res, next) {
  const UserID = req.body.userID;
  const productID = req.body.productID;
  const productName = req.body.productName;
  const productPrice = req.body.productPrice;
  const productImage = req.body.productImage;
  const amount = req.body.amount;

  // Check if product already in cart
  const setData = (result) => {
    if (result[0]) {
      if ("cartID" in result[0]) {
        const newAmt = parseInt(amount) + parseInt(result[0].quantity);
        const sql = "UPDATE cart SET quantity = ? WHERE cartID = ?";
        db.query(sql, [newAmt, result[0].cartID], (err, ret) => {
          if (err) res.send({ err: err });
          res.send(ret);
        });
      }
    } else {
      const sql =
        "INSERT INTO cart (UserID, ProductID, ProductName, ProductPrice, ProductImage, quantity) VALUES (?, ?, ?, ?, ?, ?)";

      db.query(
        sql,
        [UserID, productID, productName, productPrice, productImage, amount],
        (err, result) => {
          if (err) res.send({ err: "INSERTING" + err });
          res.send(result);
        }
      );
    }
  };

  const select =
    "SELECT cartID, quantity FROM cart WHERE ProductID = ? AND UserID = ?";
  db.query(select, [productID, UserID], (err, result) => {
    if (err) res.send(err);
    setData(result);
  });
});

app.delete("/api/clearCart/:UserID", (req, res, next) => {
  const productID = req.params.UserID;

  const sql = "DELETE FROM cart WHERE UserID = ?";

  db.query(sql, productID, (err, result) => {
    if (err) res.send({ err: err });
    res.send(result);
  });
});

app.delete("/api/deleteItem/:itemID/:UserID", (req, res, next) => {
  const productID = req.params.itemID;
  const UserID = req.params.UserID;

  const sql = "DELETE FROM cart WHERE ProductID = ? AND UserID = ?";

  db.query(sql, [productID, UserID], (err, result) => {
    if (err) res.send({ err: err });
  });
});

app.post("/api/getCart", (req, res, next) => {
  const UserID = req.body.userID;

  const sql = "SELECT * FROM cart WHERE UserID = ?";

  db.query(sql, UserID, (err, result) => {
    if (err) res.send({ err: err });
    res.send(result);
  });
});

//-------------------------ORDERS--------------------------
app.post("/api/addToOrders", (req, res) => {
  const userID = req.body.userID;
  const shipping = req.body.shipping;
  const products = req.body.products;
  const subtotal = req.body.subtotal;
  const tax = req.body.tax;
  const total = req.body.total;

  const sql =
    "INSERT INTO orders(OrderUserID, shipAddress, Products, subtotal, tax, OrderTotal) VALUES (?, ?, ?, ?, ?, ?);";
  db.query(
    sql,
    [userID, shipping, products, subtotal, tax, total],
    (err, result) => {
      if (err) res.send({ err: err });
      res.send(result);
    }
  );
});

app.get("/api/getUserOrders/:uID", (req, res, next) => {
  const userID = req.params.uID;

  const sql = "SELECT * FROM orders WHERE UserID = ?";
  db.query(sql, userID, (err, result) => {
    if (err) res.send({ err: err });
    res.send(result);
  });
});

app.get("/api/getOrder/:orderID", (req, res, next) => {
  const orderID = req.params.orderID;

  const sql = "SELECT * FROM orders where OrderID = ?";

  db.query(sql, orderID, (err, result) => {
    if (err) res.send({ err: err });
    res.send(result);
  });
});

app.listen(80, () => {
  console.log("Running on port 80");
});
