import React from 'react'
import css from './DeleteImg.module.scss'

export default function DeleteImg({ setLink }: { setLink: any; }) {
  return (
    <div className={css.deleteImg} onClick={() => setLink("")}>
      ✖
    </div>
  );
}
