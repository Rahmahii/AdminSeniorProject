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
            res.render("AddProduct", { json, storeId ,titel: "AddProduct" })
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
const id= req.params.id

  fetch('http://localhost:3000/product/DeleteProduct/'+id,{
    method: 'DELETE'
  }).then(res => res.json())
      .then(json => {
          res.redirect("/Products")
      })
})


module.exports = router
