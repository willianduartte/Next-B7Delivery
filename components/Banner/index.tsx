import {Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper'
import 'swiper/css'

import styles from './styles.module.css'

export const Banner = () => {
  return (
    <div className={styles.container}>
       <Swiper
          slidesPerView={1}
          spaceBetween={30}
          loop={true}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
          modules={[Autoplay]}
          className={styles.swiper}
        >
        <SwiperSlide className={styles.slide} ><img src='/tmp/banner-1.png' /></SwiperSlide>
        <SwiperSlide className={styles.slide} ><img src='/tmp/banner-2.png' /></SwiperSlide>
      </Swiper>
    </div>
  )
}