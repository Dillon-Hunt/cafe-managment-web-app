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

const equivalent = (array1, array2) => {
  let isEquivalent = true
  if (array1.length === array2.length) {
    array1.forEach((object, id) => {
      if (object.id !== array2[id].id)  {
        isEquivalent = false
    }
    })
  } else {
    isEquivalent = false
  }
  return isEquivalent;
}

function App() {
  const [orders, setOrders] = useState(null)
  const [products, setProducts] = useState(null)
  const [signedIn, loading] = useAuthState(auth)
  const [allowedAccess, setAllowedAccess] = useState(false)

  const orderQuery = query(collection(database, 'orders'), orderBy('time'))
  onSnapshot(orderQuery, (results) => {
    const newOrders = results.docs.map(result => {
      let order = result.data()
      order.id = result.id
      return order
    })

    if (orders === null || !equivalent(newOrders, orders)) {
      setOrders(newOrders)
    }
  })

  const productQuery = query(collection(database, 'products'), orderBy('title'))
  onSnapshot(productQuery, (results) => {
    const newProducts = results.docs.map(result => {
      let product = result.data()
      product.id = result.id
      return product
    })

    if (products === null || !equivalent(newProducts, products)) {
      setProducts(newProducts)
    }
  })

  useEffect(() => {
    if (signedIn === null) {
      setAllowedAccess(true)
    } else {
      getDoc(doc(database, 'config', 'allowedManagers')).then(snapshot => {
        if (!snapshot.data().emails.includes(signedIn.email)) {
            signOut(auth)
            setAllowedAccess(false)
            alert('Hospitality Students Only, If you\'re a hospitality student contact an administrator.')
        }
      })
    }
  }, [signedIn])

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
