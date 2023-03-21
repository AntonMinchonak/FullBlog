import React from 'react'
import { clearPosts, deletePost, fetchComments, fetchPosts, filterComments } from '../../redux/slices/postSlice'
import { useAppDispatch } from '../../redux/store'
import { CommentType, PostType } from '../../types'
import css from "./Delete.module.scss"
import { useLocation, useNavigate } from 'react-router'

export default function DeletePost({ post, entity, parent}:{post: PostType | CommentType, entity: 'comments' | 'posts', parent?:PostType}) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const pathname = useLocation().pathname
  
  const isDetail = pathname.includes('/detail') 
  const isProfile = pathname.includes('/profile') 
  
  async function onClick() {
    await dispatch(deletePost({ _id: post._id, entity, parent: parent?._id }))
    if (entity === "comments") {
      dispatch(filterComments({ id: post._id }))
      if (parent) await dispatch(fetchComments(parent._id))
      return
    }
    if (isDetail) navigate('/')
    else {
      dispatch(clearPosts())
      dispatch(fetchPosts({ user: isProfile ? `id=${post.user?._id}` : '' }))
    }
  }

  return (
    <div className={css.delete} onClick={onClick}>✖</div> 
  )
}
