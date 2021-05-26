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
    AddToCart: (productId, userId) => {


        return new Promise(async (resolve) => {
            const userCart = await db
                .get()
                .collection(collection.CART_COLLECTION)
                .findOne({ user: ObjectID(userId) });
            if (!userCart) {
                const cart = {
                    user: ObjectID(userId),
                    products: [ObjectID(productId)],
                };
                db.get()
                    .collection(collection.CART_COLLECTION)
                    .insertOne(cart, (err, done) => {
                        console.log(done);
                        resolve();
                    });
            } else {
                db.get()
                    .collection(collection.CART_COLLECTION)
                    .updateOne(
                        { user: ObjectID(userId) },
                        { $push: { products: ObjectID(productId) } },
                        (err, done) => {
                            if (!err) {
                                resolve();
                            }
                        }
                    );
            }
        });
    },
    getCartProducts: (userId) => {
        return new Promise(async (resolve) => {
            console.log(userId);
            let cart = await db
                .get()
                .collection(collection.CART_COLLECTION)
                .aggregate([
                    { $match: { user: ObjectID(userId) } },
                    {
                        $lookup: {
                            from: collection.PRODUCT_COLLECTION,
                            let: { product: "$products" },
                            pipeline: [
                                {
                                    $match: { $expr: { $in: ["$_id", "$$product"] } },
                                },
                            ],
                            as: "productDetails",
                        },
                    },
                    { $project: { productDetails: 1, _id: 0 } },
                ])
                .toArray();
            console.log(cart);
            if (cart[0]) resolve(cart[0].productDetails);
            else resolve(null);
        });
    },
};
