import languageDataList from '../locale'
import indexOf from 'lodash'
import {hexSha1} from './sha1'
const configure = require('../../configure')

/**
 *修改页面标题
 * @param {string} [title] --> 默认为'OTCMAKER'
 * */
export function $title (title) {
  title = title || 'OTCMAKER'
  window.document.title = title
}

/**
 *获取当前语言，从localStorage或配置中读取
 *
 * @return {string} --> like 'en-US', 'zh-CN', 'zh-TW', 'zh-HK'
 * */
export function $getLanguage (title) {
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
export function $getAxiosLanguage () {
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
  if (indexOf(['zh-HK', 'zh-TW'], ln) > -1) {
    ln = 'zh-TW'
  } else if (ln !== 'zh-CN') {
    ln = 'en'
  }
  return ln
}

export function $getNicknameByHash (str) {
  return 'OTCMAKER_' + hexSha1(str + new Date().getTime())
}
