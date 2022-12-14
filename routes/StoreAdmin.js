const express = require('express')
const router = express.Router();
const atob = require("atob");
const fetch = require('node-fetch');
var localStorage = require('localStorage')

router.get("/Dashboard", (req, res, next) => {
    const token =localStorage.getItem('token') 
    const storeId =localStorage.getItem('storeId') 

    if (token == "") {
        req.flash('message', "please make login to acsess dashboard")
        return res.redirect("/Login")
    }

    const head = {
        method: 'post',
        body: JSON.stringify({ "storeId": storeId }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }

    fetch('http://localhost:3000/dashboard/dashboard', head).then(res => res.json())
        .then(json => {
            if (json.error == null) {
                fetch('http://localhost:3000/dashboard/dashboard2', head).then(res => res.json())
                    .then(json2 => {

                        if (json2.error == null) {
                            fetch('http://localhost:3000/dashboard/dashboard3', head).then(res => res.json())
                                .then(json3 => {
                                    const message = req.flash('message')
                                    res.render("Dashboard", { json, json2, json3, storeId, message, titel: "Dashboard" })
                                })

                        } else {
                            req.flash('message', "please make login to acsess dashboard")
                            res.redirect("/Login")
                        }
                    })
            } else {
                req.flash('message', "please make login to acsess dashboard")
                res.redirect("/Login")
            }

        })

})
///////////////////////////////////////////////////////////////
router.get("/Products", (req, res, next) => {
   const token =localStorage.getItem('token')
   const storeId =localStorage.getItem('storeId') 
    if (token == "") {
        req.flash('message', "please make login to acsess Products")
        return res.redirect("/Login")
    }

    fetch('http://localhost:3000/product/StorAdminView', {
        method: 'post',
        body: JSON.stringify({ "storeId": storeId }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    }).then(res => res.json())
        .then(json => {
            if (json.error == null) {
                const message = req.flash('message')
                res.render("Products", { json, message, titel: "Products" })
            } else {
                console.log(json)
                req.flash('message', "please make login to acsess Products")
                res.redirect("/Login")
            }
        })

})
///////////////////////////////////////////////////////////////
router.get("/Admins", (req, res, next) => {
    const token =localStorage.getItem('token')
    const storeId =localStorage.getItem('storeId') 
    if (token == "") {
        req.flash('message', "please make login to acsess Admins")
        return res.redirect("/Login")
    }

    fetch('http://localhost:3000/user/getUserByStore', {
        method: 'post',
        body: JSON.stringify({ "storeId": storeId }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }).then(res => res.json())
        .then(json => {
            if (json.error == null) {
                res.render("Admins", { json, titel: "Admins" })
            } else {
                req.flash('message', "please make login to acsess Admins")
                res.redirect("/Login")
            }
        })
})
///////////////////////////////////////////////////////////////
router.get("/Shoppers", (req, res, next) => {
    const token =localStorage.getItem('token')
    const storeId =localStorage.getItem('storeId') 
    if (token == "") {
        req.flash('message', "please make login to acsess Shoppers")
        return res.redirect("/Login")
    }

    fetch('http://localhost:3000/invoice/getStoreInvoices', {
        method: 'post',
        body: JSON.stringify({ "storeId": storeId }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }).then(res => res.json())
        .then(json => {
            if (json.error == null) {
                res.render("Shoppers", { json, titel: "Shoppers" })
            } else {
                req.flash('message', "please make login to acsess Shoppers")
                res.redirect("/Login")
            }

        })


})
module.exports = router