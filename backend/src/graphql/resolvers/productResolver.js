const productService = require("../../services/productService");
const traceabilityService = require("../../services/traceabilityService");

const productResolver = {
    Query: {
        getProduct: async (_, { id }) => {
            return productService.findById(id);
        },
        myProducts: async (_, __, context) => {
            if (!context.user) throw new Error("Unauthorized");
            return productService.findByFarmer(context.user._id);
        },
        listProducts: async (_, { filters }) => {
            return productService.findActive(filters || {});
        },
        traceProduct: async (_, { qrCode }) => {
            return traceabilityService.getTraceByQR(qrCode);
        }
    },

    Mutation: {
        createProduct: async (_, args, context) => {
            if (!context.user) throw new Error("Unauthorized");
            
            const { batchId, title, description, category, pricePerKg, availableQty, minOrderQty, photos, isOrganic } = args;
            
            return productService.create({
                batch: batchId,
                farmer: context.user._id,
                title,
                description,
                category,
                pricePerKg,
                availableQty,
                minOrderQty: minOrderQty || 1,
                photos: photos || [],
                isOrganic: isOrganic || false,
                status: 'active'
            });
        },

        updateProduct: async (_, { id, ...updateData }, context) => {
            if (!context.user) throw new Error("Unauthorized");
            
            const product = await productService.findById(id);
            if (!product) throw new Error("Product not found");
            if (product.farmer._id.toString() !== context.user._id.toString()) {
                throw new Error("Not authorized to update this product");
            }
            
            return productService.update(id, updateData);
        },

        deleteProduct: async (_, { id }, context) => {
            if (!context.user) throw new Error("Unauthorized");
            
            const product = await productService.findById(id);
            if (!product) throw new Error("Product not found");
            if (product.farmer._id.toString() !== context.user._id.toString()) {
                throw new Error("Not authorized to delete this product");
            }
            
            return productService.delete(id);
        },

        publishProduct: async (_, { id }, context) => {
            if (!context.user) throw new Error("Unauthorized");
            
            const product = await productService.findById(id);
            if (!product) throw new Error("Product not found");
            if (product.farmer._id.toString() !== context.user._id.toString()) {
                throw new Error("Not authorized to publish this product");
            }
            
            return productService.updateStatus(id, 'active');
        }
    },

    Product: {
        id: (parent) => parent._id.toString()
    }
};

module.exports = productResolver;

