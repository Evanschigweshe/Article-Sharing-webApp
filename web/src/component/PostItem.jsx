import React, { useState } from 'react'
import API from '../api'

export default function PostItem({ post, user, onDeleted }) {
  const [err, setErr] = useState(null)

  const canDelete = user && (user.username === post.username || user.username === 'admin')

  const del = async () => {
    const res = await API.deletePost(post.id)
    if (res && res.error) setErr(res.error)
    else onDeleted()
  }

  return (
    <div style={{border:'1px solid #eee', padding:8, marginBottom:8}}>
      <div><a href={post.url} target="_blank" rel="noreferrer">{post.title || post.url}</a></div>
      <div style={{fontSize:12, color:'#666'}}>posted by {post.username} • {new Date(post.created_at).toLocaleString()}</div>
      {canDelete && <button onClick={del}>Delete</button>}
      {err && <div style={{color:'red'}}>{err}</div>}
    </div>
  )
}
