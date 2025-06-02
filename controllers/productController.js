const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
    try {
        const { name, tagline, description, url, image, category } = req.body;
        const userId = req.user.id;

        const product = new Product({
            name,
            tagline,
            description,
            url,
            image,
            category,
            submittedBy: userId
        });

        await product.save();

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.getProducts = async (req, res) => {
    try {
        const { category, sortBy, page = 1, limit = 10 } = req.query;
        const match = {};

        if (category) match.category = category;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const limitNum = parseInt(limit);

        const pipeline = [
            { $match: match },
            {
                $addFields: {
                    upvotesCount: { $size: { $ifNull: ["$upvotes", []] } }
                }
            }
        ];

        if (sortBy === 'trending') {
            pipeline.push({
                $sort: { upvotesCount: -1, createdAt: -1 }
            });
        } else {
            pipeline.push({
                $sort: { createdAt: -1 }
            });
        }

        pipeline.push(
            { $skip: skip },
            { $limit: limitNum }
        );

        const products = await Product.aggregate(pipeline);

        const total = await Product.countDocuments(match);
        const totalPages = Math.ceil(total / limitNum);

        res.status(200).json({
            currentPage: parseInt(page),
            totalPages,
            totalItems: total,
            products
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('submittedBy', 'name email')
            .lean();

        if (!product)
            return res.status(404).json({ message: 'Product not found' });

        product.upvotesCount = product.upvotes.length;

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.toggleUpvote = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product)
            return res.status(404).json({ message: 'Product not found' });

        const userId = req.user.id;
        const index = product.upvotes.indexOf(userId);

        if (index === -1) {
            product.upvotes.push(userId);
        } else {
            product.upvotes.splice(index, 1);
        }

        await product.save();

        res.status(200).json({ upvotesCount: product.upvotes.length });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const categories = await Product.distinct('category');
        res.status(200).json({ categories });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
