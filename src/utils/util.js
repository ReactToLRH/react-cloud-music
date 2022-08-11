export const debounce = (func, delay) => {
  let timer = null
  // eslint-disable-next-line func-names
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
      clearTimeout(timer)
    }, delay)
  }
}

// 处理数据，找出第一个没有歌名的排行榜的索引
export const filterIndex = rankList => {
  for (let i = 0; i < rankList.length - 1; i++) {
    if (rankList[i].tracks.length && !rankList[i + 1].tracks.length) {
      return i + 1
    }
  }
}

// 判断一个对象是否为空对象
export const isEmptyObject = obj => !obj || Object.keys(obj).length === 0

// 处理歌手列表拼接歌手名字
export const getName = list => {
  let str = ''
  list.map((item, index) => {
    str += index === 0 ? item.name : `/${item.name}`
    return item
  })
  return str
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
// 随机算法
export function shuffle(arr) {
  const newArr = []
  arr.forEach(item => {
    newArr.push(item)
  })
  for (let i = 0; i < newArr.length; i++) {
    const j = getRandomInt(0, i)
    const t = newArr[i]
    newArr[i] = newArr[j]
    newArr[j] = t
  }
  return newArr
}

// 找到当前的歌曲索引
export const findIndex = (song, list) => list.findIndex(item => song.id === item.id)

// 拼接出歌曲的url链接
export const getSongUrl = id => `https://music.163.com/song/media/outer/url?id=${id}.mp3`

// 转换歌曲播放时间
export const formatPlayTime = interval => {
  // eslint-disable-next-line no-bitwise,operator-assignment
  interval = interval | 0 // |0 表示向下取整
  // eslint-disable-next-line no-bitwise
  const minute = (interval / 60) | 0
  const second = (interval % 60).toString().padStart(2, '0')
  return `${minute}:${second}`
}

export const getTransitionEndName = dom => {
  const cssTransition = ['transition', 'webkitTransition']
  const transitionEnd = {
    transition: 'transitionend',
    webkitTransition: 'webkitTransitionEnd'
  }
  for (let i = 0; i < cssTransition.length; i++) {
    if (dom.style[cssTransition[i]] !== undefined) {
      return transitionEnd[cssTransition[i]]
    }
  }
  return undefined
}

// 给css3相关属性增加浏览器前缀，处理浏览器兼容性问题
const elementStyle = document.createElement('div').style
const vendor = (() => {
  // 首先通过transition属性判断是何种浏览器
  const transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransfrom',
    ms: 'msTransform',
    standard: 'Transform'
  }
  // eslint-disable-next-line no-restricted-syntax, guard-for-in
  for (const key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }
  return false
})()
export function prefixStyle(style) {
  if (vendor === false) {
    return false
  }
  if (vendor === 'standard') {
    return style
  }
  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}

export default {
  debounce,
  filterIndex,
  isEmptyObject
}
