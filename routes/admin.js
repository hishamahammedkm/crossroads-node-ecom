var express = require('express');
var router = express.Router();
var productHelpers = require('../helpers/product-helpers')

router.get('/', function(req, res, next) {
  productHelpers.getAllProducts().then((products)=>{
    res.render('admin/view-products',{products,admin:true})


  })
});
router.get('/add-product',function(req,res){
  res.render('admin/add-products',{admin:true})
})
router.post('/add-product',function(req,res){

  productHelpers.addproduct(req.body,(id)=>{
    let image = req.files.image
    image.mv('./public/product-images/'+id+'.jpg',(err,done)=>{
      if(!err){
        res.render('admin/add-products')

      }
    })
    })
  })

router.get('/delete-product/:id',(req,res)=>{
  let proId=req.params.id
  productHelpers.deleteProduct(proId).then((response)=>{
    res.redirect('/admin')
  })
  
})
router.get('/edit-product/:id',async(req,res)=>{
  let proId=req.params.id
  
  let product =await productHelpers.getProductDetails(proId)
  
  res.render('admin/edit-product',{product})
  
})
router.post('/edit-product/:id',(req,res)=>{
  productHelpers.updateProduct(req.params.id,req.body).then(()=>{
    res.redirect('/admin')
    if(req.files.image){
      let image = req.files.image
      image.mv('./public/product-images/'+req.params.id+'.jpg')
       
      

    }

  })
})

module.exports = router;
