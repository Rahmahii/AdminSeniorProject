const path = require('path')
const express = require('express')
const fetch = require('node-fetch');
const app = express()
app.set("view engine","ejs")
app.set("views","views")//defult views
 
//app.use(express.static(path.join(__dirname, 'static')))

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
   
    res.render( "Dashboard",{titel:"Dashboard"})

})

app.listen(8000, () => {
    console.log("server is lestning on port 8000")
})

// fetch('http://localhost:3000/product/StorAdminView')
// .then(res => res.json())
// .then(json => {    
    
// })

