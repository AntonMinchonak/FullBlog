import React from 'react'
import { useParams } from 'react-router'
import AuthForm from '../../components/AuthForm'
import Login from '../../components/AuthForm/Login'
export default function Auth() {
  const type:string = useParams().type ?? ''
  return (
    <div className="block">
      {type === 'login' ? <Login></Login> : <AuthForm></AuthForm>}
      </div>
  )
}
