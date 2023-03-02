import React, { ChangeEvent } from "react";
import css from "./Post.module.scss";
import { PostType } from "../../types";
import eye from "../../assets/img/eye.svg";
import commentimg from "../../assets/img/comment.svg";
import { Link, useLocation } from "react-router-dom";
import { RootState, useAppDispatch } from "../../redux/store";
import Like from "../LikeButton/Like";
import { useSelector } from "react-redux";
import UserSign from "../UserSign";
import DeletePost from "../DeletePost";
import EditPost from "../EditPost";
import { editPost } from "../../redux/slices/postSlice";
import FileInput from "../../UI/Input/FileInput";


export default function Post({ info }: { info: PostType }) {
  const dispatch = useAppDispatch()
  const isDetail = useLocation().pathname.includes("detail");
  const me = useSelector((state: RootState) => state.user.me);
  const date = info.createdAt.slice(0, 16).split(/-|T/g).reverse();
  let timeArr: string[] = date?.shift()?.split(":") ?? [];
  timeArr[0] = String(+timeArr[0] + 3);
  var time = timeArr.join(":");
  const commentList = useSelector((state: RootState) => state.posts.comments);
  const [isEditing, setEditing] = React.useState(false)
  const [title, setTitle] = React.useState(info.title);
  const [text, setText] = React.useState(info.text);
  const [tags, setTags] = React.useState<string[]|null>(info.tags);
  const [fileLink, setLink] = React.useState(info.imageUrl);
  const titleRef = React.useRef<HTMLInputElement>(null)
  const textRef = React.useRef<HTMLInputElement>(null);
  const tagsRef = React.useRef<HTMLInputElement>(null);

  function changeContent() {
    const newTitle = titleRef.current?.value;
    const newText = textRef.current?.value;
    const newTags = tagsRef.current?.value;
    if (newTitle) setTitle(newTitle);
    if (newText) setText(newText);
    if (newTags?.length) setTags(newTags.split(','));
    else setTags(null);
    dispatch(editPost({ ...info, text: newText, title: newTitle, tags: newTags, imageUrl: fileLink }));
  }

  return (
    <div className={css.post}>
      <div className={css.top}>
        <UserSign info={info.user} date={date} time={time}></UserSign>
        {me && info.user?._id === me._id && (
          <div className={css.controlPost}>
            <EditPost setEditing={setEditing} isEditing={isEditing} changeContent={changeContent}></EditPost>
            <DeletePost post={info} entity="posts"></DeletePost>
          </div>
        )}
      </div>

      {isEditing ? (
        <input className="input-edit" ref={titleRef} type="text" defaultValue={title} />
      ) : (
        <Link to={"/detail/" + info._id}>
          <h2> {title}</h2>
        </Link>
      )}

      {isEditing ? <input className="input-edit" ref={textRef} defaultValue={text} type="text" /> : <div className={isDetail ? "" : css.text}>{text}</div>}

      {isEditing && <FileInput fileLink={fileLink} setLink={setLink}></FileInput>}

      {info.imageUrl && !isEditing && <Link to={"/detail/" + info._id} className={css.image} style={{ backgroundImage: `url(${fileLink})` }}></Link>}

      <div className={css.bottom}>
        {isEditing && <input className="input-edit" ref={tagsRef} type="text" defaultValue={tags?.join(",")} />}
        {!!tags?.length && !isEditing && (
          <div className={css.tags}>
            {tags.map((i, _) => (
              <div key={_}>#{i}</div>
            ))}
          </div>
        )}
        <div className={css.reactions}>
          <div className={css.views}>
            <img src={eye} alt="" />
            {info.viewsCount}
          </div>
          <Like userLikes={info.userLikes} me={me} postId={info._id} entity={"posts"}></Like>
          <Link to={"/detail/" + info._id} className={css.views}>
            <img src={commentimg} alt="" />
            {commentList.length || info.commentsAmount}
          </Link>
        </div>
      </div>
    </div>
  );
}
