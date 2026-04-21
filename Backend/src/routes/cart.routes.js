import express from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { validateAddToCart } from "../validator/cart.validator.js";
import { addToCart, getCart, removeFromCart, updateCartItemQuantity } from "../controllers/cart.controller.js";



const router = express.Router();


/**
 * @route POST /api/cart/add/:productId/:variantId
 * @desc Add item to cart
 * @access Private
 * @argument productId - ID of the product to add
 * @argument variantId - ID of the variant to add
 * @argument quantity - Quantity of the item to add (optional, default: 1)
 */
router.post("/add/:productId/:variantId",authenticateUser, validateAddToCart, addToCart  )


/**
 * @route GET /api/cart
 * @desc Get user's cart
 * @access Private
 */
router.get("/",authenticateUser, getCart)

/**
 * @route DELETE /api/cart/remove/:productId/:variantId
 * @desc Remove item from cart
 * @access Private
 */
router.delete("/remove/:productId/:variantId", authenticateUser, removeFromCart)



/**
 * @route PATCH /api/cart/update/:productId/:variantId
 * @desc Update item quantity in cart
 * @access Private
 */
router.patch("/update/:productId/:variantId", authenticateUser, updateCartItemQuantity)

export default router;