import React from 'react'
import { fetchUsers } from '../../redux/slices/userSlice'
import { RootState, useAppDispatch } from '../../redux/store'
import searchimg from '../../assets/img/searchimg.svg'
import css from'./SearchPanel.module.scss'

import { clearPosts, fetchPosts } from '../../redux/slices/postSlice'
import { useSelector } from 'react-redux'

export default function SearchPanel({type}:{type:string}) {
  const dispatch = useAppDispatch()
  const searchInput = React.useRef<HTMLInputElement>(null)
  const [searchValue, setValue] = React.useState('')
  const [timer, setTimer] = React.useState<any>(null);
  const me = useSelector((state:RootState)=> state.user.me)

  function searchInList() {
    if (searchInput.current) setValue(searchInput.current.value);
    
    clearTimeout(timer);
    let timeout = setTimeout(() => {
      const searchValue = searchInput.current?.value ?? null;
      if (type === "users") dispatch(fetchUsers({ search: searchValue}));
      else {
        dispatch(clearPosts())
        dispatch(fetchPosts({ search: searchValue, userId: me?._id }));
      }
    }, 700);
    setTimer(timeout);
  }

  function clear() {
    setValue('')
    if (type === "users") dispatch(fetchUsers({ search: null }));
    else dispatch(fetchPosts({ search: null }));
  }

  return (
    <div className={css.panel}>
      <img src={searchimg} alt="" />
      <input placeholder="Search..." ref={searchInput} value={searchValue} onChange={() => searchInList()} type="text" className="input" />
      <div className={css.clear} onClick={() => clear()}>
        ✖
      </div>
    </div>
  );
}
