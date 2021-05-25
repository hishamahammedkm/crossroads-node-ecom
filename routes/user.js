var express = require("express");
var router = express.Router();
var productHelpers = require("../helpers/product-helpers");
var userHelpers = require("../helpers/user-helpers");
/* GET home page. */
const verifyLogin=(req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }else{
    res.redirect('/login')
  }
}
router.get("/", function (req, res, next) {
  let user = req.session.user
  productHelpers.getAllProducts().then((products) => {
    res.render("user/view-products", { products,user,admin: false });
  });
});
router.get("/login", (req, res) => {
  if(req.session.loggedIn){
    res.redirect('/')
  }else{
    res.render("user/login",{'loginError':req.session.loginError});
    req.session.loginError=''
  }
  
});
router.get("/signup", (req, res) => {
  res.render("user/signup");
});
router.post("/signup", (req, res) => {
  userHelpers.doSignup(req.body).then((response) => {
    console.log(response);
  });
});
router.post("/login", (req, res) => {
  userHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.loggedIn=true
      req.session.user = response.user
      res.redirect('/');
    }else{
      req.session.loginError='invalid username or password'
      res.redirect('/login');
    }
  });
});
router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/login')
})
router.get('/cart',verifyLogin,(req,res)=>{
  res.render('user/cart')
})

module.exports = router;
