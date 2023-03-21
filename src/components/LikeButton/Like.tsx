
import React, { useEffect } from 'react'
import heart from '../../assets/img/heart.svg'
import like from '../../assets/img/liked.svg'
import { likePost } from '../../redux/slices/postSlice'
import { useAppDispatch } from '../../redux/store'
import { userType } from '../../types'
import LikePopup from '../LikePopup'
import css from './Like.module.scss'

export default function Like({ userLikes, me, postId , entity} : {postId: string,userLikes:userType[], me:userType | null | undefined, entity:string}) {
  const dispatch = useAppDispatch()
  const imgRef = React.useRef<HTMLImageElement>(null)
  const [hovered, setHovered] = React.useState(false)
  let abort: ReturnType<typeof setTimeout> ;
  let showTime: ReturnType<typeof setTimeout> ;
  const [users, setUserLikes] = React.useState(userLikes ?? [])
  
  const isLiked = !me ? false : userLikes ? userLikes.find(e => e._id === me._id) !== undefined : false;
  const [liked, setLiked] = React.useState(isLiked)
  
  React.useEffect(() => {
    setUserLikes(userLikes)
    setLiked(isLiked);
  }, [userLikes]);

  function onLike() {
    if (!me) return
    let n = 1
    if (liked) {
      n = -1
      setLiked(false)
      if (me) setUserLikes(users.filter(e=>e._id!==me._id))
    } else {
      if (me) setUserLikes([...users,me]); 
      setLiked(true)
    }
    dispatch(likePost({ n, _id:postId, entity}))
  }

  function likeToggle(el:HTMLImageElement|null) {
    if (!el) return
    el.src = like
    clearTimeout(abort)
    showTime = setTimeout(()=>setHovered(true) ,700 )
  }

  function dislikeToggle(el: HTMLImageElement | null) {
    clearTimeout(showTime)
    if (!el) return
    if (!liked) el.src = heart
    abort = setTimeout(()=>setHovered(false) ,1000 )
  }

  
  return (
    <div onMouseEnter={()=>likeToggle(imgRef.current)} onMouseLeave={()=>dislikeToggle(imgRef.current)} className={`${css.like} ${liked ? css.liked : ''}`}>
       <img onClick={onLike} ref={imgRef} src={liked||hovered ? like : heart} alt="" />{users?.length}
      {hovered&&users.length ? <LikePopup users={users}></LikePopup> : ''}
    </div>
  )
}