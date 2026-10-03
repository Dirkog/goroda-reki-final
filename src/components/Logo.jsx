import React from 'react'

/* Единственный логотип сайта: самолёт, солнце и пальма — прозрачный знак без плитки
   (public/logo-mark.png, собирается tools/make_logo.py вместе со значками вкладки).
   size — высота знака в px; ширина считается по пропорции файла (305×220). */
const RATIO = 305 / 220

export default function Logo({ size = 46 }) {
  return (
    <span className="logo-mark" style={{ height: size, width: Math.round(size * RATIO) }} aria-hidden="true">
      <img src={`${import.meta.env.BASE_URL}logo-mark.png`} width={Math.round(size * RATIO)} height={size} alt="" decoding="async" />
    </span>
  )
}
