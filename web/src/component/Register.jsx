import React, { useState } from 'react'
import API from '../api'

export default function Register() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    const res = await API.register(username, password)
    if (res && res.error) setMsg(res.error)
    else setMsg('Registered — you can now log in')
  }

  return (
    <form onSubmit={submit} style={{border:'1px solid #ddd', padding:12}}>
      <h3>Register</h3>
      <input placeholder="username" value={username} onChange={e=>setUsername(e.target.value)} />
      <input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button type="submit">Register</button>
      {msg && <div>{msg}</div>}
    </form>
  )
}
