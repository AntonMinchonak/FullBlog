import React from 'react'
import { useSelector } from 'react-redux';
import SearchPanel from '../../components/SearchPanel';
import UserCard from '../../components/UserCard';
import { fetchUsers } from '../../redux/slices/userSlice';
import { RootState, useAppDispatch } from '../../redux/store'
import css from "./Search.module.scss";

export default function UserSearch() {
  const dispatch = useAppDispatch()
  const users = useSelector((state: RootState)=> state.user.users)
  React.useEffect(() => {
    dispatch(fetchUsers({search:null}));
  }, []);
  

  return (
    <>
      <div className="block">
        <h1>Search Users</h1>
        <SearchPanel type={"users"}></SearchPanel>
        <div className={css.userList}>{users.length ? users.map(e => <UserCard info={e} key={e._id}></UserCard>) : <div className="block">Loading...</div>}</div>
      </div>
    </>
  );
}
