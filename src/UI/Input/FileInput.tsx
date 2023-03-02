import React, { ChangeEvent } from 'react'
import { uploadImg } from '../../redux/slices/postSlice';
import { useAppDispatch } from '../../redux/store';
import pickImage from "../../assets/img/pickimage.svg";
import css from './Fileinput.module.scss'
import DeleteImg from '../Buttons/DeleteImg';

export default function FileInput({ fileLink, setLink }: { setLink: any; fileLink?:string }) {
  const dispatch = useAppDispatch();

 async function loadFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const fileType = file.type.split("/")[1];
      const fileName = Date.now() + "." + fileType;
      await  dispatch(uploadImg({ data: file, fileName }));
      await setLink("http://localhost:4444/uploads/" + fileName);
    }
  }

  return (
    <>
      <label htmlFor={"filePost" + Date.now()} className={css.fileinput}>
        <img className={css.button} src={pickImage} alt="pickImage" />
        <input type="file" className="input--file " onChange={loadFile} id={"filePost" + Date.now()} name="image" />
      </label>
      {!!fileLink?.length && (
        <div className={css.preview} style={{ backgroundImage: `url(${fileLink})` }}>
          <DeleteImg setLink={setLink}></DeleteImg>
        </div>
      )}
    </>
  );
}
