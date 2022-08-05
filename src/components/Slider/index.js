import React, { memo } from 'react'
import { Autoplay } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import SliderContainer from './style'

import 'swiper/css'
import 'swiper/css/pagination'

// SwiperCore.use([Autoplay])

const Slider = props => {
  const { bannerList } = props

  return (
    <SliderContainer>
      <div className="before" />
      <Swiper
        className="slider-container"
        modules={[Autoplay]}
        spaceBetween={0}
        loop
        autoplay={{
          delay: 3000,
          disableOnInteraction: false
        }}
      >
        {bannerList.map(slider => (
          <SwiperSlide className="swiper-slider" key={slider.imageUrl}>
            <div className="slider-nav">
              <img src={slider.imageUrl} width="100%" height="100%" alt="推荐" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </SliderContainer>
  )
}

export default memo(Slider)
