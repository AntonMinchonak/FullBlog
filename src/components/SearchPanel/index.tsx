import React from 'react'
import { useSelector } from 'react-redux'
import { fetchUsers } from '../../redux/slices/userSlice'
import { RootState, useAppDispatch } from '../../redux/store'
import searchimg from '../../assets/img/searchimg.svg'
import css from'./SearchPanel.module.scss'
import { clear } from 'console'
import { fetchPosts } from '../../redux/slices/postSlice'

export default function SearchPanel({type}:{type:string}) {
  const dispatch = useAppDispatch()
  const users = useSelector((state: RootState)=> state.user.users)
  const searchInput = React.useRef<HTMLInputElement>(null)
  const [searchValue, setValue] = React.useState('')

  let fetch:any; 
  function searchInList() {
    if (searchInput.current) setValue(searchInput.current.value);
    clearTimeout(fetch)
    fetch = setTimeout(() => {
      const searchValue = searchInput.current?.value ?? null;
      if (type === 'users') dispatch(fetchUsers({ search: searchValue }));
      else dispatch(fetchPosts({ search: searchValue }));
    }, 700);
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
