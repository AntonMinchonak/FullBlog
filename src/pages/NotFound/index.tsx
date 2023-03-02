import React from 'react'
import { Link } from 'react-router-dom'

export default function index() {
  return (
    <div className='block'>
      <h1>Page not found!</h1>
      <Link className='button' to="/">Go home</Link>
    </div>
  )
}
