import React, { useEffect, useState } from 'react'
import API from '../api'
import NewPost from './NewPost'
import PostItem from './PostItem'

export default function Board({ user, refreshSignal, onRefresh }) {
  const [posts, setPosts] = useState([])

  const load = async () => {
    const data = await API.getPosts()
    setPosts(data || [])
  }

  useEffect(() => {
    load()
  }, [refreshSignal])

  return (
    <div>
      <h2>Message Board</h2>
      {user && <NewPost onPosted={() => onRefresh()} />}
      <div>
        {posts.map(p => <PostItem key={p.id} post={p} user={user} onDeleted={() => onRefresh()} />)}
      </div>
    </div>
  )
}