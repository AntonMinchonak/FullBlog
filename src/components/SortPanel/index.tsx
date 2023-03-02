import React from 'react'
import { fetchPosts, sortPosts } from '../../redux/slices/postSlice'
import { useAppDispatch } from '../../redux/store'
import css from './Sort.module.scss'

export default function SortPanel() {
  const dispatch = useAppDispatch()

  function onSort(type: 'time' | 'views' | 'likes') {
    dispatch(sortPosts({sort:type}))
    // dispatch(fetchPosts())
  }

  return (
    <div className={css.sortPanel}>
      <div onClick={()=>onSort('time')} className="empty-button">Newest</div>
      <div onClick={()=>onSort('views')} className="empty-button">Popular</div>
      <div onClick={()=>onSort('likes')} className="empty-button">Liked</div>
    </div>
  )
}
