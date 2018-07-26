export default {
  tradePath: '/buy', // 交易页面的路径,默认为 '/buy'
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
    valid_account: [],
    omt: {},
    stat: {
      trade_count: 0,
      good_count: 0,
      good_rate: '0'
    },
    default_collection: {}
  },
  code: {
    exable: ['cny', 'usd', 'dai', 'ck'],
    payable: ['cny', 'usd'],
    sellable: []
  },
  bankList: [],
  countryList: [],
  collectionList: [],
  collection_refresh: 0, // 是否刷新收款方式
  homeCarouselList: [], // 首页carousel
  inviteBannerList: [], // 邀请页面的banner
  userToken: null, // 登录后header必携带
  showAuthEmail: false,
  axiosCancel: {}, // axios的CancelToken
  timeout: {}, // 定时器
  device: 0 // 设备 0--PC端 1--手机端
}
