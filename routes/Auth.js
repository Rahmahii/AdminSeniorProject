const express = require('express')
const router = express.Router();
const atob = require("atob");
const fetch = require('node-fetch');
const bcrypt = require('bcrypt');
var localStorage = require('localStorage')

router.get("/SignUp", (req, res, next) => {
  fetch(' http://localhost:3000/store/getStoresNames').then(res => res.json())
    .then(json => {
      const message = req.flash('message')
      res.render("SignUp", { json, message, titel: "SignUp" })
    })
})
///////////////////////////////////////////////////////////////
router.get("/Login", (req, res, next) => {
  const message = req.flash('message')
  res.render("Login", { message, titel: "Login" })
})
///////////////////////////////////////////////////////////////
router.get("/Logout", (req, res, next) => {
  localStorage.clear();
  req.flash('message', "Logout successfully")
  res.redirect("/Login")

})
///////////////////////////////////////////////////////////////
router.get("/checkApproval", (req, res, next) => {
  fetch('http://localhost:3000/user/loginAdmin', {
    method: 'post',
    body: JSON.stringify({ "email": req.query.email, "password": req.query.password }),
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include'
  }).then(res => res.json(),
  )
    .then(json => {
      if (json.status == true) {
        req.flash('message', json.message)
        localStorage.setItem('token', json.token);
        setStoreId()
        res.redirect("/Dashboard")
      } else if (json.status == "waiting") {
        req.flash('message', json.message)
        res.redirect("/waiting")
      }
      else {
        req.flash('message', json.message)
        res.redirect("/Login")
      }

    })
})
///////////////////////////////////////////////////////////////
router.get("/waiting", (req, res, next) => {
  const message = req.flash('message')
  res.render("waiting", { message, titel: "waiting" })

})
///////////////////////////////////////////////////////////////
router.get("/checking", async (req, res, next) => {
  const password = await bcrypt.hash(req.query.password, await bcrypt.genSalt(10))
  fetch('http://localhost:3000/user/signUpAdmin', {
    method: 'post',
    body: JSON.stringify({ "storeId": req.query.storeId, "phone": req.query.phone, "email": req.query.email, "name": req.query.name, "password": password, "gender": req.query.gender }),
    headers: { 'Content-Type': 'application/json' }
  }).then(res => res.json())
    .then(json => {
      if (json.status) {
        req.flash('message', "Your account created successfully")
        res.redirect("/Login")

      } else {
        req.flash('message', json.message)
        res.redirect("/SignUp")
      }

    })
})

function setStoreId() {
  const token = localStorage.getItem('token')
  const token1 = token.toString().split(".")[1];
  var storeId = JSON.parse(atob(token1)).storeId;
  
  localStorage.setItem('storeId', storeId);
  

}
module.exports = router
