import React from 'react'
import { useSelector } from 'react-redux'
import { fetchPosts } from '../../redux/slices/postSlice'
import { RootState, useAppDispatch } from '../../redux/store'
import { userType } from '../../types'
import Post from '../Post'
import SearchPanel from '../SearchPanel'
import css from "./PostList.module.scss"

export default function PostList({user}:{user?:userType}) {
  const sort = useSelector((state:RootState)=> state.posts.sort)
  const posts = useSelector((state: RootState) => state.posts.posts)
  const me = useSelector((state: RootState) => state.user.me)
  
  const sukaRef = React.useRef<any>(null)

  const dispatch = useAppDispatch()
  React.useEffect(() => {
    if (me!==null) dispatch(fetchPosts({ user: user?._id, userId: me?._id }));
  }, [dispatch,sort,user,me])
  window.onscroll = () => {
    if (sukaRef.current?.getBoundingClientRect().y<1000) console.log(window.scrollY, sukaRef.current?.getBoundingClientRect());
  }

  if (!posts.length) return <div className='block'>No posts</div>

  return (
    <div className={css.postList}>
     <SearchPanel type="posts"></SearchPanel>
      {posts.map((item) => <Post key={item._id} info={item}></Post>)}
      <div className="suka" ref={sukaRef}>22222222</div>
    </div>
  )
}
