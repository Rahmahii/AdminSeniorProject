const path = require('path')
const express = require('express')
const fetch = require('node-fetch');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const app = express()
app.use(express.urlencoded({extended: true}));
app.set("view engine","ejs")
app.set("views","views")//defult views
const jwt = require('jsonwebtoken');
const atob = require("atob");
 
//app.use(express.static(path.join(__dirname, 'static')))



app.use(cookieParser());

//app.use(cookieParser('NotSoSecret'));

app.use(session({
  secret : 'something',
  cookie: { maxAge: 60000 },
  resave: true,
  saveUninitialized: true
}));
app.use(flash());


app.get("/SignUp",(req,res,next)=>{

        fetch(' http://localhost:3000/store/getStoresNames').then(res => res.json())
        .then(json => {   
            const message=req.flash('message')
            res.render( "SignUp",{json,message,titel:"SignUp"})
})
})
app.get("/Login",(req,res,next)=>{
    const message=req.flash('message')
        res.render( "Login",{message,titel:"Login"})

})

app.get("/waiting",(req,res,next)=>{
    fetch('http://localhost:3000/user/loginAdmin', {
        method: 'post',
        body: JSON.stringify({"email":req.query.email,"password":req.query.password}),
        headers: {'Content-Type': 'application/json'},
        credentials: 'include' }).then(res => res.json(),
        )      
        .then(json => {   
          //  console.log(res.raw['set-cookie'])
          if(json.status==true){ 
            req.flash('message', json.message)
            req.flash('token', json.token)
            res.redirect( "/Dashboard") 
        }else if(json.status=="waiting"){
           var message= json.message
           console.log(message)
            res.render( "waiting",{message,titel:"waiting"}) 
          }
          else{
            req.flash('message', json.message)
            res.redirect( "/Login")
          }
          
        })
 

})

app.get("/checking", (req, res, next) =>{
    
    fetch('http://localhost:3000/user/signUpAdmin', {
        method: 'post',
        body: JSON.stringify({"storeId":req.query.storeId,"phone":req.query.phone,"email":req.query.email,"name":req.query.name,"password":req.query.password}),
        headers: {'Content-Type': 'application/json'}}).then(res => res.json())
        .then(json => {   
          if(json.status){ 
            req.flash('message', "Your account created successfully")
            res.redirect( "/Login")
           
          }else{
            req.flash('message', json.message)
            res.redirect( "/SignUp")
          }
          
        })
    })



    // console.log(JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString()))
    
    //console.log(token)
    app.get("/Products", (req, res, next) =>{ 
        var storeId=req.flash('storeId')
        req.flash('storeId',storeId)
        fetch('http://localhost:3000/product/StorAdminView', {
            method: 'post',
            body: JSON.stringify({"storeId":storeId}),
            headers: {'Content-Type': 'application/json'}}).then(res => res.json())
            .then(json => {    
        
        res.render( "Products",{json,titel:"Products"})
    })

})

app.get("/Admins", (req, res, next) =>{
    var storeId=req.flash('storeId')
    req.flash('storeId',storeId)
  
//console.log(token)
    fetch('http://localhost:3000/user/getUserByStore', {
        method: 'post',
        body: JSON.stringify({"storeId":storeId}),
        headers: {'Content-Type': 'application/json'}}).then(res => res.json())
        .then(json => {  
           res.render( "Admins",{json,titel:"Admins"})
        })
})

app.get("/Customer", (req, res, next) =>{
    var storeId=req.flash('storeId')
    req.flash('storeId',storeId)
    fetch('http://localhost:3000/invoice/getStoreInvoices', {
        method: 'post',
        body: JSON.stringify({"storeId":storeId}),
        headers: {'Content-Type': 'application/json'}}).then(res => res.json())
        .then(json => {  
            res.render( "Customers",{json,titel:"Customers"})
        })
       
   
})
app.get("/Dashboard", (req, res, next) =>{
    const token=req.flash('token')
    if(token!=0){
    const token1 = token.toString().split(".")[1];
    var storeId = JSON.parse(atob(token1)).storeId;
}else{
    var storeId=req.flash('storeId')
}
   req.flash('storeId', storeId)
       
    fetch('http://localhost:3000/invoice/dashboard', {
        method: 'post',
        body: JSON.stringify({"storeId":storeId}),
        headers: {'Content-Type': 'application/json'}}).then(res => res.json())
        .then(json => { 
            fetch('http://localhost:3000/invoice/dashboard2', {
                method: 'post',
                body: JSON.stringify({"storeId":1}),
                headers: {'Content-Type': 'application/json'}}).then(res => res.json())
                .then(json2 => { 
                    const message=req.flash('message')
                    res.render( "Dashboard",{json,json2,message,token,titel:"Dashboard"})
                })
        })

})

app.listen(8000, () => {
    console.log("server is lestning on port 8000")
})

// fetch('http://localhost:3000/product/StorAdminView')
// .then(res => res.json())
// .then(json => {    
    
// })
