import '../styles/Products.css'

import Navigation from '../components/Navigation'
import Product from '../components/Product'
import ProductOverlay from '../components/ProductOverlay'

import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { addDoc, collection } from 'firebase/firestore'
import { database } from '../App'

function Products(props) {
    const { products } = props

    // Set state variables (will rerender view on update)
    const [showProductOverlay, setShowProductOverlay] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)

    // Open product overlay
    const openProductOverlay = (product) => {
        setSelectedProduct(product)
        setShowProductOverlay(true)
    }

    // Hide product overlay
    const hideProductOverlay = () => {
        showProductOverlay !== false && setShowProductOverlay(false)
    }

    // Delete product data
    const defaultProduct = {
        title: 'Product Name',
        subtitle: 'Product Catogory',
        description: 'Product Description',
        image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.istockphoto.com%2Fphotos%2Fblank-white-disposable-cup-with-straw-mockup-set-isolated-picture-id986717130%3Fk%3D6%26m%3D986717130%26s%3D170667a%26w%3D0%26h%3DdVJgv9oB0HYW2YWDZ5YvKqVj5-QSFWhmvl_lBentLto%3D&f=1&nofb=1',
        prices: {},
        options: {},
        orders: 0,
    }

    // Add product to database and open overlay
    const addNewProduct = () => {

        // Add product to database
        addDoc(collection(database, 'products'), defaultProduct).then((result) => {
            setSelectedProduct({
                ...defaultProduct,
                id: result.id,
            })

            // Open product overlay
            setShowProductOverlay(true)
        })
    }

    return (
        <div className='Products'>
            <Helmet>
                <title>Products | St Andrew's Anglican College Hospitality</title>
            </Helmet>

            <div onClick={hideProductOverlay}>
                <h1>Products</h1>
                <div className='Products__List'>
                    <div className='Products__New' onClick={addNewProduct}>
                        <p>New Product</p>
                    </div>
                {
                    products !== null && products.sort((a, b) => a.orders < b.orders).map((product, idx) => {
                        return <Product key={idx} product={product} openProductOverlay={openProductOverlay} showProductOverlay={showProductOverlay} />
                    })
                }
                </div>
            </div>

            <ProductOverlay showProductOverlay={showProductOverlay} hideProductOverlay={hideProductOverlay} product={selectedProduct} />

            <Navigation />
        </div>
    )
}

export default Products;
