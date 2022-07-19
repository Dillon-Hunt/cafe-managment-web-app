import '../styles/Product.css'

import { doc, deleteDoc } from 'firebase/firestore'

import { database } from '../App'

// Convert number (1) to price (1.00)
export const formatPrice = (price) => {
    if (price.toString().split(".")[1] === undefined) price = price + '.00'
    else if (price.toString().split(".")[1].length === 1) price = price + '0'
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
            <img className='Product__Edit' src='../../edit.svg' alt='Edit Product' onClick={() => {openProductOverlay(product)}} />
            <img className='Product__Bin' src='../../bin.svg' alt='Delete Product' onClick={() => {deleteProduct(product.id)}} />
        </div>
    )
}

export default Product;
