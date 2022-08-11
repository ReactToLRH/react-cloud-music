import React, { useRef, useState, useEffect, useMemo } from 'react'

import styled from 'styled-components'
import globalStyle from '@/assets/styles/global-style'

import { debounce } from '@/utils/util'

const SearchBoxWrapper = styled.div`
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 0 6px;
  padding-right: 20px;
  height: 40px;
  background: ${globalStyle['theme-color']};
  .icon-back {
    font-size: 24px;
    color: ${globalStyle['font-color-light']};
  }
  .box {
    flex: 1;
    margin: 0 5px;
    line-height: 18px;
    background: ${globalStyle['theme-color']};
    color: ${globalStyle['highlight-background-color']};
    font-size: ${globalStyle['font-size-m']};
    outline: none;
    border: none;
    border-bottom: 1px solid ${globalStyle['border-color']};
    &::placeholder {
      color: ${globalStyle['font-color-light']};
    }
  }
  .icon-delete {
    font-size: 16px;
    color: ${globalStyle['background-color']};
  }
`

const SearchBox = props => {
  const queryRef = useRef()
  const [query, setQuery] = useState('')

  const { newQuery } = props
  const { handleQuery } = props

  const handleQueryDebounce = useMemo(() => debounce(handleQuery, 500), [handleQuery])

  useEffect(() => {
    queryRef.current.focus()
  }, [])

  useEffect(() => {
    handleQueryDebounce(query)
  }, [query])

  useEffect(() => {
    let curQuery = query
    if (newQuery !== query) {
      curQuery = newQuery
      queryRef.current.value = newQuery
    }
    setQuery(curQuery)
  }, [newQuery])

  const handleChange = e => {
    const val = e.currentTarget.value
    setQuery(val)
  }

  const clearQuery = () => {
    setQuery('')
    queryRef.current.value = ''
    queryRef.current.focus()
  }

  const displayStyle = query ? { display: 'block' } : { display: 'none' }

  return (
    <SearchBoxWrapper>
      <i className="iconfont icon-back" onClick={() => props.back()}>
        &#xe655;
      </i>
      <input
        ref={queryRef}
        className="box"
        placeholder="搜索歌曲、歌手、专辑"
        onChange={handleChange}
      />
      <i className="iconfont icon-delete" onClick={clearQuery} style={displayStyle}>
        &#xe600;
      </i>
    </SearchBoxWrapper>
  )
}

export default React.memo(SearchBox)
