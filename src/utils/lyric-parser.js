/**
 * version:1.0.0
 * 传入歌词，按照正则表达式解析
 * 解析的数据结构为：
 * {
 *   txt:歌词，
 *   time:ms
 * }
 */
// eslint-disable-next-line unicorn/better-regex, no-useless-escape
const timeExp = /\[(\d{2,}):(\d{2})(?:[\.\:](\d{2,3}))?]/g

const STATE_PAUSE = 0
const STATE_PLAYING = 1

const tagRegMap = {
  title: 'ti',
  artist: 'ar',
  album: 'al',
  offset: 'offset',
  by: 'by'
}

function noop() {}

export default class Lyric {
  constructor(lrc, hanlder = noop, speed = 1) {
    this.lrc = lrc
    this.tags = {}
    this.lines = [] // 歌词解析后的数组，每一项包含对应的歌词和时间
    this.handler = hanlder // 回调函数
    this.state = STATE_PAUSE // 播放状态
    this.curLineIndex = 0 // 当前播放歌词所在的行数
    this.speed = speed
    this.offset = 0

    this._init()
  }

  _init() {
    this._initTag()
    this._initLines()
  }

  _initTag() {
    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const tag in tagRegMap) {
      const matches = this.lrc.match(new RegExp(`\\[${tagRegMap[tag]}:([^\\]]*)]`, 'i'))
      this.tags[tag] = matches && (matches[1] || '')
    }
  }

  _initLines() {
    const lines = this.lrc.split('\n')
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i] // 如 "[00:01.997] 作词：薛之谦"
      const result = timeExp.exec(line)
      if (result) {
        const txt = line.replace(timeExp, '').trim() // 去除时间戳，保留歌词文本
        if (txt) {
          if (result[3].length === 3) {
            result[3] /= 10 // [00:01.997] 中匹配到的 997 就会被切成 99
          }
          this.lines.push({
            time: result[1] * 60 * 1000 + result[2] * 1000 + (result[3] || 0) * 10,
            txt
          })
        }
      }
    }

    this.lines.sort((a, b) => a.time - b.time) // 根据时间排序
  }

  _findcurLineIndex(time) {
    for (let i = 0; i < this.lines.length; i++) {
      if (time <= this.lines[i].time) {
        return i
      }
    }
    return this.lines.length - 1
  }

  _callHandler(i) {
    if (i < 0) {
      return
    }
    this.handler({
      txt: this.lines[i].txt,
      lineNum: i
    })
  }

  // isSeek 标志位表示用户是否手动调整进度
  _playRest(isSeek = false) {
    const line = this.lines[this.curLineIndex]
    let delay
    if (isSeek) {
      delay = line.time - (+new Date() - this.startStamp)
    } else {
      // 获取上一行的歌词开始时间，计算间隔
      const preTime = this.lines[this.curLineIndex - 1] ? this.lines[this.curLineIndex - 1].time : 0
      delay = line.time - preTime
    }
    this.timer = setTimeout(() => {
      this._callHandler(this.curLineIndex++)
      if (this.curLineIndex < this.lines.length && this.state === STATE_PLAYING) {
        this._playRest()
      }
    }, delay / this.speed)
  }

  changeSpeed(speed) {
    this.speed = speed
  }

  // offset 为时间进度，isSeek 标志位表示用户是否手动调整进度
  play(offset = 0, isSeek = false) {
    if (!this.lines.length) {
      return
    }
    this.state = STATE_PLAYING

    // 当前所在的行
    this.curLineIndex = this._findcurLineIndex(offset)
    // 现在正处于第 this.curLineIndex-1 行
    // 立即定位，方式是调用传来的回调函数，并把当前歌词信息传给它
    this._callHandler(this.curLineIndex - 1)
    this.offset = offset
    // 根据时间进度判断歌曲开始的时间戳
    this.startStamp = +new Date() - offset

    if (this.curLineIndex < this.lines.length) {
      clearTimeout(this.timer)
      // 继续播放
      this._playRest(isSeek)
    }
  }

  togglePlay(offset) {
    if (this.state === STATE_PLAYING) {
      this.stop()
      this.offset = offset
    } else {
      this.state = STATE_PLAYING
      this.play(offset, true)
    }
  }

  stop() {
    this.state = STATE_PAUSE
    this.offset = 0
    clearTimeout(this.timer)
  }

  seek(offset) {
    this.play(offset, true)
  }
}
