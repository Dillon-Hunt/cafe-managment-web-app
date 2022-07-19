import '../styles/Orders.css'

import Order from '../components/Order'
import Navigation from '../components/Navigation'

import { Helmet } from 'react-helmet-async'

function Orders(props) {
    const { orders } = props

    return (
        <div className='Orders'>
            <Helmet>
                <title>Orders | St Andrew's Anglican College Hospitality</title>
            </Helmet>

            <h1>Orders</h1>
            <div className='Orders__List'>
            {
                orders !== null && orders.filter(order => !order.complete).map((order, idx) => {
                    return <Order key={idx} order={order} />
                })
            }
            </div>

            <Navigation />
        </div>
    )
}

export default Orders;
