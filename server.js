var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://127.0.0.1:27017/swag-shop');

var Product = require('./model/product');
var WishList = require('./model/wishlist');

//Allow all requests from all domains & localhost
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET");
  next();
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.post('/product', async function(request, response) {
    try {
        // Create a new Product instance
        var product = new Product();
        product.title = request.body.title;
        product.price = request.body.price;

        // Save the product to the database
        const savedProduct = await product.save();
        
        // Send the saved product as the response
        response.send(savedProduct);
    } catch (err) {
        // If there is an error, send a 500 status with the error message
        response.status(500).send({ error: "Could not save product" });
    }
});


app.get('/product', async function(request, response) {
    try {
        // Fetch all products from the database
        const products = await Product.find({});

        // Send the fetched products as the response
        response.send(products);
    } catch (err) {
        // If there's an error, send a 500 status with the error message
        response.status(500).send({ error: "Could not fetch products" });
    }
});


app.get('/wishlist', async function(request, response) {
    try {
        // Fetch wishlists and populate the products field
        const wishLists = await WishList.find({})
            .populate({ path: 'products', model: 'Product' })
            .exec();

        // Send the fetched wishlists as the response
        response.status(200).send(wishLists);
    } catch (err) {
        // If there's an error, send a 500 status with the error message
        response.status(500).send({ error: "Could not fetch wishlists" });
    }
});

app.post('/wishlist', async function(request, response) {
    try {
        // Create a new WishList instance
        const wishList = new WishList();
        wishList.title = request.body.title;

        // Save the new wishlist
        const newWishList = await wishList.save();

        // Send the created wishlist as the response
        response.send(newWishList);
    } catch (err) {
        // If there is an error, send a 500 status with the error message
        response.status(500).send({ error: "Could not create wishlist" });
    }
});

app.put('/wishlist/product/add', async function(request, response) {
    try {
        // Find the product by its ID
        const product = await Product.findOne({ _id: request.body.productId });

        if (!product) {
            return response.status(404).send({ error: "Product not found" });
        }

        // Update the wishlist by adding the product to the 'products' array
        const wishList = await WishList.updateOne(
            { _id: request.body.wishListId },
            { $addToSet: { products: product._id } }
        );

        if (wishList.modifiedCount === 0) {
            return response.status(400).send({ error: "Could not add item to wishlist" });
        }

        // Send a success response
        response.send("Successfully added to wishlist");
    } catch (err) {
        // If there's an error, send a 500 status with the error message
        response.status(500).send({ error: "Could not add item to wishlist" });
    }
});


app.listen(3004, function() {
    console.log("Swag Shop API running on port 3004...");
});
