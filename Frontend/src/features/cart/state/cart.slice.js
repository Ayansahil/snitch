import { createSlice } from "@reduxjs/toolkit";


const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: [],
    },
    reducers: {
        setItems: (state, action) => {
            state.items = action.payload;
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

export const { setItems, addItem, updateQuantity, removeItem } = cartSlice.actions
export default cartSlice.reducer