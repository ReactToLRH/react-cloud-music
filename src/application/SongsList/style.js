import styled from 'styled-components'
import globalStyle from '@/assets/styles/global-style'

export const SongList = styled.div`
  border-radius: 10px;
  opacity: 0.98;
  ${props =>
    props.showBackground ? `background: ${globalStyle['highlight-background-color']}` : ''};
  .first_line {
    box-sizing: border-box;
    padding: 10px 0;
    margin-left: 10px;
    position: relative;
    justify-content: space-between;
    border-bottom: 1px solid ${globalStyle['border-color']};
    .play_all {
      display: inline-block;
      line-height: 24px;
      color: ${globalStyle['font-color-desc']};
      .iconfont {
        font-size: 24px;
        margin-right: 10px;
        vertical-align: top;
      }
      .sum {
        font-size: ${globalStyle['font-size-s']};
        color: ${globalStyle['font-color-desc-v2']};
      }
      > span {
        vertical-align: top;
      }
    }
    .add_list,
    .isCollected {
      display: flex;
      align-items: center;
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      width: 130px;
      line-height: 34px;
      background: ${globalStyle['theme-color']};
      color: ${globalStyle['font-color-light']};
      font-size: 0;
      border-radius: 3px;
      vertical-align: top;
      .iconfont {
        vertical-align: top;
        font-size: 10px;
        margin: 0 5px 0 10px;
      }
      span {
        font-size: 14px;
        line-height: 34px;
      }
    }
    .isCollected {
      display: flex;
      background: ${globalStyle['background-color']};
      color: ${globalStyle['font-color-desc']};
    }
  }
`
export const SongItem = styled.ul`
  > li {
    display: flex;
    height: 60px;
    align-items: center;
    .index {
      flex-basis: 60px;
      width: 60px;
      height: 60px;
      line-height: 60px;
      text-align: center;
    }
    .info {
      box-sizing: border-box;
      flex: 1;
      display: flex;
      height: 100%;
      padding: 5px 0;
      flex-direction: column;
      justify-content: space-around;
      border-bottom: 1px solid ${globalStyle['border-color']};
      ${globalStyle.noWrap()}
      >span {
        ${globalStyle.noWrap()}
      }
      > span:first-child {
        color: ${globalStyle['font-color-desc']};
      }
      > span:last-child {
        font-size: ${globalStyle['font-size-s']};
        color: #bba8a8;
      }
    }
  }
`
