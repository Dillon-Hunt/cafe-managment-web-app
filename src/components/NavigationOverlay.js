import '../styles/NavigationOverlay.css'

import { Link } from 'react-router-dom';

function NavigationOverlay(props) {
    const { shown, hideOverlay } = props

    return (
        <div className='NavigationOverlay' shown={shown}>
            <div className='NavigationOverlay__Links' shown={shown}>
                <Link className='NavigationOverlay__Link' to='/orders' onClick={hideOverlay}>Orders</Link>
                <Link className='NavigationOverlay__Link' to='/products'onClick={hideOverlay}>Products</Link>
            </div>
        </div>
    )
}

export default NavigationOverlay;
