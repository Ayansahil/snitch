import { param, body, validationResult } from "express-validator";

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

export const validateAddToCart = [
    param("productId").isMongoId().withMessage("Invalid product ID"),
    param("variantId").custom((value) => {
        if (value === "default") return true;
        // Simple regex check for MongoId since isMongoId() might be strict on types
        if (/^[0-9a-fA-F]{24}$/.test(value)) return true;
        return false;
    }).withMessage("Invalid variant ID"),
    body("quantity").optional().isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
    validateRequest
]