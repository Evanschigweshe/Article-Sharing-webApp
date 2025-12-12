import React, { useState } from 'react'
import API from '../api'

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    try {
      const res = await API.login(username, password)
      if (res.error) return setErr(res.error)
      onLogin({ username: username })
    } catch (e) {
      setErr('Network error')
    }
  }

  return (
    <form onSubmit={submit} style={{border:'1px solid #ddd', padding:12}}>
      <h3>Login</h3>
      <div>
        <input placeholder="username" value={username} onChange={e=>setUsername(e.target.value)} />
      </div>
      <div>
        <input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      </div>
      <div>
        <button type="submit">Login</button>
      </div>
      {err && <div style={{color:'red'}}>{err}</div>}
    </form>
  )
}
