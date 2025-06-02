const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    tagline: { type: String, required: true },
    description: { type: String },
    url: { type: String, required: true },
    image: { type: String },
    category: { type: String },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);
