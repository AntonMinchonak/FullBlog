import React from 'react'
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import css from "./CreatePost.module.scss"
import BigError from '../../UI/Error/BigError';
import { useAppDispatch } from '../../redux/store';
import { createComment, createPost, fetchComments, fetchPosts, uploadImg } from '../../redux/slices/postSlice';
import pickImage from "../../assets/img/pickimage.svg"
import FileInput from '../../UI/Input/FileInput';
import DeleteImg from '../../UI/Buttons/DeleteImg';

export type InputsC = {
  text: string,
  imageUrl?: string
  postId: string
};

const schema = yup.object({
  text: yup.string().required().min(1, 'Min length is 1 symbols'),
}).required();

export default function CreateComment({id}:{id: string}) {
  const dispatch = useAppDispatch()
  const [responseStatus, setResponseStatus] = React.useState(true)
  const [fileLink, setLink] = React.useState('')
  const { register, handleSubmit, formState: { errors }, reset } = useForm<InputsC>({
    resolver: yupResolver(schema)
  });
  
  const onSubmit: SubmitHandler<InputsC> = async data => {      
    data.imageUrl = fileLink;
    data.postId = id
    
    const res = await dispatch(createComment(data))
    const status = res.payload;
    if (status) {
      dispatch(fetchComments(id))
      setLink('')
      reset()
    } else setResponseStatus(false)
  }

  return (
    <div className={css.authform}>
      <form className={css.form} onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="">
          <input className="input" placeholder="Comment text" {...register("text")} />
        </label>
        <div className={css.bottom}>
          <FileInput setLink={setLink}></FileInput>

          <input className="button" type="submit" value="Comment" />
        </div>
        {!!fileLink?.length && (
          <div className={css.preview} style={{ backgroundImage: `url(${fileLink})` }}>
            <DeleteImg setLink={setLink}></DeleteImg>
          </div>
        )}
        {!responseStatus && <BigError>ERROR!</BigError>}
      </form>
    </div>
  );
  
}