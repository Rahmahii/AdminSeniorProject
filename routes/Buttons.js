const express = require('express')
const router = express.Router();
const fetch = require('node-fetch');
var localStorage = require('localStorage')
////////////////////////////////////////////////////////////////////////////////
router.get("/AddProduct", (req, res, next) => {
    const token =localStorage.getItem('token') 
    const storeId =localStorage.getItem('storeId') 

    if (token == "") {
        req.flash('message', "please make login to acsess dashboard")
        return res.redirect("/Login")
    }

    fetch('http://localhost:3000/category/getAllCategories').then(res => res.json())
        .then(json => {
            res.render("AddProduct", { json, storeId, titel: "AddProduct" })
        })
})
////////////////////////////////////////////////////////////////////////////////

router.get("/UpdateProduct/:name/:price/:sellPrice/:barcodeNum/:description/:id/", (req, res, next) => {
    const token =localStorage.getItem('token') 
    if (token == "") {
        req.flash('message', "please make login to acsess dashboard")
        return res.redirect("/Login")
    }
    const name = req.params.name.replaceAll("&", " ")
    const price = req.params.price
    const sellPrice = req.params.sellPrice
    const barcodeNum = req.params.barcodeNum
    const id = req.params.id
    const description=req.params.description.replaceAll("&", " ")
    fetch('http://localhost:3000/category/getAllCategories').then(res => res.json())
        .then(json => {
            res.render("updateProduct", { json, name, price, sellPrice, barcodeNum, description,id, titel: "Update Product" })
        })
})
////////////////////////////////////////////////////////////////////////////////
router.get("/UpdateProductImage/:id", (req, res, next) => {
    const token =localStorage.getItem('token') 
    if (token == "") {
        req.flash('message', "please make login to acsess dashboard")
        return res.redirect("/Login")
    }

    var productId = req.params.id
    res.render("UpdateImage", { productId, titel: "Update Product Image" })
})
////////////////////////////////////////////////////////////////////////////////
router.get("/DeleteProduct/:id", (req, res, next) => {
    const token =localStorage.getItem('token') 
    const storeId =localStorage.getItem('storeId') 

    if (token == "") {
        req.flash('message', "please make login to acsess dashboard")
        return res.redirect("/Login")
    }
    const id = req.params.id
    fetch('http://localhost:3000/product/DeleteProduct/' + id, {
        method: 'DELETE'
    }).then(res => res.json())
        .then(json => {
            var message;
            if (json.error == null) {
                message = "Product deleted successfully "
            } else {
                message = "There are invoices containing this product, We can't delete it "
            }
            req.flash('message', message)
            res.redirect("/Products")
        })
})
////////////////////////////////////////////////////////////////////////////////
router.get("/UserInvoice/:id", (req, res, next) => {
    const token =localStorage.getItem('token') 
    const storeId =localStorage.getItem('storeId') 
    const userId =req.params.id

    if (token == "") {
        req.flash('message', "please make login to acsess dashboard")
        return res.redirect("/Login")
    }

    fetch('http://localhost:3000/invoice/getUserStoreInvoices', {
        method: 'post',
        body: JSON.stringify({ "storeId": storeId, "userId": userId }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    }).then(res => res.json())
        .then(json => {
            if (json.error == null) {
                res.render("Invoices", { json, titel: "User Invoices" })
            } else {
                req.flash('message', "please make login to acsess Products")
                res.redirect("/Login")
            }
        })


})
router.get("/checkUpdade", (req, res, next) => {
    const token =localStorage.getItem('token') 
    if (token == "") {
        req.flash('message', "please make login to acsess dashboard")
        return res.redirect("/Login")
    }
   
    fetch('http://localhost:3000/product/UpdateProduct', {
        method: 'post',
        body: JSON.stringify({ "name": req.query.name, "price": req.query.price, "sellPrice": req.query.sellPrice, "barcodeNum": req.query.barcodeNum, "description": req.query.description, "id": req.query.productId }),
        headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json())
        .then(json => {
            if (json.status) {
                req.flash('message', "product updated successfully")
                res.redirect("/Products")

            } else {
                req.flash('message', json.message)
                res.redirect("/Login")
            }

        })
})

module.exports = router
