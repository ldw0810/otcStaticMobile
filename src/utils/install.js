import {Indicator, Toast} from 'mint-ui'

export default {
  install (Vue, options) {
    /**
     *全局展示信息
     *
     * */
    Vue.prototype.$message = {
      success: (message) => Toast({
        message: message,
        position: 'bottom'
      }),
      error: (message) => Toast({
        message: message,
        iconClass: 'icon icon-error'
      }),
      warn: (message) => Toast({
        message: message,
        iconClass: 'icon icon-warn'
      })
    }
    /**
     *全局展示loading
     *
     * */
    Vue.prototype.$loading = {
      open: (message) => {
        Indicator.open({
          text: message,
          spinnerType: 'snake'
        })
      },
      close: () => {
        Indicator.close()
      }
    }
    String.prototype.format = function () {
      if (arguments.length === 0) {
        return this
      }
      let param = arguments[0]
      let s = this
      if (typeof param === 'object') {
        for (let key in param) {
          s = s.replace(new RegExp('\\{' + key + '\\}', 'g'), param[key])
        }
        return s
      } else {
        for (let i = 0; i < arguments.length; i++) {
          s = s.replace(new RegExp('\\{' + i + '\\}', 'g'), arguments[i])
        }
        return s
      }
    }
    Date.prototype.format = function (format) {
      let date = {
        'M+': this.getMonth() + 1,
        'd+': this.getDate(),
        'h+': this.getHours(),
        'm+': this.getMinutes(),
        's+': this.getSeconds(),
        'q+': Math.floor((this.getMonth() + 3) / 3),
        'S+': this.getMilliseconds()
      }
      if (/(y+)/i.test(format)) {
        format = format.replace(
          RegExp.$1,
          (this.getFullYear() + '').substr(4 - RegExp.$1.length)
        )
      }
      for (let k in date) {
        if (new RegExp('(' + k + ')').test(format)) {
          format = format.replace(
            RegExp.$1,
            RegExp.$1.length === 1
              ? date[k]
              : ('00' + date[k]).substr(('' + date[k]).length)
          )
        }
      }
      return format
    }
  }
}
