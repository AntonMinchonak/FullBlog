import React from 'react'
import css from './Error.module.scss'

export default function BigError(text: { children: string }) {
  return (
    <div className={css.big}>{ text.children}</div>
  )
}
