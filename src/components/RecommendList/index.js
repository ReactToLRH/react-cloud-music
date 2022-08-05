import React, { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import LazyLoad from 'react-lazyload'
import { ListWrapper, ListItem, List } from './style'

const recommendMusicDefaultPng = require('./music.png')

const RecommendList = props => {
  const navigate = useNavigate()

  const enterDetail = id => {
    navigate(`/recommend/${id}`)
  }

  return (
    <ListWrapper>
      <h1 className="title">推荐歌单</h1>
      <List>
        {props.recommendList.map(item => (
          <ListItem key={item.id} onClick={() => enterDetail(item.id)}>
            <div className="img_wrapper">
              <div className="decorate" />
              <LazyLoad
                placeholder={
                  <img width="100%" height="100%" src={recommendMusicDefaultPng} alt="music" />
                }
              >
                <img src={`${item.picUrl}?param=300x300`} width="100%" height="100%" alt="music" />
              </LazyLoad>
              <div className="play_count">
                <i className="iconfont play">&#xe885;</i>
                <span className="count">{Math.floor(item.playCount / 10000)}万</span>
              </div>
            </div>
            <div className="desc">{item.name}</div>
          </ListItem>
        ))}
      </List>
    </ListWrapper>
  )
}

export default memo(RecommendList)
