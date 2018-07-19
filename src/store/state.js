export default {
  header_index: 0, // 顶部菜单坐标
  layer_index: 1, // layer层级坐标，默认main层：1，蒙层：2
  user_sider_index: 0, // 个人中心页面的侧边栏坐标
  pinCodeValue: '', // PIN码的值
  pinCodeRefresh: 0, // 是否刷新PIN码
  googleKey: '', // 谷歌验证码
  googleCode: '', // 谷歌二维码的值
  loginInfo: {
    mobile: '',
    loginToken: ''
  },
  userInfo: { // 用户信息
    id: '',
    display_name: '',
    nickname: '',
    email: '',
    phone_number: '',
    api_ln: '',
    activated: true,
    invite: '',
    notice: 0,
    valid_account: [
    ],
    omt: {},
    stat: {
      trade_count: 0,
      good_count: 0,
      good_rate: '0'
    },
    default_collection: {
      kind: '', // alipay || bank
      account: '',
      bank: '',
      bank_name: '',
      account_display: ''
    }
  },
  code: {
    exable: ['cny', 'usd', 'dai', 'ck'],
    payable: ['cny', 'usd'],
    sellable: []
  },
  collection: [],
  collection_refresh: 0, // 是否刷新收款方式
  homeCarouselList: [], // 首页carousel
  inviteBannerList: [], // 邀请页面的banner
  banks: [],
  userToken: null, // 登录后header必携带
  showAuthEmail: false,
  axiosCancel: {}, // axios的CancelToken
  timeout: {}, // 定时器
  device: 0 // 设备 0--PC端 1--手机端
}
