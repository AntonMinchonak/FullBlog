import React from 'react'
import SortPanel from '../SortPanel'
import css from "./Sidebar.module.scss"

export default function index() {
  return (
    <div className={"block--small "+css.sidebar }>
      <SortPanel></SortPanel>
    </div>
  )
}
