import React from 'react'
import edit from '../../assets/img/edit.svg'
import css from './EditPost.module.scss'

export default function EditPost({ setEditing, isEditing, changeContent }: { setEditing: any; isEditing: boolean; changeContent:any }) {

  function onEdit() {
    setEditing(!isEditing);
    if (isEditing) changeContent();
  }

  return (
      <img onClick={()=>onEdit()} src={edit} className={css.editImg} alt="edit" />
  );
}
