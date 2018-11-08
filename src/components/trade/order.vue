<template lang="pug">
  .order(@click="orderClick")
    mt-header(id="header" :title="$t('order.order_detail')")
      router-link(to="/orderList" slot="left")
        mt-button(icon="back")
      .rules(slot="right" @click="showRulesFlag = true") {{$t('order.order_trade_notice')}}
    .content(v-if="order.id" id="content")
      .border
      .info(class="showInfo")
        .list
          .item
            .label {{$t('order.order_id')}}:
            .text {{order.id}}
          .item
            .label {{$t('order.order_money_amount')}}:
            .text {{order.price_sum | $fixDecimalAuto(order.target_currency)}} {{order.target_currency.toUpperCase()}}
          .item(v-if="triggerInfoFlag")
            .label {{$t('order.order_order_price')}}:
            .text {{order.price | $fixDecimalAuto(order.currency)}} {{order.target_currency.toUpperCase() + '/' + order.currency.toUpperCase()}}
          .item(v-if="triggerInfoFlag")
            .label {{orderType === 0 ? $t('order.order_buy_number_title') : $t('order.order_sell_number_title')}}:
            .text {{order.amount | $fixDecimalAuto(order.currency)}} {{order.currency.toUpperCase()}}
          .item(v-if="triggerInfoFlag")
            .label {{$t('order.order_order_payment')}}:
            .text {{order.pay_kind ? $t('public.' + order.pay_kind) : ''}}
          .btn(@click="triggerInfo") {{triggerInfoFlag ? $t('order.order_hide_detail') : $t('order.order_show_detail')}}
        .border(v-if="triggerInfoFlag")
        .remark(v-if="triggerInfoFlag")
          .label {{$t('ad.ad_remark')}}:
          .text {{order.remark}}
      .border
      .oper
        .tip(v-if="stepTip" v-html="stepTip")
        .submit(class="mintSubmit" v-if="order.status === 'timeout'")
          mt-button(disabled) {{$t('order.order_deal_timeout')}}
        .submit(class="mintSubmit" v-else-if="['cancel', 'judge_seller'].indexOf(order.status) > -1")
          mt-button(disabled) {{$t('order.order_deal_cancel')}}
        .submit(class="mintSubmit" v-else-if="order.status === 'over'")
          mt-button(disabled) {{$t('order.order_deal_complete')}}
        .submit(class="orderSubmit" v-else-if="order.status === 'fresh' && !orderType")
          mt-button(class="orderSubmitBtn" @click="orderOper('pay')") {{$t('order.order_pay_complete')}}
          mt-button(class="orderCancelBtn" @click="orderOper('cancel')") {{$t('order.order_pay_cancel')}}
        .submit(class="orderSubmit" v-else-if="order.status === 'pay' && !orderType")
          mt-button(class="orderSubmitBtn" disabled) {{$t('order.order_pay_completed')}}
          mt-button(class="orderCancelBtn" disabled) {{$t('order.order_pay_cancel')}}
        .submit(class="mintSubmit" v-else-if="order.status === 'fresh' && orderType")
          mt-button(@click="orderOper('release')" disabled) {{$t('order.order_pay_release')}}
        .submit(class="mintSubmit" v-else-if="order.status === 'pay' && orderType")
          mt-button(@click="orderOper('release')") {{$t('order.order_pay_release')}}
        .submit(class="orderSubmit" v-else-if="order.status === 'release' || (order.status === 'sell_eval' && !orderType) || (order.status === 'buy_eval' && orderType)")
          .radioDiv
            .radio(:class="{'radioChecked': evaluateIndex === 0}" @click="evaluateIndex = 0")
            .radioText {{$t('order.order_pay_evaluate_good')}}
            .radio(class="rightRadio" :class="{'radioChecked': evaluateIndex === 1}" @click="evaluateIndex = 1")
            .radioText  {{$t('order.order_pay_evaluate_bad')}}
          mt-button(class="orderSubmitBtn" @click="orderOper('evaluate')") {{$t('order.order_eval')}}
        .submit(class="mintSubmit" v-else)
          mt-button(disabled) {{$t('order.order_status_over')}}
      Chat(class="chatWrapper" ref="chat" :contact="{id: order.member.member_id, name: order.member.nickname}" :order="order" :chatList="chatList" :msg="chatMessage" :chatFlag="chatFlag" @refresh="getOrderInterval" @sendSuccess="sendSuccess")
    .footer(v-if="order.id" id="footer")
      .oper
        .footerInputWrapper
          #footerInput(contenteditable="true" :placeholder="$t('order.order_chat_placeholder')" :tabIndex="2" @input="changeInputValue" @paste="pasteInputValue" @keydown.enter="doInputKeyEnter" @focus="doInputFocusEvent" @blur="doInputFocusEvent")
          .sendBtn(@click="sendInfo")
        el-upload(class="uploader" ref="upload" :headers="{Authorization: userToken}" action="/api/v1/common/up_img.json" :show-upload-list="false" :on-success="uploadSuccess" :on-error="uploadError" :before-upload="uploadBefore" :on-progress="showUploadProgress")
          .uploadImage(@click="submitUpload")
        .browImage(@click.prevent.stop="triggerBrow")
          img(:src="browImage")
      transition(name="bottom" mode="out-in")
        mt-swipe(class="browPage" :auto="0" :continuous="false" v-if="browFlag" @click.native.stop="browPageClick")
          mt-swipe-item(v-for="browPage in browPageTotal" :key="browPage")
            .browList
              .line(v-for="line in browLine" :key="line")
                .row(v-for="row in browRow" :key="row")
                  .brow(@click="insertBrow(browPage, line, row)")
                    img(class="static-emotion-gif" style="vertical-align: middle" :src="getBrowImageSrc(browPage, line, row)" v-if="((browPage - 1) * browLine * browRow + (line - 1) * browRow + (row - 1)) < browList.length")
    transition-group(tag="div" name="slide-right")
      .popup(class="popup-right" v-if="confirmFlag.cancel" :key="1")
        slot
          OrderCancelConfirm(@close="confirmFlag.cancel = false" @success="doOper('cancel')")
      .popup(class="popup-right" v-if="confirmFlag.pay" :key="2")
        slot
          OrderPayConfirm(@close="confirmFlag.pay = false" @success="doPay")
      .popup(class="popup-right" v-if="confirmFlag.release" :key="3")
        slot
          OrderReleaseConfirm(:order="order" @close="confirmFlag.release = false" @success="doRelease")
      .popup(class="popup-right" v-if="confirmFlag.complete" :key="4")
        slot
          OrderCompleteConfirm(:order="order" @close="confirmFlag.complete = false" @success="doOper('complete')")
      .popup(class="popup-right" v-if="showRulesFlag" :key="5")
        slot
          Rules(@close="showRulesFlag = false" @success="init")
      .popup(class="popup-right" v-if="confirmFlag.authPhone" :key="6")
        slot
          ValidPhone(:needAuth="false" @close="confirmFlag.authPhone = false" @success="doAuthClose" @change="changeValidate(0)")
      .popup(class="popup-right" v-if="confirmFlag.authGoogle" :key="7")
        slot
          ValidGoogle(:needAuth="false" @close="confirmFlag.authGoogle = false" @success="doAuthClose" @change="changeValidate(1)")
</template>
<script type="es6">
import Vue from 'vue'
import Avatar from '../common/avatar'
import EmptyList from '../common/emptyList'
import Rules from '../policy/rules'
import {Upload} from 'element-ui'
import {Button, Field, Header, Swipe, SwipeItem} from 'mint-ui'
import OrderPayConfirm from './orderPayConfirm'
import OrderReleaseConfirm from './orderReleaseConfrim'
import OrderCancelConfirm from './orderCancelConfirm'
import OrderCompleteConfirm from './orderCompleteConfrim'
import Chat from './chat'
import ValidPhone from '../common/validPhone'
import ValidGoogle from '../common/validGoogle'
import {$insertHtmlAtCaret, $restoreSelection, $saveSelection} from '../../utils'

Vue.component(Upload.name, Upload)
Vue.component(Header.name, Header)
Vue.component(Button.name, Button)
Vue.component(Field.name, Field)
Vue.component(Swipe.name, Swipe)
Vue.component(SwipeItem.name, SwipeItem)

export default {
  name: 'order',
  components: {
    OrderCompleteConfirm,
    OrderCancelConfirm,
    OrderReleaseConfirm,
    OrderPayConfirm,
    Avatar,
    EmptyList,
    Rules,
    Chat,
    ValidPhone,
    ValidGoogle
  },
  data () {
    return {
      stepList: [],
      stepTip: '',
      order: {},
      chat: [],
      confirmFlag: {
        pay: false,
        release: false,
        cancel: false,
        complete: false,
        authGoogle: false,
        authPhone: false
      },
      triggerInfoFlag: true,
      triggerInfoTimer: 0,
      triggerInfoHeight: 0,
      triggerInfoMinHeight: 10,
      showRulesFlag: false,
      evaluateIndex: -1,
      chatFlag: false,
      chatMessage: '',
      remainTime: 0,
      timer: 0,
      orderTimer: 0,
      remark: '',
      password: '',
      inputValue: '',
      inputSelection: {},
      browList: ['微笑', '撇嘴', '色', '发呆', '得意', '流泪', '害羞', '闭嘴', '睡', '大哭', '尴尬', '发怒', '调皮', '呲牙', '惊讶', '难过', '酷', '冷汗', '抓狂', '吐', '偷笑', '愉快', '白眼', '傲慢', '饥饿', '困', '惊恐', '流汗', '憨笑', '大兵', '奋斗', '咒骂', '疑问', '嘘', '晕', '折磨', '衰', '骷髅', '敲打', '再见', '擦汗', '抠鼻', '鼓掌', '糗大了', '坏笑', '左哼哼', '右哼哼', '哈欠', '鄙视', '委屈', '快哭了', '阴险', '亲亲', '吓', '可怜', '菜刀', '西瓜', '啤酒', '篮球', '乒乓', '咖啡', '饭', '猪头', '玫瑰', '凋谢', '示爱', '爱心', '心碎', '蛋糕', '闪电', '炸弹', '刀', '足球', '瓢虫', '便便', '月亮', '太阳', '礼物', '拥抱', '强', '弱', '握手', '胜利', '抱拳', '勾引', '拳头', '差劲', '爱你', 'NO', 'OK', '爱情', '飞吻', '跳跳', '发抖', '怄火', '转圈', '磕头', '回头', '跳绳', '挥手', '激动', '街舞', '献吻', '左太极', '右太极'],
      browCurrentPage: 1,
      browLine: 3,
      browRow: 9,
      browFlag: false,
      uploadFlag: false,
      uploadImageUrl: '',
      uploadFile: ''
    }
  },
  watch: {
    $route: function () {
      this.init()
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.userInfo
    },
    userToken () {
      return this.$store.state.userToken
    },
    orderType () {
      return this.order.op_type === 'buy' ? 0 : 1
    },
    id () {
      return this.$route.query.id
    },
    chatList () {
      let tempList = []
      let tempTime = 0
      if (this.chat.length) {
        for (let i = this.chat.length - 1; i >= 0; i--) {
          let timeFlag = +this.chat[i].from === 0 ? false : +this.chat[i].created_at * 1000 - tempTime > 3 * 60 * 1000
          tempTime = timeFlag ? +this.chat[i].created_at * 1000 : tempTime
          let tempType = 0
          let tempParseMsg = {}
          try {
            tempParseMsg = JSON.parse(this.chat[i].msg)
          } catch (e) {
          }
          if (+this.chat[i].from === 0) {
            tempType = 9
          } else {
            if (typeof tempParseMsg === 'object' && tempParseMsg.imgUrl) { // 图片
              if (this.chat[i].to === this.order.member.member_id) {
                tempType = 1
              } else {
                tempType = 5
              }
            } else {
              if (this.chat[i].to === this.order.member.member_id) {
                tempType = 0
              } else {
                tempType = 4
              }
            }
          }
          tempList[this.chat.length - (i + 1)] = {
            type: tempType,
            data: this.chat[i].msg,
            imgUrl: [1, 5].indexOf(tempType) > -1 ? tempParseMsg.imgUrl : '',
            imgAlt: [1, 5].indexOf(tempType) > -1 ? tempParseMsg.imgAlt : '',
            time: +this.chat[i].created_at * 1000,
            compareTime: tempTime,
            timeFlag: timeFlag
          }
        }
      }
      return tempList
    },
    browImage () {
      return this.browFlag ? require('../../assets/images/trade/ShapeFocus.png') : require('../../assets/images/trade/Shape.png')
    },
    uploadData () {
      return {
        upload_file: this.uploadFile
      }
    },
    browPageTotal () {
      return Math.ceil(this.browList.length / (this.browLine * this.browRow))
    }
  },
  methods: {
    triggerInfo () {
      // let chatScrollTop = this.$refs.chat.$el.scrollTop
      this.triggerInfoFlag = !this.triggerInfoFlag
      // this.$nextTick(() => {
      //   this.$refs.chat.$el.scrollTop = chatScrollTop
      // })
    },
    triggerBrow () {
      this.browFlag = !this.browFlag
    },
    getBrowImageSrc (page, line, row) {
      let index = (page - 1) * this.browLine * this.browRow + (line - 1) * this.browRow + (row - 1)
      let path = index > 104 ? '/img' : 'https://res.wx.qq.com/mpres/htmledition/images/icon'
      return `${path}/emotion/${index}.gif`
    },
    doInputFocusEvent (event) {
      if (event.type === 'focus') {
        this.restoreSelection()
      } else if (event.type === 'blur') {
        this.saveSelection()
      }
    },
    saveSelection () {
      this.inputSelection = $saveSelection(document.getElementById('footerInput'))
    },
    restoreSelection (section) {
      section = section || this.inputSelection
      return $restoreSelection(document.getElementById('footerInput'), section)
    },
    changeValidate (value) {
      if (+value === 0) {
        this.confirmFlag.authPhone = false
        this.confirmFlag.authGoogle = true
      } else {
        this.confirmFlag.authGoogle = false
        this.confirmFlag.authPhone = true
      }
    },
    doInputKeyEnter (event) {
      let key = event.keyCode || event.charCode
      if (+key === 13) {
        if (event.preventDefault) {
          event.preventDefault()
        } else {
          event.returnValue = false
        }
        let footerInput = document.getElementById('footerInput')
        let tempTop = footerInput.scrollTop
        $insertHtmlAtCaret('<br>')
        footerInput.scrollTop = tempTop + 26
        this.inputValue = footerInput.innerHTML
      }
    },
    changeInputValue (event) {
      this.saveSelection()
      this.inputValue = event.target.innerHTML
      this.restoreSelection()
    },
    escapeHtml (str) {
      let arrEntities = {'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"'}
      return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, (all, t) => {
        return arrEntities[t]
      })
    },
    pasteInputValue (event) {
      event.preventDefault()
      if (!(event.clipboardData && event.clipboardData.items)) {
        return
      }
      let isImage = false
      let clipData = ''
      for (let i = 0, len = event.clipboardData.items.length; i < len; i++) {
        let item = event.clipboardData.items[i]
        if (item.kind === 'string' && item.type === 'text/plain') { // 文字
          clipData = event.clipboardData.getData('text/plain')
        } else if (item.kind === 'file') { // 图片
          isImage = true
          let clipDataList = this.escapeHtml(event.clipboardData.getData('text/html')).match(/<img.*?>/g)
          if (clipDataList.length) {
            clipData = clipDataList[0]
          } else {
            clipData = ''
          }
        }
      }
      if (clipData !== '') {
        if (!isImage) {
          document.execCommand('insertText', false, clipData)
        } else {
          document.execCommand('insertText', false, clipData)
        }
      }
    },
    browPageClick () {
      this.browFlag = true
    },
    orderClick () {
      this.browFlag = false
    },
    submitUpload () {
      this.uploadFlag = true
      this.$refs.upload.submit()
    },
    uploadSuccess (res, file) {
      if (+res.error === 0 && res.data) {
        this.uploadFlag = false
        this.uploadFile = ''
        this.uploadImageUrl = res.data
        this.$refs.chat.sendImage({
          status: 'success',
          name: file.name,
          url: res.data,
          uid: file.uid
        })
      } else {
        this.$refs.chat.sendImage({
          status: file.status,
          name: file.name,
          url: file.url || '',
          uid: file.uid
        })
      }
    },
    uploadError (res, file) {
      this.uploadFlag = false
      this.uploadFile = ''
      this.$refs.chat.sendImage({
        status: file.status,
        name: file.name,
        url: file.url || '',
        uid: file.uid
      })
    },
    showUploadProgress (event, file) {
      this.$refs.chat.sendImage({
        name: file.name,
        url: file.url || '',
        status: file.status || '',
        percentage: +file.percentage,
        uid: file.uid
      })
    },
    uploadBefore (file) {
      let isImage = false
      const isLt = file.size / 1024 / 1024 < 2
      let imageTypeList = ['bmp', 'jpg', 'jpeg', 'png', 'svg', 'bmp', 'gif']
      if (file.type) {
        for (let i = 0; i < imageTypeList.length; i++) {
          if (file.type.indexOf(imageTypeList[i]) > -1) {
            isImage = true
            break
          }
        }
      }
      if (!isImage) {
        this.$message.error(this.$t('order.order_upload_is_image'))
      }
      if (!isLt) {
        this.$message.error(this.$t('order.order_upload_limit'))
      }
      this.uploadFlag = isLt && isImage
      if (this.uploadFlag) {
        this.uploadFile = file
        this.$refs.chat.sendImage({
          status: 'start',
          name: file.name,
          uid: file.uid
        })
      }
      return this.uploadFlag
    },
    showTip () {
      this.timer && clearTimeout(this.timer)
      if (this.order.status === 'fresh') {
        if (this.remainTime) {
          if (this.remainTime < 0) {
            this.stepTip = this.$t('order.order_info_timeout')
          } else {
            let hour = Math.floor(this.remainTime / 3600)
            let minute = Math.floor((this.remainTime % 3600) / 60)
            let second = Math.floor((this.remainTime % 3600) % 60)
            hour = hour / 10 < 1 ? '0' + hour : hour
            minute = minute / 10 < 1 ? '0' + minute : minute
            second = second / 10 < 1 ? '0' + second : second
            this.stepTip = this.$t('order.order_info_timer', {'0': `<span class="tipTime">${+hour > 0 ? (hour + ':') : ''}${minute}:${second}</span>`})
            this.remainTime--
          }
        } else {
          this.stepTip = ''
        }
        this.timer = setTimeout(this.showTip, 1000)
      } else {
        this.stepTip = ''
      }
    },
    showAuth () {
      if (this.userInfo.mobile) {
        this.confirmFlag.authPhone = true
      } else if (this.userInfo.app_two_factor) {
        this.confirmFlag.authGoogle = true
      }
    },
    getMe () {
      this.$store.dispatch('axios_me')
    },
    getOrder (noLoading) {
      !noLoading && this.$loading.open()
      this.$store.dispatch('axios_order_info', {
        id: this.id
      }).then(res => {
        if (res.data && +res.data.error === 0) {
          this.order = res.data.info
          if (this.chat.length && (this.chat.length !== res.data.chat.length)) {
            this.$refs.chat.scrollToBottom()
          }
          this.chat = res.data.chat
          this.remainTime = +(res.data.info.remain_time || 0)
          this.showTip()
        }
      }).catch(() => {
        // this.$message.error(this.$t('order.order_info_request_fail'))
      })
    },
    getOrderInterval (noLoading) {
      this.getOrder(noLoading)
      this.orderTimer && clearTimeout(this.orderTimer)
      this.orderTimer = setTimeout(() => {
        this.getOrderInterval(1)
      }, 60 * 1000)
    },
    orderOper (operStr) {
      if (operStr === 'pay') {
        this.confirmFlag.pay = true
      } else if (operStr === 'release') {
        this.confirmFlag.release = true
      } else if (operStr === 'evaluate') {
        if (+this.evaluateIndex >= 0) {
          this.$loading.open()
          this.$store.dispatch('axios_order_evaluate', {
            order_id: this.id,
            good: +this.evaluateIndex
          }).then(res => {
            if (res.data && +res.data.error === 0) {
              this.$message.success(this.$t('order.order_pay_evaluate_success'))
              this.getOrder()
            }
          }).catch(() => {
            // this.$message.error(this.$t('order.order_pay_evaluate_fail'))
          })
        } else {
          this.$message.error(this.$t('order.order_pay_evaluate_required'))
        }
      } else if (operStr === 'complete') {
        this.confirmFlag.complete = true
      } else if (operStr === 'cancel') {
        this.confirmFlag.cancel = true
      } else {
      }
    },
    doPay (value) {
      this.remark = value
      this.doOper('pay')
    },
    doRelease (value) {
      this.password = value
      this.doOper('release')
    },
    doAuthClose (value) {
      this.doOper('release', value)
    },
    doOper (operStr, authJson) {
      if (operStr === 'pay') {
        this.$loading.open()
        this.$store.dispatch('axios_order_pay', {
          order_id: this.id
        }).then(res => {
          if (res.data && +res.data.error === 0) {
            this.confirmFlag.pay = false
            if (this.remark && this.remark.trim()) {
              this.$refs.chat.sendInfo(this.remark)
            }
            this.$message.success(this.$t('order.order_pay_complete_success'))
            this.getOrder()
          }
        }).catch(() => {
          // this.$message.error(this.$t('order.order_pay_complete_fail'))
        })
      } else if (operStr === 'release') {
        let requestData = {
          order_id: this.id,
          password: this.password
        }
        if (authJson) {
          requestData = Object.assign(authJson, requestData)
        }
        this.$loading.open()
        this.$store.dispatch('axios_order_release', requestData).then(res => {
          if (res.data && res.data.error === 0) {
            this.confirmFlag.release = false
            this.$message.success(this.$t('order.order_pay_release_success'))
            this.getOrder()
          } else {
            if (res.data.sms || res.data.app) {
              this.confirmFlag.release = false
              this.$store.commit('loginInfo_setter', {
                mobile: res.data.mobile
              })
              this.showAuth()
            }
          }
        }).catch(() => {
          // this.$message.error(this.$t('order.order_pay_release_fail'))
        })
      } else if (operStr === 'complete') {
        this.confirmFlag = {
          pay: false,
          release: false,
          cancel: false,
          complete: false
        }
      } else if (operStr === 'cancel') {
        this.$loading.open()
        this.$store.dispatch('axios_order_cancel', {
          order_id: this.id
        }).then(res => {
          if (res.data && +res.data.error === 0) {
            this.confirmFlag.cancel = false
            this.$message.success(this.$t('order.order_pay_cancel_success'))
            this.getOrder()
          }
        }).catch(() => {
          // this.$message.error(this.$t('order.order_pay_cancel_fail'))
        })
      }
    },
    sendInfo (event) {
      event && event.preventDefault()
      this.$refs.chat.sendInfo(this.inputValue)
      document.getElementById('footerInput').focus()
    },
    insertBrow (page, line, row) {
      // let browHTML = `<i class="browIcon" style="${this.getBrowImage(page, line, row)}"></i>`
      let tempIndex = ((page - 1) * this.browLine * this.browRow) + (line - 1) * this.browRow + row - 1
      let insertText = '[' + this.browList[tempIndex] + ']'
      this.inputValue = this.inputValue.substring(0, +this.inputSelection.end) + insertText + this.inputValue.substring(+this.inputSelection.end)
      document.getElementById('footerInput').innerHTML = this.inputValue
      this.inputSelection = {
        start: +this.inputSelection.start + insertText.length,
        end: +this.inputSelection.end + insertText.length
      }
    },
    sendSuccess () {
      this.inputValue = ''
      document.getElementById('footerInput').innerHTML = this.inputValue
    },
    init () {
      this.getMe()
      this.getOrderInterval()
    }
  },
  mounted () {
    this.init()
  },
  destroyed () {
    this.timer && clearTimeout(this.timer)
    this.orderTimer && clearTimeout(this.orderTimer)
  }
}
</script>
<style lang='stylus' scoped>
  .order {
    width 100vw
    height 100vh
    overflow hidden
    display flex
    flex-direction column
    .content {
      position static
      display flex
      overflow hidden
      flex-direction column
      flex 1
      top $mintHeaderHeight
      left 0
      height 100 - $chatFooterHeight - $mintHeaderHeight
      width 100vw
      .border {
        width: 100vw;
        height: 1vh;
        background: #fafafa;
      }
      .info {
        display flex
        flex-direction column
        padding 0 6vw 2.5vh
        background #FFFFFF
        border-top 1px solid #EEEEEE
        border-bottom 1px solid #EEEEEE
        .list {
          display flex
          flex-direction column
          .item {
            display flex
            .label {
              font-size 0.85rem
              font-weight normal
              color #333333
              margin 2.5vh 5vw 0 0
            }
            .text {
              font-size 0.85rem
              font-weight normal
              color #333333
              margin-top 2.5vh
            }
          }
          .btn {
            position absolute
            right 6vw
            margin-top 2.5vh
            color #2EA2F8
            font-size 1rem
          }
        }
        .border {
          align-self center
          margin 2.5vh 0
          height 1px
          width 88vw
          background #EEEEEE
        }
        .remark {
          padding-bottom 2.5vh
          .label {
            font-size 0.85rem
            font-weight normal
            color #333333
          }
          .text {
            font-size 0.85rem
            font-weight normal
            color #333333
          }
        }
      }
      .oper {
        display flex
        flex-direction column
        padding 2.5vh 0
        background #FFFFFF
        border-top 1px solid #EEEEEE
        border-bottom 1px solid #EEEEEE
        .tip {
          font-size 0.85rem
          font-weight normal
          color #333333
          padding 0 6vw 1.5vh
        }
      }
      .chatWrapper {
        flex 1
        overflow-y scroll
        overflow-x hidden
      }
    }
    .footer {
      position static
      left 0
      bottom 0
      width 100vw
      background #fff
      display flex
      align-items flex-start
      border-top 1px solid #EEEEEE
      flex-direction column
      transition: .2s ease-out;
      .oper {
        display flex
        align-items center
        .footerInputWrapper {
          @extend .flex-center
          justify-content flex-start
          border-right 1px solid #eee
          border-left 1px solid #eee
          border-bottom 1px solid #eee
          width 76vw
        }
        #footerInput {
          margin 0.5vh 0
          padding 0.5vh 1.5vw
          min-height 5vh
          max-height 10vh
          width: 66vw
          font-size 0.85rem
          font-weight normal
          color #000
          word-break break-all
          overflow-y scroll
          &:active, &:focus, &:hover {
            outline none
            content none
          }
          &:empty:before {
            content attr(placeholder)
            font-size 0.85rem
            color #ccc
            opacity 0.7
            margin-left 2vw
            line-height 4vh
          }
        }
        .uploader {
          width 4vh
          height 4vh
          margin-left 3.5vw
          .el-upload {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            &:hover {
              border-color: #409EFF;
            }
          }
          .uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 178px;
            height: 178px;
            line-height: 178px;
            text-align: center;
          }
          .uploadImage {
            width: 4vh;
            height: 4vh;
            background url("../../assets/images/trade/image.png") 0 0
            background-size cover
            &:active, &:focus {
              background url("../../assets/images/trade/imageFocus.png") 0 0
              background-size cover
            }
          }
        }

        .browImage {
          width 4vh
          height 4vh
          margin-left 3.5vw
          img {
            width 100%
            height 100%
            object-fit cover
            object-position 0 0
          }
        }
        .sendBtn {
          width 4vh
          height 4vh
          background url("../../assets/images/trade/send.png") 0 0
          background-size cover
          &:active, &:focus {
            background url("../../assets/images/trade/sendFocus.png") 0 0
            background-size cover
          }
        }
      }
      .browPage {
        width: 100vw;
        height: 24vh;
        transition: .2s ease-in-out;
      }
      .browList {
        width: 100vw;
        height: 20vh;
        background: #fff;
        border: 1px solid #ebeef5;
        padding: 1vh 2vw;
        z-index: 2000;
        color: #606266;
        line-height: 1.4;
        text-align: justify;
        font-size: 14px;
        -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
        transition: .2s ease-in-out;
        display flex
        flex-direction column
        justify-content space-around
        .line {
          display flex
          justify-content space-evenly
          .row {
            @extend .flex-center
            .brow {
              width 8vw
              height 8vw
              transition: .2s ease-out;
              &:active, &:focus, &:hover {
                transform scale(1.2)
              }
              img {
                object-position 0 0
                object-fit cover
                width 100%
                height 100%
              }
            }
          }
        }
      }
      .browPageArrowList {
        @extend .flex-center
        width 100vw
        transition .2s ease-out
        margin 0.5vh 0
        .browPageArrow {
          width 2vw
          height 2vw
          border-radius 2vw
          background #eee
          margin 0 2vw
        }
        .browPageArrowActive {
          width 3vw
          height 3vw
          border-radius 3vw
        }
      }
    }
  }

  .orderSubmit {
    display flex
    align-items center
    justify-content space-around
    .radioDiv {
      display flex
      align-items center
      .radio {
        box-sizing: border-box;
        display: inline-block;
        background-color: #fff;
        border-radius: 100%;
        border: 1px solid #ccc;
        position: relative;
        width: 20px;
        height: 20px;
        vertical-align: middle;
        &:after {
          content: " ";
          border-radius: 100%;
          top: 5px;
          left: 5px;
          position: absolute;
          width: 8px;
          height: 8px;
          -webkit-transition: -webkit-transform .2s;
          transition: -webkit-transform .2s;
          transition: transform .2s;
          -webkit-transform: scale(0);
          transform: scale(0);
        }
      }
      .rightRadio {
        margin-left 6vw
      }
      .radioChecked {
        background-image linear-gradient(-134deg, #0BBFD5 0%, #6DD7B2 100%)
        border-image linear-gradient(-134deg, #0BBFD5 0%, #6DD7B2 100%)
        &:after {
          background-color: #fff;
          -webkit-transform: scale(1);
          transform: scale(1);
        }
      }
      .radioText {
        margin-left 1vw
        font-size 0.85rem
        font-weight normal
        color #333333
      }
    }
  }

  .showInfo
    width 100vw

  .hideInfo
    width 100vw

  /deep/ .footerInput {
    width 88vw
  }

  /deep/ .tipTime {
    font-size 0.85rem
    font-weight normal
    color: #ED1C24;
    text-align center
  }

  /deep/ .orderSubmitBtn {
    width 36vw
    color #FFFFFF
    background-image: linear-gradient(-134deg, #0BBFD5 0%, #6DD7B2 100%);
    box-shadow: 0 5px 5px 0 rgba(102, 187, 191, 0.14);
    border-radius: 2px;
    @extend .flex-center
    .mint-button-text {
      font-size 0.85rem
    }
  }

  /deep/ .orderCancelBtn {
    width 36vw
    color #333333
    background: #FFFFFF;
    border: 1px solid rgba(0, 0, 0, 0.10);
    box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.03);
    border-radius: 2px;
    .mint-button-text {
      font-size 0.85rem
    }
  }

  /deep/ .orderSubmitBtn[disabled], .orderCancelBtn[disabled] {
    color #656b79
  }

  /deep/ .mint-button.is-disabled {
    background: #C8D4E0;
  }

  /deep/ .currency {
    font-weight normal
    margin-left 1vw
  }

  /deep/ .mint-field-core {
    font-weight normal
  }

  /deep/ .mint-swipe-indicators {
    bottom 2.5%
  }

  /deep/ .mint-swipe-indicator {
    opacity 1
    background rgba(0, 0, 0, 0.2)
  }

  /deep/ .mint-swipe-indicator.is-active {
    opacity 1
    background rgba(0, 0, 0, 1)
  }

  /deep/ .el-upload-list {
    display none !important
  }
  #header {
    position static !important
  }
</style>
