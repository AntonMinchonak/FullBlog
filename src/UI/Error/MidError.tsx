import React from 'react'
import css from './Error.module.scss'

export default function MidError(text: { children: string }) {
  return (
    <div className={css.mid}>{ text.children}</div>
  )
}
