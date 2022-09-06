import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
        {
                name: {type: String, required: true},
                slug: {type: String, required: true, unique: true },
                category: {type: String, required: true},
                size: {type: String, required: false},
                image: {type: String, required: true},
                image2: {type: String, required: true},
                image3: {type: String, required: true},
                image4: {type: String, required: true},
                image5: {type: String, required: true},
                image6: {type: String, required: true},
                image7: {type: String, required: true},
                image8: {type: String, required: true},
                image9: {type: String, required: true},
                image10: {type: String, required: true},
                price: {type: Number, required: true},
                brand: {type: String, required: true},
                rating: {type: Number, required: true, default: 0},
                numReviews: {type: Number, required: true, default: 0},
                countInStock: {type: Number, required: true, default: 0},
                description: {type: String, required: true},
        },
        {
                timestamps: true,
        }
);

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;