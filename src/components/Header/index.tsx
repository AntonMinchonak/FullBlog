import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/img/logo.svg'
import { RootState, useAppDispatch } from '../../redux/store'
import css from './Header.module.scss'
import {logOut} from  '../../redux/slices/userSlice'
import { useSelector } from 'react-redux'
import { clearPosts, fetchPosts } from '../../redux/slices/postSlice'

export default function Header() {
  const dispatch = useAppDispatch()
  const me = useSelector((state: RootState) => state.user.me)
  function onLogOut() {
    dispatch(logOut());
    dispatch(clearPosts())
    dispatch(fetchPosts())
  }
  
  return (
    <div className={css.header}>
     <div className={css.logo}><img src={logo} alt="" />POST <br />MINCHONOK</div>
      <div className={css.account}>
        {me &&<>
          <Link to={'/profile/' + me._id} className='button'>Profile</Link>
          <Link to="/" onClick={() => onLogOut()} className='button button--outline'>Log Out</Link>
        </>}
        {!me && <>
          <Link to="/auth/login" className='button'>Log In</Link>
          <Link to="/auth/signup" className='button button--outline'>Sign Up</Link>
        </>}
        </div>
    </div>
  )
}
