import './App.css';

import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"

const firebaseConfig = {
  apiKey: "AIzaSyD1MZx4gn6sZB83dm16fgaGG-wLw6mId_o",
  authDomain: "cafe-web-app-d741e.firebaseapp.com",
  projectId: "cafe-web-app-d741e",
  storageBucket: "cafe-web-app-d741e.appspot.com",
  messagingSenderId: "439419802863",
  appId: "1:439419802863:web:3b0f0830d02de8b3a3771a",
  measurementId: "G-TSK6NFDJNB"
}


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

function App() {
  return (
    <div className="App">
      
    </div>
  );
}

export default App;
