import React, { memo, useEffect } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router'

import Scroll from '@/baseUI/Scroll'
import { List, ListItem, SongList, Container } from './style'

import { getRankListRequestAsync } from './store'
import { filterIndex } from '@/utils/util'

const Rank = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { rankList } = useSelector(state => state.rank, shallowEqual)

  useEffect(() => {
    if (!rankList.length) {
      dispatch(getRankListRequestAsync())
    }
  }, [dispatch])

  const enterDetail = detail => {
    navigate(`/rank/${detail.id}`)
  }

  const renderSongList = list =>
    list.length ? (
      <SongList>
        {list.map((item, index) => (
          <li key={item.first}>
            {index + 1}. {item.first} - {item.second}
          </li>
        ))}
      </SongList>
    ) : null

  const renderRankList = (list, global) => (
    <List globalRank={global}>
      {list.map(item => (
        <ListItem key={`${item.id}`} tracks={item.tracks} onClick={() => enterDetail(item)}>
          <div className="img_wrapper">
            <img src={item.coverImgUrl} alt="" />
            <div className="decorate" />
            <span className="update_frequecy">{item.updateFrequency}</span>
          </div>
          {renderSongList(item.tracks)}
        </ListItem>
      ))}
    </List>
  )

  const globalStartIndex = filterIndex(rankList)
  const officialList = rankList.slice(0, globalStartIndex)
  const globalList = rankList.slice(globalStartIndex)

  return (
    <Container>
      <Scroll>
        <div>
          <h1 className="offical">官方榜</h1>
          {renderRankList(officialList)}
          <h1 className="global">全球榜</h1>
          {renderRankList(globalList, true)}
        </div>
      </Scroll>
      <Outlet />
    </Container>
  )
}

export default memo(Rank)
