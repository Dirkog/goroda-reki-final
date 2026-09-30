import React from 'react'
import { Page, SplitTitle, Breadcrumbs } from '../components/Page'

// Источники фотографий: на сайте только реальные снимки со свободной лицензией,
// здесь указаны автор и лицензия — как требуют условия использования.
const PHOTOS = [
  {"role": "Направление «Море и семейный отдых»", "title": "Turquoise waters of the Aegean Sea at Hawaii Beach on Naxos Island, Greece.jpg", "author": "dronepicr", "license": "CC BY 2.0", "page": "https://commons.wikimedia.org/wiki/File:Turquoise_waters_of_the_Aegean_Sea_at_Hawaii_Beach_on_Naxos_Island,_Greece.jpg"},
  {"role": "Направление «Круизы»", "title": "Petergof river cruise ship sunset.jpg", "author": "Mike1979 Russia", "license": "CC BY-SA 3.0", "page": "https://commons.wikimedia.org/wiki/File:Petergof_river_cruise_ship_sunset.jpg"},
  {"role": "Направление «Сакура в Японии»", "title": "Cherry blossoms along the moat of Hirosaki Castle at night 20260420a.jpg", "author": "掬茶", "license": "CC BY-SA 4.0", "page": "https://commons.wikimedia.org/wiki/File:Cherry_blossoms_along_the_moat_of_Hirosaki_Castle_at_night_20260420a.jpg"},
  {"role": "Направление «Норвежские фьорды»", "title": "205 Kilometer lang ist der Sognefjord. 02.jpg", "author": "Holger Uwe Schmitt", "license": "CC BY-SA 4.0", "page": "https://commons.wikimedia.org/wiki/File:205_Kilometer_lang_ist_der_Sognefjord._02.jpg"},
  {"role": "Направление «ОАЭ и Оман»", "title": "Muttrah-Muscat مطرح، مسقط 23.jpg", "author": "Mostafameraji", "license": "CC BY-SA 4.0", "page": "https://commons.wikimedia.org/wiki/File:Muttrah-Muscat_%D9%85%D8%B7%D8%B1%D8%AD%D8%8C_%D9%85%D8%B3%D9%82%D8%B7_23.jpg"},
  {"role": "Направление «Фестивали тюльпанов»", "title": "Close-Red-Tulips Bollenstreek Hillegom.jpg", "author": "acediscovery", "license": "CC BY 4.0", "page": "https://commons.wikimedia.org/wiki/File:Close-Red-Tulips_Bollenstreek_Hillegom.jpg"},
  {"role": "Направление «Европейские события»", "title": "Venice Carnival - Masked Lovers (2010).jpg", "author": "Frank Kovalchek from Anchorage, Alaska, USA", "license": "CC BY 2.0", "page": "https://commons.wikimedia.org/wiki/File:Venice_Carnival_-_Masked_Lovers_(2010).jpg"},
  {"role": "Страница «Корпоративным»", "title": "DZ6 0468 Spacious elegantly lit banquet hall set up with rows of white-covered chairs facing a stage ready for a large conference or formal event.jpg", "author": "PattayaPatrol", "license": "CC BY-SA 4.0", "page": "https://commons.wikimedia.org/wiki/File:DZ6_0468_Spacious_elegantly_lit_banquet_hall_set_up_with_rows_of_white-covered_chairs_facing_a_stage_ready_for_a_large_conference_or_formal_event.jpg"},
  {"role": "Направление «Корпоративный выезд»", "title": "Chairs in a meeting room (Unsplash).jpg", "author": "Breather breather", "license": "CC0", "page": "https://commons.wikimedia.org/wiki/File:Chairs_in_a_meeting_room_(Unsplash).jpg"},
  {"role": "Полоса на главной — фьорды", "title": "Sognefjord at dusk 01.jpg", "author": "Cbliu", "license": "CC BY-SA 4.0", "page": "https://commons.wikimedia.org/wiki/File:Sognefjord_at_dusk_01.jpg"},
  {"role": "Полоса на главной — тюльпаны", "title": "Tulip field in Holland.jpg", "author": "rboed*", "license": "CC BY 2.0", "page": "https://commons.wikimedia.org/wiki/File:Tulip_field_in_Holland.jpg"},
  {"role": "Полоса на главной — европейские города", "title": "Street and canal at dusk, Oudezijds Voorburgwal 'blue hour', 7 januari 2011 (5821465439).jpg", "author": "Jorge Láscar from Australia", "license": "CC BY 2.0", "page": "https://commons.wikimedia.org/wiki/File:Street_and_canal_at_dusk,_Oudezijds_Voorburgwal_%27blue_hour%27,_7_januari_2011_(5821465439).jpg"}
]

export default function Credits() {
  return (
    <Page className="inner-page credits-page">
      <Breadcrumbs items={[{ label: 'Главная', path: '/' }, { label: 'Источники фотографий' }]} />
      <SplitTitle
        eyebrow="об изображениях"
        title="Источники фотографий"
        text="На сайте нет рисунков и сгенерированных картинок — только настоящие снимки из открытых архивов (Wikimedia Commons) со свободными лицензиями. Ниже — автор и лицензия каждой фотографии."
      />
      <div className="credits-list">
        {PHOTOS.map(p => (
          <article key={p.title}>
            <b>{p.role}</b>
            <span>{p.title}</span>
            <span className="credits-meta">
              {p.author ? `Автор: ${p.author}. ` : ''}{p.license}
              {p.page ? <> · <a href={p.page} target="_blank" rel="noopener noreferrer">страница файла</a></> : null}
            </span>
          </article>
        ))}
      </div>
      <p className="legal-warning" style={{ marginTop: '28px' }}>
        Лицензии CC BY и CC BY-SA разрешают использование с указанием автора и лицензии — именно поэтому список открыт.
        Если вы правообладатель и хотите заменить снимок, напишите нам, заменим в течение суток.
      </p>
    </Page>
  )
}
