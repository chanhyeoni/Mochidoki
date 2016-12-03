var express = require("express");
var session = require("express-session");
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
//var passport = require("passport");
var ObjectID = mongodb.ObjectID;

var INVOICES = "invoice";

var app = express();

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// use session
app.use(session({secret: 'ssshhhhh'}));

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

<<<<<<< HEAD
var MONGODB_URI = "mongodb://heroku_155d3r3c:375pu0ssddrdqaor9k7letgets@ds033116.mlab.com:33116/heroku_155d3r3c";

// Connect to the database before starting the application server. 
mongodb.MongoClient.connect(MONGODB_URI, function (err, database) {
=======



// Connect to the database before starting the application server. 
mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
  
>>>>>>> 811f094a551f263c35fd8540547d72c54b212d5e
  if (err) {
    console.log(err);
    process.exit(1);
  }
  // Save database object from the callback for reuse.
  db = database;
  // Initialize the app
  var server = app.listen(process.env.PORT || 3000, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

// CONTACTS API ROUTES BELOW
// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

// login
app.get("/isLoggedIn", function(req, res){
  console.log("isLoggedIn called");

  if (req != null && req.session != null && req.session.isLoggedIn != null){
    return res.json({isLoggedIn : req.session.isLoggedIn, session: req.session});
  }else{
    return res.json({isLoggedIn : false, session: "no session"});
  }
});

// app.get("/login", function(req, res){
//   console.log("login get called");
//   if (req != null && req.session != null && req.session.isLoggedIn != null){
//     return res.json({isLoggedIn : req.session.isLoggedIn, session: req.session});
//   }else{
//     return res.json({isLoggedIn : false, session: "no session"});
//   }
// });


app.post("/login", function(req, res){
  console.log("login post called");
  var email = req.body.email; //req.param('email');
  var password = req.body.password; //req.param('password')

  if (email != undefined && password != undefined){
    var userInformation = db.collection("user").findOne({"email" : email, "password": password});
    if (userInformation){      

      req.session.email = userInformation.email;
      req.session.isLoggedIn = true;   
      db.collection(INVOICES).find({}).toArray(function(err, docs) {
        if (err) {
          console.log("error in getting invoices from login!");
          handleError(res, err.message, "Failed to get invoices.");
        } else {
          console.log("assigned!");
        }
        return res.status(200).json({
          message: 'You are signed in successfully',
          status: 200,
          invoices : docs
        });  

      });
    }else{
      return res.status(401).json({
        message: 'Username and password are not matched.',
        status: 401
      });
    }   
  }else{
    return res.status(401).json({
      message: 'Aunthorized.',
      status: 401
    });    
  }
});

// invoices
app.get("/invoices", function(req, res){
  console.log("invoices called");
  db.collection(INVOICES).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get invoices.");
    } else {
      res.status(200).json(docs);  
    }
  });
});

app.post("/newInvoice", function(req, res) {
  console.log("newInvoice called");
  var newInvoice = req.body;
  newInvoice.dateCreated = new Date();

  if (!(req.body.firstName || req.body.lastName)) {
    handleError(res, "Invalid user input", "Must provide a first or last name.", 400);
  }

  db.collection(INVOICES).insertOne(newInvoice, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new invoice.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

app.get("/invoice/:id", function(req, res){
    console.log("invoice called");
    db.collection(INVOICE).findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
      if (err) {
        handleError(res, err.message, "Failed to get the invoice requested");
      } else {
        res.status(200).json(doc);  
      }
    });
});