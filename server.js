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
 
//app.use(express.static(path.join(__dirname, 'static')))


app.use(cookieParser('NotSoSecret'));
app.use(session({
  secret : 'something',
  cookie: { maxAge: 60000 },
  resave: true,
  saveUninitialized: true
}));
app.use(flash());


app.get("/signUp",(req,res,next)=>{
    //res.render( "signUp",{titel:"signUp"}) 

    fetch(' http://localhost:3000/store/getStoresNames').then(res => res.json())
        .then(json => {   
            const message=req.flash('message')
            res.render( "signUp",{json,message,titel:"signUp"})
})
})
//console.log(isSaved)

app.get("/waiting", (req, res, next) =>{
    
    fetch('http://localhost:3000/user/signUpAdmin', {
        method: 'post',
        body: JSON.stringify({"storeId":req.query.storeId,"phone":req.query.phone,"email":req.query.email,"name":req.query.name,"password":req.query.password}),
        headers: {'Content-Type': 'application/json'}}).then(res => res.json())
        .then(json => {   
          if(json.status){ 
            res.render( "waiting",{titel:"waiting"})
            console.log(json.status)
          }else{
            req.flash('message', json.message)
            res.redirect( "/signUp")
            //console.log(json.message)
          }
          
        })
    })



app.get("/Products", (req, res, next) =>{
    
    fetch('http://localhost:3000/product/StorAdminView', {
	method: 'post',
    body: JSON.stringify({"storeId":1}),
	headers: {'Content-Type': 'application/json'}}).then(res => res.json())
    .then(json => {    
        res.render( "Products",{json,titel:"Products"})
    })

})

app.get("/Admins", (req, res, next) =>{
    fetch('http://localhost:3000/user/getUserByStore', {
        method: 'post',
        body: JSON.stringify({"storeId":1}),
        headers: {'Content-Type': 'application/json'}}).then(res => res.json())
        .then(json => {  
           res.render( "Admins",{json,titel:"Admins"})
        })
})

app.get("/Customer", (req, res, next) =>{
    fetch('http://localhost:3000/invoice/getStoreInvoices', {
        method: 'post',
        body: JSON.stringify({"storeId":1}),
        headers: {'Content-Type': 'application/json'}}).then(res => res.json())
        .then(json => {  
            res.render( "Customers",{json,titel:"Customers"})
        })
       
   
})
app.get("/Dashboard", (req, res, next) =>{
   
     
    fetch('http://localhost:3000/invoice/dashboard', {
        method: 'post',
        body: JSON.stringify({"storeId":1}),
        headers: {'Content-Type': 'application/json'}}).then(res => res.json())
        .then(json => { 
            fetch('http://localhost:3000/invoice/dashboard2', {
                method: 'post',
                body: JSON.stringify({"storeId":1}),
                headers: {'Content-Type': 'application/json'}}).then(res => res.json())
                .then(json2 => { 
                    res.render( "Dashboard",{json,json2,titel:"Dashboard"})
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
