import { addItem, getCart, removeItem, updateItemQuantity } from "../services/cart.api"
import { useDispatch } from "react-redux"
import { setItems } from "../state/cart.slice"


export const useCart = () => {

    const dispatch = useDispatch()

    async function handleAddItem({ productId, variantId, quantity = 1 }) {
        const safeVariantId = variantId || "default"
        const data = await addItem({ productId, variantId: safeVariantId, quantity })
        await handleGetCart() // Auto-sync after add/update
        return data
    }

    async function handleRemoveItem({ productId, variantId }) {
        const safeVariantId = variantId || "default"
        const data = await removeItem({ productId, variantId: safeVariantId })
        await handleGetCart() // Auto-sync after removal
        return data
    }

    async function handleUpdateItemQuantity({ productId, variantId, quantity }) {
        const safeVariantId = variantId || "default"
        const data = await updateItemQuantity({ productId, variantId: safeVariantId, quantity })
        await handleGetCart() // Auto-sync after quantity update
        return data
    }

    async function handleGetCart() {
        const data = await getCart()
        dispatch(setItems(data.cart?.items || []))
        return data.cart
    }

    return { handleAddItem, handleRemoveItem, handleUpdateItemQuantity, handleGetCart }

}