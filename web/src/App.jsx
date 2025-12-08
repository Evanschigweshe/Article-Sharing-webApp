import React, { useEffect, useState } from 'react'
import API from './api'
import Login from './components/Login'
import Register from './components/Register'
import Board from './components/Board'

export default function App() {
  const [user, setUser] = useState(null)
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    // Check by trying to fetch posts (server will not return username) — we rely on login to set user.
    API.getPosts().then(() => {}).catch(()=>{})
  }, [])

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 16 }}>
      <h1>Article Share</h1>
      {!user ? (
        <div style={{display:'flex', gap:16}}>
          <Login onLogin={(u)=>setUser(u)} />
          <Register />
        </div>
      ) : (
        <div>
          <div style={{display:'flex', justifyContent:'space-between'}}>
            <div>Signed in as <strong>{user.username}</strong></div>
            <div>
              <button onClick={() => API.logout().then(()=> setUser(null))}>Logout</button>
            </div>
          </div>
          <Board user={user} refreshSignal={refresh} onRefresh={() => setRefresh(r => r+1)} />
        </div>
      )}
      <hr />
      <Board user={user} refreshSignal={refresh} onRefresh={() => setRefresh(r => r+1)} />
    </div>
  )
}