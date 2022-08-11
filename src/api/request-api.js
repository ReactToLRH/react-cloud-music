import request from './request'

export const getBannerRequest = (params, custom) =>
  request(
    {
      url: '/banner',
      method: 'get',
      params
    },
    custom
  )

export const getRecommendListRequest = (params, custom) =>
  request(
    {
      url: '/personalized',
      method: 'get',
      params
    },
    custom
  )

export const getHotSingerListRequest = (params, custom) =>
  request(
    {
      url: '/top/artists',
      method: 'get',
      params
    },
    custom
  )

export const getSingerListRequest = (params, custom) =>
  request(
    {
      url: '/artist/list',
      method: 'get',
      params
    },
    custom
  )

export const getRankListRequest = (params, custom) =>
  request(
    {
      url: '/toplist/detail',
      method: 'get',
      params
    },
    custom
  )

export const getAlbumDetailRequest = (params, custom) =>
  request(
    {
      url: '/playlist/detail',
      method: 'get',
      params
    },
    custom
  )

export const getSingerInfoRequest = (params, custom) =>
  request(
    {
      url: '/artists',
      method: 'get',
      params
    },
    custom
  )

export const getSongDetailRequest = (params, custom) =>
  request(
    {
      url: '/song/detail',
      method: 'get',
      params
    },
    custom
  )

export const getLyricRequest = (params, custom) =>
  request(
    {
      url: '/lyric',
      method: 'get',
      params
    },
    custom
  )

export const getHotKeyWordsRequest = (params, custom) =>
  request(
    {
      url: '/search/hot',
      method: 'get',
      params
    },
    custom
  )

export const getSuggestListRequest = (params, custom) =>
  request(
    {
      url: '/search/suggest',
      method: 'get',
      params
    },
    custom
  )

export const getResultSongsListRequest = (params, custom) =>
  request(
    {
      url: '/search',
      method: 'get',
      params
    },
    custom
  )
