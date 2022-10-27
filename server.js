const path = require('path')
const express = require('express')
const fetch = require('node-fetch');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const jwt = require('jsonwebtoken');
const atob = require("atob");
const app = express()
const bodyParser=require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(express.urlencoded({extended: true}));

app.set("view engine","ejs")
app.set("views","views")//defult views
 
//app.use(express.static(path.join(__dirname, 'static')))

app.use(cookieParser());

app.use(session({
  secret : 'something',
  cookie: { maxAge: 60000 },
  resave: true,
  saveUninitialized: true
}));
app.use(flash());

const AuthRoute=require('./routes/Auth')
app.use("/",AuthRoute)

const StoreAdminRoute=require('./routes/StoreAdmin')
app.use("/",StoreAdminRoute)

const ButtonsRoute=require('./routes/Buttons')
app.use("/",ButtonsRoute)

app.listen(8000, () => {
    console.log("server is lestning on port 8000")
})


