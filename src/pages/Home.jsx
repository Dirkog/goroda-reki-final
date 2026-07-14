import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { contacts, heroVideo } from '../data/site'
import { Page } from '../components/Page'
import Footer from '../components/Footer'

function HeroMedia() {
  const [videoReady, setVideoReady] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)

  return (
    <div className="flight-hero">
      <img className="hero-photo-fallback" src={heroVideo.poster} alt="Лес, река и горы" />
      {!videoFailed && (
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={heroVideo.poster}
          className={videoReady ? 'flight-video is-ready' : 'flight-video'}
          onCanPlay={() => setVideoReady(true)}
          onError={() => setVideoFailed(true)}
        >
          <source src={heroVideo.src} type="video/mp4" />
        </video>
      )}
      <div className="horizon-glow" aria-hidden="true" />
    </div>
  )
}

export default function Home({ setPage }) {
  return (
    <Page className="home-page">
      <HeroMedia />
      <div className="hero-content">
        <motion.p className="eyebrow" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}>официальный подбор путешествий онлайн</motion.p>
        <motion.h1 initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{delay:.08}}>Путешествия, которые хочется вспоминать</motion.h1>
        <motion.p className="hero-lead" initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:.16}}>Команда «Города и реки» подбирает и бронирует туры для семей, пар, компаний и корпоративных групп — по договору, с официальной оплатой и сопровождением до возвращения.</motion.p>
        <motion.div className="hero-actions" initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:.24}}>
          <a className="btn light" href={contacts.whatsapp}>Написать в WhatsApp</a>
          <button className="btn glass" onClick={() => setPage('trips')}>Найти идею поездки</button>
        </motion.div>
      </div>
      <motion.div className="hero-search" initial={{opacity:0,y:36}} animate={{opacity:1,y:0}} transition={{delay:.34,duration:.75,ease:[.16,1,.3,1]}}>
        <div><span>Куда</span><b>море / город / круиз</b></div>
        <div><span>Когда</span><b>месяц или даты</b></div>
        <div><span>Кто едет</span><b>семья / пара / команда</b></div>
        <button onClick={() => setPage('trips')}>Подобрать</button>
      </motion.div>
      <aside className="home-trust"><b>РТА 0005142</b><span>Официальный договор, расчётный счёт, чек и документы перед поездкой.</span></aside>
      <Footer setPage={setPage} />
    </Page>
  )
}
