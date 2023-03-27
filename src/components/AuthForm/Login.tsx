import React from 'react'
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import css from "./AuthForm.module.scss"
import { Link } from 'react-router-dom';
import BigError from '../../UI/Error/BigError';
import MidError from '../../UI/Error/MidError';
import LittleError from '../../UI/Error/LittleError';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../redux/store';
import { fetchMe } from '../../redux/slices/userSlice';
import { clearPosts, fetchPosts } from '../../redux/slices/postSlice';

type Inputs = {
  email: string,
  password: string
};

const schema = yup.object({
  email: yup.string().required().email(),
  password: yup.string().min(6, 'Min length is 6 symbols').required()
}).required();


export default function Login() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [responseStatus, setResponseStatus] = React.useState({success: false, tried: false, UNF: false, WPE: false})
  const { register, handleSubmit,formState: { errors }} = useForm<Inputs>({
    resolver: yupResolver(schema)
  });
  const onSubmit: SubmitHandler<Inputs> = async data => {
    const res = await fetch('http://localhost:4444/auth/login',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }
    )
    const msg = await res.json()
    const newStatus = {...responseStatus}
    if (res.ok) {   
      const now = new Date()
      const date = new Date(`${now.getFullYear()}-${now.getMonth()+2}-${now.getDate()}`).toUTCString()
      document.cookie = `token=${msg.token}; path=/; expires=${date}`
      navigate('/')
      dispatch(fetchMe())  
    }
    if (!res.ok) newStatus.tried = true
    if (msg.message?.includes('UNF: USER NOT FOUND')) newStatus.UNF = true
    if (msg.message?.includes('WPE: WRONG EMAIL OR PASSWORD')) newStatus.WPE = true
    setResponseStatus(newStatus)
    dispatch(clearPosts()); 
  }

  return (
   <div className={css.authform}>
    <h1>Log In</h1>
    <form className={css.form} onSubmit={handleSubmit(onSubmit)}>

      <label htmlFor="">
        <input className='input' placeholder="E-mail" {...register("email")} />
          {errors.email?.message &&<LittleError>{errors.email.message}</LittleError>}
      </label>

      <label htmlFor="">
        <input  type="password" className='input' placeholder="Password" {...register("password")} />
          {errors.password?.message &&<LittleError>{errors.password.message}</LittleError>}
      </label>
        
      <input className='button' type="submit" value="Submit" />
      {responseStatus.tried &&<BigError>ERROR!</BigError>}
      {responseStatus.UNF && <MidError>This email is not existing.</MidError>}
      {responseStatus.WPE && <MidError>Wrong password.</MidError>}
      </form>
</div>
  );
  
}