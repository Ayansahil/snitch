import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import { stockOfVariant } from "../dao/product.dao.js";
import mongoose from "mongoose";

export const addToCart = async (req, res) => {
  const { productId, variantId } = req.params;
  const { quantity = 1 } = req.body


  const query = { _id: productId };
  if (variantId !== "default") {
    query["variants._id"] = variantId;
  }

  const product = await productModel.findOne(query);

  if (!product) {
    return res.status(404).json({
      message: "Product or variant not found",
      success: false,
    });
  }

  const stock = await stockOfVariant(productId, variantId);

  const cart =(await cartModel.findOne({ user: req.user._id })) ||
    (await cartModel.create({ user: req.user._id }));

  const isProductAlreadyInCart = cart.items.some(
    (item) =>
      item.product.toString() === productId &&
      (variantId === "default" ? !item.variant : item.variant?.toString() === variantId),
  );

  if (isProductAlreadyInCart) {
    const item = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        (variantId === "default" ? !item.variant : item.variant?.toString() === variantId),
    );

    if (item.quantity + quantity > stock) {
      return res.status(400).json({
        message: `Only ${stock} items left in stock. and you already have ${item.quantity} items in your cart`,
        success: false,
      });
    }

    item.quantity += quantity;
    
    // Update price snapshot to current price for accurate price drop detection
    const variantObj = product.variants.find(v => v._id.toString() === variantId);
    const currentPrice = (variantId !== "default" && variantObj?.price) ? variantObj.price : product.price;
    item.price = currentPrice;

    if (item.quantity <= 0) {
      cart.items = cart.items.filter((i) => i !== item);
    }

    await cart.save();

    const populatedCart = await cartModel.findById(cart._id).populate({
        path: 'items.product',
        model: productModel
    });

    return res.status(200).json({
      message: "Cart updated successfully",
      success: true,
      cart: populatedCart
    });
  }

      if (quantity > stock) {
        return res.status(400).json({
            message: `Only ${stock} items left in stock`,
            success: false
        })
    }
    const variantObj = product.variants.find(v => v._id.toString() === variantId);
    const itemPrice = (variantId !== "default" && variantObj?.price) ? variantObj.price : product.price;

    cart.items.push({
      product: productId,
      variant: variantId !== "default" ? variantId : undefined,
      quantity,
      price: itemPrice
    })

    await cart.save()

    // Populate the cart before returning to ensure frontend has full product details
    const populatedCart = await cartModel.findById(cart._id).populate({
        path: 'items.product',
        model: productModel
    });
    
    return res.status(200).json({
        message: "Product added to cart successfully",
        success: true,
        cart: populatedCart
    })
};

export const removeFromCart = async (req, res) => {
    const { productId, variantId } = req.params;
    const userId = req.user._id;

    const cart = await cartModel.findOne({ user: userId });
    
    if (cart) {
        cart.items = cart.items.filter(item => {
            const itemVariantId = item.variant?.toString() || "default";
            return !(
                item.product.toString() === productId &&
                itemVariantId === variantId
            );
        });
        await cart.save();
    }

    return res.status(200).json({
        message: "Item removed from cart successfully",
        success: true,
        cart
    });
}

export const updateCartItemQuantity = async (req, res) => {
    const { productId, variantId } = req.params;
    const { quantity } = req.body;
    const userId = req.user._id;

    if (quantity <= 0) {
        return removeFromCart(req, res);
    }

    const stock = await stockOfVariant(productId, variantId);
    if (quantity > stock) {
        return res.status(400).json({
            message: `Only ${stock} items left in stock`,
            success: false
        });
    }

    const cart = await cartModel.findOne({ user: userId });
    if (!cart) {
        return res.status(404).json({ message: "Cart not found", success: false });
    }

    const itemIndex = cart.items.findIndex(item => {
        const itemVariantId = item.variant?.toString() || "default";
        return item.product.toString() === productId && itemVariantId === variantId;
    });

    if (itemIndex === -1) {
        return res.status(404).json({ message: "Item not in cart", success: false });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    return res.status(200).json({
        message: "Quantity updated successfully",
        success: true,
        cart
    });
}

export const getCart = async (req, res) => {
    const user = req.user;

    // Use Aggregation Pipeline for guaranteed real-time data sync (bypassing Mongoose cache)
   let cart = (await cartModel.aggregate([
        {
            $match: {
                user: new mongoose.Types.ObjectId(user._id)
            }
        },
        { $unwind: { path: '$items' } },
        {
            $lookup: {
                from: 'products',
                localField: 'items.product',
                foreignField: '_id',
                as: 'items.product'
            }
        },
        { $unwind: { path: '$items.product' } },
        {
            $unwind: { path: '$items.product.variants' }
        },
        {
            $match: {
                $expr: {
                    $eq: [
                        '$items.variant',
                        '$items.product.variants._id'
                    ]
                }
            }
        },
        {
            $addFields: {
                itemPrice: {
                    price: {
                        $multiply: [
                            '$items.quantity',
                            '$items.product.variants.price.amount'
                        ]
                    },
                    currency:
                        '$items.product.variants.price.currency'
                }
            }
        },
        {
            $group: {
                _id: '$_id',
                totalPrice: { $sum: '$itemPrice.price' },
                currency: {
                    $first: '$itemPrice.currency'
                },
                items: { $push: '$items' }
            }
        }
    ]))[ 0 ]

    if (!cart) {
        cart = await cartModel.create({ user: user._id });
    }

    return res.status(200).json({
        message: "Cart fetched successfully",
        success: true,
        cart
    });
};

