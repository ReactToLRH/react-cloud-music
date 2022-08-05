import axios from 'axios'
import { Toast, Modal } from 'antd-mobile'

const pendingMap = new Map()

const LoadingInstance = {
  _target: null,
  _count: 0
}

function request(defaultOptions, customOptions = {}, loadingOptions = {}) {
  const service = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    timeout: 10000
  })

  customOptions = {
    repeat_request_cancel: true, // 是否开启取消重复请求, 默认为 true
    loading: true, // 是否开启 loading 层效果, 默认为 false
    reduct_data_format: true, // 是否开启简洁的数据结构响应, 默认为true
    error_message_show: true, // 是否开启接口错误信息展示,默认为true
    code_message_show: false, // 是否开启 code 不为 0 时的信息提示, 默认为 false
    ...customOptions
  }

  service.interceptors.request.use(
    config => {
      removePending(config)
      !!customOptions.repeat_request_cancel && addPending(config)
      if (customOptions.loading) {
        LoadingInstance._count++
        if (LoadingInstance._count === 1) {
          LoadingInstance._target = Toast.show({
            icon: 'loading',
            content: '加载中…',
            duration: 0,
            ...loadingOptions
          })
        }
        return config
      }
    },
    error => Promise.reject(error)
  )

  // 响应拦截
  service.interceptors.response.use(
    response => {
      removePending(response.config)
      customOptions.loading && closeLoading(customOptions) // 关闭loading

      if (customOptions.code_message_show && response.data && response.data.code !== 0) {
        Modal.alert({
          content: response.data.message
        })
        return Promise.reject(response.data) // code不等于0, 页面具体逻辑就不执行了
      }

      return customOptions.reduct_data_format ? response.data : response
    },
    error => {
      error.config && removePending(error.config)
      customOptions.loading && closeLoading(customOptions) // 关闭loading
      customOptions.error_message_show && httpErrorStatusHandle(error) // 处理错误状态码
      return Promise.reject(error) // 错误继续返回给到具体页面
    }
  )
  return service(defaultOptions)
}

export default request

/* 处理异常 */
function httpErrorStatusHandle(error) {
  // 处理被取消的请求
  if (axios.isCancel(error)) return console.error(`请求的重复请求：${error.message}`)
  let message = ''
  if (error && error.response) {
    switch (error.response.status) {
      case 302:
        message = '接口重定向了！'
        break
      case 400:
        message = '参数不正确！'
        break
      case 401:
        message = '您未登录，或者登录已经超时，请先登录！'
        break
      case 403:
        message = '您没有权限操作！'
        break
      case 404:
        message = `请求地址出错: ${error.response.config.url}`
        break // 在正确域名下
      case 408:
        message = '请求超时！'
        break
      case 409:
        message = '系统已存在相同数据！'
        break
      case 500:
        message = '服务器内部错误！'
        break
      case 501:
        message = '服务未实现！'
        break
      case 502:
        message = '网关错误！'
        break
      case 503:
        message = '服务不可用！'
        break
      case 504:
        message = '服务暂时无法访问，请稍后再试！'
        break
      case 505:
        message = 'HTTP版本不受支持！'
        break
      default:
        message = '异常问题，请联系管理员！'
        break
    }
  }
  if (error.message.includes('timeout')) message = '网络请求超时！'
  if (error.message.includes('Network'))
    message = window.navigator.onLine ? '服务端异常！' : '您断网了！'

  Modal.alert({
    content: message
  })
}

// 关闭Loading层实例
function closeLoading(_options) {
  if (_options.loading && LoadingInstance._count > 0) LoadingInstance._count--
  if (LoadingInstance._count === 0) {
    LoadingInstance._target.close()
    LoadingInstance._target = null
  }
}

// 储存每个请求的唯一cancel回调, 以此为标识
function addPending(config) {
  const pendingKey = getPendingKey(config)
  config.cancelToken =
    config.cancelToken ||
    new axios.CancelToken(cancel => {
      if (!pendingMap.has(pendingKey)) {
        pendingMap.set(pendingKey, cancel)
      }
    })
}

// 删除重复的请求
function removePending(config) {
  const pendingKey = getPendingKey(config)
  if (pendingMap.has(pendingKey)) {
    const cancelToken = pendingMap.get(pendingKey)
    cancelToken(pendingKey) // 用于在控制台中打印出被取消了的请求的信息，这能更好的帮助开发者定位那些请求是会造成重复请求的。
    pendingMap.delete(pendingKey)
  }
}

// 生成唯一的每个请求的唯一 key
function getPendingKey(config) {
  const { url, method, params } = config
  let { data } = config
  if (typeof data === 'string') data = JSON.parse(data) // response里面返回的config.data是个字符串对象
  return [url, method, JSON.stringify(params), JSON.stringify(data)].join('&')
}
