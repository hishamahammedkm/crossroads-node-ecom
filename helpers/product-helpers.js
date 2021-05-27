var db = require("../config/connection");
var collection = require("../config/collections");
var objectId = require("mongodb").ObjectID;

module.exports = {
  addproduct: (product, callback) => {
    db.get()
      .collection(collection.PRODUCT_COLLECTION)
      .insertOne(product)
      .then((data) => {
        callback(data.ops[0]._id);
      });
  },
  getAllProducts: () => {
    return new Promise(async (resolve, reject) => {
      let products = await db
        .get()
        .collection(collection.PRODUCT_COLLECTION)
        .find()
        .toArray();
      resolve(products);
    });
  },
  deleteProduct: (proId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.PRODUCT_COLLECTION)
        .removeOne({ _id: objectId(proId) })
        .then((response) => {
          resolve();
        });
    });
  },
  getProductDetails: (proId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.PRODUCT_COLLECTION)
        .findOne({ _id: objectId(proId) })
        .then((product) => {
          resolve(product);
        });
    });
  },
  updateProduct: (proId, productDetais) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.PRODUCT_COLLECTION)
        .updateOne(
          { _id: objectId(proId) },
          {
            $set: {
              Name: productDetais.Name,
              Price: productDetais.Price,
              Description: productDetais.Description,
            },
          }
        )
        .then(() => {
          resolve();
        });
    });
  },
  getCartCount:(userId)=>{
      let count=0
      return new Promise(async(resolve,reject)=>{
          let cart= await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)})
          if(cart){
              count=cart.products.length
          }
          resolve(count)
        })
  }
};
