import '../styles/Navigation.css'

import NavigationOverlay from './NavigationOverlay';

import { useState } from 'react'

function Navigation() {
    const [navigationShown, setNavigationShown] = useState(false)

    // Toggle navigation overlay
    const navigationToggle = () => {
        setNavigationShown(!navigationShown)
    }

    // Hide navigation overlay
    const hideOverlay = () => {
        setNavigationShown(false)
    }


    return (
        <div className='Navigation'>
            <NavigationOverlay shown={navigationShown.toString()} hideOverlay={hideOverlay} />
            <img className='Navigation__image' src='../../menu.svg' alt='Menu' onClick={navigationToggle} shown={navigationShown.toString()} />
        </div>
    )
}

export default Navigation;
