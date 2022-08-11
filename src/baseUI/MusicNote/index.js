import React, { memo, useEffect, useImperativeHandle, useRef, forwardRef } from 'react'
import styled from 'styled-components'

import globalStyle from '@/assets/styles/global-style'
import { prefixStyle } from '@/utils/util'

const Container = styled.div`
  .icon_wrapper {
    position: fixed;
    z-index: 1000;
    margin-top: -10px;
    margin-left: -10px;
    color: ${globalStyle['theme-color']};
    font-size: 14px;
    display: none;
    transition: transform 1s cubic-bezier(0.62, -0.1, 0.86, 0.57);
    transform: translate3d(0, 0, 0);
    > div {
      transition: transform 1s;
    }
  }
`

const MusicNote = forwardRef((props, ref) => {
  const iconsRef = useRef()

  const ICON_NUMBER = 10

  const transform = prefixStyle('transform')

  const createNode = txt => {
    const template = `<div class='icon_wrapper'>${txt}</div>`
    const tempNode = document.createElement('div')
    tempNode.innerHTML = template
    return tempNode.firstChild
  }

  useEffect(() => {
    for (let i = 0; i < ICON_NUMBER; i++) {
      const node = createNode(`<div class="iconfont">&#xe642;</div>`)
      iconsRef.current.appendChild(node)
    }
    // 类数组（不具备数组原型上所有的方法）转换成数组，当然也可以用 [...xxx] 解构语法或者 Array.from ()
    const domArray = [].slice.call(iconsRef.current.children)
    domArray.forEach(item => {
      item.running = false
      // transitionend 事件在 CSS 完成过渡后触发
      item.addEventListener(
        'transitionend',
        // eslint-disable-next-line func-names
        function () {
          // eslint-disable-next-line react/no-this-in-sfc
          this.style.display = 'none'
          // eslint-disable-next-line react/no-this-in-sfc
          this.style[transform] = `translate3d(0, 0, 0)`
          // eslint-disable-next-line react/no-this-in-sfc
          this.running = false

          // eslint-disable-next-line react/no-this-in-sfc
          const icon = this.querySelector('div')
          icon.style[transform] = `translate3d(0, 0, 0)`
        },
        false
      )
    })
  }, [])

  const startAnimation = ({ x, y }) => {
    for (let i = 0; i < ICON_NUMBER; i++) {
      const domArray = [].slice.call(iconsRef.current.children)
      const item = domArray[i]
      // 选择一个空闲的元素来开始动画
      if (item.running === false) {
        item.style.left = `${x}px`
        item.style.top = `${y}px`
        item.style.display = 'inline-block'
        // 元素（.icon_wrapper）由 display: none 转变为 display: inline-block 。
        // 元素显示需要经过 【浏览器的回流】 过程，无法立即显示，即：元素还是隐藏状态。元素的位置未知，transform 失效
        // 使用 setTimeout 本质是将动画逻辑放到下一次的宏任务中。
        // 事实上，当本次宏任务完成后，会触发 【浏览器 GUI 渲染线程】 的重绘工作，才执行下一次宏任务，则下一次红任务中元素就会显示，transform 便能生效
        setTimeout(() => {
          item.running = true
          item.style[transform] = `translate3d(0, 750px, 0)`
          const icon = item.querySelector('div')
          icon.style[transform] = `translate3d(-40px, 0, 0)`
        }, 20)
        break
      }
    }
  }

  useImperativeHandle(ref, () => ({
    startAnimation
  }))

  return <Container ref={iconsRef} />
})

export default memo(MusicNote)
