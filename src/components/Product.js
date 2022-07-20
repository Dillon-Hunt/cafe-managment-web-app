import '../styles/Product.css'

import { doc, deleteDoc } from 'firebase/firestore'

import { database } from '../App'

// Convert number (1) to price (1.00)
export const formatPrice = (price) => {
    // If price is a integer, add .00 to end else if price has 1 decimal place, add 0 to end
    if (price.toString().split(".")[1] === undefined) price = price + '.00'
    else if (price.toString().split(".")[1].length === 1) price = price + '0'

    // Return formatted price
    return price
}

function Product(props) {
    const { product, openProductOverlay } = props

    // Delete product from database
    const deleteProduct = (id) => {
        deleteDoc(doc(database, 'products', id))
    }

    return (
        <div className='Product'>
            <img className='Product__Image' src={product.image} alt={product.title} />
            <p className='Product__Title' >{product.title}</p>
            <p className='Product__Subtitle' >{product.subtitle}</p>
            <p className='Product__Count' >Ordered {product.orders === 1 ? product.orders + ' Time' : product.orders + ' Times'}</p>
            <img className='Product__Edit' src='../../edit.svg' alt='Edit Product' onClick={() => {openProductOverlay(product)}} />
            <img className='Product__Bin' src='../../bin.svg' alt='Delete Product' onClick={() => {deleteProduct(product.id)}} />
        </div>
    )
}

export default Product;
