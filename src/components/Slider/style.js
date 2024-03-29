import styled from 'styled-components'
import style from '@/assets/styles/global-style'

const SliderContainer = styled.div`
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  margin: auto;
  background: white;
  .before {
    position: absolute;
    /* top: -300px;
    height: 400px; */
    top: 0;
    height: 80px;
    width: 100%;
    background: ${style['theme-color']};
    z-index: 1;
  }
  .slider-container {
    position: relative;
    width: 98%;
    height: 160px;
    overflow: hidden;
    margin: auto;
    border-radius: 6px;
    .slider-nav {
      position: absolute;
      display: block;
      width: 100%;
      height: 100%;
      font-size: 0;
      img {
        width: 100%;
        height: 100%;
        object-fit: fill;
      }
    }
    .swiper-pagination-bullet-active {
      background: ${style['theme-color']};
    }
  }
`

export default SliderContainer
