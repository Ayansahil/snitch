import { addItem, getCart } from "../services/cart.api"
import { useDispatch } from "react-redux"
import { setItems } from "../state/cart.slice"


export const useCart = () => {

    const dispatch = useDispatch()

    async function handleAddItem({ productId, variantId }) {
        const safeVariantId = variantId || "null"
        const data = await addItem({ productId, variantId: safeVariantId })
        return data
    }

    async function handleGetCart() {
        const data = await getCart()
        dispatch(setItems(data.cart?.items || []))
        return data.cart
    }

    return { handleAddItem, handleGetCart }

}