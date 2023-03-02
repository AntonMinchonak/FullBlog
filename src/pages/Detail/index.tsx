import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'
import CommentItem from '../../components/CommentItem'
import CreateComment from '../../components/CreateComment'
import Post from '../../components/Post'
import { clearComments, fetchComments, fetchPost } from '../../redux/slices/postSlice'
import { RootState, useAppDispatch } from '../../redux/store'
import { CommentType } from '../../types'


export default function Detail() {
  const id:string = useParams().id ?? ''
  const [info, setInfo] = React.useState(null)
  const comments = useSelector((state: RootState) => state.posts.comments)
  const me = useSelector((state: RootState) => state.user.me)
  const dispatch = useAppDispatch()

  React.useEffect(() => {
    async function getInfo() {
      const post = await dispatch(fetchPost(id))
      await dispatch(fetchComments(id))
      setInfo(post.payload);
    }
    getInfo()

    return () => {
      dispatch(clearComments())
    }
  }, [id])


  if (!info) return  <h2 className='block'>Loading...</h2>
  
  return (
      <div className='list block'>
      <Post info={info}></Post>
      {me && <CreateComment id={id}></CreateComment>}
      {!!comments.length && <div className="list">
        {comments.map((e, i) => <CommentItem info={e} post={info} key={i}></CommentItem>)}
      </div>}
      </div>
  )
}
