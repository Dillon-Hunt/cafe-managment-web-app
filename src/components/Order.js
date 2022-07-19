import '../styles/Order.css'

import { updateDoc, doc } from 'firebase/firestore'

import { database } from '../App'
import { formatPrice } from './Product'

// Format time from milliseconds (100000) to time string (1 Hour Ago)
function formatTime(milliseconds) {
    // Convert milliseconds to years
    let time = Math.floor(milliseconds / 31536000000) 
    let type = time === 1 ? ' year Ago' : ' years Ago'

    // Convert years to days, hours & minutes
    time === 0 && (time = Math.floor(milliseconds / 86400000)) && (type = time === 1 ? ' Day Ago' : ' Days Ago')
    time === 0 && (time = Math.floor(milliseconds / 3600000)) && (type = time === 1 ? ' Hour Ago' : ' Hours Ago')
    time === 0 && (time = Math.floor(milliseconds / 60000)) && (type = time === 1 ? ' Minute Ago' : ' Minutes Ago')
    time === 0 && (type = 'Just Now') && (time = '')
    
    // Return formatted time string
    return time + type
}

function Order(props) {
    const { order } = props

    // Calculate total price of order
    let total = 0

    // Add price of each item to total
    order !== null && order.items.forEach(item => {
        total += item.price * item.quantity
    })

    // Update order in database to show it has been completed
    const dismissOrder = () => {
        updateDoc(doc(database, 'orders', order.id), { complete: true })
    }

    return (
        <div className='Order'>
        <img className='Order__Dismiss' src='../../close.svg' alt='Dismiss Order' onClick={dismissOrder} />
            <p className='Order__Name'>{order.name} - <span className='Order__Name__Time'>{formatTime(Date.now() - order.time)}</span></p>
            <div className='Order__Items'>
            {
                order.items.map((item, idx) => {
                    return <div key={idx} className='Order__Item'>
                            <p className='Order__Item__Title'>{item.title}</p>
                            <img className='Order__Item__Image' src={item.image} alt={item.title} />
                            <p className='Order__Item__Title'>{item.title}</p>
                            <p className='Order__Item__Quantity'>x{item.quantity}</p>
                            <div className='Order__Item__Options'>
                            {
                                Object.keys(item.options).map((option, idx) => {
                                    return <p className='Order__Item__Option' key={idx}><span className='Order__Item__Option__Key'>{option}:</span> {item.options[option]}</p>
                                })
                            }
                            </div>
                        </div>
                })
            }
            </div>
            <p className='Order__Price'>Total: <span className='Order__Price__Symbol'>$</span>{formatPrice(total)}</p>
        </div>
    )
}

export default Order;
