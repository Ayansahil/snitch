import productModel from "../models/product.model.js";

export const stockOfVariant = async (productId, variantId) => {
    const product = await productModel.findById(productId)

    if (!product) return 0;

    if (variantId === "default" || !variantId) {
        // If product has no variants, return a high default stock
        return (product.variants && product.variants.length > 0) ? product.variants[0].stock : 999;
    }

    const variant = product.variants.find(variant => variant._id.toString() === variantId.toString())
    return variant ? variant.stock : 0;
}