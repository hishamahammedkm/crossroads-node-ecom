var db = require("../config/connection");
var collection = require("../config/collections");
const bcrypt = require("bcrypt");
// const collections = require('../config/collections')
var objectId = require("mongodb").ObjectID;
const { ObjectID } = require("mongodb");

module.exports = {
  doSignup: (userData) => {
    return new Promise(async (resolve, reject) => {
      userData.password = await bcrypt.hash(userData.password, 10);
      db.get()
        .collection(collection.USER_COLLECTION)
        .insertOne(userData)
        .then((data, error) => {
          if (!error) {
            resolve(data);
          } else {
            throw error;
          }
        });
    });
  },
  doLogin: (userData) => {
    return new Promise(async (resolve, reject) => {
      let logiStatus = false;
      let response = {};
      let user = await db
        .get()
        .collection(collection.USER_COLLECTION)
        .findOne({ email: userData.email });
      if (user) {
        bcrypt.compare(userData.password, user.password).then((status) => {
          if (status) {
            response.user = user;
            response.status = true;
            resolve(response);
          } else {
            resolve({ status: false });
          }
        });
      } else {
        resolve({ status: false });
      }
    });
  },
  AddToCart: (proId, userId) => {
    return new Promise(async (resolve, reject) => {
      let userCart = await db
        .get()
        .collection(collection.CART_COLLECTION)
        .findOne({ user: objectId(userId) });
      if (userCart) {
        db.get()
          .collection(collection.CART_COLLECTION)
          .updataOne(
            { user: objectId(userId) },

            {
              $push: { products: objectId(proId) },
            }
          )
          .then((response) => {
            resolve();
          });
      } else {
        let cartObj = {
          user: objectId(userId),
          products: [objectId(proId)],
        };
        db.get()
          .collection(collection.CART_COLLECTION)
          .insertOne(cartObj)
          .then((response) => {
            resolve();
          });
      }
    });
  },
  getCartProducts: (userId) => {
      console.log('carttttttttt')
    return new Promise(async(resolve, reject) => {
      let CartItems = await
        db.get()
        .collection(collection.CART_COLLECTION)
        .aggregate([
          {
            $match: { user: objectId(userId) },
          },
          {
            $lookup: {
              from: collection.PRODUCT_COLLECTION,
              let: { prodList: "$products" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $in: ["$_id", "$$prodList"],
                    },
                  },
                },
              ],
              as: "cartItems",
            },
          },
        ]).toArray()
        resolve(cartItems[0].cartItems)
    });
  },
};
