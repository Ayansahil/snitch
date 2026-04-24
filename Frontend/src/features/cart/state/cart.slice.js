import { createSlice } from "@reduxjs/toolkit";


const cartSlice = createSlice({
    name: "cart",
    initialState: {
        totalPrice: null,
        currency: null,
        items: [],
    },
    reducers: {
        setCart: (state, action) => {
            state.items = action.payload.items;
            state.totalPrice = action.payload.totalPrice;
            state.currency = action.payload.currency;
        },
        addItem: (state, action) => {
            state.items.push(action.payload)
        },
        updateQuantity: (state, action) => {
            const { productId, variantId, quantity } = action.payload;
            const item = state.items.find(i => 
                i.product?._id === productId && 
                (i.variant || 'default') === (variantId || 'default')
            );
            if (item) {
                item.quantity = quantity;
            }
        },
        removeItem: (state, action) => {
            const { productId, variantId } = action.payload;
            state.items = state.items.filter(i => 
                !(i.product?._id === productId && 
                (i.variant || 'default') === (variantId || 'default'))
            );
        }
    }
})

export const { setCart, addItem, updateQuantity, removeItem } = cartSlice.actions
export default cartSlice.reducer