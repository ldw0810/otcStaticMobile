<template lang="pug">
  .chat(ref="chat")
    ul
      li(v-for="(chat, index) in msgList" :key="index" :class="{'an-move-right': +chat.type === 0, 'an-move-left': +chat.type === 1, 'an-move-center': +chat.type === 9}")
        p(class="time system" v-if="+chat.type === 9")
          span(v-html="$getDateStr(new Date(chat.time)) + '<br/>' + parseText(chat.data)")
        div(:class="'main' + (+chat.type < 4 ? ' self': '')" v-else)
          p(class="time" v-if="chat.timeFlag")
            span(v-text="$getDateStr(new Date(chat.time))")
          .avatar
            Avatar(:size='5' :status="order.member.online" :statusType="2")
          <!-- 状态 -->
          span(class='chat-status' v-show='chat.status !== 1')
            span(class='chat-loading' v-show='chat.status === 0')
            span(:title='$t("order.order_chat_send_msg_fail")' class='chat-error' v-show='chat.status === -1') !
          <!-- 图片 -->
          .text(class="imgText" v-if="+chat.type === 1 || +chat.type === 5")
            img(v-lazy="JSON.parse(chat.data).imgUrl" class="image" :alt="JSON.parse(chat.data).imgAlt" :preview="order.id" :preview-text="JSON.parse(chat.data).imgAlt")
            mt-progress(class="progress" :value="chat.percentage" :class="{'showPercentage100': chat.percentage >= 100}" v-if="chat.status >= 0 && (chat.percentage || chat.percentage === 0)")
          <!-- 文本 -->
          .text(v-html="parseText(chat.data)" v-if="+chat.type !== 1 && +chat.type !== 5")
</template>
<script type="es6">
import {VALI_CHAT} from '../../utils/validator'
import {$getDateStr, $isJson, $trim} from '../../utils'
import Avatar from '../common/avatar'
import {Button, Progress} from 'mint-ui'
import Vue from 'vue'
import 'vue-photo-preview/dist/skin.css'

Vue.component(Button.name, Button)
Vue.component(Progress.name, Progress)

export default {
  components: {
    Avatar
  },
  props: {
    order: {},
    msg: '',
    chatList: {
      type: Array
    },
    chatFlag: false,
    wrapBg: {
      type: String,
      default: '#fff'
    },
    readOnly: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      socket: null,
      inputText: '',
      minHeight: 700,
      msgList: this.chatList,
      inputFocusFlag: false,
      lastEditRange: null,
      chatTime: 0,
      timeout: 0
    }
  },
  watch: {
    inputFocusFlag (val) {
      if (!val) {
        this.inputText = this.setMaxLength(this.$refs.input.innerHTML)
      }
    }
  },
  computed: {
    axios_source_chat () {
      return this.$store.state.axiosCancel.chat
    }
  },
  methods: {
    $getDateStr (value) {
      return $getDateStr(value)
    },
    setMaxLength (str) {
      return str.substr(0, VALI_CHAT.max)
    },
    checkLengh ($event) {
      const $el = $event.target
      if ($el.innerHTML.length > VALI_CHAT.max) {
        $el.innerHTML = this.setMaxLength($el.innerHTML)
      }
    },
    scrollToBottom () {
      this.$nextTick(() => {
        if (this.$refs.chat) {
          this.$refs.chat.scrollTop = this.$refs.chat.scrollHeight
        }
      })
    },
    sendImageInfo (imgObj) {
      const tempTime = new Date()
      let compareTime = this.msgList.length ? this.msgList[this.msgList.length - 1].compareTime : 0
      let timeFlag = tempTime.getTime() - compareTime > 3 * 60 * 1000
      let msgData = {
        imgUrl: imgObj.url || require('../../assets/images/trade/image.png'),
        imgUid: imgObj.uid || '',
        imgAlt: imgObj.name || ''
      }
      let newMsg = {
        type: 1,
        data: JSON.stringify(msgData),
        imgUrl: msgData.imgUrl,
        imgAlt: msgData.imgAlt,
        time: $getDateStr(tempTime),
        compareTime: timeFlag ? tempTime.getTime() : compareTime,
        timeFlag: timeFlag,
        status: 0 // 0. 加载  1. 成功 -1 失败
      }
      let tempIndex = this.msgList.length
      this.$set(this.msgList, tempIndex, newMsg)
      this.scrollToBottom()
    },
    sendImage (imgObj) {
      if (imgObj.status === 'start') {
        this.sendImageInfo(imgObj)
      } else {
        let tempNum = 0
        for (let i = this.msgList.length - 1; i >= 0; i--) {
          if (this.msgList[i].data && (this.msgList[i].data.indexOf(imgObj.uid) > -1)) {
            let tempImg = new Image()
            tempImg.src = imgObj.url
            this.scrollToBottom()
            tempImg.onload = () => {
              this.msgList[i].data = this.msgList[i].data.replace(/("imgUrl":")(.*?)(")/gi, `$1${imgObj.url}$3`)
              if (imgObj.status === 'ready' || imgObj.status === 'uploading') {
                this.msgList[i].percentage = +imgObj.percentage
              } else if (imgObj.status === 'success') {
                this.msgList[i].percentage = 100
                this.msgList[i].status = 1
                this.sendMsg(this.msgList[i].data, i)
              } else if (imgObj.status === 'fail' || imgObj.status === 'error') {
                this.msgList[i].percentage = ''
                this.msgList[i].status = -1
              }
              // $set强制修改，防止不刷新数据
              this.$set(this.msgList, i, this.msgList[i])
              this.scrollToBottom()
            }
            break
          } else {
            tempNum++
          }
        }
        if (+tempNum === this.msgList.length) {
          this.sendMsg(this.msgList[this.msgList.length - 1].data, this.msgList.length - 1)
        }
      }
    },
    sendInfo (value) {
      value = value ? $trim($trim(('' + value).trim(), '<br>'), '&nbsp;', 'left').trim() : ''
      if (value) {
        // const inputInfo = this.htmlEncode(value.trim())
        const tempTime = new Date()
        this.$emit('sendSuccess', 1)
        let compareTime = this.msgList.length ? this.msgList[this.msgList.length - 1].compareTime : 0
        let timeFlag = tempTime.getTime() - compareTime > 3 * 60 * 1000
        let newMsg = {
          type: 0,
          data: value,
          time: $getDateStr(tempTime),
          compareTime: timeFlag ? tempTime.getTime() : compareTime,
          timeFlag: timeFlag,
          status: 0 // 0. 加载  1. 成功 -1 失败
        }
        let tempIndex = this.msgList.length
        this.$set(this.msgList, tempIndex, newMsg)
        this.scrollToBottom()
        this.sendMsg(value, tempIndex)
      } else {
        return false
      }
    },
    sendMsg (msg, index) {
      this.$store.dispatch('axios_send_msg', {
        order_id: this.order.id,
        to: this.order.member.member_id,
        msg: msg
      }).then(res => {
        if (res.data && +res.data.error === 0) {
          this.$nextTick(() => {
            this.msgList[index].status = 1
          })
        } else {
          this.$nextTick(() => {
            this.msgList[index].status = -1
          })
        }
      }).catch(() => {
        this.$nextTick(() => {
          this.msgList[index].status = -1
        })
      })
    },
    getMsg () {
      this.$store.dispatch('axios_chat', {
        order: this.order.id
      }).then(res => {
        let tempTime = new Date().getTime()
        if (res.data && +res.data.error === 0) {
          let compareTime = this.msgList.length ? this.msgList[this.msgList.length - 1].compareTime : 0
          let timeFlag = +res.data.from === 0 ? false : tempTime - compareTime > 3 * 60 * 1000
          let tempType = 0
          let tempParseMsg = {}
          if ($isJson(res.data.msg)) {
            tempParseMsg = JSON.parse(res.data.msg)
            if (res.data.from === 0) {
              tempType = 9
            } else {
              if (typeof tempParseMsg === 'object' && tempParseMsg.imgUrl) { // 图片
                if (res.data.to === this.order.member.member_id) {
                  tempType = 1
                } else {
                  tempType = 5
                }
              } else {
                if (res.data.to === this.order.member.member_id) {
                  tempType = 0
                } else {
                  tempType = 4
                }
              }
            }
          } else {
            if (+res.data.from === 0) {
              tempType = 9
            } else if (res.data.to === this.order.member.member_id) {
              tempType = 0
            } else {
              tempType = 4
            }
          }
          this.$set(this.msgList, this.msgList.length, {
            type: tempType,
            data: res.data.msg,
            imgUrl: [1, 5].indexOf(tempType) > -1 ? tempParseMsg.imgUrl : '',
            imgAlt: [1, 5].indexOf(tempType) > -1 ? tempParseMsg.imgAlt : '',
            time: $getDateStr(tempTime),
            compareTime: timeFlag ? tempTime : compareTime,
            timeFlag: timeFlag
          })
          this.scrollToBottom()
          if (+res.data.from === 0) {
            this.$emit('refresh', 1)
          }
          this.getMsg()
        } else if (res.data && +res.data.error === 100002) { // timeout
          this.getMsg()
        } else {
          if (res.data && +res.data.cancel === 1) {
          } else {
            this.timeout && clearTimeout(this.timeout)
            this.timeout = setTimeout(() => {
              this.getMsg()
            }, 60 * 1000)
          }
        }
      }).catch(() => {
        this.timeout && clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          this.getMsg()
        }, 60 * 1000)
      })
    },
    inputKey (event) {
      if (+event.keyCode === 13) {
        event.preventDefault()
        if (event.ctrlKey === true) {
          // ctrl + enter
          // this.showRange(document.createElement("br"));
          this.inputText = this.setMaxLength(this.$refs.input.innerText.trim())
        } else {
          this.inputText = this.setMaxLength(this.$refs.input.innerText.trim())
          this.sendInfo()
        }
      } else {
        // this.inputText = event.target.innerHTML;
      }
    },
    getRange () {
      // 获取选定对象
      let selection = getSelection()
      // 设置最后光标对象
      this.lastEditRange = selection.getRangeAt(0)
    },
    htmlEncode (str) {
      let ele = document.createElement('span')
      ele.appendChild(document.createTextNode(str))
      // 正则匹配所有的html tags，并删除
      return ele.innerHTML.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '')
    },
    // 解析
    htmlDecode (str) {
      let ele = document.createElement('span')
      ele.innerHTML = str
      return ele.textContent
    },
    doInit () {
      this.timeout && clearTimeout(this.timeout)
      this.msg && (this.msgList[this.msgList.length] = this.msg)
      this.getMsg()
    },
    parseText (text) {
      return this.parseBrow(this.parseImage(this.parseUrl(text)))
    },
    parseUrl (text) {
      let parseHttp = (str) => {
        if (str.startsWith('http://') || str.startsWith('https://') || str.startsWith('ftp://') || str.startsWith('news://')) {
          return str
        } else {
          return 'https://' + str
        }
      }
      let reg = /^((https?|ftp|news):\/\/)?([a-z]([a-z0-9-]*[.。])+([a-z]{2}|aero|arpa|biz|com|coop|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel)|(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]).){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))(\/[a-z0-9_\-.~]+)*(\/([a-z0-9_\-.]*)(\?[a-z0-9+_\-.%=&]*)?)?(#[a-z][a-z0-9_]*)?$/
      let newMsg = ''
      while (reg.exec(text)) {
        let pipeUrl = reg.exec(text)
        let newUrl = '<a href=' + parseHttp(pipeUrl[0]) + ' target=\'_blank\'>' + pipeUrl[0] + '</a>'
        let urlLength = pipeUrl[0].length
        let start = text.indexOf(pipeUrl[0])
        newMsg += text.substring(0, start) + newUrl
        text = text.substring(start + urlLength)
      }
      return newMsg + text
    },
    parseImage (text) {
      if (!text) {
        return text
      }
      text = text.replace(/(&lt;img)(.*?)(\/&gt;)/gi, '<img$2/>')
      return text
    },
    parseBrow (text, isNoGif) {
      const list = ['微笑', '撇嘴', '色', '发呆', '得意', '流泪', '害羞', '闭嘴', '睡', '大哭', '尴尬', '发怒', '调皮', '呲牙', '惊讶', '难过', '酷', '冷汗', '抓狂', '吐', '偷笑', '愉快', '白眼', '傲慢', '饥饿', '困', '惊恐', '流汗', '憨笑', '大兵', '奋斗', '咒骂', '疑问', '嘘', '晕', '折磨', '衰', '骷髅', '敲打', '再见', '擦汗', '抠鼻', '鼓掌', '糗大了', '坏笑', '左哼哼', '右哼哼', '哈欠', '鄙视', '委屈', '快哭了', '阴险', '亲亲', '吓', '可怜', '菜刀', '西瓜', '啤酒', '篮球', '乒乓', '咖啡', '饭', '猪头', '玫瑰', '凋谢', '示爱', '爱心', '心碎', '蛋糕', '闪电', '炸弹', '刀', '足球', '瓢虫', '便便', '月亮', '太阳', '礼物', '拥抱', '强', '弱', '握手', '胜利', '抱拳', '勾引', '拳头', '差劲', '爱你', 'NO', 'OK', '爱情', '飞吻', '跳跳', '发抖', '怄火', '转圈', '磕头', '回头', '跳绳', '挥手', '激动', '街舞', '献吻', '左太极', '右太极', '嘿哈', '捂脸', '奸笑', '机智', '皱眉', '耶', '红包', '鸡']
      if (!text) {
        return text
      }
      text = text.replace(/\[[\u4E00-\u9FA5a-zA-Z]{1,3}\]/gi, (word) => {
        let newWord = word.replace(/\[|\]/gi, '')
        let index = list.indexOf(newWord)
        let backgroundPositionX = -index * 24
        let imgHTML = ''
        if (index < 0) {
          return word
        }
        if (isNoGif) {
          if (index > 104) {
            return word
          }
          imgHTML = `<i class="static-emotion" style="background:url(https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/default218877.gif) ${backgroundPositionX}px 0;"></i>`
        } else {
          let path = index > 104 ? '/img' : 'https://res.wx.qq.com/mpres/htmledition/images/icon'
          imgHTML = `<img class="static-emotion-gif" style="vertical-align: middle" src="${path}/emotion/${index}.gif">`
        }
        return imgHTML
      })
      return text
    }
  },
  created () {
    this.doInit()
  },
  mounted () {
    this.scrollToBottom()
  },
  beforeDestroy () {
    this.axios_source_chat && this.axios_source_chat.cancel({cancel: 1})
    this.timeout && clearTimeout(this.timeout)
  }
}
</script>

<style lang="stylus" scoped>
  .chat-status {
    margin-right: 5px;
  }

  .chat-loading {
    width: 2.5vh;
    height: 2.5vh;
    display: inline-block;
    vertical-align: middle;
    animation: weuiLoading 1s steps(12, end) infinite;
    background: transparent url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHBhdGggZmlsbD0ibm9uZSIgZD0iTTAgMGgxMDB2MTAwSDB6Ii8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTlFOUU5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTMwKSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iIzk4OTY5NyIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgzMCAxMDUuOTggNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjOUI5OTlBIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDYwIDc1Ljk4IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0EzQTFBMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSg5MCA2NSA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNBQkE5QUEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoMTIwIDU4LjY2IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0IyQjJCMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgxNTAgNTQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjQkFCOEI5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDE4MCA1MCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDMkMwQzEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTE1MCA0NS45OCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDQkNCQ0IiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTEyMCA0MS4zNCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNEMkQyRDIiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTkwIDM1IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0RBREFEQSIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgtNjAgMjQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTJFMkUyIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKC0zMCAtNS45OCA2NSkiLz48L3N2Zz4=") no-repeat;
    background-size: 100%;
    &.weui-loading_transparent {
      background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMjAnIGhlaWdodD0nMTIwJyB2aWV3Qm94PScwIDAgMTAwIDEwMCc+PHBhdGggZmlsbD0nbm9uZScgZD0nTTAgMGgxMDB2MTAwSDB6Jy8+PHJlY3QgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyB3aWR0aD0nNycgaGVpZ2h0PScyMCcgeD0nNDYuNScgeT0nNDAnIGZpbGw9J3JnYmEoMjU1LDI1NSwyNTUsLjU2KScgcng9JzUnIHJ5PSc1JyB0cmFuc2Zvcm09J3RyYW5zbGF0ZSgwIC0zMCknLz48cmVjdCB3aWR0aD0nNycgaGVpZ2h0PScyMCcgeD0nNDYuNScgeT0nNDAnIGZpbGw9J3JnYmEoMjU1LDI1NSwyNTUsLjUpJyByeD0nNScgcnk9JzUnIHRyYW5zZm9ybT0ncm90YXRlKDMwIDEwNS45OCA2NSknLz48cmVjdCB3aWR0aD0nNycgaGVpZ2h0PScyMCcgeD0nNDYuNScgeT0nNDAnIGZpbGw9J3JnYmEoMjU1LDI1NSwyNTUsLjQzKScgcng9JzUnIHJ5PSc1JyB0cmFuc2Zvcm09J3JvdGF0ZSg2MCA3NS45OCA2NSknLz48cmVjdCB3aWR0aD0nNycgaGVpZ2h0PScyMCcgeD0nNDYuNScgeT0nNDAnIGZpbGw9J3JnYmEoMjU1LDI1NSwyNTUsLjM4KScgcng9JzUnIHJ5PSc1JyB0cmFuc2Zvcm09J3JvdGF0ZSg5MCA2NSA2NSknLz48cmVjdCB3aWR0aD0nNycgaGVpZ2h0PScyMCcgeD0nNDYuNScgeT0nNDAnIGZpbGw9J3JnYmEoMjU1LDI1NSwyNTUsLjMyKScgcng9JzUnIHJ5PSc1JyB0cmFuc2Zvcm09J3JvdGF0ZSgxMjAgNTguNjYgNjUpJy8+PHJlY3Qgd2lkdGg9JzcnIGhlaWdodD0nMjAnIHg9JzQ2LjUnIHk9JzQwJyBmaWxsPSdyZ2JhKDI1NSwyNTUsMjU1LC4yOCknIHJ4PSc1JyByeT0nNScgdHJhbnNmb3JtPSdyb3RhdGUoMTUwIDU0LjAyIDY1KScvPjxyZWN0IHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyB4PSc0Ni41JyB5PSc0MCcgZmlsbD0ncmdiYSgyNTUsMjU1LDI1NSwuMjUpJyByeD0nNScgcnk9JzUnIHRyYW5zZm9ybT0ncm90YXRlKDE4MCA1MCA2NSknLz48cmVjdCB3aWR0aD0nNycgaGVpZ2h0PScyMCcgeD0nNDYuNScgeT0nNDAnIGZpbGw9J3JnYmEoMjU1LDI1NSwyNTUsLjIpJyByeD0nNScgcnk9JzUnIHRyYW5zZm9ybT0ncm90YXRlKC0xNTAgNDUuOTggNjUpJy8+PHJlY3Qgd2lkdGg9JzcnIGhlaWdodD0nMjAnIHg9JzQ2LjUnIHk9JzQwJyBmaWxsPSdyZ2JhKDI1NSwyNTUsMjU1LC4xNyknIHJ4PSc1JyByeT0nNScgdHJhbnNmb3JtPSdyb3RhdGUoLTEyMCA0MS4zNCA2NSknLz48cmVjdCB3aWR0aD0nNycgaGVpZ2h0PScyMCcgeD0nNDYuNScgeT0nNDAnIGZpbGw9J3JnYmEoMjU1LDI1NSwyNTUsLjE0KScgcng9JzUnIHJ5PSc1JyB0cmFuc2Zvcm09J3JvdGF0ZSgtOTAgMzUgNjUpJy8+PHJlY3Qgd2lkdGg9JzcnIGhlaWdodD0nMjAnIHg9JzQ2LjUnIHk9JzQwJyBmaWxsPSdyZ2JhKDI1NSwyNTUsMjU1LC4xKScgcng9JzUnIHJ5PSc1JyB0cmFuc2Zvcm09J3JvdGF0ZSgtNjAgMjQuMDIgNjUpJy8+PHJlY3Qgd2lkdGg9JzcnIGhlaWdodD0nMjAnIHg9JzQ2LjUnIHk9JzQwJyBmaWxsPSdyZ2JhKDI1NSwyNTUsMjU1LC4wMyknIHJ4PSc1JyByeT0nNScgdHJhbnNmb3JtPSdyb3RhdGUoLTMwIC01Ljk4IDY1KScvPjwvc3ZnPgo=");
    }
  }

  .chat-error {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-color: #f76260;
    width: 2.5vh;
    height: 2.5vh;
    border-radius: 50%;
    color: #fff;
    font-size 0.8rem
    .ivu-icon-alert {
      color: #fff;
      transform-origin: center;
      transform: scale(0.8);
      font-size: 8px;
    }
  }

  @keyframes weuiLoading {
    0% {
      transform: rotate3d(0, 0, 1, 0deg);
    }

    100% {
      transform: rotate3d(0, 0, 1, 360deg);
    }
  }

  .publish {
    /*margin-top: 20px;*/
    &-action {
      display: flex;
      width: 100%;
      &-input {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        outline: 0;
        word-break: break-all;
        font-size: 14px;
        width: 692px;
        min-height: 40px;
        max-height: 120px;
        padding: 8px 12px;
        user-select: text;
        white-space: pre-wrap;
        text-align: left;
        background: #ffffff;
        border: 1px solid #dddddd;
        &[contenteditable="true"] {
          -webkit-user-modify: read-write-plaintext-only;
          &:empty:before {
            content: attr(placeholder);
            display: block;
            color: #ccc;
          }
          &:focus {
            &:before {
              display: none;
            }
          }
        }
      }
      &-button {
        width: 106px;
        margin-left: 10px;
      }
    }
  }

  .chat {
  }

  .shadow {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    height: 100%;
    background: #000;
    opacity: 0.2;
  }

  .window {
    width: 100vw
    background: #fafafa;
    /*border: 1px solid #eeeeee;*/
    /*box-shadow: inset 0 0 5px 0 rgba(0, 0, 0, 0.1);*/
    border-radius: 2px;
    margin: 0 auto;
    padding: 0;
    height: 100%;
    position: relative;
  }

  .w100 {
    width: 100%;
  }

  .mt5 {
    margin-top: 5px;
  }

  .mt10 {
    margin-top: 10px;
  }

  .mt20 {
    margin-top: 20px;
  }

  .mb10 {
    margin-bottom: 10px;
  }

  .mb20 {
    margin-bottom: 20px;
  }

  .fs0 {
    font-size: 0;
  }

  .title {
    background: #000;
    text-align: center;
    color: #fff;
    width: 100%;
    height: 50px;
    line-height: 50px;
    font-size: 14px;
  }

  .loading,
  .no-more {
    text-align: center;
    color: #b0b0b0;
    line-height: 100px;
  }

  .no-more {
    line-height: 60px;
  }

  .pull-right {
    float: right;
  }

  .link-line {
    text-decoration: underline;
  }

  .chat {
    padding: 1vh 1.5vw;
  }

  .chat li {
    margin-bottom: 1.5vh;
    left: 0;
    position: relative;
    display: block;
  }

  .chat .time {
    margin: 1vh 0;
    text-align: center;
  }

  .chat .avatar {
    float: left;
    margin: 0 2vw 0 0;
    border-radius: 3px;
  }

  .chat .time > span {
    display: inline-block;
    font-size: 0.9rem;
    font-weight normal
    color: #333333;
    letter-spacing: 0;
    margin-bottom: 1.5vh;
  }

  .chat .system > span {
    background: #eeeeee;
    border-radius: 2vw;
    font-size: 0.85rem;
    font-weight normal
    color: #666666;
    letter-spacing: 0;
    line-height: 1.5;
    max-width: 72vw;
    min-height: 5vh;
    padding: 1vh 2vw;
    margin-bottom: 1.5vh;
    text-align: center;
  }

  .chat {
    /deep/ .text {
      background-color: #fff;
      box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
      display: inline-block;
      position: relative;
      max-width: calc(50%);
      line-height: 2.1;
      font-size: 0.9rem;
      padding: 0.5vh 2vw;
      text-align: left;
      word-break: break-all;
      border-radius: 2vw;
      &:before {
        content: " ";
        position: absolute;
        width: 5px;
        height: 5px;
        transform: rotate(135deg);
        background-color: #fff;
        left: -2px;
        top: 12px;
        box-shadow: 2px 2px 5px 0 rgba(0, 0, 0, 0.1);
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: 0 0;
        vertical-align: middle;
      }
    }
    .imgText {
      padding: 1vh 2vw;
    }
  }

  .chat .self {
    text-align: right;
  }

  .chat .self .avatar {
    float: right;
    margin: 0 0 0 1.5vw;
  }

  .chat .self .text {
    background: #f6ffff;
  }

  .chat .self .text:before {
    left: auto;
    right: -2px;
    box-shadow: -2px -2px 5px 0 rgba(0, 0, 0, 0.1);
    background-color: #f6ffff;
  }

  .chat .image {
    max-width: 35vw;
    cursor zoom-in
  }

  .showPercentage100 {
    transition-delay .5s
    width 0 !important
    height 0 !important
    padding 0 !important
    margin 0 !important
  }

  /deep/ .progress {
    width 100%
    height 1.5vh
    padding 0.5vh 0
    .mt-progress-content {
      height 1vh
      .mt-progress-progress {
        background-image: linear-gradient(134deg, #0BBFD5 0%, #6DD7B2 100%);
      }
    }
  }

  /deep/ img.static-emotion-gif,
  /deep/ img.static-emotion {
    vertical-align: middle !important;
    width auto !important
    height auto !important
  }

  .an-move-left {
    left: 0;
    animation: moveLeft 0.7s ease;
    -webkit-animation: moveLeft 0.7s ease;
    overflow auto
  }

  .an-move-right {
    left: 0;
    animation: moveRight 0.7s ease;
    overflow auto
  }

  .an-move-center {
    left: 0;
    animation: moveCenter 0.5s ease;
    overflow auto
  }

  .bgnone {
    background: none;
  }

  @keyframes moveRight {
    0% {
      left: -20px;
      opacity: 0;
    }
    100% {
      left: 0;
      opacity: 1;
    }
  }

  @-webkit-keyframes moveRight {
    0% {
      left: -20px;
      opacity: 0;
    }

    100% {
      left: 0px;
      opacity: 1;
    }
  }

  @keyframes moveLeft {
    0% {
      left: 20px;
      opacity: 0;
    }

    100% {
      left: 0px;
      opacity: 1;
    }
  }

  @-webkit-keyframes moveLeft {
    0% {
      left: 20px;
      opacity: 0;
    }
    100% {
      left: 0px;
      opacity: 1;
    }
  }

  @keyframes moveCenter {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @-webkit-keyframes moveCenter {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }

  @media (max-width: 367px) {
    .fzDInfo {
      width: 82%;
    }
  }
</style>
