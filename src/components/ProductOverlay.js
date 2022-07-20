import '../styles/ProductOverlay.css'

import { useEffect, useRef, useState } from 'react'
import { setDoc, doc } from 'firebase/firestore'

import { database } from '../App'

// Format series of numbers [1, 2.5, 3] to price strings ['1.00', '2.50', '3.00']
export const formatPrices = (prices) => {

    // Loop through prices and format each price
    Object.keys(prices).forEach(key => {
        if (prices[key].toString().split(".")[1] === undefined) prices[key] = prices[key] + '.00'
        else if (prices[key].toString().split(".")[1].length === 1) prices[key] = prices[key] + '0'
    })

    // Return formatted prices
    return prices
}

function ProductOverlay(props) {
    const { showProductOverlay, product, hideProductOverlay } = props

    // Set state variables (will rerender view on update)
    const [values, setValues] = useState(null)
    const [options, setOptions] = useState(null)
    const [sizes, setSizes] = useState(null)
    const [newOptions, setNewOptions] = useState({})
    const [newOptionsSection, setNewOptionsSection] = useState('')
    const [newSizeSection, setNewSizeSection] = useState('')

    // Set ref to DOM element
    const bottom = useRef()

    // Set state variables with props
    useEffect(() => {
        if (product !== null) {
            product.prices = formatPrices(product.prices)
            setOptions(product.options)
            setSizes(product.prices)
            setValues(product)
        }
    }, [product])

    // Scroll to bottom of overlay when option is added
    useEffect(() => {
        bottom.current !== undefined && Object.keys(product.options).length !== Object.keys(options).length  && bottom.current.scrollIntoView({ behavior: 'smooth'})
    }, [options, bottom, product])

    // Misc

    // Edit Property
    const editValue = (type, e) => {
        let value = e.target.value

        // Fixes problem with textarea
        if (type === 'description') {
            e.preventDefault()
        }

        if (value === '') {

            // If value is empty, reset to original value
            setValues({
                ...values,
                [type]: product[type],
            })
        } else if (e.charCode === 13) {

            // If value is not empty and user presses enter, save new value
            setValues({
                ...values,
                [type]: value,
            })

            e.target.value = ''
        }
        
    }

    // Sizes

    // Add new size
    const addSizeSection = () => {
        if (newSizeSection !== '') {
            setSizes({
                ...sizes,
                [newSizeSection]: 0
            })
            setNewSizeSection('')
        }
    }

    // Edit name of size
    const editSize = (size, e) => {
        if (e.target.value !== '' && e.charCode === 13) {

            // If value is not empty and user presses enter, save new value
            let newSizes = {...sizes}
            delete newSizes[size]
            newSizes[e.target.value] = sizes[size]

            // Update state
            setSizes({
                ...newSizes
            })
            e.target.value = ''
        }
    }

    // Change price of size
    const editPrice = (size, e) => {
        if (e.target.value !== '' && e.charCode === 13) {

            // If value is not empty and user presses enter, save new value
            setSizes({
                ...sizes,
                [size]: e.target.value
            })

            e.target.value = ''
        }
    }

    // Options

    // Add new option
    const addOptionsSection = () => {
        if (newOptionsSection !== '') {
            setOptions({
                ...options,
                [newOptionsSection]: []
            })
            setNewOptionsSection('')
        }
    }

    // Add item to list of options
    const addOption = (option) => {
        setOptions({
            ...options,
            [option]: [...options[option], newOptions[option]]
        })
        setNewOptions({...newOptions, [option]: ''})
    }

    // Delete option type
    const deleteOptionsSection = (option) => {
        let copyOfOptions = { ...options }
        delete copyOfOptions[option]

        setOptions({
            ...copyOfOptions
        })
    }

    // Edit option type
    const editOptions = (option, e) => {
        if (e.target.value !== '' && e.charCode === 13) {
            let copyOfOptions = { ...options }
            delete copyOfOptions[option]
            copyOfOptions[e.target.value] = options[option]

            setOptions({
                ...copyOfOptions
            })

            e.target.value = ''
        }
    }

    // Delete option item from list of options
    const deleteOption = (option, optionItem) => {
        let newOption = options[option]

        newOption.splice(newOption.indexOf(optionItem), 1)

        setOptions({
            ...options,
            [option]: newOption
        })
    }

    /// Edit option item text
    const changeOptionItemName = (option, id, e) => {
        if (e.charCode === 13) {

            // If user presses enter, save new value
            let optionsArray = options[option]
            optionsArray[id] = e.target.value
            e.target.value = ''

            const newOptions = {
                ...options,
                [option]: [
                    ...optionsArray
                ]
            }
            setOptions(newOptions)
        }
    }

    // Used for removing the id
    const removeValue = (values, value) => {
        delete values[value]
        return values
    }

    // Save all changes to database
    const saveChanges = () => {

        // Update product in database
        setDoc(doc(database, 'products', product.id), {
            ...removeValue(values, 'id'),
            options: options,
            prices: sizes,
        }).then(() => {
            
            // Hide overlay
            hideProductOverlay()
        })
    }

    return (
        <div className='ProductOverlay' shown={showProductOverlay.toString()}>
            { 
                product !== null && options !== null && <>
                    <h2>Edit Item - Press Enter To Submit</h2>
                    
                    <p className='ProductOverlay__Heading'>Name</p>
                    <input className='ProductOverlay__Input' placeholder={values.title === undefined ? product.title : values.title} onKeyPress={(e) => {editValue('title', e)}} />

                    <p className='ProductOverlay__Heading'>Category</p>
                    <input className='ProductOverlay__Input'  placeholder={values.subtitle === undefined ? product.subtitle : values.subtitle} onKeyPress={(e) => {editValue('subtitle', e)}} />

                    <p className='ProductOverlay__Heading'>Description</p>
                    <textarea className='ProductOverlay__Input'  placeholder={values.description === undefined ? product.description : values.description} onKeyPress={(e) => {editValue('description', e)}} />

                    <p className='ProductOverlay__Heading'>Image</p>
                    <input className='ProductOverlay__Input'  placeholder={values.image === undefined ? product.image : values.image} onKeyPress={(e) => {editValue('image', e)}} />

                    <p className='ProductOverlay__Heading'>Sizes</p>
                    <div className='ProductOverlay__Prices__List'>
                    {
                        Object.keys(sizes).map((size, idx) => {
                            return <div className='ProductOverlay__Sizes' key={idx}>
                                <img className='ProductOverlay__Sizes__Delete' src='../../close-shamrock.svg' alt='Delete Size' onClick={null} />
                                <input className='ProductOverlay__Sizes__Name' placeholder={size} onKeyPress={(e) => {editSize(size, e)}} />
                                <input className='ProductOverlay__Size__Price__Name' type='number' min='0' placeholder={sizes[size]} onKeyPress={(e) => { editPrice(size, e) }} />
                            </div>
                        })
                    }
                        <div className='ProductOverlay__Sizes'>
                            <img className='ProductOverlay__Sizes__Add' src='../../add.svg' alt='Add Size' onClick={addSizeSection} />
                            <input className='ProductOverlay__Sizes__Name' placeholder='Add Size' value={newSizeSection} onChange={(e) => {setNewSizeSection(e.target.value)}} />
                        </div>
                    </div>

                    <p className='ProductOverlay__Heading'>Options</p>
                    <div className='ProductOverlay__Options__List'>
                    {
                        Object.keys(options).map((option, idx) => {
                            return <div className='ProductOverlay__Options' key={idx}>
                                <img className='ProductOverlay__Options__Delete' src='../../close-shamrock.svg' alt='Delete Options' onClick={() => {deleteOptionsSection(option)}} />
                                <input className='ProductOverlay__Options__Name' placeholder={option} onKeyPress={(e) => {editOptions(option, e)}} />
                                {
                                    options[option].map((optionItem, idx) => {
                                        return <div className='ProductOverlay__Options__Option' key={idx}>
                                            <img className='ProductOverlay__Options__Option__Delete' src='../../close-shamrock.svg' alt='Delete Option' onClick={() => {deleteOption(option, optionItem)}} />
                                            <input className='ProductOverlay__Options__Option__Name' placeholder={optionItem} onKeyPress={(e) => changeOptionItemName(option, idx, e)} />
                                        </div>
                                    })
                                }
                                <div className='ProductOverlay__Options__Option'>
                                    <img className='ProductOverlay__Options__Option__Add' src='../../add.svg' alt='Add Option' onClick={() => {addOption(option)}} />
                                    <input className='ProductOverlay__Options__Option__Name' placeholder='Add an Option Type' value={newOptions[option] === undefined ? '' : newOptions[option]} onChange={(e) => {setNewOptions({...newOptions, [option]: e.target.value})}} />
                                </div>
                            </div>
                        })
                    }
                        <div className='ProductOverlay__Options'>
                            <img className='ProductOverlay__Options__Add' src='../../add.svg' alt='Add Options' onClick={addOptionsSection} />
                            <input className='ProductOverlay__Options__Name' placeholder='Add an Option' value={newOptionsSection} onChange={(e) => {setNewOptionsSection(e.target.value)}} />
                        </div>
                        <div className='EndRef' ref={bottom} />
                    </div>
                    <div className='ProductOverlay__Hide__Overflow' shown={showProductOverlay.toString()}/>
                    <button className='ProductOverlay__Save__Button' onClick={saveChanges} shown={showProductOverlay.toString()}>Save</button>
                </>
            }
        </div>
    )
}

export default ProductOverlay;
