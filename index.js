const express = require('express');
const mysql = require("mysql");
const ejs = require("ejs");

//express app
const app = new express();

//database connection config
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root123',
    database: 'unihangDb',
});

// //connection with the DB
db.connect((err) => {
    if (err) {
        throw err;
    }else{
        console.log(`Successfully connected to the DB`)
    }
})

// Initialize Body Parser Middleware to parse data sent by users in the request object
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // to parse HTML form data

// Initialize ejs Middleware
app.set("view engine", "ejs");
app.use("/public", express.static(__dirname + "/public"));

//routes 
app.get('/', (req, res) => {
    res.render("../views/landing.ejs")
});

app.post("/newuser", (req, res) => {
    let data = {fname: req.body.fn, lname: req.body.ln, email: req.body.e,
        major: req.body.m};
    
    let sql = `INSERT INTO users SET ?`;
    let query = db.query(sql, data, (err, result) => {
        if (err){
            throw err;
        }
        res.send("things were saved")
        console.log("it saved");
    });
});

app.get("/home", (req, res) => {
    let sql = `SELECT * FROM users`;
    db.query(sql, (err, result) => {
        if (err) {
            throw err;
            
        }
        res.render("/home", { user: result});
        console.log("it worked");
    });
});

app.get('/home', (req, res) => {
    res.render('../views/home.ejs')
});

app.get('/events', (req, res) => {
    res.render('../views/events.ejs')
});

app.get('/orgs', (req, res) => {
    res.render('../views/orgs.ejs')
});

app.get('/sign_up', (req, res) => {
    res.render('../views/sign_up.ejs')
});

//start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> (console.log(`Server started on PORT NO. ${PORT}`)));