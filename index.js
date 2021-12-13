const express = require('express');
const mysql = require("mysql");
const ejs = require("ejs");
const dotenv = require("dotenv");

const session = require("express-session");
const passport = require("passport");
const req = require('express/lib/request');
const res = require('express/lib/response');
require("./auth");

function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}


//express app
const app = new express();

//session usage middleware
app.use(session({ secret: process.env.MY_SECRET })); 
app.use(passport.initialize());
app.use(passport.session());

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

//place it sends you when you look up sight
app.get('/', (req, res) => {
    res.send(`
    <style>
        body {
            background: rgba(221, 221, 221, 0.637);
            font-family: Arial, Helvetica, sans-serif;
            line-height: 1;
        }
        h1 {
            color: rgb(240, 156, 0);
            text-align: center;
            font-size: 85px;
        }
        h2 {
            color: rgb(240, 156, 0);
            font-size: 50px;
            text-align: center;
        }
        p {
            text-align: center;
            margin: 40px;
        }
        section {
            border-style: double;
            margin: 15px;
        }
    </style>
    <body>
        <main>
            <h1>Welcome to UniHang</h1>
            <section>
                <h2>Uni is short for University</h2>
                <p> Come one come all! Login with any google account and see what UniHang holds!</p>
                
                <a href="/auth/google"> Login with Google </a>
            </section>
        </main>
        <hr>
        <footer>&copy; UniHang</footer>
    </body>
    `)
});

//google auth route
app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["email", "profile"] })
);

// Define Route: /google/callback to redirect users back to our webapp after successfull log in
app.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      successRedirect: "/home",
      failureRedirect: "auth/failure",
    })
);

// Create a protected route for successful redirect -- Users won't be able to access this route unless successfully logged in.
app.get("/home", isLoggedIn, (req, res) => {
    res.render("../views/home.ejs");
});

// Define a failure route for redirect on invalid login in
app.get("/auth/failure", (req, res) => {
    res.send("You were not authenticated.. Try again next time");
});
 
//creation routes
app.post("/createorg", (req, res) => {
    let data = { oname: req.body.orgname, odetails: req.body.details };
    let sql = `INSERT INTO orgs SET ?`;
    let query = db.query(sql, data, (err, result) => {
      if (err) {
        throw err;
      }
      res.send(`Org has been created`);
    });
  });

app.post("/createevent", (req, res) => {
    let e1 = { ename: req.body.evname, edetails: req.body.evdetails, edate: req.body.thedate };
    let sql = `INSERT INTO e SET ?`;
    let query = db.query(sql, e1, (err, result) => {
        if (err) {
            throw err;
            
        }
        res.send(`Event has been created`)
        console.log("it worked");
    });
});

//logout function/route
app.get("/logout", (req, res) => {
    req.logout();
    req.session.destroy();
    res.send("You have been successfully logged out... Goodbye!");
});

//update routes
app.post("/updateorgs", (req, res) => {
    let sql = `UPDATE orgs SET odetails = '${req.body.updateOrgDetails}' WHERE id = ${req.body.orgId}`;
    db.query(sql, (err, result) => {
        if (err){
            throw err;
        }
        res.send(`updated org`);
    });
});

app.post("/updateevent", (req, res) => {
    let sql = `UPDATE e SET edetails = '${req.body.updateEDetails}' WHERE id = ${req.body.eventId}`;
    let sql2 = `UPDATE e SET edate = ${req.body.updateEDate} WHERE id = ${req.body.eventId}`;
    db.query(sql, sql2, (err, result) => {
        if (err){
            throw err;
        }
        res.send(`updated event`);
    });
});

//delete routes
app.post("/deleteorg", (req, res) => {
    let sql = `DELETE FROM orgs WHERE id = '${req.body.orgIdent}'`;
    db.query(sql, (err, result) => {
        if (err){
            throw err;
        }
        res.send(`Org deleted`);
    });
});

app.post("/deleteevent", (req, res) => {
    let sql = `DELETE FROM e WHERE id = '${req.body.eIdent}'`;
    db.query(sql, (err, result) => {
        if (err){
            throw err;
        }
        res.send(`Event deleted`);
    });
});

//read routes
app.get("/readevents", (req, res) => {
    let sql = `SELECT * FROM e`;
    db.query(sql, (err, result) => {
        if(err){
            throw err;
        }
        res.render("events", {e1: result})
    });

});

app.get("/readorgs", (req, res) => {
    let sql = `SELECT * FROM orgs`;
    db.query(sql, (err, result) => {
        if(err){
            throw err;
        }
        res.render("orgs", {data: result})
    });

});

//start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> (console.log(`Server started on PORT NO. ${PORT}`)));