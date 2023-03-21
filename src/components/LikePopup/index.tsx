import React from 'react'
import { Link } from 'react-router-dom'
import { userType } from '../../types'
import css from './LikePopup.module.scss'

export default function LikePopup({ users }: { users: userType[] }) {
 
  if (!users) return  <div className={css.popup}></div>
  return (
    <div className={css.popup}>
      {users.map((e) => (<Link to={`/profile/${e._id}`} key={e._id}><img src={e.avatarUrl??'http://localhost:4444/uploads/unknownuser.svg'} alt="user" title={e.fullName}></img></Link>))}
    </div>
  )
}
