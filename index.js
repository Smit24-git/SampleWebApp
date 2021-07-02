const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
var firebase = require("firebase/app");

const session=require('express-session');

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");

var myApp = express();

myApp.set('views', path.join(__dirname, 'views'));

myApp.set('view engine', 'ejs');

myApp.use(bodyParser.urlencoded({ extended: true }));
myApp.use(express.static(__dirname + '/public'));

myApp.use(session({
     secret: 'a2ficy2445idakco', //very complex string is required...
     resave: false,
     saveUninitialized: true
 }));


var firebaseConfig = {
};
firebase.initializeApp(firebaseConfig);
myApp.get('/', (req, res) => {
    var items = [];
    items = items.concat(
        [
            { id: "apple", name:"Apple", img: "apple.png", price:"4.99"},
            { id: "banana", name:"Banana", img: "banana.png", price:"5.99"},
            { id: "watermelon_tray", name:"Watermelon Tray", img: "watermelon_tray.png", price:"6.99"},
            { id: "soup_mix", name:"Soup Mix", img: "soup_mix.png", price:"5.99"},
            { id: "leeks", name:"Leeks", img: "leeks.png", price:"3.99"}
        ]);
    res.render('index',{items:items});
});

myApp.listen(process.env.PORT || 5000);
console.log('Click http://localhost:5000');