import React from 'react'
import { flushSync } from 'react-dom'
import { useSelector } from 'react-redux'
import { useLocation, useParams } from 'react-router'
import CreatePost from '../../components/CreatePost'
import Post from '../../components/Post'
import PostList from '../../components/PostList'
import Sidebar from '../../components/Sidebar'
import UserCard from '../../components/UserCard'
import { fetchPosts } from '../../redux/slices/postSlice'
import { fetchUser } from '../../redux/slices/userSlice'
import { RootState, useAppDispatch } from '../../redux/store'
import { userType } from '../../types'

export default function Profile() {
  const dispatch = useAppDispatch()
  const id = useParams().id ?? ''
  const me = useSelector((state: RootState) => state.user.me)
  const [user, setUser] = React.useState<userType|null>(null)
  const posts = useSelector((state:RootState)=> state.posts.posts)

  async function getInfo() {
    const newUser = await dispatch(fetchUser(id))
    setUser(newUser.payload) 
  }

  React.useEffect(() => {
    getInfo()
  }, [id])

  if (!user) return  <h2 className='block'>Loading...</h2>

  return (
    <>
      <div className='list'>
        <UserCard info={user}></UserCard> 
        {me?._id === id && <CreatePost id={user._id} />}
        <PostList user={user}></PostList>
      </div> 
      <Sidebar></Sidebar>
    </>
  )
}
