import React, { memo } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import globalStyle from '@/assets/styles/global-style'

const HeaderContainer = styled.div`
  position: fixed;
  padding: 5px 10px;
  padding-top: 0;
  height: 40px;
  width: 100%;
  z-index: 100;
  display: flex;
  line-height: 40px;
  color: ${globalStyle['font-color-light']};
  .back {
    margin-right: 5px;
    font-size: 20px;
    width: 20px;
  }
  > h1 {
    font-size: ${globalStyle['font-size-l']};
    font-weight: 700;
  }
`
// 处理函数组件拿不到 ref 的问题,所以用 forwardRef
const Header = React.forwardRef((props, ref) => {
  const { handleClick, title, isMarquee } = props
  return (
    <HeaderContainer ref={ref}>
      <i className="iconfont back" onClick={handleClick}>
        &#xe655;
      </i>
      {isMarquee ? (
        // eslint-disable-next-line jsx-a11y/no-distracting-elements
        <marquee>
          <h1>{title}</h1>
        </marquee>
      ) : (
        <h1>{title}</h1>
      )}
    </HeaderContainer>
  )
})

Header.defaultProps = {
  title: '标题',
  isMarquee: false,
  handleClick: () => {}
}

Header.propTypes = {
  title: PropTypes.string,
  isMarquee: PropTypes.bool,
  handleClick: PropTypes.func
}

export default memo(Header)
