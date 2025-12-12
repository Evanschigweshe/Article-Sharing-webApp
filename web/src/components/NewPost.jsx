import React, { useState } from 'react'
import API from '../api'

export default function NewPost({ onPosted }) {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [err, setErr] = useState(null)

  const submit = async e => {
    e.preventDefault()
    const res = await API.createPost(url, title)
    if (res && res.error) setErr(res.error)
    else {
      setUrl('')
      setTitle('')
      onPosted()
    }
  }

  return (
    <form onSubmit={submit} style={{border:'1px solid #ccc', padding:8, marginBottom:8}}>
      <div>
        <input placeholder="https://example.com/article" value={url} onChange={e=>setUrl(e.target.value)} style={{width:'100%'}} />
      </div>
      <div>
        <input placeholder="optional title" value={title} onChange={e=>setTitle(e.target.value)} style={{width:'100%'}} />
      </div>
      <div>
        <button type="submit">Post</button>
      </div>
      {err && <div style={{color:'red'}}>{err}</div>}
    </form>
  )
}
