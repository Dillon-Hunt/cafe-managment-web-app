import './App.css'

import SignIn from './pages/SignIn'
import Orders from './pages/Orders'
import Products from './pages/Products'
import NoPage from './pages/NoPage'

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useEffect, useState } from 'react'
import { HelmetProvider, Helmet } from 'react-helmet-async'

import { initializeApp } from "firebase/app"
import { getFirestore, collection, getDoc, doc, onSnapshot, query, orderBy } from "firebase/firestore"
import { getAuth, signOut } from 'firebase/auth'
//import { getAnalytics } from "firebase/analytics"

const firebaseConfig = {
  apiKey: "AIzaSyD1MZx4gn6sZB83dm16fgaGG-wLw6mId_o",
  authDomain: "cafe-web-app-d741e.firebaseapp.com",
  projectId: "cafe-web-app-d741e",
  storageBucket: "cafe-web-app-d741e.appspot.com",
  messagingSenderId: "439419802863",
  appId: "1:439419802863:web:3b0f0830d02de8b3a3771a",
  measurementId: "G-TSK6NFDJNB"
}


export const app = initializeApp(firebaseConfig)
export const database = getFirestore(app)
export const auth = getAuth(app)
//export const analytics = getAnalytics(app);

// Check if two arrays of objects are equivalent
const equivalent = (array1, array2) => {

  // Default to true
  let isEquivalent = true

  // Check if arrays are the same length
  if (array1.length === array2.length) {

    // Check if each object in array1 is in array2
    array1.forEach((object, id) => {

      if (object.id !== array2[id].id)  {

        // If not, set isEquivalent to false
        isEquivalent = false
      }
    })
  } else {

    // If not, set isEquivalent to false
    isEquivalent = false
  }

  // Return isEquivalent
  return isEquivalent;
}

function App() {

  // Set state variables (will rerender view on update)
  const [orders, setOrders] = useState(null)
  const [products, setProducts] = useState(null)
  const [signedIn, loading] = useAuthState(auth)
  const [allowedAccess, setAllowedAccess] = useState(false)

  // Check if user is signed in
  useEffect(() => {

    // Not signed in
    if (signedIn === null) {

      // Show sign in page
      setAllowedAccess(true)
    } else {

      // Get list of allowed users from database
      getDoc(doc(database, 'config', 'allowedManagers')).then(snapshot => {

        // Check if user is allowed access
        if (!snapshot.data().emails.includes(signedIn.email)) {

          // If not, sign them out and alert them
          signOut(auth)
          setAllowedAccess(false)
          alert('Hospitality Students Only, If you\'re a hospitality student contact an administrator.')
        } else {
          // Set query for orders
          const orderQuery = query(collection(database, 'orders'), orderBy('time'))

          // Get realtime updates for orders
          onSnapshot(orderQuery, (results) => {

            // Map results to an array of objects
            const newOrders = results.docs.map(result => {
              let order = result.data()
              order.id = result.id
              return order
            })

            // Check for new orders
            if (orders === null || !equivalent(newOrders, orders)) {

              // Set orders
              setOrders(newOrders)
            }
          })

          // Set query for products
          const productQuery = query(collection(database, 'products'), orderBy('title'))

          // Get realtime updates for products
          onSnapshot(productQuery, (results) => {

            // Map results to an array of objects
            const newProducts = results.docs.map(result => {
              let product = result.data()
              product.id = result.id
              return product
            })

            // Check for new products
            if (products === null || !equivalent(newProducts, products)) {

              // Set products
              setProducts(newProducts)
            }
          })
        }
      })
    }
  }, [signedIn, orders, products])

  return (
    <div className="App">
      <HelmetProvider>
      {
        loading || !allowedAccess ? <>
          <Helmet>
            <title>Loading</title>
          </Helmet> 
          <p className='App__Loading'>
            Loading...
          </p>
        </>

        :

        <BrowserRouter>
          <Routes>
            {
              signedIn === null ?
              <>
                <Route path="*" element={<SignIn />} />
              </>

              :

              <>
                <Route index path="/" element={<SignIn />} />
                <Route path="/orders" element={<Orders orders={orders} />} />
                <Route path="/products" element={<Products products={products} />} />
                <Route path='*' element={<NoPage />}/>
              </>
            }
          </Routes>
        </BrowserRouter>
      }
      </HelmetProvider>
    </div>
  );
}

export default App;
