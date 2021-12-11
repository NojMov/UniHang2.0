const express = require('express');
//const mysql = require("mysql");
const ejs = require("ejs");

//express app
const app = new express();

//database connection config
// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: ''
    
// });

// //connection with the DB
// db.connect((err) => {
//     if (err) {
//         throw err;
//     }else{
//         console.log(`Successfully connected to the DB`)
//     }
// })

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