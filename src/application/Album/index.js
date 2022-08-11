import React, { memo, useEffect, useCallback, useRef, useState } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import { useNavigate, useParams } from 'react-router'

import { CSSTransition } from 'react-transition-group'
import Header from '@/baseUI/Header'
import Scroll from '@/baseUI/Scroll'
import MusicNote from '@/baseUI/MusicNote'
import AlbumDetail from '@/components/AlbumDetail'
import { Container } from './style'

import { getAlbumDetailRequestAsync, changePullUpLoading } from './store'
import { isEmptyObject } from '@/utils/util'
import { HEADER_HEIGHT } from '@/config/const'
import globalStyle from '@/assets/styles/global-style'

const Album = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const params = useParams()

  const { id } = params

  const [showStatus, setShowStatus] = useState(true)
  const [title, setTitle] = useState('歌单')
  const [isMarquee, setIsMarquee] = useState(false)

  const headerRef = useRef()
  const musicNoteRef = useRef()

  const { currentAlbum, pullUpLoading } = useSelector(state => state.album, shallowEqual)

  useEffect(() => {
    dispatch(getAlbumDetailRequestAsync(id))
  }, [dispatch, id])

  const handleBack = useCallback(() => {
    setShowStatus(false)
  }, [])

  const handleScroll = useCallback(
    pos => {
      const minScrollY = -HEADER_HEIGHT
      const percent = Math.abs(pos.y / minScrollY)
      const headerDom = headerRef.current
      if (pos.y < minScrollY) {
        headerDom.style.backgroundColor = globalStyle['theme-color']
        headerDom.style.opacity = Math.min(1, (percent - 1) / 2)
        setTitle(currentAlbum && currentAlbum.name)
        setIsMarquee(true)
      } else {
        headerDom.style.backgroundColor = ''
        headerDom.style.opacity = 1
        setTitle('歌单')
        setIsMarquee(false)
      }
    },
    [currentAlbum]
  )

  const handlePullUp = () => {
    changePullUpLoading(true)
    changePullUpLoading(false)
  }

  const addMusicAnimation = (x, y) => {
    musicNoteRef.current.startAnimation({ x, y })
  }

  return (
    <CSSTransition
      in={showStatus}
      timeout={300}
      classNames="fly"
      appear
      unmountOnExit
      onExited={() => {
        navigate(-1)
      }}
    >
      <Container>
        <Header ref={headerRef} title={title} handleClick={handleBack} isMarquee={isMarquee} />
        {!isEmptyObject(currentAlbum) ? (
          <Scroll
            onScroll={handleScroll}
            pullUp={handlePullUp}
            pullUpLoading={pullUpLoading}
            bounceTop={false}
          >
            <AlbumDetail
              currentAlbum={currentAlbum}
              pullUpLoading={pullUpLoading}
              addMusicAnimation={addMusicAnimation}
            />
          </Scroll>
        ) : null}
        <MusicNote ref={musicNoteRef} />
      </Container>
    </CSSTransition>
  )
}

export default memo(Album)
