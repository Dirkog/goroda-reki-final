import React from 'react'

/* Единственный логотип сайта: самолёт, солнце и пальма (файл public/logo-mark.png).
   Тот же знак — в значке вкладки и на телефоне (favicon.ico, icon-*.png, apple-touch-icon.png).
   Меняется только вместе с этими файлами. */
export default function Logo({ size = 42 }) {
  return (
    <span className="logo-mark" style={{ width: size, height: size }} aria-hidden="true">
      <img src={`${import.meta.env.BASE_URL}logo-mark.png`} width={size} height={size} alt="" decoding="async" />
    </span>
  )
}
