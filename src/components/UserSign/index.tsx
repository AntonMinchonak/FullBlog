import React from 'react'
import { Link } from 'react-router-dom'
import { userType } from '../../types'
import css from './UserSign.module.scss'

export default function UserSign({ info,date,time }: { info: userType | undefined, date:string[], time:string | undefined}) {
  return (
      <Link to={`/profile/${info?._id}`}>
        <div className={css.author}>
          <img className={css['author__image']} src={info?.avatarUrl ? info?.avatarUrl : 'http://localhost:4444/uploads/unknownuser.svg'} alt="" />
          <div>
            <h3>{info?.fullName}</h3>
            <div className={css['author__date']}>{`${time}   ${date?.join('.')}`}</div>
          </div>
        </div>
        </Link>
  )
}
