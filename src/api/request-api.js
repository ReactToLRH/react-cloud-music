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

export const getSingerListRequest = (params, custom) => {
  console.log('params: ', params)
  return request(
    {
      url: '/artist/list',
      method: 'get',
      params
    },
    custom
  )
}
