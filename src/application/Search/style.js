import styled from 'styled-components'
import globalStyle from '@/assets/styles/global-style'

export const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: ${props => (props.play > 0 ? '60px' : 0)};
  width: 100%;
  z-index: 100;
  overflow: hidden;
  background: #f2f3f4;
  transform-origin: right bottom;
  &.fly-enter,
  &.fly-appear {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
  &.fly-enter-active,
  &.fly-appear-active {
    opacity: 1;
    transition: all 0.3s;
    transform: translate3d(0, 0, 0);
  }
  &.fly-exit {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
  &.fly-exit-active {
    opacity: 0;
    transition: all 0.3s;
    transform: translate3d(100%, 0, 0);
  }
`

export const ShortcutWrapper = styled.div`
  position: absolute;
  top: 40px;
  bottom: 0;
  width: 100%;
  display: ${props => (props.show ? '' : 'none')};
`

export const HotKey = styled.div`
  margin: 0 20px 20px 20px;
  .title {
    padding-top: 35px;
    margin-bottom: 20px;
    font-size: ${globalStyle['font-size-m']};
    color: ${globalStyle['font-color-desc-v2']};
  }
  .item {
    display: inline-block;
    padding: 5px 10px;
    margin: 0 20px 10px 0;
    border-radius: 6px;
    background: ${globalStyle['highlight-background-color']};
    font-size: ${globalStyle['font-size-m']};
    color: ${globalStyle['font-color-desc']};
  }
`

export const SearchHistory = styled.div`
  position: relative;
  margin: 0 20px;
  .title {
    display: flex;
    align-items: center;
    height: 40px;
    font-size: ${globalStyle['font-size-m']};
    color: ${globalStyle['font-color-desc-v2']};
    .text {
      flex: 1;
    }
    .clear {
      ${globalStyle.extendClick()}
      .icon-clear {
        font-size: ${globalStyle['font-size-m']};
        color: ${globalStyle['font-color-desc']};
      }
    }
  }
  .history_item {
    display: flex;
    align-items: center;
    height: 40px;
    overflow: hidden;
    color: ${globalStyle['font-color-desc-v2']};
    border-bottom: 1px solid ${globalStyle['border-color']};
    .text {
      flex: 1;
      font-size: ${globalStyle['font-size-s']};
      color: ${globalStyle['font-color-desc']};
    }
    .icon {
      ${globalStyle.extendClick()}
      font-size: ${globalStyle['font-size-s']};
      .icon_delete {
        color: ${globalStyle['font-color-desc']};
      }
    }
  }
`
