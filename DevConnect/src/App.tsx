import { useState } from 'react'
import Signup from './Pages/Inscription'
import Login from './Pages/Login'
import './App.css'

function App() {
  const [showSignup, setShowSignup] = useState(false)

  return (
    <>
    {showSignup ? (
      <Signup/>
    ) : (
      <Login onSwitchToSignup={() => setShowSignup(true)} />
    )}
    {!showSignup && (
      <div style={{ textAlign: 'center', marginTop: 12 }}>
        <button onClick={() => setShowSignup(true)}>Pas encore inscrit ? S'inscrire</button>
      </div>
    )}
    </>
  )
}

export default App
