import React from 'react'
import { useSelector } from 'react-redux'
import { clearPosts, fetchPosts } from '../../redux/slices/postSlice'
import { RootState, useAppDispatch } from '../../redux/store'
import { userType } from '../../types'
import Post from '../Post'
import SearchPanel from '../SearchPanel'
import css from "./PostList.module.scss"

export default function PostList({user}:{user?:userType}) {
  const sort = useSelector((state:RootState)=> state.posts.sort)
  const posts = useSelector((state: RootState) => state.posts.posts)
  const me = useSelector((state: RootState) => state.user.me)
  let isLoad = false
  const loadBorderRef = React.useRef<any>(null);

  const dispatch = useAppDispatch()
  React.useEffect(() => {
  
    if (me!==null) dispatch(fetchPosts({ user: user?._id, userId: me?._id }));

    return () => {
      dispatch(clearPosts()) 
    }
  }, [dispatch, sort, user, me])
  
  window.onscroll = async () => {
    if (loadBorderRef.current?.getBoundingClientRect().y < 1000 && !isLoad && posts.length>9) {
      isLoad = true;
      await dispatch(fetchPosts({ user: user?._id, userId: me?._id }));
      isLoad = false;
    }
  }


  return (
    <div className={css.postList}>
      <SearchPanel type="posts"></SearchPanel>
      {!!posts.length ? posts.map(item => <Post key={item._id} info={item}></Post>) : "No posts"}

      <div ref={loadBorderRef}>
      </div>
    </div>
  );
}
