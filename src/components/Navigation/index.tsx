import React from 'react'
import { Link } from 'react-router-dom'
import css from "./Navigation.module.scss"

export default function index() {
  return (
    <div className='block--small'>
      <Link to='/'><h3>Feed</h3> </Link>
      <Link to='/users'><h3>Users</h3> </Link>
    </div>
  )
}
