<template lang="pug">
  .agreement
    mt-header(:title="$t('user.agreement')" fixed)
      span(slot="left")
        mt-button(icon="back" @click="close")
    .content
      .text(v-html='text')
      .footer(class="mintCancel")
        mt-button(@click="close") {{$t('public.confirm')}}
</template>
<script type="es6">
import {$getLanguage} from '../../utils'
import Vue from 'vue'
import {Button, Header} from 'mint-ui'

Vue.component(Button.name, Button)
Vue.component(Header.name, Header)

const language = {}
language['zh-CN'] = `<h1 class='title'>用户协议</h1><p class='underline'></p>
<p>https://www.otcmaker.com（以下称“本网站”或“网站”），是一个专门供用户进行数字资产交易和提供相关服务（以下称“该服务”或“服务”）的平台。为了本协议表述之方便，该网站在本协议中使用“我们”或其他第一人称称呼。只要登陆该网站的自然人或其他主体均为本网站的用户，本协议表述之便利，以下使用“您”或其他第二人称。为了本协议表述之便利，我们和您在本协议中合称为“双方”，我们或您单称为“一方”。</p>
<p class='sub-title'>重要提示：</p>
<p>我们在此特别提醒您：</p>
<p>1 数字资产本身不由任何金融机构或公司或本网站发行；</p>
<p>2 数字资产市场是全新的、未经确认的，而且可能不会增长；</p>
<p>3 数字资产主要由投机者大量使用，零售和商业市场使用相对较少，数字资产交易存在极高风险，其全天不间断交易，没有涨跌限制，价格容易受庄家、全球政府政策的影响而大幅波动；</p>
<p>4 因各国法律、法规和规范性文件的制定或者修改，数字资产交易随时可能被暂停或被禁止。</p>
<p>数字资产交易有极高风险，并不适合绝大部分人士。您了解和理解此投资有可能导致部分损失或全部损失，所以您应该以能承受的损失程度来决定投资的金额。您了解和理解数字资产会产生衍生风险，所以如有任何疑问，建议先寻求理财顾问的协助。此外，除了上述提及过的风险以外，还会有未能预测的风险存在。您应慎重考虑并用清晰的判断能力去评估自己的财政状况及上述各项风险而作出任何买卖数字资产的决定，并承担由此产生的全部损失，我们对此不承担任何责任。</p>
<p class='sub-title'>敬告您：</p>
<p>1 您了解本网站仅作为您获取数字资产信息、寻找交易方、就数字资产的交易进行协商及开展交易的场所，本网站不参与您的任何交易，故您应自行谨慎判断确定相关数字资产及/或信息的真实性、合法性和有效性，并自行承担因此产生的责任与损失。</p>
<p>2 本网站的任何意见、消息、探讨、分析、价格、建议和其他资讯均是一般的市场评论，并不构成投资建议。我们不承担任何因依赖该资讯直接或间接而产生的损失，包括但不限于任何利润损失。</p>
<p>3 本网站的内容会随时更改并不作另行通知，我们已采取合理措施确保网站资讯的准确性，但并不能保证其准确性程度，亦不会承担任何因本网站上的资讯或因未能链结互联网、传送或接收任何通知和信息时的延误或失败而直接或间接产生的损失。</p>
<p>4 使用互联网形式的交易系统亦存有风险，包括但不限于软件，硬件和互联网链结的失败等。由于我们不能控制互联网的可靠性和可用性，我们不会对失真，延误和链结失败而承担任何责任。</p>
<p>5 https://www.otcmaker.com/为本网站唯一官方对外信息公布平台；</p>
<p>6 本网站任何服务均不接受信用卡支付；</p>
<p>7 禁止使用本网站从事洗钱、走私、商业贿赂等一切非法交易活动，若发现此类事件，本站将采取各种可使用之手段，包括但不限于冻结账户，通知相关权力机关等，我们不承担由此产生的所有责任并保留向相关人士追究责任的权利。</p>
<p class='sub-title'>一、总则</p>
<p>1.1 《用户协议》（以下称“本协议”或“本条款及条件”），由正文、《隐私条款》、《了解你的客户和反洗钱政策》以及本网站已经发布的或将来可能发布的各类规则、声明、说明等构成。</p>
<p>1.2 您在使用本网站提供的各项服务之前，应仔细阅读本协议，如有不理解之处或其他必要，请咨询专业律师。如您不同意本协议及/或随时对其的修改，请您立即停止使用本网站提供的服务或不再登陆本网站。您一旦登陆本网站、使用本网站的任何服务或任何其他类似行为即表示您已了解并完全同意本协议各项内容，包括本网站对本协议随时所做的任何修改。</p>
<p>1.3 您通过按照本网站的要求填写相关信息，并经过其他相关程序后成功注册可以成为本网站的会员（以下称“会员”），在进行注册过程中点击“同意”按钮即表示您以电子签署的形式与公司达成协议；或您在使用本网站过程中点击任何标有“同意”或类似意思的按钮的行为或以其他本网站允许的方式实际使用本网站提供的服务时，均表示您完全了解、同意且接受本协议项下的全部条款的约束，无您手写的书面签字就本协议对您的法律约束力无任何影响。</p>
<p>1.4 您成为本网站的会员后，您将获得一个会员帐号及相应的密码，该会员帐号和密码由会员负责保管；会员应当对您帐号进行的所有活动和事件负法律责任。</p>
<p>1.5 只有成为本网站的会员才可使用本网站提供的数字资产交易平台进行交易及享受其他本网站规定的只有会员才可获得的服务；非会员只有登陆网站、浏览网站及其他本网站规定的可获得的服务。</p>
<p>1.6 通过注册和使用任何由本网站提供的服务和功能，您将被视为已阅读，理解并：</p>
<p>1.6.1 接受本协议所有条款及条件的约束。</p>
<p>1.6.2 您确认您已年满16周岁或根据不同的可适用的法律规定的具有可订立合同的法定年龄，并有充分的能力接受这些条款，并订立交易，使用本网站进行数字资产交易。</p>
<p>1.6.3 您保证交易中涉及到的属于您的数字资产均为合法取得并所有。</p>
<p>1.6.4 您同意您为您自身的交易或非交易行为承担全部责任和任何收益或亏损。</p>
<p>1.6.5 您确认注册时提供的信息是真实和准确的。</p>
<p>1.6.6 您同意遵守任何有关法律的规定，就税务目的而言，包括报告任何交易利润。</p>
<p>1.6.7 本协议只是就您与我们之间达成的权利义务关系进行约束，而并不涉及本网站用户之间与其他网站和您之间因数字资产交易而产生的法律关系及法律纠纷。</p>
<p class='sub-title'>二、协议修订</p>
<p>我们保留不时修订本协议、并以网站公示的方式进行公告、不再单独通知您的权利，变更后的协议会在本协议首页标注变更时间，一经在网站公布，立即自动生效。您应不时浏览及关注本协议的更新变更时间及更新内容，如您不同意相关变更，应当立即停止使用本网站服务；您继续使用本网站服务，即表示您接受并同意经修订的协议的约束。</p>
<p class='sub-title'>三、注册</p>
<p>3.1 注册资格</p>
<p>您确认并承诺：在您完成注册程序或以其他本网站允许的方式实际使用本网站提供的服务时，您应当是具备可适用的法律规定的可签署本协议及使用本网站服务应具有的能力的自然人、法人或其他组织。您一旦点击同意注册按钮，即表示您自身或您的有权代理人已经同意该协议内容并由其代理注册及使用本网站服务。若您不具备前述主体资格，则您及您的有权代理人应承担因此而导致的一切后果，且公司保留注销或永久冻结您账户，并向您及您的有权代理人追究责任的权利。</p>
<p>3.2 注册目的</p>
<p>您确认并承诺：您进行本网站注册并非出于违反法律法规或破坏本网站数字资产交易秩序的目的。</p>
<p>3.3 注册流程</p>
<p>3.3.1 您同意根据本网站用户注册页面的要求提供有效电子邮箱等信息，您可以使用您提供或确认的邮箱或者本网站允许的其它方式作为登陆手段进入本网站。如有必要，按照不同法域相关法律法规的规定，您必须提供您的真实姓名、身份证件等法律法规及隐私条款及反洗钱条款规定的相关信息并不断更新注册资料，符合及时、详尽、准确的要求。所有原始键入的资料将引用为注册资料。您应对该等信息的真实性、完整性和准确性负责，并承担因此产生的任何直接或间接损失及不利后果。</p>
<p>3.3.2 您合法、完整并有效提供注册所需信息并经验证，有权获得本网站账号和密码，您获得本网站账号及密码时视为注册成功，可在本网站进行会员登陆。</p>
<p>3.3.3 您同意接收本网站发送的与本网站管理、运营相关的电子邮件和/或短消息。</p>
<p class='sub-title'>四、服务</p>
<p>本网站只为您通过本网站进行数字资产交易活动（包括但不限于数字资产交易等服务）提供网络交易平台服务，本网站并不作为买家或卖家参与买卖数字资产行为本身；本网站不提供任何国家法定货币充入和提取的相关服务。</p>
<p>4.1 服务内容</p>
<p>4.1.1 您有权在本网站浏览数字资产各项产品的交易信息、有权通过本网站提交数字资产交易请求并完成数字资产交易。</p>
<p>4.1.2 您有权在本网站查看其本网站会员账号下的信息，有权应用本网站提供的功能进行操作。</p>
<p>4.1.3 您有权按照本网站发布的活动规则参与本网站组织的网站活动。</p>
<p>4.1.4 本网站承诺为您提供的其他服务。</p>
<p>4.2.服务规则 您承诺遵守下列本网站服务规则：</p>
<p>4.2.1 您应当遵守法律法规、规章、及政策要求的规定，保证账户中所有数字资产来源的合法性，不得在本网站或利用本网站服务从事非法或其他损害本网站或第三方权益的活动，如发送或接收任何违法、违规、侵犯他人权益的信息，发送或接收传销材料或存在其他危害的信息或言论，未经本网站授权使用或伪造本网站电子邮件题头信息等。</p>
<p>4.2.2 您应当遵守法律法规并妥善使用和保管其本网站账号及登陆密码、资金密码、和其绑定的手机号码、以及手机接收的手机验证码的安全。您对使用其本网站账号和登陆密码、手机验证码进行的任何操作和后果承担全部责任。当您发现本网站账号、登陆密码、验证码被未经其授权的第三方使用，或存在其他账号安全问题时，应立即有效通知本网站，要求本网站暂停本网站账号的服务。本网站有权在合理时间内对您的该等请求采取行动，但本网站对在采取行动前已经产生的后果（包括但不限于您的任何损失）不承担任何责任。您在未经本网站同意的情况下不得将本网站账号以赠与、借用、租用、转让或其他方式处置给他人。</p>
<p>4.2.3 您同意您对您的本网站的账号、密码下发生的所有活动（包括但不限于信息披露、发布信息、网上点击同意或提交各类规则协议、网上续签协议或购买服务等）承担责任。</p>
<p>4.2.4 您在本网站进行数字资产交易时不得恶意干扰数字资产交易的正常进行、破坏交易秩序；不得以任何技术手段或其他方式干扰本网站的正常运行或干扰其他用户对本网站服务的使用；不得以虚构事实等方式恶意诋毁本网站的商誉。</p>
<p>4.2.5 如您因网上交易与其他用户产生纠纷的，不得通过司法或行政以外的途径要求本网站提供相关资料。</p>
<p>4.2.6 您在使用本网站提供的服务过程中，所产生的应纳税赋，以及一切硬件、软件、服务及其它方面的费用，均由您独自承担。</p>
<p>4.2.7 您应当遵守本网站不时发布和更新的本协议以及其他服务条款和操作规则，有权随时终止使用本网站提供的服务。</p>
<p class='sub-title'> 五、本网站的权利和义务</p>
<p>5.1 如您不具备本协议约定的注册资格，则本网站有权拒绝您进行注册，对已注册的，本网站有权注销您的会员账号，本网站保留向您或您的有权代理人追究责任的权利。同时，本网站保留其他任何情况下决定是否接受您注册的权利。</p>
<p>5.2 本网站发现账户使用者并非账户初始注册人时，有权中止或终止该账户的使用。</p>
<p>5.3 本网站通过技术检测、人工抽检等检测方式合理怀疑您提供的信息错误、不实、失效或不完整时，有权通知您更正、更新信息或中止、终止为其提供本网站服务。</p>
<p>5.4 本网站有权在发现本网站上显示的任何信息存在明显错误时，对信息予以更正。</p>
<p>5.5 本网站保留随时修改、中止或终止本网站服务的权利，本网站行使修改或中止服务的权利不需事先告知您；本网站终止本网站一项或多项服务的，终止自本网站在网站上发布终止公告之日生效。</p>
<p>5.6 本网站应当采取必要的技术手段和管理措施保障本网站的正常运行，并提供必要、可靠的交易环境和交易服务，维护数字资产交易秩序。</p>
<p>5.7 如您连续一年未使用本网站会员账号和密码登陆本网站，则本网站有权注销您的本网站账号。账号注销后，本网站有权将相应的会员名开放给其他您注册使用。</p>
<p>5.8 本网站通过加强技术投入、提升安全防范等措施保障您的数字资产的安全，有义务在您账户出现可以预见的安全风险时提前通知您。</p>
<p>5.9 本网站有权随时删除本网站内各类不符合法律法规或本网站规定等的内容信息，本网站行使该等权利不需提前通知您。</p>
<p>5.10 本网站有权根据您所属主权国家或地区的法律法规、规则、命令等规范的要求，向您要求提供更多的信息或资料等，并采取合理的措施，以符合当地的规范之要求，您有义务配合；本网站有权根据您所属主权国家或地区的法律法规、规则、命令等规范的要求，暂停或永久停止对您的开放本网站及其部分或全部服务。</p>
<p class='sub-title'>六、赔偿</p>
<p>6.1 在任何情况下，我们对您的直接损害的赔偿责任均不会超过您从使用本网站服务产生的为期三（ 3）个月的总费用。</p>
<p>6.2 如您发生违反本协议或其他法律法规等情况，您须向我们至少赔偿200万美元及承担由此产生的全部费用（包括律师费等），如不够弥补实际损失，您须补全。</p>
<p class='sub-title'>七、寻求禁令救济的权利</p>
<p>我们和您均承认普通法对违约或可能违约情况的救济措施是可能是不足以弥补我们遭受的全部损失的，故非违约方有权在违约或可能违约情况下寻求禁令救济以及普通法或衡平法允许的其他所有的补救措施。</p>
<p class='sub-title'>八、责任限制与免责</p>
<p>8.1 您了解并同意，在任何情况下，我们不就以下各事项承担责任：</p>
<p>8.1.1 收入的损失；</p>
<p>8.1.2 交易利润或合同损失；</p>
<p>8.1.3 业务中断；</p>
<p>8.1.4 预期可节省的货币的损失；</p>
<p>8.1.5 信息的损失；</p>
<p>8.1.6 机会、商誉或声誉的损失；</p>
<p>8.1.7 数据的损坏或损失；</p>
<p>8.1.8 购买替代产品或服务的成本；</p>
<p>8.1.9 任何由于侵权（包括过失）、违约或其他任何原因产生的间接的、特殊的或附带性的损失或损害，不论这种损失或损害是否可以为我们合理预见；不论我们是否事先被告知存在此种损 失或损害的可能性。</p>
<p>8.1.1 条至8.1.9条均是彼此独立的。</p>
<p>8.2 您了解并同意，我们不对因下述任一情况而导致您的任何损害赔偿承担责任：</p>
<p>8.2.1 我们有合理的理由认为您的具体交易事项可能存在重大违法或违约情形。</p>
<p>8.2.2 我们有合理的理由认为您在本网站的行为涉嫌违法或不当。</p>
<p>8.2.3 通过本网站服务购买或获取任何数据、信息或进行交易等行为或替代行为产生的费用及损失。</p>
<p>8.2.4 您对本网站服务的误解。</p>
<p>8.2.5 任何非因我们的原因而引起的与本网站提供的服务有关的其它损失。</p>
<p>8.3 我们对由于信息网络设备维护、信息网络连接故障、电脑、通讯或其他系统的故障、电力故障、天气原因、意外事故、罢工、劳动争议、暴乱、起义、骚乱、生产力或生产资料不足、火灾、洪水、风暴、爆炸、战争、银行或其他合作方原因、数字资产市场崩溃、政府行为、 司法或行政机关的命令、其他不在我们可控范围内或我们无能力控制的行为或第三方的原因而造成的不能服务或延迟服务，以及造成的您的损失，我们不承担任何责任。</p>
<p>8.4 我们不能保证本网站包含的全部信息、程序、文本等完全安全，不受任何病毒、木马等恶意程序的干扰和破坏，故您登陆、使用本网站任何服务或下载及使用该下载的任何程序、信息、数据等均是您个人的决定并自行承担风险及可能产生的损失。</p>
<p>8.5 我们对本网站中链接的任何第三方网站的任何信息、产品及业务及其他任何形式的不属于我们的主体的内容等不做任何保证和承诺，您如果使用第三方网站提供的任何服务、信息及产品等均为您个人决定且承担由此产生的一切责任。</p>
<p>8.6 我们对于您使用本网站服务不做任何明示或暗示的保证，包括但不限于本网站提供服务的适用性、没有错误或疏漏、持续性、准确性、可靠性、适用于某一特定用途。同时，我们也不对本网站提供的服务所涉及的技术及信息的有效性、准确性、正确性、可靠性、质量、稳定、完整和及时性作出任何承诺和保证。是否登陆或使用本网站提供的服务是您个人的决定且自行承担风险及可能产生的损失。我们对于数字资产的市场、价值及价格等不做任何明示或暗示的保证，您理解并了解数字资产市场是不稳定的，价格和价值随时会大幅波动或崩盘，交易数字资产是您个人的自由选择及决定且自行承担风险及可能产生的损失。</p>
<p>8.7 本协议中规定的我们的保证和承诺是由我们就本协议和本网站提供的服务的唯一保证和陈述，并取代任何其他途径和方式产生的保证和承诺，无论是书面的或口头的， 明示的或暗示的。所有这些保证和陈述仅仅代表我们自身的承诺和保证，并不保证任何第三方遵守本协议中的保证和承诺。</p>
<p>8.8 我们并不放弃本协议中未提及的在法律适用的最大范围内我们享有的限制、免除或抵销我们损害赔偿责任的任何权利。</p>
<p>8.9 您注册后即表示认可我们按照本协议中规定的规则进行的任何操作，产生的任何风险均由您承担。</p>
<p class='sub-title'>九、协议的终止</p>
<p>9.1 本网站有权依据本协议约定注销您的本网站账号，本协议于账号注销之日终止。</p>
<p>9.2 本网站有权依据本协议约定终止全部本网站服务，本协议于本网站全部服务终止之日终止。</p>
<p>9.3 本协议终止后，您无权要求本网站继续向其提供任何服务或履行任何其他义务，包括但不限于要求本网站为您保留或向您披露其原本网站账号中的任何信息， 向您或第三方转发任何其未曾阅读或发送过的信息等。</p>
<p>9.4 本协议的终止不影响守约方向违约方要求其他责任的承担。</p>
<p class='sub-title'>十、知识产权</p>
<p>10.1 本网站所包含的全部智力成果包括但不限于网站标志、数据库、网站设计、文字和图表、软件、照片、录像、音乐、声音及其前述组合，软件编译、相关源代码和软件 (包括小应用程序和脚本) 的知识产权权利均归本网站所有。您不得为商业目的复制、更改、拷贝、发送或使用前述任何材料或内容。</p>
<p>10.2 本网站名称中包含的所有权利 (包括但不限于商誉和商标、标志) 均归公司所有。</p>
<p>10.3 您接受本协议即视为您主动将其在本网站发表的任何形式的信息的著作权， 包括但不限于：复制权、发行权、出租权、展览权、表演权、放映权、广播权、信息网络传播权、摄制权、改编权、翻译权、汇编权 以及应当由著作权人享有的其他可转让权利无偿独家转让给本网站所有，本网站有权利就任何主体侵权单独提起诉讼并获得全部赔偿。 本协议效力及于您在本网站发布的任何受著作权法保护的作品内容， 无论该内容形成于本协议签订前还是本协议签订后。</p>
<p>10.4 您在使用本网站服务过程中不得非法使用或处分本网站或他人的知识产权权利。您不得将已发表于本网站的信息以任何形式发布或授权其它网站（及媒体）使用。</p>
<p>10.5 您登陆本网站或使用本网站提供的任何服务均不视为我们向您转让任何知识产权。</p>
<p class='sub-title'>十一、信息保护</p>
<p>11.1 适用范围</p>
<p>11.1.1 在您注册网站账号或者使用账户时，您根据本网站要求提供的个人注册信息，包括但不限于电话号码、邮箱信息、身份证件信息。</p>
<p>11.1.2 在您使用本网站服务时，或访问本网站网页时，本网站自动接收并记录的您浏览器上的服务器数值，包括但不限于IP地址等数据及您要求取用的网页记录。</p>
<p>11.1.3 本网站收集到的您在本网站进行交易的有关数据，包括但不限于交易记录。</p>
<p>11.1.4 本网站通过合法途径取得的其他您个人信息。</p>
<p>11.2 信息使用</p>
<p>11.2.1 不需要您额外的同意，您在本网站注册成功即视为您同意本网站收集并使用其在本网站的各类信息，如11.1条所列，您了解并同意，本网站可以将收集的您信息用作包括但不限于下列用途：</p>
<p>11.2.1.1 向您提供本网站服务；</p>
<p>11.2.1.2 基于主权国家或地区相关主管部门的要求向相关部门进行报告；</p>
<p>11.2.1.3 在您使用本网站服务时，本网站将您的信息用于身份验证、客户服务、安全防范、诈骗监测、存档和备份用途，确保本网站向您提供的产品和服务的安全性；</p>
<p>11.2.1.4 帮助本网站设计新产品及服务，改善本网站现有服务；</p>
<p>11.2.1.5 为了使您解本网站服务的具体情况，您同意本网站向其发送营销活动通知、商业性电子信息以及提供与您相关的广告以替代普遍投放的广告；</p>
<p>11.2.1.6 本网站为完成合并、分立、收购或资产转让而将您的信息转移或披露给任何非关联的第三方；</p>
<p>11.2.1.7 软件认证或管理软件升级；</p>
<p>11.2.1.8 邀请您参与有关本网站服务的调查；</p>
<p>11.2.1.9 用于和政府机关、公共事务机构、协会等合作的数据分析；</p>
<p>11.2.1.10 用作其他一切合法目的以及经您授权的其他用途。</p>
<p>11.2.2 本网站不会向其他任何人出售或出借您的个人信息，除非事先得到您的许可。本网站也不允许任何第三方以任何手段收集、编辑、出售或者无偿传播您的个人信息。</p>
<p>11.3 本网站对所获得的客户身份资料和交易信息等进行保密，不得向任何单位和个人提供客户身份资料和交易信息，应相关主权国家或地区法律法规、政令、命令等规定要求本网站提供的除外。</p>
<p class='sub-title'>十二、计算</p>
<p>所有的交易计算结果都经过我们的核实，所有的计算方法都已经在网站上公示，但是我们不能保证网站的使用不会受到干扰或没有误差。</p>
<p class='sub-title'>十三、转让</p>
<p>本协议中约定的权利及义务同样约束从该权利义务中获取到利益的各方的受让人，继承人，遗嘱执行人和管理员。您不得在我们不同意的前提下转让给任何第三人，但我们可随时将我们在本协议中的权利和义务转让给任何第三人，并给予您提前30天的通知。</p>
<p class='sub-title'>十四、可分割性</p>
<p>如本协议中的任何条款被任何有管辖权的法院认定为不可执行的，无效的或非法的，并不影响本协议的其余条款的效力。</p>
<p class='sub-title'>十五、非代理关系</p>
<p>本协议中的任何规定均不可被认为创造了、暗示了或以其他方式将我们视为您的代理人、受托人或其他代表人，本协议有其他规定的除外。</p>
<p class='sub-title'>十六、弃权</p>
<p>我们或您任何一方对追究本协议约定的违约责任或其他责任的弃权并不能认定或解释为对其他违约责任的弃权；未行使任何权利或救济不得以任何方式被解释为对该等权利或救济的放弃。</p>
<p class='sub-title'>十七、标题</p>
<p>所有标题仅供协议表述方便，并不用于扩大或限制该协议条款的内容或范围。</p>
<p class='sub-title'>十八、协议的生效和解释</p>
<p>18.1 本协议于您点击本网站注册页面的同意注册并完成注册程序、获得本网站账号和密码时生效，对本网站和您均具有约束力。</p>
<p>18.2 本协议的最终解释权归本网站所有。</p>
<h2 class='title'>了解你的客户和反洗钱政策</h2>
<p class='sub-title'>一、导言</p>
<p>1.1 我们保证审慎遵守“了解你的客户”和反洗钱相关的法律法规且不得故意违反该《了解你的客户和反洗钱政策》。在我们合理控制的范围内我们将采取必要的措施和技术为您提供安全的服务，尽可能使您免于遭受犯罪嫌疑人的洗钱行为带来的损失。</p>
<p>1.2 我们的了解你的客户和反洗钱政策是一个综合性的国际政策体系，包括您隶属的不同法律辖区的了解你的客户和反洗钱政策。我们健全合规的框架确保我们在本地和全球层面均符合监管要求和监管水平，并确保本网站持续性运行。</p>
<p class='sub-title'>二、了解你的客户和反洗钱政策如下：</p>
<p>2.1 颁布了解你的客户和反洗钱政策并时时更新以满足相应的法律法规规定的标准；</p>
<p>2.2 颁布和更新运行本网站的一些指导原则和规则，且我们的员工将按照该原则和规则的指导提供服务；</p>
<p>2.3 设计并完成内部监测和控制交易的程序，如以严格的手段验证身份，安排组建专业团队专门负责反洗钱工作；</p>
<p>2.4 采用风险预防的方法对客户进行尽职调查和持续的监督;</p>
<p>2.5 审查和定期检查已发生的交易;</p>
<p>2.6 向主管当局报告可疑交易;</p>
<p>2.7身份证明文件、地址证明文件和交易记录的证明文件将会维持至少六年，如被提交给监管部门，恕不另行通知您。</p>
<p>2.8 整个交易过程中，信用卡被禁止使用；</p>
<p class='sub-title'>三、身份信息与核实确认</p>
<p>3.1 身份信息</p>
<p>3.1.1 根据不同的司法管辖区的不同规定及不同的实体类型，我们收集的您的信息内容可能不一致，原则上将向注册的个人收集以下信息：</p>
<p>个人基本信息：您的姓名，住址（及永久地址，如果不同） ，出生日期及国籍等可获得的其他情况。身份验证应该是根据官方或其他类似权威机构发放的文件，比如护照，身份证或其他不同的辖区要求的和引发的身份证明文件。您提供的地址将使用适当的方法进行验证，比如检查乘用交通工具的票据或利率票据或检查选民登记册等。</p>
<p>有效的照片：在您注册之前，您须提供您将您的身份证件放在胸前的照片；</p>
<p>联系方式：电话/手机号码和/或有效的电子邮件地址。</p>
<p>3.1.2 如果您是一个公司或其他合法实体，我们将收集以下信息以确定您或信托帐户的最终受益人。</p>
<p>公司注册、登记证；公司的章程与备忘录副本；公司的股权机构和所有权说明的详细证明材料，证明决定本网站账户的开立以及执行的授权委托人的董事会决议；按照要求需要提供的公司董事、大股东及本网站账户有权签字人的身份证明文件；该公司的主要营业地址，如果与公司的邮寄地址不同，提供邮寄地址。如果公司在本地的地址与它的主要营业地址不一致的，则被视为风险较高的客户，需要提交额外附加文件。</p>
<p>• 根据不同的司法管辖区的不同规定及不同的实体类型，我们要求的其他认证和权威部门发布的文件以及我们认为必要的文件。</p>
<p>3.1.3 我们只接受英语版本或汉语版本的身份信息，如不是，请您将您的身份信息翻译成英文的版本并加以公证。</p>
<p>3.2确认核实</p>
<p>3.2.1 我们要求您提供身份证明文件的全部页面内容。</p>
<p>3.2.2 我们要求您提供您将您的身份证明文件放在您胸前的照片。</p>
<p>3.2.3 证明文件的副本一般应核和原始凭证进行核对。然而，如果某个可信赖的合适的认证人可证明该副本文件是原始文件准确而全面的复制的，该副本可接受。这样的认证人包括大使、司法委员、地方治安官等。</p>
<p>3.2.4 对识别最终受益人和账户控制权的要求是确定哪些个人最终所有或控制直接客户，和/或确定正在进行的交易是由他人代为执行。如果是企业，则大股东的身份（例如那些持有10％或以上的投票权益）应被验证。一般，持股25 ％会被认定为正常风险内，其股东身份须验证；持股10%或拥有更多的投票权或股票时被认定为高风险的情况，股东身份须加以验证。</p>
<p class='sub-title'>四、监控交易</p>
<p>4.1 我们根据安全性和实际交易情况时时设置和调整日常交易和提币最高限额;</p>
<p>4.2 如果交易频繁集中发生在某个注册用户或存在超乎合理的情况，我们的专业团队将评估并决定他们是否可疑;</p>
<p>4.3 我们凭借自身的判断认定为可疑交易的情况，我们可能会采取暂停该交易、拒绝该交易等限制性措施，甚至如果可能将尽快逆转该交易，同时向主管部门报告，但不会通知您;</p>
<p>4.4 我们保留拒绝来自于不符合国际反洗钱标准辖区的人或可被视为政治公众人物的人的注册申请，我们保留随时暂停或终止根据我们自身判断为可疑交易的交易，但我们这样做并不违反对您的任何义务和责任。</p>`

language['zh-HK'] = `<h1 class='title'>用戶協議</h1><p class='underline'></p>
<p>https://www.otcmaker.com（以下稱“本網站”或“網站”），是一個專門供用戶進行數字資產交易和提供相關服務（以下稱“該服務”或“服務”）的平臺。為了本協議表述之方便，該網站在本協議中使用“我們”或其他第一人稱稱呼。只要登陸該網站的自然人或其他主體均為本網站的用戶，本協議表述之便利，以下使用“您”或其他第二人稱。為了本協議表述之便利，我們和您在本協議中合稱為“雙方”，我們或您單稱為“一方”。</p>
<p>重要提示：</p>
<p class='sub-title'>我們在此特別提醒您：</p>
<p>1 數字資產本身不由任何金融機構或公司或本網站發行；</p>
<p>2 數字資產市場是全新的、未經確認的，而且可能不會增長；</p>
<p>3 數字資產主要由投機者大量使用，零售和商業市場使用相對較少，數字資產交易存在極高風險，其全天不間斷交易，沒有漲跌限制，價格容易受莊家、全球政府政策的影響而大幅波動；</p>
<p>4 因各國法律、法規和規範性文件的制定或者修改，數字資產交易隨時可能被暫停或被禁止。</p>
<p>數字資產交易有極高風險，並不適合絕大部分人士。您了解和理解此投資有可能導致部分損失或全部損失，所以您應該以能承受的損失程度來決定投資的金額。您了解和理解數字資產會產生衍生風險，所以如有任何疑問，建議先尋求理財顧問的協助。此外，除了上述提及過的風險以外，還會有未能預測的風險存在。您應慎重考慮並用清晰的判斷能力去評估自己的財政狀況及上述各項風險而作出任何買賣數字資產的決定，並承擔由此產生的全部損失，我們對此不承擔任何責任。</p>
<p class='sub-title'>敬告您：</p>
<p>1 您了解本網站僅作為您獲取數字資產信息、尋找交易方、就數字資產的交易進行協商及開展交易的場所，本網站不參與您的任何交易，故您應自行謹慎判斷確定相關數字資產及/或信息的真實性、合法性和有效性，並自行承擔因此產生的責任與損失。</p>
<p>2 本網站的任何意見、消息、探討、分析、價格、建議和其他資訊均是一般的市場評論，並不構成投資建議。我們不承擔任何因依賴該資訊直接或間接而產生的損失，包括但不限於任何利潤損失。</p>
<p>3 本網站的內容會隨時更改並不作另行通知，我們已采取合理措施確保網站資訊的準確性，但並不能保證其準確性程度，亦不會承擔任何因本網站上的資訊或因未能鏈結互聯網、傳送或接收任何通知和信息時的延誤或失敗而直接或間接產生的損失。</p>
<p>4 使用互聯網形式的交易系統亦存有風險，包括但不限於軟件，硬件和互聯網鏈結的失敗等。由於我們不能控制互聯網的可靠性和可用性，我們不會對失真，延誤和鏈結失敗而承擔任何責任。</p>
<p>5 https://www.otcmaker.com/為本網站唯一官方對外信息公布平臺；</p>
<p>6 本網站任何服務均不接受信用卡支付；</p>
<p>7 禁止使用本網站從事洗錢、走私、商業賄賂等一切非法交易活動，若發現此類事件，本站將采取各種可使用之手段，包括但不限於凍結賬戶，通知相關權力機關等，我們不承擔由此產生的所有責任並保留向相關人士追究責任的權利。</p>
<p class='sub-title'>一、總則</p>
<p>1.1 《用戶協議》（以下稱“本協議”或“本條款及條件”），由正文、《隱私條款》、《了解妳的客戶和反洗錢政策》以及本網站已經發布的或將來可能發布的各類規則、聲明、說明等構成。</p>
<p>1.2 您在使用本網站提供的各項服務之前，應仔細閱讀本協議，如有不理解之處或其他必要，請咨詢專業律師。如您不同意本協議及/或隨時對其的修改，請您立即停止使用本網站提供的服務或不再登陸本網站。您一旦登陸本網站、使用本網站的任何服務或任何其他類似行為即表示您已了解並完全同意本協議各項內容，包括本網站對本協議隨時所做的任何修改。</p>
<p>1.3 您通過按照本網站的要求填寫相關信息，並經過其他相關程序後成功註冊可以成為本網站的會員（以下稱“會員”），在進行註冊過程中點擊“同意”按鈕即表示您以電子簽署的形式與公司達成協議；或您在使用本網站過程中點擊任何標有“同意”或類似意思的按鈕的行為或以其他本網站允許的方式實際使用本網站提供的服務時，均表示您完全了解、同意且接受本協議項下的全部條款的約束，無您手寫的書面簽字就本協議對您的法律約束力無任何影響。</p>
<p>1.4 您成為本網站的會員後，您將獲得一個會員帳號及相應的密碼，該會員帳號和密碼由會員負責保管；會員應當對您帳號進行的所有活動和事件負法律責任。</p>
<p>1.5 只有成為本網站的會員才可使用本網站提供的數字資產交易平臺進行交易及享受其他本網站規定的只有會員才可獲得的服務；非會員只有登陸網站、瀏覽網站及其他本網站規定的可獲得的服務。</p>
<p>1.6 通過註冊和使用任何由本網站提供的服務和功能，您將被視為已閱讀，理解並：</p>
<p>1.6.1 接受本協議所有條款及條件的約束。</p>
<p>1.6.2 您確認您已年滿16周歲或根據不同的可適用的法律規定的具有可訂立合同的法定年齡，並有充分的能力接受這些條款，並訂立交易，使用本網站進行數字資產交易。</p>
<p>1.6.3 您保證交易中涉及到的屬於您的數字資產均為合法取得並所有。</p>
<p>1.6.4 您同意您為您自身的交易或非交易行為承擔全部責任和任何收益或虧損。</p>
<p>1.6.5 您確認註冊時提供的信息是真實和準確的。</p>
<p>1.6.6 您同意遵守任何有關法律的規定，就稅務目的而言，包括報告任何交易利潤。</p>
<p>1.6.7 本協議只是就您與我們之間達成的權利義務關系進行約束，而並不涉及本網站用戶之間與其他網站和您之間因數字資產交易而產生的法律關系及法律糾紛。</p>
<p class='sub-title'>二、協議修訂</p>
<p>我們保留不時修訂本協議、並以網站公示的方式進行公告、不再單獨通知您的權利，變更後的協議會在本協議首頁標註變更時間，一經在網站公布，立即自動生效。您應不時瀏覽及關註本協議的更新變更時間及更新內容，如您不同意相關變更，應當立即停止使用本網站服務；您繼續使用本網站服務，即表示您接受並同意經修訂的協議的約束。</p>
<p class='sub-title'>三、註冊</p>
<p>3.1 註冊資格</p>
<p>您確認並承諾：在您完成註冊程序或以其他本網站允許的方式實際使用本網站提供的服務時，您應當是具備可適用的法律規定的可簽署本協議及使用本網站服務應具有的能力的自然人、法人或其他組織。您一旦點擊同意註冊按鈕，即表示您自身或您的有權代理人已經同意該協議內容並由其代理註冊及使用本網站服務。若您不具備前述主體資格，則您及您的有權代理人應承擔因此而導致的一切後果，且公司保留註銷或永久凍結您賬戶，並向您及您的有權代理人追究責任的權利。</p>
<p>3.2 註冊目的</p>
<p>您確認並承諾：您進行本網站註冊並非出於違反法律法規或破壞本網站數字資產交易秩序的目的。</p>
<p>3.3註冊流程</p>
<p>3.3.1 您同意根據本網站用戶註冊頁面的要求提供有效電子郵箱等信息，您可以使用您提供或確認的郵箱或者本網站允許的其它方式作為登陸手段進入本網站。如有必要，按照不同法域相關法律法規的規定，您必須提供您的真實姓名、身份證件等法律法規及隱私條款及反洗錢條款規定的相關信息並不斷更新註冊資料，符合及時、詳盡、準確的要求。所有原始鍵入的資料將引用為註冊資料。您應對該等信息的真實性、完整性和準確性負責，並承擔因此產生的任何直接或間接損失及不利後果。</p>
<p>3.3.2您合法、完整並有效提供註冊所需信息並經驗證，有權獲得本網站賬號和密碼，您獲得本網站賬號及密碼時視為註冊成功，可在本網站進行會員登陸。</p>
<p>3.3.3 您同意接收本網站發送的與本網站管理、運營相關的電子郵件和/或短消息。</p>
<p class='sub-title'>四、服務</p>
<p>本網站只為您通過本網站進行數字資產交易活動（包括但不限於數字資產交易等服務）提供網絡交易平臺服務，本網站並不作為買家或賣家參與買賣數字資產行為本身；本網站不提供任何國家法定貨幣充入和提取的相關服務。</p>
<p>4.1 服務內容</p>
<p>4.1.1 您有權在本網站瀏覽數字資產各項產品的交易信息、有權通過本網站提交數字資產交易請求並完成數字資產交易。</p>
<p>4.1.2 您有權在本網站查看其本網站會員賬號下的信息，有權應用本網站提供的功能進行操作。</p>
<p>4.1.3 您有權按照本網站發布的活動規則參與本網站組織的網站活動。</p>
<p>4.1.4 本網站承諾為您提供的其他服務。</p>
<p>4.2.服務規則
您承諾遵守下列本網站服務規則：</p>
<p>4.2.1 您應當遵守法律法規、規章、及政策要求的規定，保證賬戶中所有數字資產來源的合法性，不得在本網站或利用本網站服務從事非法或其他損害本網站或第三方權益的活動，如發送或接收任何違法、違規、侵犯他人權益的信息，發送或接收傳銷材料或存在其他危害的信息或言論，未經本網站授權使用或偽造本網站電子郵件題頭信息等。</p>
<p>4.2.2 您應當遵守法律法規並妥善使用和保管其本網站賬號及登陸密碼、資金密碼、和其綁定的手機號碼、以及手機接收的手機驗證碼的安全。您對使用其本網站賬號和登陸密碼、手機驗證碼進行的任何操作和後果承擔全部責任。當您發現本網站賬號、登陸密碼、驗證碼被未經其授權的第三方使用，或存在其他賬號安全問題時，應立即有效通知本網站，要求本網站暫停本網站賬號的服務。本網站有權在合理時間內對您的該等請求采取行動，但本網站對在采取行動前已經產生的後果（包括但不限於您的任何損失）不承擔任何責任。您在未經本網站同意的情況下不得將本網站賬號以贈與、借用、租用、轉讓或其他方式處置給他人。</p>
<p>4.2.3 您同意您對您的本網站的賬號、密碼下發生的所有活動（包括但不限於信息披露、發布信息、網上點擊同意或提交各類規則協議、網上續簽協議或購買服務等）承擔責任。</p>
<p>4.2.4 您在本網站進行數字資產交易時不得惡意幹擾數字資產交易的正常進行、破壞交易秩序；不得以任何技術手段或其他方式幹擾本網站的正常運行或幹擾其他用戶對本網站服務的使用；不得以虛構事實等方式惡意詆毀本網站的商譽。</p>
<p>4.2.5 如您因網上交易與其他用戶產生糾紛的，不得通過司法或行政以外的途徑要求本網站提供相關資料。</p>
<p>4.2.6 您在使用本網站提供的服務過程中，所產生的應納稅賦，以及一切硬件、軟件、服務及其它方面的費用，均由您獨自承擔。</p>
<p>4.2.7 您應當遵守本網站不時發布和更新的本協議以及其他服務條款和操作規則，有權隨時終止使用本網站提供的服務。</p>
<p class='sub-title'> 五、本網站的權利和義務</p>
<p>5.1 如您不具備本協議約定的註冊資格，則本網站有權拒絕您進行註冊，對已註冊的，本網站有權註銷您的會員賬號，本網站保留向您或您的有權代理人追究責任的權利。同時，本網站保留其他任何情況下決定是否接受您註冊的權利。</p>
<p>5.2 本網站發現賬戶使用者並非賬戶初始註冊人時，有權中止或終止該賬戶的使用。</p>
<p>5.3 本網站通過技術檢測、人工抽檢等檢測方式合理懷疑您提供的信息錯誤、不實、失效或不完整時，有權通知您更正、更新信息或中止、終止為其提供本網站服務。</p>
<p>5.4 本網站有權在發現本網站上顯示的任何信息存在明顯錯誤時，對信息予以更正。</p>
<p>5.5 本網站保留隨時修改、中止或終止本網站服務的權利，本網站行使修改或中止服務的權利不需事先告知您；本網站終止本網站一項或多項服務的，終止自本網站在網站上發布終止公告之日生效。</p>
<p>5.6 本網站應當采取必要的技術手段和管理措施保障本網站的正常運行，並提供必要、可靠的交易環境和交易服務，維護數字資產交易秩序。</p>
<p>5.7 如您連續一年未使用本網站會員賬號和密碼登陸本網站，則本網站有權註銷您的本網站賬號。賬號註銷後，本網站有權將相應的會員名開放給其他您註冊使用。</p>
<p>5.8 本網站通過加強技術投入、提升安全防範等措施保障您的數字資產的安全，有義務在您賬戶出現可以預見的安全風險時提前通知您。</p>
<p>5.9 本網站有權隨時刪除本網站內各類不符合法律法規或本網站規定等的內容信息，本網站行使該等權利不需提前通知您。</p>
<p>5.10 本網站有權根據您所屬主權國家或地區的法律法規、規則、命令等規範的要求，向您要求提供更多的信息或資料等，並采取合理的措施，以符合當地的規範之要求，您有義務配合；本網站有權根據您所屬主權國家或地區的法律法規、規則、命令等規範的要求，暫停或永久停止對您的開放本網站及其部分或全部服務。</p>
<p class='sub-title'>六、賠償</p>
<p>6.1 在任何情況下，我們對您的直接損害的賠償責任均不會超過您從使用本網站服務產生的為期三（ 3）個月的總費用。</p>
<p>6.2 如您發生違反本協議或其他法律法規等情況，您須向我們至少賠償200萬美元及承擔由此產生的全部費用（包括律師費等），如不夠彌補實際損失，您須補全。</p>
<p class='sub-title'>七、尋求禁令救濟的權利</p>
<p>我們和您均承認普通法對違約或可能違約情況的救濟措施是可能是不足以彌補我們遭受的全部損失的，故非違約方有權在違約或可能違約情況下尋求禁令救濟以及普通法或衡平法允許的其他所有的補救措施。</p>
<p class='sub-title'>八、責任限制與免責</p>
<p>8.1 您了解並同意，在任何情況下，我們不就以下各事項承擔責任：</p>
<p>8.1.1 收入的損失；</p>
<p>8.1.2 交易利潤或合同損失；</p>
<p>8.1.3 業務中斷；</p>
<p>8.1.4 預期可節省的貨幣的損失；</p>
<p>8.1.5 信息的損失；</p>
<p>8.1.6 機會、商譽或聲譽的損失；</p>
<p>8.1.7 數據的損壞或損失；</p>
<p>8.1.8 購買替代產品或服務的成本；</p>
<p>8.1.9 任何由於侵權（包括過失）、違約或其他任何原因產生的間接的、特殊的或附帶性的損失或損害，不論這種損失或損害是否可以為我們合理預見；不論我們是否事先被告知存在此種損 失或損害的可能性。</p>
<p>8.1.1 條至8.1.9條均是彼此獨立的。</p>
<p>8.2 您了解並同意，我們不對因下述任一情況而導致您的任何損害賠償承擔責任：</p>
<p>8.2.1 我們有合理的理由認為您的具體交易事項可能存在重大違法或違約情形。</p>
<p>8.2.2 我們有合理的理由認為您在本網站的行為涉嫌違法或不當。</p>
<p>8.2.3 通過本網站服務購買或獲取任何數據、信息或進行交易等行為或替代行為產生的費用及損失。</p>
<p>8.2.4 您對本網站服務的誤解。</p>
<p>8.2.5 任何非因我們的原因而引起的與本網站提供的服務有關的其它損失。</p>
<p>8.3 我們對由於信息網絡設備維護、信息網絡連接故障、電腦、通訊或其他系統的故障、電力故障、天氣原因、意外事故、罷工、勞動爭議、暴亂、起義、騷亂、生產力或生產資料不足、火災、洪水、風暴、爆炸、戰爭、銀行或其他合作方原因、數字資產市場崩潰、政府行為、 司法或行政機關的命令、其他不在我們可控範圍內或我們無能力控制的行為或第三方的原因而造成的不能服務或延遲服務，以及造成的您的損失，我們不承擔任何責任。</p>
<p>8.4 我們不能保證本網站包含的全部信息、程序、文本等完全安全，不受任何病毒、木馬等惡意程序的幹擾和破壞，故您登陸、使用本網站任何服務或下載及使用該下載的任何程序、信息、數據等均是您個人的決定並自行承擔風險及可能產生的損失。</p>
<p>8.5 我們對本網站中鏈接的任何第三方網站的任何信息、產品及業務及其他任何形式的不屬於我們的主體的內容等不做任何保證和承諾，您如果使用第三方網站提供的任何服務、信息及產品等均為您個人決定且承擔由此產生的一切責任。</p>
<p>8.6 我們對於您使用本網站服務不做任何明示或暗示的保證，包括但不限於本網站提供服務的適用性、沒有錯誤或疏漏、持續性、準確性、可靠性、適用於某一特定用途。同時，我們也不對本網站提供的服務所涉及的技術及信息的有效性、準確性、正確性、可靠性、質量、穩定、完整和及時性作出任何承諾和保證。是否登陸或使用本網站提供的服務是您個人的決定且自行承擔風險及可能產生的損失。我們對於數字資產的市場、價值及價格等不做任何明示或暗示的保證，您理解並了解數字資產市場是不穩定的，價格和價值隨時會大幅波動或崩盤，交易數字資產是您個人的自由選擇及決定且自行承擔風險及可能產生的損失。</p>
<p>8.7 本協議中規定的我們的保證和承諾是由我們就本協議和本網站提供的服務的唯一保證和陳述，並取代任何其他途徑和方式產生的保證和承諾，無論是書面的或口頭的， 明示的或暗示的。所有這些保證和陳述僅僅代表我們自身的承諾和保證，並不保證任何第三方遵守本協議中的保證和承諾。</p>
<p>8.8 我們並不放棄本協議中未提及的在法律適用的最大範圍內我們享有的限制、免除或抵銷我們損害賠償責任的任何權利。</p>
<p>8.9 您註冊後即表示認可我們按照本協議中規定的規則進行的任何操作，產生的任何風險均由您承擔。</p>
<p class='sub-title'>九、協議的終止</p>
<p>9.1 本網站有權依據本協議約定註銷您的本網站賬號，本協議於賬號註銷之日終止。</p>
<p>9.2 本網站有權依據本協議約定終止全部本網站服務，本協議於本網站全部服務終止之日終止。</p>
<p>9.3 本協議終止後，您無權要求本網站繼續向其提供任何服務或履行任何其他義務，包括但不限於要求本網站為您保留或向您披露其原本網站賬號中的任何信息， 向您或第三方轉發任何其未曾閱讀或發送過的信息等。</p>
<p>9.4 本協議的終止不影響守約方向違約方要求其他責任的承擔。</p>
<p class='sub-title'>十、知識產權</p>
<p>10.1 本網站所包含的全部智力成果包括但不限於網站標誌、數據庫、網站設計、文字和圖表、軟件、照片、錄像、音樂、聲音及其前述組合，軟件編譯、相關源代碼和軟件 (包括小應用程序和腳本) 的知識產權權利均歸本網站所有。您不得為商業目的復制、更改、拷貝、發送或使用前述任何材料或內容。</p>
<p>10.2 本網站名稱中包含的所有權利 (包括但不限於商譽和商標、標誌) 均歸公司所有。</p>
<p>10.3 您接受本協議即視為您主動將其在本網站發表的任何形式的信息的著作權， 包括但不限於：復制權、發行權、出租權、展覽權、表演權、放映權、廣播權、信息網絡傳播權、攝制權、改編權、翻譯權、匯編權 以及應當由著作權人享有的其他可轉讓權利無償獨家轉讓給本網站所有，本網站有權利就任何主體侵權單獨提起訴訟並獲得全部賠償。 本協議效力及於您在本網站發布的任何受著作權法保護的作品內容， 無論該內容形成於本協議簽訂前還是本協議簽訂後。</p>
<p>10.4 您在使用本網站服務過程中不得非法使用或處分本網站或他人的知識產權權利。您不得將已發表於本網站的信息以任何形式發布或授權其它網站（及媒體）使用。</p>
<p>10.5 您登陸本網站或使用本網站提供的任何服務均不視為我們向您轉讓任何知識產權。</p>
<p class='sub-title'>十一、信息保護</p>
<p>11.1 適用範圍</p>
<p>11.1.1 在您註冊網站賬號或者使用賬戶時，您根據本網站要求提供的個人註冊信息，包括但不限於電話號碼、郵箱信息、身份證件信息。</p>
<p>11.1.2 在您使用本網站服務時，或訪問本網站網頁時，本網站自動接收並記錄的您瀏覽器上的服務器數值，包括但不限於IP地址等數據及您要求取用的網頁記錄。</p>
<p>11.1.3 本網站收集到的您在本網站進行交易的有關數據，包括但不限於交易記錄。</p>
<p>11.1.4本網站通過合法途徑取得的其他您個人信息。</p>
<p>11.2 信息使用</p>
<p>11.2.1 不需要您額外的同意，您在本網站註冊成功即視為您同意本網站收集並使用其在本網站的各類信息，如11.1條所列，您了解並同意，本網站可以將收集的您信息用作包括但不限於下列用途：</p>
<p>11.2.1.1 向您提供本網站服務；</p>
<p>11.2.1.2 基於主權國家或地區相關主管部門的要求向相關部門進行報告；</p>
<p>11.2.1.3 在您使用本網站服務時，本網站將您的信息用於身份驗證、客戶服務、安全防範、詐騙監測、存檔和備份用途，確保本網站向您提供的產品和服務的安全性；</p>
<p>11.2.1.4 幫助本網站設計新產品及服務，改善本網站現有服務；</p>
<p>11.2.1.5為了使您解本網站服務的具體情況，您同意本網站向其發送營銷活動通知、商業性電子信息以及提供與您相關的廣告以替代普遍投放的廣告；</p>
<p>11.2.1.6 本網站為完成合並、分立、收購或資產轉讓而將您的信息轉移或披露給任何非關聯的第三方；</p>
<p>11.2.1.7 軟件認證或管理軟件升級；</p>
<p>11.2.1.8 邀請您參與有關本網站服務的調查；</p>
<p>11.2.1.9 用於和政府機關、公共事務機構、協會等合作的數據分析；</p>
<p>11.2.1.10 用作其他一切合法目的以及經您授權的其他用途。</p>
<p>11.2.2 本網站不會向其他任何人出售或出借您的個人信息，除非事先得到您的許可。本網站也不允許任何第三方以任何手段收集、編輯、出售或者無償傳播您的個人信息。</p>
<p>11.3 本網站對所獲得的客戶身份資料和交易信息等進行保密，不得向任何單位和個人提供客戶身份資料和交易信息，應相關主權國家或地區法律法規、政令、命令等規定要求本網站提供的除外。</p>
<p class='sub-title'>十二、計算</p>
<p>所有的交易計算結果都經過我們的核實，所有的計算方法都已經在網站上公示，但是我們不能保證網站的使用不會受到幹擾或沒有誤差。</p>
<p class='sub-title'>十三、轉讓</p>
<p>本協議中約定的權利及義務同樣約束從該權利義務中獲取到利益的各方的受讓人，繼承人，遺囑執行人和管理員。您不得在我們不同意的前提下轉讓給任何第三人，但我們可隨時將我們在本協議中的權利和義務轉讓給任何第三人，並給予您提前30天的通知。</p>
<p class='sub-title'>十四、可分割性</p>
<p>如本協議中的任何條款被任何有管轄權的法院認定為不可執行的，無效的或非法的，並不影響本協議的其余條款的效力。</p>
<p class='sub-title'>十五、非代理關系</p>
<p>本協議中的任何規定均不可被認為創造了、暗示了或以其他方式將我們視為您的代理人、受托人或其他代表人，本協議有其他規定的除外。</p>
<p class='sub-title'>十六、棄權</p>
<p>我們或您任何一方對追究本協議約定的違約責任或其他責任的棄權並不能認定或解釋為對其他違約責任的棄權；未行使任何權利或救濟不得以任何方式被解釋為對該等權利或救濟的放棄。</p>
<p class='sub-title'>十七、標題</p>
<p>所有標題僅供協議表述方便，並不用於擴大或限制該協議條款的內容或範圍。</p>
<p class='sub-title'>十八、協議的生效和解釋</p>
<p>18.1 本協議於您點擊本網站註冊頁面的同意註冊並完成註冊程序、獲得本網站賬號和密碼時生效，對本網站和您均具有約束力。</p>
<p>18.2 本協議的最終解釋權歸本網站所有。</p>
<h2  class='title'>了解妳的客戶和反洗錢政策</h2>
<p class='sub-title'>一、導言</p>
<p>1.1我們保證審慎遵守“了解妳的客戶”和反洗錢相關的法律法規且不得故意違反該《了解妳的客戶和反洗錢政策》。在我們合理控制的範圍內我們將采取必要的措施和技術為您提供安全的服務，盡可能使您免於遭受犯罪嫌疑人的洗錢行為帶來的損失。</p>
<p>1.2我們的了解妳的客戶和反洗錢政策是一個綜合性的國際政策體系，包括您隸屬的不同法律轄區的了解妳的客戶和反洗錢政策。我們健全合規的框架確保我們在本地和全球層面均符合監管要求和監管水平，並確保本網站持續性運行。</p>
<p class='sub-title'>二、了解妳的客戶和反洗錢政策如下：</p>
<p>2.1頒布了解妳的客戶和反洗錢政策並時時更新以滿足相應的法律法規規定的標準；</p>
<p>2.2頒布和更新運行本網站的一些指導原則和規則，且我們的員工將按照該原則和規則的指導提供服務；</p>
<p>2.3 設計並完成內部監測和控制交易的程序，如以嚴格的手段驗證身份，安排組建專業團隊專門負責反洗錢工作；</p>
<p>2.4 采用風險預防的方法對客戶進行盡職調查和持續的監督;</p>
<p>2.5 審查和定期檢查已發生的交易;</p>
<p>2.6 向主管當局報告可疑交易;</p>
<p>2.7身份證明文件、地址證明文件和交易記錄的證明文件將會維持至少六年，如被提交給監管部門，恕不另行通知您。</p>
<p>2.8 整個交易過程中，信用卡被禁止使用；</p>
<p class='sub-title'>三、身份信息與核實確認</p>
<p>3.1 身份信息</p>
<p>3.1.1 根據不同的司法管轄區的不同規定及不同的實體類型，我們收集的您的信息內容可能不一致，原則上將向註冊的個人收集以下信息：</p>
<p>個人基本信息：您的姓名，住址（及永久地址，如果不同） ，出生日期及國籍等可獲得的其他情況。身份驗證應該是根據官方或其他類似權威機構發放的文件，比如護照，身份證或其他不同的轄區要求的和引發的身份證明文件。您提供的地址將使用適當的方法進行驗證，比如檢查乘用交通工具的票據或利率票據或檢查選民登記冊等。</p>
<p>有效的照片：在您註冊之前，您須提供您將您的身份證件放在胸前的照片；</p>
<p>聯系方式：電話/手機號碼和/或有效的電子郵件地址。</p>
<p>3.1.2如果您是一個公司或其他合法實體，我們將收集以下信息以確定您或信托帳戶的最終受益人。</p>
<p>公司註冊、登記證；公司的章程與備忘錄副本；公司的股權機構和所有權說明的詳細證明材料，證明決定本網站賬戶的開立以及執行的授權委托人的董事會決議；按照要求需要提供的公司董事、大股東及本網站賬戶有權簽字人的身份證明文件；該公司的主要營業地址，如果與公司的郵寄地址不同，提供郵寄地址。如果公司在本地的地址與它的主要營業地址不一致的，則被視為風險較高的客戶，需要提交額外附加文件。</p>
<p>•根據不同的司法管轄區的不同規定及不同的實體類型，我們要求的其他認證和權威部門發布的文件以及我們認為必要的文件。</p>
<p>3.1.3 我們只接受英語版本或漢語版本的身份信息，如不是，請您將您的身份信息翻譯成英文的版本並加以公證。</p>
<p>3.2確認核實</p>
<p>3.2.1我們要求您提供身份證明文件的全部頁面內容。</p>
<p>3.2.2 我們要求您提供您將您的身份證明文件放在您胸前的照片。</p>
<p>3.2.3證明文件的副本一般應核和原始憑證進行核對。然而，如果某個可信賴的合適的認證人可證明該副本文件是原始文件準確而全面的復制的，該副本可接受。這樣的認證人包括大使、司法委員、地方治安官等。</p>
<p>3.2.4 對識別最終受益人和賬戶控制權的要求是確定哪些個人最終所有或控制直接客戶，和/或確定正在進行的交易是由他人代為執行。如果是企業，則大股東的身份（例如那些持有10％或以上的投票權益）應被驗證。一般，持股25 ％會被認定為正常風險內，其股東身份須驗證；持股10%或擁有更多的投票權或股票時被認定為高風險的情況，股東身份須加以驗證。</p>
<p class='sub-title'>四、監控交易</p>
<p>4.1 我們根據安全性和實際交易情況時時設置和調整日常交易和提幣最高限額;</p>
<p>4.2如果交易頻繁集中發生在某個註冊用戶或存在超乎合理的情況，我們的專業團隊將評估並決定他們是否可疑;</p>
<p>4.3我們憑借自身的判斷認定為可疑交易的情況，我們可能會采取暫停該交易、拒絕該交易等限制性措施，甚至如果可能將盡快逆轉該交易，同時向主管部門報告，但不會通知您;</p>
<p>4.4我們保留拒絕來自於不符合國際反洗錢標準轄區的人或可被視為政治公眾人物的人的註冊申請，我們保留隨時暫停或終止根據我們自身判斷為可疑交易的交易，但我們這樣做並不違反對您的任何義務和責任。</p>`
language['en-US'] = `<h1 class='title'>User Agreement</h1><p class='underline'></p>
<p>https://www.otcmaker.com (hereinafter referred to as 'this Website' or 'the Website'), which is a platform dedicated to the transaction of digital assets and the provision of related services (hereinafter referred to as 'the Service'). For the convenience of wording in this Agreement, the Website is referred to as 'We' or other applicable forms of first person pronouns in this Agreement. All natural persons or other subjects who log onto this Website shall be users of this Website. For the convenience of wording in this Agreement, the users are referred to as 'You' or any other applicable forms of the second-person pronouns. For the convenience of wording in this Agreement, you and us are collectively referred to as “both parties”, and individually as “one party”.</p>
<p>Important reminder:</p>
<p class='sub-title'>We hereby remind you that:</p>
<p>1. The digital assets themselves are not offered by any financial institution, corporation or this Website;</p>
<p>2. The digital asset market is new and unconfirmed, and will not necessarily expand;</p>
<p>3. Digital assets are primarily used by speculators, and are used relatively less on retail and commercial markets; digital asset transactions are highly risky, due to the fact that they are traded throughout 24-hour a day without limits on the rise or fall in price, and market makers and global government policies may cause major fluctuations in their prices;</p>
<p>4. Digital asset transactions may be suspended or prohibited at any time due to the enactment or modification of national laws, regulations and regulatory documents.</p>
<p>Digital assets trading is highly risky and therefore not suitable for the vast majority of people. You acknowledge and understand that investment in digital assets may result in partial or total loss of your investment and therefore you are advised to decide the amount of your investment on the basis of your loss-bearing capacity. You acknowledge and understand that digital assets may generate derivative risks. Therefore, if you have any doubt, you are advised to seek assistance from a financial adviser first. Furthermore, aside from the above-mentioned risks, there may also be unpredictable risks. Therefore, you are advised to carefully consider and use clear judgment to assess your financial position and the abovementioned risks before making any decisions on buying and selling digital assets; any and all losses arising therefrom will be borne by you and we shall not be held liable in any manner whatsoever.</p>
<p class='sub-title'>You are hereby informed that:</p>
<p>1. You understand that this Website is only intended to serve as a venue for you to obtain digital asset information, find trading counterparties, hold negotiations on and effect transactions of digital assets. This Website does not participate in any of your transactions, and therefore you shall, at your sole discretion, carefully assess the authenticity, legality and validity of relevant digital assets and/or information, and solely bear the responsibilities and losses that may arise therefrom.</p>
<p>2. All opinions, information, discussions, analyses, prices, advice and other information on this Website are general market reviews and do not constitute any investment advice. We do not bear any loss arising directly or indirectly from reliance on the abovementioned information, including but not limited to, any loss of profits.</p>
<p>3. The content of this Website may be changed from time to time and at any time without notice, and we have taken reasonable measures to ensure the accuracy of the information on the Website; however, we do not guarantee the degree of such accuracy, or bear any loss arising directly or indirectly from the information on this Website or from any delay or failure caused by failure to link up with the internet, transmit or receive any notice and information.</p>
<p>4. Using internet-based trading systems also involves risks, including but not limited to failures in software, hardware or Internet links, etc. In view of the fact that we cannot control the reliability and availability of the Internet, we will not be responsible for any distortion, delay and link failure.</p>
<p>5. https://www.otcmaker.com/ is the sole official external information release platform for this Website;</p>
<p>6. No service on this Website may be paid for by credit card;</p>
<p>7. It is prohibited to use this Website for any illegal activities, such as money-laundering, smuggling and commercial bribery. Upon uncovering any of such illegal activities, this Website will adopt all available measures, including but not limited to freezing accounts, notifying the relevant authorities and so on, and in this case, we shall not assume any of the responsibilities arising therefrom, and reserve the right to hold the relevant persons accountable.</p>
<p class='sub-title'>1. General Provisions</p>
<p>1.1 The User Agreement (hereinafter referred to as 'this Agreement' or 'these Terms and Conditions') consists of the main body, Terms of Privacy, Understanding Your client and Anti-money-laundering Policy, as well as any rules, statements, instructions, etc. that this Website has published or may publish in the future.</p>
<p>1.2 Before using any service offered by this Website, you shall read this Agreement carefully, and consult a professional lawyer if you have any doubt or as may be otherwise necessary. If you do not agree to the Terms and Conditions of this Agreement and/or any change made thereto from time to time and at any time, please immediately stop using the service provided by this Website or stop logging into this Website. Upon your logging into this Website or using any service offered by this Website or engaging in any other similar activity, it shall be deemed as You have understood and fully agreeing to all terms and conditions of this Agreement, including any and all changes, modifications or alterations that this Website may make to this Agreement from time to time and at any time.</p>
<p>1.3 After filling in the relevant information in accordance with the requirements of this Website, and going through other relevant procedures, you will successfully register yourself as a member of this Website (hereinafter referred to as 'Member'); in the process of registration, if you click on the 'I Agree', it shall be deemed that you have reached an agreement with the Company by way of electronic signature; or when you use this Website, you click on the “I Agree” button or a similar button, or if you use the services offered by this Website in any of the ways allowed by this Website, it shall be deemed that you fully understand, agree to and accept all the Terms and Conditions under this Agreement, and in this case, the absence of your handwritten signature will not affect the legal binding force that this Agreement may have on you.</p>
<p>1.4 After you become a member of this Website, you will receive a member account and corresponding password, which shall be properly kept by you as a member of this Website; Members shall be liable for all activities and events carried out through their accounts.</p>
<p>1.5 You cannot engage in trading digital asset by this Website and gain access to the services that are exclusively available to members in accordance with the rules and regulations of this Website, unless and until You become a member of this Website; if You are not a member of this Website, You can only log into and browse the Website and have access to other services as are permitted by the rules and regulations of this Website.</p>
<p>1.6 Upon registering yourself as a member of this Website and using any of the services and functions offered by this Website, it shall be deemed that You have read, understood this Agreement, and:</p>
<p>1.6.1 accepted to be bound by all Terms and Conditions of this Agreement;</p>
<p>1.6.2 You confirm that you have attained the age of 16, or another statutory age for entering into contracts as is required by a different applicable law, and have sufficient capacity to accept these terms and conditions herein, to enter into a transaction, and to use this Website for digital asset transactions.</p>
<p>1.6.3 You undertake that all your digital assets involved in transactions hereunder are legally acquired and owned by You.</p>
<p>1.6.4 You agree to undertake any and all liabilities for your own transaction and non-transaction activities as well as any and all profits and losses therefrom.</p>
<p>1.6.5 You confirm that the information provided at the time of registration is true and accurate.</p>
<p>1.6.6 You agree to comply with any and all relevant laws, including the reporting of any transaction profits for tax purposes.</p>
<p>1.6.7 This Agreement is only binding on the rights and obligations between You and us, and does not involve any legal relations and legal disputes arising from and relating to the transaction of digital assets between the users of this Website, and between other websites and You.</p>
<p class='sub-title'>2. Amendment of this Agreement</p>
<p>We reserve the right to amend this Agreement from time to time, and disclose such amendment by way of announcement on the Website without sending a separate notice to You on your rights. The date when the amendment is made will be indicated on the first page of the amended agreement. The amended agreement will take effect immediately upon announcement on the Website. You shall browse this Website from time to time and follow information on the time and content of amendments, if any, made to this Agreement. If You do not agree with the amendments, you shall stop using the services offered by this Website immediately; if You continue to use the services offered by this Website, it shall be deemed that You accept and agree to be bound by the amended agreement.</p>
<p class='sub-title'>3. Registration</p>
<p>3.1 Eligibility for Registration</p>
<p>You confirm and promise that: you shall be a natural person, legal person or other organization with the ability to sign this Agreement and the ability to use the services of this Website, as is provided by applicable laws, when you complete the registration process or when you use the services offered by this Website in any other manner as is otherwise permitted by this Website. Upon clicking on the button indicating that you agree to register, it shall be deemed that you yourself or your authorized agent agrees to the content of this Agreement and your authorized agent will register with this Website and use the services offered by this Website on your behalf. If you are not a natural person, legal person or organization with the abovementioned ability, you and your authorized agent shall bear all the consequences of that, and the company reserves the right to cancel or permanently freeze your account and to hold you and your authorized agent accountable.</p>
<p>3.2 Purpose of Registration</p>
<p>You confirm and promise that you do not register with this Website for the purpose of violating any of the applicable laws or regulations or undermining the order of digital asset transactions on this Website.</p>
<p>3.3 Registration Process</p>
<p>3.3.1 You agree to provide a valid email address, a mobile phone number and other information in accordance with the requirements on the user registration page of this Website. You can use the email address, mobile phone number or any other manner permitted by this Website to log in to this Website. Where it is necessary and in accordance with the requirements of applicable laws and regulations of relevant jurisdictions, you shall provide your real name, identity card and other information required by applicable laws, regulations, the Terms of Privacy, and anti-money-laundering terms, and constantly update your registration data so that they will be timely, detailed and accurate as is required. All of the original typed data will be referenced as registration information. You shall be responsible for the authenticity, integrity and accuracy of such information and bear any direct or indirect loss and adverse consequences arising out of it.</p>
<p>3.3.2 After you provide the required registration information in a legal, complete and valid manner and such information passes relevant verification, you shall have the right to obtain an account and a password of this Website. Upon obtaining such account and password, your registration shall be deemed as successful and you can log into this Website as a member thereof.</p>
<p>3.3.3 You agree to receive emails and/or short messages sent by this Website related to the management and operation thereof.</p>
<p class='sub-title'>4. Services</p>
<p>This Website only provides online transaction platform services for you to engage in digital asset trading activities through this Website (including but not limited to the digital asset transactions etc.). This Website does not participate in the transaction of digital assets as a buyer or seller; This Website does not provide any services relating to the replenishment and withdrawal of the legal currency of any country.</p>
<p>4.1 Content of Services</p>
<p>4.1.1 You have the right to browse the transaction information of digital asset products on this Website, to submit digital asset transaction request and to complete the digital asset transaction through this Website.</p>
<p>4.1.2 You have the right to view information under the member accounts on this Website and to apply the functions provided by this Website.</p>
<p>4.1.3 You have the right to participate in the website activities organized by this Website in accordance with the rules of activities posted on this Website.</p>
<p>4.1.4 Other services that this Website promises to offer to you.</p>
<p>4.2 Service Rules</p>
<p>You undertake to comply with the following service rules of this Website:</p>
<p>4.2.1 You shall comply with the provisions of applicable laws, regulations, rules, and policy requirements, and ensure the legality of the source of all digital assets in your account, and shall refrain from engaging in any illegal activities or other activities that damages the rights and interests of this Website or any third party, such as sending or receiving information that is illegal, illicit or infringes on the rights and interests of any other person, sending or receiving pyramid scheme information or information or remarks causing other harms, unauthorized use or falsification of the email header information of this Website, inter alia.</p>
<p>4.2.2 You shall comply with applicable laws and regulations and properly use and keep your account in this Website and login password, password of your financial transactions, and the mobile phone number bound with your account that you provide for your account, as well as the security of the verification codes received via your mobile phone. You shall be solely responsible for any and all your operations carried out using your account with this Website and login password, financial transaction password, verification codes sent to your mobile phone, as well as all consequences of such operations. When you find that your account with this Website, your login password, financial transaction password, or mobile phone verification codes is used by any unauthorized third party, uncover any other problem relating to the security of your account, you shall inform this Website in a prompt and effective manner, and request this Website to temporarily suspend the services to your account with this Website. This Website shall have the right to take action on your request within a reasonable time; nonetheless, this Website does not bear any liability for the consequences that have arisen before such action is taken, including but not limited to any loss that you may sustain. You may not assign your account with this Website to any other person by way of donation, lending, leasing, transfer or otherwise without the consent of this Website.</p>
<p>4.2.3 You agree to take responsibility for all activities (including but not limited to information disclosure, information release, online click-approving or submission of various agreements on rules, online renewal of agreements or purchase service) using your account and password with this Website.</p>
<p>4.2.4 In your digital asset transactions on this Website, you may not maliciously interfere with the normal proceeding of the digital asset transaction or disrupt the transaction order; you may not use any technical means or other means to interfere with the normal operation of this Website or interfere with the other users’ use of the services; you may not maliciously defame the business goodwill of this Website on the ground of falsified fact.</p>
<p>4.2.5 If any dispute arises between you and any other user in connection with online transaction, you may not resort to any means other than judicial or governmental means to request this Website to provide relevant information.</p>
<p>4.2.6 All taxes payable as well as all fees relating to hardware, software and services that are incurred by you in the course of using the services provided by this Website shall be solely borne by you.</p>
<p>4.2.7 You shall abide by this Agreement and other terms of service and operating rules that this Website may release from time to time, and you have the right to terminate your use of the services provided by this Website at any time.</p>
<p class='sub-title'>5. Rights and Obligations of this Website</p>
<p>5.1 If you do not have the registration qualifications agreed on in this Agreement, this Website shall have the right to refuse to allow you to register; if you have already registered, this Website shall have the right to revoke your member account, and this Website reserves the right to hold you or your authorized agent accountable. Furthermore, this Website reserves the right to decide whether to accept your application for registration under any other circumstances.</p>
<p>5.2 When this Website finds out that the user of an Account is not the initial registrant of that Account, it shall have the right to suspend or terminate the user’s access to that Account.</p>
<p>5.3 Where by means of technical testing or manual sampling, among others, this Website reasonably suspects that the information you provide is wrong, untrue, invalid or incomplete, this Website shall have the right to notify you to correct or update the information, or suspend or terminate its supply of the services to you.</p>
<p>5.4 This Website shall have the right to correct any information displayed on this Website when it uncovers any obvious error in such information.</p>
<p>5.5 This Website reserves the right to modify, suspend or terminate the Services offered by this Website, at any time, and the right to modify or suspend the Service without prior notice to you; if this Website terminates one or more of the Services offered by this Website, such termination by this Website will take effect on the date of announcement of such termination on the Website.</p>
<p>5.6 This Website shall take necessary technical means and management measures to ensure the normal operation of this Website, and shall provide a necessary and reliable trading environment and transaction services, and shall maintain the order of digital assets trading.</p>
<p>5.7 If you fail to log into this Website using your member account number and password for an uninterrupted period of one year, this Website shall have the right to revoke your account. After your account is revoked, this Website shall have the right to offer the member name represented by such account to other applicants for membership.</p>
<p>5.8 This Website shall ensure the security of your digital assets by strengthening technical input and enhancing security precautions, and is under the obligation to notify you in advance of the foreseeable security risks in your account.</p>
<p>5.9 This Website shall have the right to delete all kinds of content and information which does not conform to laws and regulations or the rules of this Website at any time, and exercise of this right by this Website is not subject to a prior notice to you.</p>
<p>5.10 This Website shall have the right to, in accordance with the applicable laws, administrative regulations, rules, orders and other regulatory documents of the sovereign country or region where you are based, request to you for more information or data, and to take reasonable measures to meet the requirements of the local standards, and you have the obligation to provide proper assistance to such measures; this Website shall have the right to suspend or permanently terminate your access to this Website as well as part or all of the services offered by this Website.</p>
<p class='sub-title'>6. Indemnity</p>
<p>6.1 Under any circumstance, our liability for your direct damage will not exceed the total cost incurred by your three (3) months’ use of services offered by this Website.</p>
<p>6.2 If you breach this Agreement or any applicable law or administrative regulation, you shall pay to us at least US$ Two million in compensation and bear all the expenses in connection with such breach (including attorney's fees, among others). If such compensation cannot cover the actual loss, you shall make up for the difference.</p>
<p class='sub-title'>7. The Right to Injunctive Relief</p>
<p>Both you and we acknowledge that common law remedies for breach of agreement or possible breach of contract may be insufficient to cover all the losses that we sustain; therefore, in the event of a breach of contract or a possible breach of contract, the non-breaching party shall have the right to seek injunctive relief as well as all other remedies that are permitted under common law or equity.</p>
<p class='sub-title'>8. Limitation and Exemption of Liability</p>
<p>8.1 You understand and agree that under no circumstance will we be held liable for any of the following events:</p>
<p>8.1.1 loss of income;</p>
<p>8.1.2 loss of transaction profits or contractual losses;</p>
<p>8.1.3 disruption of the business;</p>
<p>8.1.4 loss of expected currency losses;</p>
<p>8.1.5 loss of information;</p>
<p>8.1.6 loss of opportunity, damage to goodwill or reputation;</p>
<p>8.1.7 damage or loss of data;</p>
<p>8.1.8 cost of purchasing alternative products or services;</p>
<p>8.1.9 any indirect, special or incidental loss or damage arising from any infringement (including negligence), breach of contract or any other cause, regardless of whether or not such loss or damage may reasonably be foreseen by us, and regardless of whether or not we are notified in advance of the possibility of such loss or damage.</p>
<p>8.1.1 Items 8.1.1 to 8.1.9 are independent of each other.</p>
<p>8.2 You understand and agree that we shall not be held liable for any damages caused by any of the following events:</p>
<p>8.2.1 Where we are properly justified in believing that your specific transactions may involve any serious violation or breach of law or agreement;</p>
<p>8.2.2 Where we are properly justified in believing that your conduct on this Website is suspected of being illegal or improper;</p>
<p>8.2.3 The expenses and losses arising from the purchase or acquisition of any data, information or transaction, etc. through the services offered by this Website;</p>
<p>8.2.4 Your misunderstanding of the Services offered by this Website;</p>
<p>8.2.5 Any other losses related to the services provided by this Website, which cannot be attributed to us.</p>
<p>8.3 Where we fail to provide the Services or delay in providing such Services due to information network equipment maintenance, information network connectivity failures, errors in computer, communications or other systems, power failures, weather conditions, unexpected accidents, industrial actions, labor disputes, revolts, uprisings, riots, lack of productivity or production materials, fires, floods, storms, explosions, wars, failure on the part of banks or other partners, collapse of the digital asset market, actions by government, judicial or administrative authorities, other acts that are not within our control or beyond our inability to control, or due to causes on the part of third parties, we shall not assume any responsibility for such failure to provide service or delay in providing services, or for the resultant loss you may sustain as a result of such failure or delay.</p>
<p>8.4 We cannot guarantee that all the information, programs, texts, etc. contained in this Website are completely safe, free from the interference and destruction by any malicious programs such as viruses, trojans, etc., therefore, your log-into this Website or use of any services offered by this Website, download of any program, information and data from this Website and your use thereof are your personal decisions and therefore you shall bear the any and all risks and losses that may possibly arise.</p>
<p>8.5 We do not make any warranties and commitments in connection with any of the information, products and business of any third party websites linked to this Website, as well as any other forms of content that do not belong to us; your use any of the services, information, and products provided by a third party website is your personal decision and therefore you shall assume any and all the responsibilities arising therefrom.</p>
<p>8.6 We do not make any explicit or implicit warranties regarding your use of the Services offered by this Website, including but not limited to the applicability, freedom from error or omission, consistency, accuracy, reliability, and applicability to a specific purpose, of the services provided by this Website. Furthermore, we do not make any commitment or guarantee in connection with the validity, accuracy, correctness, reliability, quality, stability, integrity and timeliness of the technology and information covered by the services offered by this Website. Whether to log in this Website or use the services provided by this Website is your personal decision and therefore you shall bear all the risks and possible losses arising from such decision. We do not make any explicit or implicit warranties in connection with the market, value and price of digital assets; you understand and acknowledge that the digital asset market is unstable, that the price and value of assets may fluctuate or collapse at any time, and that the transaction of digital assets is based on your personal free will and decision and therefore you shall assume any and all risks and losses that may possible arise therefrom.</p>
<p>8.7 The guarantees and undertakings specified in this Agreement shall be the only guarantee and statements that we make in connection with the Services provided by us under this Agreement and through this Website, and shall supersede any and all the warranties and commitments arising in any other way and manner, whether in writing or in words, express or implied. All these guarantees and statements represent only our own commitments and undertakings and do not guarantee any third party's compliance with the guarantees and commitments contained in this Agreement.</p>
<p>8.8 We do not waive any of the rights not mentioned in this Agreement and to the maximum extent permitted by the applicable law, to limit, exempt or offset our liability for damages.</p>
<p>8.9 Upon your registration of your account with this Website, it shall be deemed that you approve any and all operations performed by us in accordance with the rules set forth in this Agreement, and any and all risks arising from such operations shall be assumed by you.</p>
<p class='sub-title'>9. Termination of this Agreement</p>
<p>9.1 This Website shall have the right to cancel your account with this Website in accordance with this Agreement, and this Agreement shall be terminated on the date of the cancellation of your account.</p>
<p>9.2 This Website shall have the right to terminate all Service offered by this Website to you in accordance with this Agreement, and this Agreement shall terminate on the date of termination of all services offered by this Website to you.</p>
<p>9.3 After the termination of this Agreement, you do not have the right to require this Website to continue to provide you with any service or perform any other obligation, including, but not limited to, requesting this Website to keep or disclose to you any information in your former original account, or to forward to you or any third party any information therein that is not read or sent.</p>
<p>9.4 The termination of this Agreement shall not prevent the observant party from demanding the breaching party to assume other liabilities.</p>
<p class='sub-title'>10. Intellectual Property</p>
<p>10.1 All intellectual achievements included in this Website, including, but not limited to, website logos, databases, website design, text and graphics, software, photos, videos, music, sounds and any combinations of the aforementioned files, and the intellectual property rights of software compilation, associated source code and software (including small applications and scripts) shall be owned by this Website. You may not copy, modify, copy, transmit or use any of the foregoing materials or content for commercial purposes.</p>
<p>10.2 All rights contained in the name of this Website (including but not limited to business goodwill and trademarks, logos) shall be owned by the Company.</p>
<p>10.3 Upon accepting this Agreement, it shall be deemed that you, on the basis of your own free will, have transferred and assigned exclusively and free of charge to this Website all copyright of any form of information that you publish on this Website, including, but not limited to copyrights, distribution rights, lease rights, exhibition rights, performance rights, projection rights, broadcasting rights, information network dissemination rights, shooting rights, adaptation rights, translation rights, compilation rights and other transferable rights that copyright owners are entitled to, and this Website shall have the right to sue for any infringement on such copyright and obtain full compensation for such infringement. This Agreement shall apply to any content that is published by you on this Website and is protected by copyright law, regardless of whether the content is generated before or after the signing of this Agreement.</p>
<p>10.4 You shall not illegally use or dispose of the intellectual property rights of this Website or any other person during your use of the services offered by this Website. For any information that you publish on this Website, you may not publish or authorize other websites (or media) to use such information in any manner whatsoever.</p>
<p>10.5 Your log into this Website or use of any of the services offered by this Website shall not be seemed as our transfer of any intellectual property to you.</p>
<p class='sub-title'>11. Information protection</p>
<p>11.1. Scope of Application</p>
<p>11.1.1 When you register your account with this Website or use your account with this Website, you shall provide personal registration information in accordance with the requirements of this Website, including but not limited to your telephone number, email address, and identity card information.</p>
<p>11.1.2 When you use the services offered by this Website, or visit this Website, this Website will automatically receive and record the server information of your web browser, including but not limited to the IP address and records on the web pages that you request to access.</p>
<p>11.1.3 The relevant data collected by this Website in connection with your transactions on this Website, including but not limited to transaction records.</p>
<p>11.1.4 Other personal information of yours legally obtained by this Website.</p>
<p>11.2 Use of Information</p>
<p>11.2.1 Upon your successful registration with this Website and without extra consent from you, it shall be deemed that you agree to permit this Website to collect and use all the information you publish on this Website; as is specified under 11.1 hereof, you acknowledge and agree that this Website can use your information collected by this Website for certain purposes, including but not limited to the following:</p>
<p>11.2.1.1 providing you with the services offered by this Website;</p>
<p>11.2.1.2 Reporting to relevant regulatory departments based on the requirements of the competent authorities in relevant sovereign states or regions;</p>
<p>11.2.1.3 When you use Services offered by this Website, this Website will use your information for the purposes of authentication, customer service, security, fraud monitoring, archiving, and backup, so as to ensure the security of the products and services that this Website offers to you;</p>
<p>11.2.1.4 Helping this Website design new products and services, improving the existing services offered by this Website;</p>
<p>11.2.1.5 In order to enable you to understand the specifics of the Services offered by this Website, you agree to permit this Website to send to your account marketing event information, commercial electronic information, and advertising that is related to you in replacement of general-purpose ubiquitous advertising;</p>
<p>11.2.1.6 This Website may transfer or disclose your information to any third party that is not a related party of this Website, for the purpose of completing merger, division, acquisition or transfer of assets;</p>
<p>11.2.1.7 Software certification or management software upgrade;</p>
<p>11.2.1.8 Inviting you to participate in surveys in connection with the services offered by this Website;</p>
<p>11.2.1.9 Data analysis relating to cooperation with government agencies, public affairs agencies, associations, etc;</p>
<p>11.2.1.10 For all other legal purposes as well as other purposes authorized by you.</p>
<p>11.2.2 This Website will not sell or lend your personal information to any other person unless your permission is obtained in advance. This Website also does not allow any third party to collect, edit, sell or gratuitously spread your personal information in any manner whatsoever.</p>
<p>11.3 This Website shall keep confidential the customer identity information and transaction information that it obtains, and shall not provide any entity or individual with customer identification information or transaction information, except where any of the applicable laws, regulations, decrees, orders, etc., of relevant sovereign states or regions requires this Website to provide such information.</p>
<p class='sub-title'>12. Calculation</p>
<p>All the transaction calculations are verified by us, and all the calculation methods have been posted on the Website, but we can not ensure that your use of this Website will not be disturbed or free from errors.</p>
<p class='sub-title'>13. Transfer</p>
<p>The rights and obligations agreed in this Agreement shall be equally binding on the assignees, the heirs, executors and administrators of the parties hereto who benefit from the rights and obligations. Without our consent, you may not transfer to any third party any of your rights or obligations hereunder, provided, however, we may, at any time, assign our rights and obligations under this Agreement to any third party with thirty (30) days' notice to you.</p>
<p class='sub-title'>14. Severability</p>
<p>If any provision of this Agreement is found unenforceable, invalid or illegal by any court of competent jurisdiction, validity of the remaining provisions of this Agreement shall not be affected.</p>
<p class='sub-title'>15. No Agency</p>
<p>Nothing in this Agreement shall be deemed to have created, implied or otherwise treated us as your agent, trustee or other representative, unless it is provided otherwise in this Agreement.</p>
<p class='sub-title'>16. Waiver</p>
<p>Our or your waiver of the right to hold the other party liable for breaches of agreement or any other liability as is agreed upon in this Agreement shall not be construed or deemed as a waiver of the right to hold the other party for other breaches of contract; a failure to exercise any right or remedy shall not be construed in any way as a waiver of such right or remedy.</p>
<p class='sub-title'>17. Headings</p>
<p>All headings herein are exclusively for the convenience of wording and are not intended to to expand or limit the content or scope of the terms and conditions of this Agreement.</p>
<p class='sub-title'>18. Entry into Force and Interpretation of the Agreement</p>
<p>18.1 This Agreement shall enter into force when you click through the registration page of this Website, complete the registration procedures, obtain your account number and password of this Website, and shall be binding on you and this Website.</p>
<p>18.2 The ultimate power of interpretation of this Agreement shall be vested in this Website.</p>
<h2  class='title'>Know-your-customer and Anti-Money Laundering Policies</h2>
<p class='sub-title'>1. Preamble</p>
<p>1.1 We ensure that we comply with know-your-customer and anti-money-laundering laws and regulations, and will not knowingly violate know-your-customers and anti-money-laundering policies. To the extent of our reasonable control, we will adopt necessary measures and technology to provide you with Services that are safe and secure, so as to protect you against the loss caused by money laundering to the greatest extent possible.</p>
<p>1.2 Our know-your-customer and anti-money-laundering policies are a comprehensive system of international policies, including the know-your-customer and anti-money-laundering policies of the jurisdictions to which you are subject to. Our robust compliance framework ensures that we meet regulatory requirements and regulatory standards on both the local and global levels, and ensure the operational sustainability of our website.</p>
<p class='sub-title'>2. Content of Our Know-Your-Customer and Anti-Money-Laundering Policies</p>
<p>2.1 We promulgate and update know-your-customers and anti-money-laundering policies to meet the standards set by relevant laws and regulations;</p>
<p>2.2 We promulgate and update some of the guidelines and rules in connection with the operation of this Website, and our staff will provide you whole-process service in accordance with the guidelines and rules;</p>
<p>2.3 We design and complete the procedures for internal monitoring and transaction control, such as rigorous identity authentication procedures, and form a professional team responsible for anti-money laundering;</p>
<p>2.4 We adopt risk-prevention-based approach to carry out due diligence and continuous supervision in connection with customers;</p>
<p>2.5 Review and regularly inspect existing transactions;</p>
<p>2.6 To report suspicious transactions to the competent authorities;</p>
<p>2.7 Proof documents of identity documents, address certificates and transaction records will be maintained for at least six(6) years; if they are submitted to the regulatory authorities, let it be understood that a separate notice will not be provided to you;</p>
<p>2.8 Credit cards are prohibited throughout the course of the transaction;</p>
<p class='sub-title'>3. Identity Information and the Verification and Confirmation Thereof</p>
<p>3.1 Identity Information</p>
<p>3.1.1 In accordance with the laws and regulations of relevant jurisdictions and in light of the nature of entities concerned, the content of your information as is collected by us may vary, and in principle, we will collect the following information of yours if you register as an individual:</p>
<p>Basic personal information: your name, address (and permanent address, if the two are different), date of birth and nationality, and other information available. Identity authentication shall be based on documents issued by the official or other similar authorities, such as passports, identity cards or other identity documents as are required and issued by relevant jurisdictions. The address you provide will be validated in an appropriate manner, such as checking the fare ticket of means of transportation you use, your interest rate bills, or voter register.</p>
<p>Valid photo: before you register, you must provide a photograph showing you holding your identity document in front of your chest;</p>
<p>Contact information: telephone/mobile phone number and valid email address.</p>
<p>3.1.2 If you are a company or any other type of legal entity, we will collect the following information of yours to determine the final beneficiary of your account or your trust account.</p>
<p>Your corporation enrollment and registration certificates of the company; a copy of the articles of association and memorandum of the company; the detailed certification materials of the ownership structure and ownership description of the company, and the decision of the board of directors on designating the authorized agent of the company responsible for the opening and execution of the account of the company with the website; the identity documents of the directors, major shareholders of the company as well as the authorized signatory for the company’s account with the website, as are required to be provided in accordance with relevant rules; the company's main business address, and the company's mailing address if it is different from the main business address of the company. If the local address of the company is different from its main business address, the company shall be deemed to be a high-risk customer, and consequently the company will be required to provide additional documentation.</p>
<p>Other certification documents, documents issued by competent authorities and other documents we may deem necessary in light of the laws and regulations of relevant jurisdictions and in light of the specific nature of your entity.</p>
<p>3.1.3 We only accept English and Chinese versions of your identity information; if your identity information is not in either of the two languages, you shall have your identity information translated into English and duly notarized.</p>
<p>3.2 Confirmation and Verification</p>
<p>3.2.1 You are required to provide both the front and back sides of your identity documents.</p>
<p>3.2.2 You are required to provide us with a photograph showing you holding your identity documents in front of your chest.</p>
<p>3.2.3 Copies of certification documents shall be checked against the originals thereof. Nonetheless, if a trusted and suitable certifier person can prove that such copies are accurate and comprehensive duplicates of the originals thereof, such copies shall be deemed as acceptable. Such certifiers include ambassadors, members of the judiciary, magistrates, etc.</p>
<p>3.2.4 The identification the ultimate beneficiary and controller of the account shall be based on the determination of which individuals ultimately own or control the direct customer and/or to determining that the ongoing transaction is performed by another person. If you are a business enterprise, the identity of major shareholders thereof (for example, those holding 10 % or more of the voting equity in such business enterprise) shall be verified. Generally, a shareholder holding 25 % of the shares of the company will be deemed as involving an average level of risk, and the identity of the shareholder shall be verified; a shareholder holding 10 % or more of the voting rights or shares is deemed to be involving a high level of risk, and the identity of the shareholder shall be verified.</p>
<p class='sub-title'>4. Transaction Supervision</p>
<p>4.1 We constantly set and adjust daily trading and cash withdrawal limits based on security requirement and actual state of transactions;</p>
<p>4.2 If the transaction occurs frequently in an account registered by you or is beyond reasonable circumstances, our professional team will assess and determine whether such transaction is suspicious;</p>
<p>4.3 If we identify a specific transaction as suspicious on the basis of our assessment, we may adopt such restrictive measures as suspending the transaction or denying the transaction, and if it is possible, we may even reverse the transaction as soon as possible, and report to the competent authorities, without, however, notifying you;</p>
<p>4.4 We reserve the right to reject registration applications by applicants that do not comply with the international standards against money laundering or who may be regarded as political and public figures; we reserve the right to suspend or terminate a transaction identified as suspicious based on our own assessment, which, however, does not breach any of our obligations and duties to you.</p>
<p>`
export default {
  data () {
    return {
      text: ''
    }
  },
  methods: {
    close () {
      this.$emit('close', 1)
    }
  },
  created () {
    this.text = language[$getLanguage()]
  }
}
</script>

<style lang="stylus" scoped>
  .agreement {
    line-height 1.5
    .content {
      margin-top $mintHeaderHeight
      height 100 - $mintHeaderHeight
      width 100vw
      overflow-y: scroll;
      .text {
        padding 5vh 6vw
      }
      .underline{
        border-bottom 1px solid #000000
      }
      .title {
        text-align center
        margin-bottom 2vh
      }
      .sub-title {
        font-size: 1.2rem
        margin-bottom: 1.5vh;
        margin-top: 2vh
        font-weight: 600;
      }
      p {
        margin-bottom 1vh
      }
    }
    .footer{
      height $footerHeight
      width 100vw
      display flex
      align-items center
      justify-content center
    }
  }
</style>
