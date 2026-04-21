import { createSlice } from "@reduxjs/toolkit";


const productSlice = createSlice({
    name: "product",
    initialState: {
        sellerProducts: [],
        products: [],
        searchQuery: ""
    },
    reducers: {
        setSellerProducts: (state, action) => {
            state.sellerProducts = action.payload
        },
        setProducts: (state, action) => {
            state.products = action.payload
        },
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload
        }
    }
})


export const { setSellerProducts, setProducts, setSearchQuery } = productSlice.actions
export default productSlice.reducer