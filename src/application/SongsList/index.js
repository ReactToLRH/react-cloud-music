import React, { useState, useEffect, memo, forwardRef } from 'react'

import { SongList, SongItem } from './style'

import { getName } from '@/utils/util'
import { PLAYLIST_ONE_PAGE_COUNT } from '@/config/const'

const SongsList = forwardRef((props, refs) => {
  const {
    songs,
    collectCount,
    musicAnimation,
    loading = false,
    showCollect,
    showBackground,
    usePageSplit
  } = props
  const totalCount = songs.length
  console.log('musicAnimation: ', musicAnimation)

  const [startIndex, setStartIndex] = useState(0)

  useEffect(() => {
    if (!loading) return
    if (startIndex + 1 + PLAYLIST_ONE_PAGE_COUNT >= totalCount) return
    setStartIndex(startIndex + PLAYLIST_ONE_PAGE_COUNT)
  }, [loading, startIndex, totalCount])

  const selectItem = (e, index) => {
    console.log('selectItem index: ', index)
  }

  const songList = list => {
    const res = []
    // 判断页数是否超过总数
    const end = usePageSplit ? startIndex + PLAYLIST_ONE_PAGE_COUNT : list.length
    for (let i = 0; i < end; i++) {
      if (i >= list.length) break
      const item = list[i]
      res.push(
        <li key={item.id} onClick={e => selectItem(e, i)}>
          <span className="index">{i + 1}</span>
          <div className="info">
            <span>{item.name}</span>
            <span>
              {item.ar ? getName(item.ar) : getName(item.artists)} -{' '}
              {item.al ? item.al.name : item.album.name}
            </span>
          </div>
        </li>
      )
    }
    return res
  }

  const collect = count => (
    <div className="add_list">
      <i className="iconfont">&#xe62d;</i>
      <span>收藏({Math.floor(count / 1000) / 10}万)</span>
    </div>
    // <div className="isCollected">
    //   <span>已收藏({Math.floor(count/1000)/10}万)</span>
    // </div>
  )

  return (
    <SongList ref={refs} showBackground={showBackground}>
      <div className="first_line">
        <div className="play_all" onClick={e => selectItem(e, 0)}>
          <i className="iconfont">&#xe6e3;</i>
          <span>
            播放全部 <span className="sum">(共{totalCount}首)</span>
          </span>
        </div>
        {showCollect ? collect(collectCount) : null}
      </div>
      <SongItem>{songList(songs)}</SongItem>
    </SongList>
  )
})

export default memo(SongsList)
