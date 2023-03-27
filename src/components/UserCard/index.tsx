import React from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { editUser } from '../../redux/slices/userSlice';
import { RootState, useAppDispatch } from '../../redux/store';
import { userType } from '../../types'
import FileInput from '../../UI/Input/FileInput';
import EditPost from '../EditPost';
import FollowButton from '../FollowButton';
import css from './Profile.module.scss'

export default function UserCard({ info }: { info: userType | null }) {
  const dispatch = useAppDispatch()
  const date = info?.createdAt.slice(0, 16).split(/-|T/g).reverse().splice(1).join('.')
  const [isEditing, setEditing] = React.useState(false);
  const [fullName, setfullName] = React.useState(info?.fullName??'');
  const [fileLink, setLink] = React.useState<string | undefined>(info?.avatarUrl);
  const fullNameRef = React.useRef<HTMLInputElement>(null);
  const [avatarHover, setHover] = React.useState(false)
  const me = useSelector((state: RootState) => state.user.me)
  const [isLoading, setLoading] = React.useState(true);
  
 
  React.useEffect(() => {
    setfullName(info?.fullName??'');
    setLink(info?.avatarUrl);
  }, [info])
  
  React.useEffect(() => {
    if (!isLoading) changeContent();
    setLoading(false);
  }, [fileLink]);
  
  function changeContent() {
    const newName = fullNameRef.current?.value ?? fullName; 
    setfullName(newName);
    dispatch(editUser({ ...info, fullName: newName, avatarUrl: fileLink }));
  }
;
  return (
    <div className={css.profile}>
      <div className={css.top}>
        {isEditing ? (
          <input defaultValue={fullName} ref={fullNameRef} className="input-edit" />
        ) : (
          <Link to={"/profile/" + info?._id}>
            <h2>{fullName}</h2>
          </Link>
        )}
        {me?._id === info?._id && <EditPost setEditing={setEditing} isEditing={isEditing} changeContent={changeContent}></EditPost>}
        {me?._id !== info?._id && <FollowButton info={info}></FollowButton>}
      </div>
      <div className={css.content}>
        <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ backgroundImage: fileLink ? `url(${fileLink})` : "url(http://localhost:4444/uploads/unknownuser.svg)" }} className={css.avatar}>
          {avatarHover && me?._id === info?._id && <FileInput setLink={setLink}></FileInput>}
        </div>
        <div className={css.details}>
          <div className={css.date}>
            <span>Joined:</span> {date}
          </div>
          {info?.email && <div className={css.email}>
            <span>e-mail:</span> {info.email}
          </div>}
        </div>
      </div>
    </div>
  );
}
