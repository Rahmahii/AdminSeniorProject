const path = require('path')
const express = require('express')
const fetch = require('node-fetch');
const app = express()
app.set("view engine","ejs")
app.set("views","views")//defult views
 
app.use(express.static(path.join(__dirname, 'static')))

app.get("/Products", (req, res, next) =>{
    
    fetch('http://localhost:3000/product/StorAdminView', {
	method: 'post',
	body: JSON.stringify({"storeId":1}),
	headers: {'Content-Type': 'application/json'}}).then(res => res.json())
    .then(json => {    
        res.render( "Products",{json})
    })

})

app.listen(8000, () => {
    console.log("server is lestning on port 8000")
})

// fetch('http://localhost:3000/product/StorAdminView')
// .then(res => res.json())
// .then(json => {    
    
// })

