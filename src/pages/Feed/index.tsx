import React from 'react'
import css from './Feed.module.scss'
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import Sidebar from '../../components/Sidebar';
import CreatePost from '../../components/CreatePost';
import PostList from '../../components/PostList';
import SearchPanel from '../../components/SearchPanel';

export default function Feed() {
  const me = useSelector((state: RootState) => state.user.me)
  
  return (
    <div className={css.feed}>
      <div className='list'>
        {me && <CreatePost></CreatePost>}
        <PostList></PostList>
      </div>
      <Sidebar></Sidebar>
    </div>
  )
}
