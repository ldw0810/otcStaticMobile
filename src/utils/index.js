import languageDataList from '../locale'
import {hexSha1} from './sha1'
import store from '../store'
import {BigNumber} from 'bignumber.js'
import configure from '../../configure'

/**
 *修改页面标题
 * @param {string} [title] --> 默认为'OTCMAKER'
 * */
export const $title = function (title) {
  title = title || 'OTCMAKER'
  window.document.title = title
}

export const $getDateStr = function (value) {
  const getNumStr = (value) => {
    if (+value > 9) {
      return '' + value
    } else {
      return '0' + value
    }
  }
  const tempDate = new Date(value)
  return getNumStr(tempDate.getFullYear()) + '/' + getNumStr(tempDate.getMonth() + 1) + '/' + getNumStr(tempDate.getDate()) + ' ' + getNumStr(tempDate.getHours()) + ':' + getNumStr(tempDate.getMinutes()) + ':' + getNumStr(tempDate.getSeconds())
}

export const $getBrowser = function () {
  let browser = {}
  if (navigator.userAgent.indexOf('MSIE') > 0) {
    browser.name = 'MSIE'
    browser.ie = true
  } else if (navigator.userAgent.indexOf('Firefox') > 0) {
    browser.name = 'Firefox'
    browser.firefox = true
  } else if (navigator.userAgent.indexOf('Chrome') > 0) {
    browser.name = 'Chrome'
    browser.chrome = true
  } else if (navigator.userAgent.indexOf('Safari') > 0) {
    browser.name = 'Safari'
    browser.safari = true
  } else if (navigator.userAgent.indexOf('Opera') >= 0) {
    browser.name = 'Opera'
    browser.opera = true
  } else {
    browser.name = 'unknow'
  }
  return browser
}
/**
 *获取当前语言，从localStorage或配置中读取
 *
 * @return {string} --> like 'en-US', 'zh-CN', 'zh-TW', 'zh-HK'
 * */
export const $getLanguage = function () {
  const currentLanguage = localStorage.getItem('language')
  if (currentLanguage) {
    return currentLanguage
  } else {
    const navLang = navigator.language
    const langList = languageDataList.map((item) => {
      return item.language
    })
    const localLang = langList.indexOf(navLang) > -1 ? navLang : configure.DEFAULT_LANGUAGE
    localStorage.setItem('language', localLang)
    return localLang
  }
}

/**
 * 获取语言供接口使用(统一 'zh-TW' 与 'zh-HK'，非中文统一为 'en')
 * */
export const $getAxiosLanguage = function () {
  let ln = ''
  const currentLanguage = localStorage.getItem('language')
  if (currentLanguage) {
    ln = currentLanguage
  } else {
    const navLang = navigator.language
    const langList = languageDataList.map((item) => {
      return item.language
    })
    const localLang = langList.indexOf(navLang) > -1 ? navLang : configure.DEFAULT_LANGUAGE
    localStorage.setItem('language', localLang)
    ln = localLang
  }
  if (['zh-HK', 'zh-TW'].indexOf(ln) > -1) {
    ln = 'zh-TW'
  } else if (ln !== 'zh-CN') {
    ln = 'en'
  }
  return ln
}
/**
 * 获取语言在配置locale中的index坐标
 *
 * return {index} number
 * */
export const $getLanguageIndex = function () {
  let index = 0
  for (let i = 0; i < languageDataList.length; i++) {
    if (languageDataList[i].language === (localStorage.getItem('language') || configure.DEFAULT_LANGUAGE)) {
      index = i
    }
  }
  return index
}

export const uuid = function (len, radix) {
  let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  let uuid = []
  let i
  radix = radix || chars.length

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix]
  } else {
    // rfc4122, version 4 form
    let r

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16
        uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r]
      }
    }
  }

  return uuid.join('')
}

export const $getNicknameByHash = function (str) {
  return 'OTCMAKER_' + hexSha1(str + new Date().getTime())
}

/**
 * 使用bignumber来截取和显示小数
 *
 * **/
export const $fixDecimalAuto = function (value, currency) {
  if (currency) {
    if (store.state.code.payable.indexOf(currency) > -1) {
      return $fixDecimalsLegal(+value)
    } else {
      return $fixDecimalsBase(+value)
    }
  } else {
    return $fixDecimal(+value, 1)
  }
}

/**
 * 资产默认位数
 */
export const $fixDecimalsAsset = function (value) {
  if (+value < Math.pow(0.1, configure.CONF_DECIMAL_ASSET)) {
    return 0
  } else {
    return $fixDecimal(value, configure.CONF_DECIMAL_ASSET)
  }
}
/**
 * 数字币基本位数
 */
export const $fixDecimalsBase = function (value) {
  return $fixDecimal(value, configure.CONF_DECIMAL_BASE)
}
/**
 * 法币显示位数
 */
export const $fixDecimalsLegal = function (value) {
  return $fixDecimal(value, configure.CONF_DECIMAL_LEGAL)
}
/**
 * 设置bigNumber的全局参数
 */
export const $fixDecimalMax = function (value) {
  return $fixDecimal(value, configure.CONF_DECIMAL_MAX)
}
// BigNumber.config({ ROUNDING_MODE: BigNumber.ROUND_FLOOR });
export const $fixDecimal = function (value, limit) {
  return Number(BigNumber(value + '')
    .decimalPlaces(limit, BigNumber.ROUND_FLOOR)
    .toFixed(limit).toString())
}

/**
 * 加法（解决精度问题）
 */
export const $plus = function (...args) {
  if (args.length !== 2) {
    throw Error('Must set two params')
  }
  const bigNumber = new BigNumber(args[0])
  return bigNumber.plus(args[1])
}
/**
 * 减法（解决精度问题）
 */
export const $minus = function (...args) {
  if (args.length !== 2) {
    throw Error('Must set two params')
  }
  const bigNumber = new BigNumber(args[0])
  return bigNumber.minus(args[1])
}
/**
 * 乘法（解决精度问题）
 */
export const $multipliedBy = function (...args) {
  if (args.length !== 2) {
    throw Error('Must set two params')
  }
  const bigNumber = new BigNumber(args[0])
  return bigNumber.multipliedBy(args[1])
}
/**
 * 除法（解决精度问题）
 */
export const $dividedBy = function (...args) {
  if (args.length !== 2) {
    throw Error('Must set two params')
  }
  const bigNumber = new BigNumber(args[0])
  return bigNumber.dividedBy(args[1])
}

/**
 * 去除收尾字符串
 */
export function $trim (str, char, type) {
  if (char) {
    let reg = ''
    if (type === 'left') {
      reg = new RegExp('^\\' + char + '+', 'g')
      while (reg.test(str)) {
        str = str.replace(reg, '').trim()
      }
    } else if (type === 'right') {
      reg = new RegExp('\\' + char + '+$', 'g')
      while (reg.test(str)) {
        str = str.replace(reg, '').trim()
      }
    } else {
      reg = new RegExp('^\\' + char + '+|\\' + char + '+$', 'g')
      while (reg.test(str)) {
        str = str.replace(reg, '').trim()
      }
    }
    return str
  }
  return str.replace(/^\s+|\s+$/g, '')
}

/**
 *  光标后追加内容
 * */
export function $insertHtmlAtCaret (insertHtml) {
  let sel
  let range
  if (window.getSelection) {
    // IE9 and non-IE
    sel = window.getSelection()
    if (sel.getRangeAt && sel.rangeCount) {
      range = sel.getRangeAt(0)
      range.deleteContents()
      // Range.createContextualFragment() would be useful here but is
      // non-standard and not supported in all browsers (IE9, for one)
      let el = document.createElement('div')
      let rangeHtml = range.endContainer.innerHTML
      if (insertHtml === '<br>' && !(rangeHtml && rangeHtml.endsWith('<br>')) && (range.endContainer.wholeText || '').length === +range.endOffset) {
        el.innerHTML = insertHtml + insertHtml
      } else {
        el.innerHTML = insertHtml
      }
      let frag = document.createDocumentFragment()
      let node
      let lastNode
      while ((node = el.firstChild)) {
        lastNode = frag.appendChild(node)
      }
      range.insertNode(frag)
      // 如果是最后的字符并且回车换行，则需要2个<br>才能换行
      // Preserve the selection
      if (lastNode) {
        range = range.cloneRange()
        range.setStartAfter(lastNode)
        range.collapse(true)
        sel.removeAllRanges()
        sel.addRange(range)
      }
    }
  } else if (document.selection && document.selection.type !== 'Control') {
    // IE < 9
    document.selection.createRange().pasteHTML(insertHtml)
  }
}

/**
 * 记录光标位置
 * */
export function $saveSelection ($el) {
  if (window.getSelection && document.createRange) {
    let range = window.getSelection().getRangeAt(0)
    let preSelectionRange = range.cloneRange()
    preSelectionRange.selectNodeContents($el)
    preSelectionRange.setEnd(range.startContainer, range.startOffset)
    let start = preSelectionRange.toString().length
    return {
      start: start,
      end: start + range.toString().length
    }
  } else if (document.selection && document.body.createTextRange) {
    let selectedTextRange = document.selection.createRange()
    let preSelectionTextRange = document.body.createTextRange()
    preSelectionTextRange.moveToElementText($el)
    preSelectionTextRange.setEndPoint('EndToStart', selectedTextRange)
    let start = preSelectionTextRange.text.length
    return {
      start: start,
      end: start + selectedTextRange.text.length
    }
  }
}

/**
 * 返回光标位置
 * */
export function $restoreSelection ($el, savedSel) {
  if (window.getSelection && document.createRange) {
    let charIndex = 0
    let range = document.createRange()
    range.setStart($el, 0)
    range.collapse(true)
    let nodeStack = [$el]
    let node
    let foundStart = false
    let stop = false
    while (!stop && (node = nodeStack.pop())) {
      if (+node.nodeType === 3) {
        let nextCharIndex = charIndex + node.length
        if (!foundStart && savedSel.start >= charIndex && savedSel.start <= nextCharIndex) {
          range.setStart(node, savedSel.start - charIndex)
          foundStart = true
        }
        if (foundStart && savedSel.end >= charIndex && savedSel.end <= nextCharIndex) {
          range.setEnd(node, savedSel.end - charIndex)
          stop = true
        }
        charIndex = nextCharIndex
      } else {
        let i = node.childNodes.length
        while (i--) {
          nodeStack.push(node.childNodes[i])
        }
      }
    }
    let sel = window.getSelection()
    sel.removeAllRanges()
    sel.addRange(range)
  } else if (document.selection && document.body.createTextRange) {
    let textRange = document.body.createTextRange()
    textRange.moveToElementText($el)
    textRange.collapse(true)
    textRange.moveEnd('character', savedSel.end)
    textRange.moveStart('character', savedSel.start)
    textRange.select()
  }
}

export function $isJson (str) {
  if (typeof str === 'string') {
    try {
      let obj = JSON.parse(str)
      if (typeof obj === 'object' && obj) {
        return true
      } else {
        return false
      }
    } catch (e) {
      return false
    }
  }
  return false
}
