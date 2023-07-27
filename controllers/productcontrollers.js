const Product = require("../models/productmodel");
const ErrorHandler = require("../utils/errorhandler");
const catchasyncerrors = require("../middleware/catchasyncerrors");
const Features = require("../utils/features");
const cloudinary = require("cloudinary");
const User=require("../models/usermodels");

//create product--admin
exports.createProduct = catchasyncerrors(async (req, res, next) => {
    let images = [];
    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    }
    else {
        images = req.body.images;
    }
    const imageslink = [];
    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], { folder: "products" });
        imageslink.push({
            public_id: result.public_id,
            url: result.secure_url,
        });
    }
    req.body.images = imageslink;
    req.body.user = req.user.id;
    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product
    })
});

//get all products
exports.getallproducts = catchasyncerrors(async (req, res, next) => {
    const resultPerPage = 8;
    const productsCount = await Product.countDocuments();
    const features = new Features(Product.find(), req.query).search().filter();
    let products = await features.query;
    let filteredProductsCount = products.length;
    features.pagination(resultPerPage);
    products = await features.query.clone();
    res.status(200).json({
        success: true,
        products,
        productsCount,
        resultPerPage,
        filteredProductsCount,
    })
});



//get all products--admin
exports.allAdminProducts = catchasyncerrors(async (req, res, next) => {
    const products = await Product.find();

    res.status(200).json({
        success: true,
        products,
    });
});

//get single product
exports.getsingleproduct = catchasyncerrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));

    }
    const _id=product.user;
    const user=await User.findById({_id});
    res.status(200).json({
        success: true,
        product,
        user,
       
    })
});

//update product --admin

exports.updateProduct = catchasyncerrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    let images = [];
    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    }
    else {
        images = req.body.images;
    }
    if (images !== undefined) {
        for (let i = 0; i < product.images.length; i++) {
            await cloudinary.v2.uploader.destroy(product.images[i].public_id);
        }
        const imageslink = [];
        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], { folder: "products" });
            imageslink.push({
                public_id: result.public_id,
                url: result.secure_url,
            });
        }
        req.body.images=imageslink;
    }



    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    res.status(200).json({
        success: true,
        product
    })
});


//delete product
exports.deleteProduct = catchasyncerrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    for (let i = 0; i < product.images.length; i++) {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    await product.deleteOne();
    res.status(200).json({
        success: true,
        message: "product deleted fully"
    })
});

//create new review or update review
exports.createproductreview = catchasyncerrors(async (req, res, next) => {
    const { rating, comment, productId } = req.body;
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }
    const product = await Product.findById(productId);
    const isreviewed = product.reviews.find(rev => rev.user.toString() === req.user._id.toString()
    )
    if (isreviewed) {
        product.reviews.forEach(rev => {
            if (rev.user.toString() === req.user._id.toString()) {
                (rev.rating = rating),
                    (rev.comment = comment)
            }

        })
    }
    else {
        product.reviews.push(review);
        product.numofreviews = product.reviews.length
    }

    let avg = 0;
    product.reviews.forEach(rev => {
        avg += rev.rating
    })

    product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true,
    })
})

//get  all reviews of a product
exports.getproductreview = catchasyncerrors(async (req, res, next) => {
    const product = await Product.findById(req.query.id);

    if (!product) {
        return next(new ErrorHandler("product not found", 404));

    }
    res.status(200).json({
        success: true,
        reviews: product.reviews,
    })
})

//delete review
exports.deletereview = catchasyncerrors(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);

    if (!product) {
        return next(new ErrorHandler("product not found", 404));

    }
    const reviews = product.reviews.filter(rev => rev._id.toString() !== req.query.id.toString());
    let avg = 0;
    reviews.forEach(rev => {
        avg += rev.rating
    })
    let ratings=0;
    if(reviews.length === 0){
        ratings=0;
    }
    else{
        ratings = avg / product.reviews.length;
    }
    const numofreviews = reviews.length;
    await Product.findByIdAndUpdate(req.query.productId, {
        reviews, ratings, numofreviews
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    }
    )

    res.status(200).json({
        success: true,
    })
})

