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
