import asyncHandler from '../middleware/asyncHandle.js'
import Product from '../models/productModel.js'


// @desc    Fetch all aproducts
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async(req,res)=>{
    const pageSize = 8; // จำนวนProduct ที่แสดง
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword 
    ? {name: {$regex: req.query.keyword, $options: 'i'}} 
    : {} ;

    const count = await Product.countDocuments({...keyword})

    const products = await Product.find({...keyword}).limit(pageSize).skip(pageSize * (page - 1))
    res.json({products, page, pages: Math.ceil(count / pageSize)});
})

// @desc    Fetch a aproduct
// @route   GET /api/products/:id
// @access  Public
const getProductsById = asyncHandler(async(req,res)=>{
    const product = await Product.findById(req.params.id)
    if (product){
        return res.json(product);
    }   else{
        res.status(404);
        throw new Error('Resource Not Found')
    }
})

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
    const product = new Product({
        name: 'Sample name',
        price: 0,
        user: req.user._id,
        image: '/images/sample.jpg',
        brand: 'Sample brand',
        category: 'Sample category',
        countInStock: 0,
        numReviews: 0,
        description: 'Sample description',
        rating: 0, // เพิ่ม rating ที่นี่หรือให้ค่าตามที่ต้องการ
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

// @desc    Update a Product
// @route   PUT /api/products/:id
// @access  Privare/Admin
const updateProduct = asyncHandler(async(req,res)=>{
    const { name, price, description, image, brand, category, countInStock } = req.body;

    const product = await Product.findById(req.params.id);
    if (product){
        product.name = name;
        product.price = price;
        product.description = description;
        product.image = image;
        product.brand = brand;
        product.category = category;
        product.countInStock = countInStock;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    }
    else{
        res.status(404);
        throw new Error('Resource not Found');
    }
});

// @desc    Delete a Product
// @route   DELETE /api/products/:id
// @access  Privare/Admin
const deleteProduct = asyncHandler(async(req,res)=>{
    const product = await Product.findById(req.params.id);

    if (product){
        await Product.deleteOne({ _id: product._id });
        res.status(200).json({ message: 'Product deleted' })
    }
    else{
        res.status(404);
        throw new Error('Resource not Found');
    }
});

// @desc    Create a new review
// @route   POST /api/products/:id/reviews
// @access  Privare/Admin
const creatProductReview = asyncHandler(async(req,res)=>{
    const {rating, comment} = req.body

    const product = await Product.findById(req.params.id);

    if (product){
        const alreadyReviewed = product.review.find(
            (review) => review.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            res.status(400);
            throw new Error ('Product already reviewed')
        };

        const review = {
            name: req.user.name,
            rating:Number(rating),
            comment,
            user: req.user._id
        };

        product.review.push(review);

        product.numReviews = product.review.length;

        product.rating = product.review.reduce( (acc,review) => acc + review.rating, 0 ) / product.review.length

        await product.save();
        res.status(201).json({message: 'Review added'})
    }
    else{
        res.status(404);
        throw new Error('Resource not Found');
    }
});


export { 
    getProducts, 
    getProductsById, 
    createProduct, 
    updateProduct,
    deleteProduct,
    creatProductReview,
};