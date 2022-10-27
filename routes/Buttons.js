const express = require('express')
const router = express.Router();
const fetch = require('node-fetch');

router.get("/AddProduct", (req, res, next) => {
    const token = req.flash('token')
    if (token == "") {
        req.flash('message', "please make login to acsess Products")
        return res.redirect("/Login")
    }
    req.flash('token', token)
    var storeId = req.flash('storeId')
    req.flash('storeId', storeId)

    fetch('http://localhost:3000/category/getAllCategories').then(res => res.json())
        .then(json => {
            res.render("AddProduct", { json, storeId, titel: "AddProduct" })
        })
})

router.get("/DeleteProduct/:id", (req, res, next) => {
    const token = req.flash('token')
    if (token == "") {
        req.flash('message', "please make login to acsess Products")
        return res.redirect("/Login")
    }
    req.flash('token', token)
    var storeId = req.flash('storeId')
    req.flash('storeId', storeId)
    const id = req.params.id
    fetch('http://localhost:3000/product/DeleteProduct/' + id, {
        method: 'DELETE'
    }).then(res => res.json())
        .then(json => {
            var message;
            if (json.error == null) {
                message = "Product deleted successfully "
            }else{
                message = "There are invoices containing this product, We can't delete it "
            }
            req.flash('message', message)
            res.redirect("/Products")
        })
})

router.get("/UserInvoice/:id", (req, res, next) => {
    const token = req.flash('token')
    if (token == "") {
        req.flash('message', "please make login to acsess Products")
        return res.redirect("/Login")
    }
    req.flash('token', token)

    var storeId = req.flash('storeId')
    req.flash('storeId', storeId)
    var userId = req.params.id

    fetch('http://localhost:3000/invoice/getUserStoreInvoices', {
        method: 'post',
        body: JSON.stringify({ "storeId": storeId, "userId": userId }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token[token.length-1]}`
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


module.exports = router
