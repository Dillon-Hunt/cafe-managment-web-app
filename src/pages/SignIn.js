import '../styles/SignIn.css'

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth"
import { getDoc, doc } from 'firebase/firestore'
import { auth, database } from '../App'
import { Helmet } from 'react-helmet-async'

// Initialize new Google provider
const provider = new GoogleAuthProvider();

function SignIn() {
    const path = window.location.pathname

    const navigate = useNavigate()

    // Set path to '/'
    useEffect(() => {
        if (path !== '/') {
            navigate('/')
        }
    }, [path, navigate])

    // Show sign in popup
    const signInWithGoogle = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                getDoc(doc(database, 'config', 'allowedManagers')).then(snapshot => {
                    if (snapshot.data().emails.includes(result.user.email)) {
                        navigate('/orders')
                    } else {
                        alert('Hospitality Students Only, If you\'re a hospitality student contact an administrator.')
                        signOut(auth)
                    }
                })
            }).catch((error) => {
            const errorCode = error.code
            const errorMessage = error.message

            console.log(errorCode, errorMessage)
        })
    }

    return (
        <div className='SignIn'>
            <Helmet>
                <title>Sign In | St Andrew's Anglican College Hospitality</title>
            </Helmet>
            <button className="SignIn__Button" onClick={signInWithGoogle}>
                <img src={'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg'} alt='' /> 
                <p className='SignIn__Button__Text'>Sign in with Google</p>
            </button>
        </div>
    )
}

export default SignIn;
