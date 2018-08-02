import languageDataList from '../locale'
import {hexSha1} from './sha1'
import store from '../store'
import {BigNumber} from 'bignumber.js'

const configure = require('../../configure')

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
  return $fixDecimal(value, configure.CONF_DECIMAL_ASSET)
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
// BigNumber.config({ ROUNDING_MODE: BigNumber.ROUND_FLOOR });
export const $fixDecimal = function (value, limit) {
  let tempLimit = +limit
  let tempValue = +value
  if (tempValue > 0) {
    while (tempValue < 0.1) {
      tempLimit += 1
      tempValue *= 10
    }
    while (tempValue >= 1000 && tempLimit >= 0) {
      tempLimit -= 1
      tempValue /= 10
    }
  } else if (tempValue === 0) {
    tempLimit = 0
  }
  return Number(BigNumber(value + '')
    .decimalPlaces(tempLimit, BigNumber.ROUND_FLOOR)
    .toFixed(tempLimit).toString())
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
 * @description 光标设置到节点的末尾
 * @param {element} 节点
 */
export function $setCursorPosition (el) {
  el.focus()
  const range = document.createRange()
  range.selectNodeContents(el)
  range.collapse(false)
  const sel = window.getSelection()
  sel.removeAllRanges()
  sel.addRange(range)
}
