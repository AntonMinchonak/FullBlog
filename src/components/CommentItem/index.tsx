import React from 'react'
import { useSelector } from 'react-redux'
import { isTypeNode } from 'typescript'
import { editComment } from '../../redux/slices/postSlice'
import { RootState, useAppDispatch } from '../../redux/store'
import { CommentType, PostType } from '../../types'
import FileInput from '../../UI/Input/FileInput'
import DeletePost from '../DeletePost'
import EditPost from '../EditPost'
import Like from '../LikeButton/Like'
import UserSign from '../UserSign'
import css from './CommentItem.module.scss'

export default function CommentItem({ info, post }: { info: CommentType, post: PostType }) {
  const dispatch = useAppDispatch()
  const date = info.createdAt.slice(0, 16).split(/-|T/g).reverse()
  let timeArr : string[] = date?.shift()?.split(':') ?? []
  timeArr[0] = String(+timeArr[0] + 3)
  var time = timeArr.join(':')
  const me = useSelector((state: RootState) => state.user.me)
  const [isEditing, setEditing] = React.useState(false);
  const [text, setText] = React.useState(info.text);
  const [fileLink, setLink] = React.useState(info.imageUrl);
  const textRef = React.useRef<HTMLInputElement>(null);

  function changeContent() {
    const newText = textRef.current?.value;
    if (newText) setText(newText);
    dispatch(editComment({ ...info, text: newText, imageUrl: fileLink }));
  }

  return (
    <div className={css.comment}>
      <div className={css.top}>
        <UserSign info={info.user} date={date} time={time}></UserSign>

        {me?._id === info.user?._id && (
          <div className={css.controlPost}>
            <EditPost setEditing={setEditing} isEditing={isEditing} changeContent={changeContent}></EditPost>
            <DeletePost post={info} parent={post} entity="comments"></DeletePost>
          </div>
        )}
      </div>
      {isEditing ? <input ref={textRef} defaultValue={text} className="input-edit"></input> : <div className={css.text}>{text}</div>}
      {isEditing && <FileInput fileLink={fileLink} setLink={setLink}></FileInput>}
      {!!fileLink?.length && !isEditing && <div className={css.image} style={{ backgroundImage: `url(${fileLink})` }}></div>}

      <Like userLikes={info.userLikes} me={me} postId={info._id} entity={"comments"}></Like>
    </div>
  );
}
