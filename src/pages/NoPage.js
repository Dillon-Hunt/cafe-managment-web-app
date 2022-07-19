import '../styles/NoPage.css'

import { Helmet } from 'react-helmet-async'

function NoPage() {
    return (
        <div className='NoPage'>
            <Helmet>
                <title>404 Page Not Found | St Andrew's Anglican College Hospitality</title>
            </Helmet>
            <h1 className='NoPage__Title'>404</h1>
            <h2 className='NoPage__Subtitle'>Page Not Found</h2>
        </div>
    )
}

export default NoPage;
