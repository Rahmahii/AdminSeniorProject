const express= require('express')
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const bodyParser=require('body-parser')
const app=express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(express.urlencoded({extended: true}));

app.set("view engine","ejs")
app.set("views","views")//defult views

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

module.exports=app