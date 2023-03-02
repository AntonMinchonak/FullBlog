import React from 'react'
import css from './Error.module.scss'

export default function LittleError(text: { children: string }) {
  return (
    <div className={css.little}> { text.children }</div>
  )
}
