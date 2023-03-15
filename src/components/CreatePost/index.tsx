import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import css from "./CreatePost.module.scss";
import BigError from "../../UI/Error/BigError";
import LittleError from "../../UI/Error/LittleError";
import { useAppDispatch } from "../../redux/store";
import { createPost, fetchPosts } from "../../redux/slices/postSlice";
import FileInput from "../../UI/Input/FileInput";
import DeleteImg from "../../UI/Buttons/DeleteImg";

type Inputs = {
  title: string;
  text: string;
  tags?: string;
  imageUrl?: string;
};

const schema = yup
.object({
    title: yup.string().min(2, "Min length is 2 symbols").required(),
    text: yup.string().required().min(1, "Min length is 1 symbols"),
  })
  .required();
  
  export default function CreatePost({ id }: { id?: string }) {
    const dispatch = useAppDispatch();
    const [fileLink, setLink] = React.useState("");
    const [responseStatus, setResponseStatus] = React.useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Inputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    data.imageUrl = fileLink;
    const res = await dispatch(createPost(data));
    const status = res.payload;
    if (status) {
      dispatch(fetchPosts({ user: id ? "id=" + id : "" }));

      setResponseStatus(true);
      reset();
      setLink('')
    } else setResponseStatus(false);
  };

  return (
    <div className={"block " +css.authform}>
      <form className={css.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={css.top}>
          <label htmlFor="">
            <input className="input" placeholder="Post title" {...register("title")} />
            {errors.title?.message && <LittleError>{errors.title.message}</LittleError>}
          </label>
          <label htmlFor="">
            <input className="input" placeholder="Post tags" {...register("tags")} />
          </label>
          <FileInput setLink={setLink}></FileInput>
        </div>
        <div className={css.bottom}>
          <label htmlFor="">
            <input className="input" placeholder="Post text" {...register("text")} />
            {errors.text?.message && <LittleError>{errors.text.message}</LittleError>}
          </label>

          <input className="button" type="submit" value="Post" />
        </div>
        {!!fileLink?.length && <div className={css.preview} style={{ backgroundImage: `url(${fileLink})` }}><DeleteImg setLink={setLink}></DeleteImg></div>}
        {!responseStatus && <BigError>ERROR!</BigError>}
      </form>
    </div>
  );
}
