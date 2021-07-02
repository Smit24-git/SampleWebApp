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
var items = [];
items = items.concat(
    [
        { id: "apple", name:"Apple", img: "apple.png", price:"4.99"},
        { id: "banana", name:"Banana", img: "banana.png", price:"5.99"},
        { id: "watermelon_tray", name:"Watermelon Tray", img: "watermelon_tray.png", price:"6.99"},
        { id: "soup_mix", name:"Soup Mix", img: "soup_mix.png", price:"5.99"},
        { id: "leeks", name:"Leeks", img: "leeks.png", price:"3.99"}
    ]);

myApp.get('/', (req, res) => {

    res.render('index',{items:items});
});
myApp.post('/',(req,res)=>{
    item = req.body.item;
    qty = req.body.qty;
    if(req.body.cart){
        if(!req.session.cart){
            req.session.cart = [];
        }
        req.session.cart.push({item: item, qty: qty });
        console.log(req.session.cart);    
        res.render('index',{items:items});
    }else{
        
        req.session.buynow = {item: item, qty: qty };
        res.redirect('buynow');
    }
    
});

myApp.get('/cart',(req,res)=>{
    if(req.session.cart )
        res.render('cart',{cart:req.session.cart});
    else
        res.render('cart',{cart:[]});
});
myApp.post('/cart',(req,res)=>{
    if(req.body.checkout){
        res.redirect('checkout');
    }else if(req.body.cart){
        req.session.cart=[];
        res.redirect('cart');
    }else{
        res.redirect('/');
    }   
});
myApp.get('/checkout',(req,res)=>{
    if(req.session.cart) res.render('checkout',{order: req.session.cart});
    else res.render('checkout',{order: []});
});
myApp.post('/checkout',(req,res)=>{
    if(req.body.complete){
        if(!req.session.orders) req.session.orders = [];    
        req.session.orders.push({cName:req.body.cName,delivery: req.body.dDate, orderItems: req.session.cart});
        req.session.cart = [];
    }
    res.redirect('/');
    
});

myApp.get('/buynow',(req,res)=>{
    res.render('checkout',{order: [req.session.buynow]});
});
myApp.post('/buynow',(req,res)=>{
    if(req.body.complete){
        if(!req.session.orders) req.session.orders = [];    
        req.session.orders.push({cName:req.body.cName,delivery: req.body.dDate, orderItems: [req.session.buynow] });
    }
    res.redirect('/');
    req.session.buynow = null;
});
myApp.get('/admin',(req,res)=>{
    if(!req.session.orders) req.session.orders=[];
    res.render('admin',{orders: req.session.orders });
});
myApp.post('/admin',(req,res)=>{
    var date = req.body.dDate;
    var productCounts = Array();
    for(var item of items){
        productCounts.push({name: item.name, qty: 0});
    }
    var orders = req.session.orders;
    if (orders) orders = orders.filter(order => order.delivery == date);
    if(orders){
        orders.forEach(order => {
            var items = order.orderItems;
            
            items.forEach(item => {
                var qty = item.qty
                var item = JSON.parse(item.item);
                for(var productCount of productCounts){
                    if(productCount.name ==item.name) {
                        productCount.qty += parseInt(qty); break;
                    }
                }
            });
        });
    }
    productCounts = productCounts.filter(o=>o.qty>0);
    console.log(productCounts);
    res.render('admin',{orders: req.session.orders, productCounts:productCounts });
});

myApp.listen(process.env.PORT || 5000);
console.log('Click http://localhost:5000');