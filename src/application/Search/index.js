import React, { memo, useState, useEffect, useRef, useCallback } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import { useNavigate } from 'react-router'
import LazyLoad, { forceCheck } from 'react-lazyload'
import { CSSTransition } from 'react-transition-group'

import SearchBox from '@/baseUI/SearchBox'
import Scroll from '@/baseUI/Scroll'
import MusicNote from '@/baseUI/MusicNote'
import { Container, ShortcutWrapper, HotKey } from './style'
import { List, ListItem } from '../Singers/style'
import { SongItem } from '../Album/style'

import { getHotKeyWordsRequestAsync, getSuggestListAsync } from './store'
import { getSongDetailRequestAsync } from '../Player/store'

import { getName } from '@/utils/util'

const singerImg = require('./singer.png')
const musicImg = require('./music.png')

const Search = () => {
  const { hotList, suggestList, songsList } = useSelector(state => state.search, shallowEqual)
  const playList = useSelector(state => state.player.playList, shallowEqual)

  const [query, setQuery] = useState('')
  const [show, setShow] = useState(false)
  const musicNoteRef = useRef()

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    setShow(true)
    if (!hotList.length) dispatch(getHotKeyWordsRequestAsync())
  }, [])

  const renderHotKey = () => (
    <ul>
      {hotList.map(item => (
        <li className="item" key={item.first} onClick={() => setQuery(item.first)}>
          <span>{item.first}</span>
        </li>
      ))}
    </ul>
  )

  const handleQuery = q => {
    setQuery(q)
    if (!q) return
    dispatch(getSuggestListAsync(q))
  }

  const renderSingers = () => {
    const singers = suggestList.artists
    if (!singers || !singers.length) return
    return (
      <List>
        <h1 className="title">相关歌手</h1>
        {singers.map((item, index) => (
          <ListItem
            // eslint-disable-next-line react/no-array-index-key
            key={`${item.accountId}${index}`}
            onClick={() => navigate(`/singers/${item.id}`)}
          >
            <div className="img_wrapper">
              <LazyLoad
                placeholder={<img width="100%" height="100%" src={singerImg} alt="singer" />}
              >
                <img src={item.picUrl} width="100%" height="100%" alt="music" />
              </LazyLoad>
            </div>
            <span className="name">歌手: {item.name}</span>
          </ListItem>
        ))}
      </List>
    )
  }

  const renderAlbum = () => {
    const albums = suggestList.playlists
    if (!albums || !albums.length) return
    return (
      <List>
        <h1 className="title">相关歌单</h1>
        {albums.map((item, index) => (
          <ListItem
            // eslint-disable-next-line react/no-array-index-key
            key={`${item.accountId}${index}`}
            onClick={() => navigate(`/album/${item.id}`)}
          >
            <div className="img_wrapper">
              <LazyLoad placeholder={<img width="100%" height="100%" src={musicImg} alt="music" />}>
                <img src={item.coverImgUrl} width="100%" height="100%" alt="music" />
              </LazyLoad>
            </div>
            <span className="name">歌单: {item.name}</span>
          </ListItem>
        ))}
      </List>
    )
  }

  const onSelectSongItem = (e, id) => {
    dispatch(getSongDetailRequestAsync(id))
    musicNoteRef.current.startAnimation({ x: e.nativeEvent.clientX, y: e.nativeEvent.clientY })
  }

  const renderSongs = () => (
    <SongItem style={{ paddingLeft: '20px' }}>
      {songsList.map(item => (
        <li key={item.id} onClick={e => onSelectSongItem(e, item.id)}>
          <div className="info">
            <span>{item.name}</span>
            <span>
              {getName(item.artists)} - {item.album.name}
            </span>
          </div>
        </li>
      ))}
    </SongItem>
  )

  const searchBack = useCallback(() => {
    setShow(false)
  }, [])

  return (
    <CSSTransition
      in={show}
      timeout={300}
      appear
      classNames="fly"
      unmountOnExit
      onExited={() => navigate(-1)}
    >
      <Container play={playList.length}>
        <div className="search_box_wrapper">
          <SearchBox back={searchBack} newQuery={query} handleQuery={handleQuery} />
        </div>
        <ShortcutWrapper show={!query}>
          <Scroll>
            <div>
              <HotKey>
                <h1 className="title">热门搜索</h1>
                {renderHotKey()}
              </HotKey>
            </div>
          </Scroll>
        </ShortcutWrapper>
        {/* 下面为搜索结果 */}
        <ShortcutWrapper show={query}>
          <Scroll onScorll={forceCheck}>
            <div>
              {renderSingers()}
              {renderAlbum()}
              {renderSongs()}
            </div>
          </Scroll>
        </ShortcutWrapper>
        <MusicNote ref={musicNoteRef} />
      </Container>
    </CSSTransition>
  )
}

export default memo(Search)
