import React, { memo, useState, useEffect, useRef } from 'react'
import { PropTypes } from 'prop-types'
import styled from 'styled-components'

import Scroll from '../Scroll'

import globalStyle from '@/assets/styles/global-style'

const List = styled.div`
  display: flex;
  align-items: center;
  height: 30px;
  justify-content: center;
  overflow: hidden;
  > span:first-of-type {
    display: block;
    flex: 0 0 auto;
    padding: 5px 5px 5px 0;
    color: grey;
    font-size: ${globalStyle['font-size-m']};
    /* vertical-align: middle; */
  }
`
const ListItem = styled.span`
  flex: 0 0 auto;
  font-size: ${globalStyle['font-size-m']};
  padding: 5px 5px;
  border: 1px solid transparent;
  border-radius: 10px;
  &.selected {
    color: ${globalStyle['theme-color']};
    border: 1px solid ${globalStyle['theme-color']};
    opacity: 0.8;
  }
`

const Horizen = props => {
  const [refreshCategoryScroll, setRefreshCategoryScroll] = useState(false)
  const categoryRef = useRef(null)
  const { list, currentVal, title } = props
  const { handleClick } = props

  useEffect(() => {
    const categoryDOM = categoryRef.current
    const tagElems = categoryDOM.querySelectorAll('span')
    let totalWidth = 0
    Array.from(tagElems).forEach(ele => {
      totalWidth += ele.offsetWidth
    })
    totalWidth += 2
    categoryDOM.style.width = `${totalWidth}px`
    setRefreshCategoryScroll(true)
  }, [refreshCategoryScroll])

  const clickHandle = item => {
    const selectVal = currentVal === item.key ? '' : item.key
    handleClick(selectVal)
  }

  return (
    <Scroll direction="horizental" refresh>
      <div ref={categoryRef}>
        <List>
          <span>{title}</span>
          {list.map(item => (
            <ListItem
              key={item.key}
              className={currentVal === item.key ? 'selected' : ''}
              onClick={() => clickHandle(item)}
            >
              {item.name}
            </ListItem>
          ))}
        </List>
      </div>
    </Scroll>
  )
}

Horizen.defaultProps = {
  title: '',
  list: [],
  currentVal: '',
  handleClick: null
}

Horizen.prototype = {
  title: PropTypes.string,
  list: PropTypes.array,
  currentVal: PropTypes.string,
  handleClick: PropTypes.func
}

export default memo(Horizen)
