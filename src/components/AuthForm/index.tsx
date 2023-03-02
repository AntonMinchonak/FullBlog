import React from 'react'
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import css from "./AuthForm.module.scss"
import { Link } from 'react-router-dom';
import BigError from '../../UI/Error/BigError';
import MidError from '../../UI/Error/MidError';
import LittleError from '../../UI/Error/LittleError';

type Inputs = {
  fullName: string,
  email: string,
  password: string
};

const schema = yup.object({
  fullName: yup.string().min(4, 'Min length is 4 symbols').required(),
  email: yup.string().required().email(),
  password: yup.string().min(6, 'Min length is 6 symbols').required()
}).required();

export default function AuthForm() {
  const [responseStatus, setResponseStatus] = React.useState({success: false, tried: false, dup: false})
  const { register, handleSubmit,formState: { errors }} = useForm<Inputs>({
    resolver: yupResolver(schema)
  });
  const onSubmit: SubmitHandler<Inputs> = async data => {
    const res = await fetch('http://localhost:4444/auth/register',
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
    if (res.ok) newStatus.success = true
    if (!res.ok) newStatus.tried = true
    if (msg.message?.includes('duplicate key')) newStatus.dup = true
    setResponseStatus(newStatus)
  }
  
  if (responseStatus.success) return (
    <div className="block">
      <h1>Success!</h1>
      <Link to="/" className="button">Go Home</Link>
    </div>
  )

  return (
   <div className={css.authform}>
    <h1>Sign Up</h1>
    <form className={css.form} onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="">
        <input className='input' placeholder="Full Name" {...register("fullName")} />
        {errors.fullName?.message &&<LittleError>{errors.fullName.message}</LittleError>}
      </label>

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
      {responseStatus.dup && <MidError>This email is already existing.</MidError>}
      </form>
</div>
  );
  
}
