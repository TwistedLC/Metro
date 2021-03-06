import React from 'react';
import { history } from 'umi';
import { Button } from 'antd';
import FooterToolbar from '@/components/FooterToolbar';

import '../index.less';
import { PageContainer } from '@ant-design/pro-layout';

// 合同模板预览
const Preview = () => {
  return (
    <PageContainer ghost title={false}>
      <div className="wrap">
        <p className="contractCode"> 合同编号：</p>
        <h1 className="label">商品采购配送合同</h1>
        <br />
        <div>
          <p>甲方：</p>
          <p>乙方：锦江麦德龙现购自运有限公司____________商场</p>
        </div>
        <br />
        <p>甲乙双方经过友好协商，就甲方自乙方处采购商品，乙方提供送货服务事宜达成协议如下：</p>
        <br />
        <div>
          <p>一、货款的支付</p>
          <p>
            1、鉴于甲乙双方已签署《信用顾客银行转帐购物保证协议》及其补充协议、《信用购货申请表》、《信用顾客授权书》及其他与申请信用顾客有关的文件（所有相关合同、文件以下统称“《信用顾客协议》”），甲方将按该协议的约定支付货款。乙方按规定提供完税发票。
            2、如甲方未能按照上述协议的约定付款，乙方有权不予送货而不构成违约。若甲方逾期5日不能按本合同的约定与乙方结清货款，乙方有权向甲方发出书面催款函，甲方应结清逾期未付的货款，并且乙方有权要求甲方承担逾期付款利息（自逾期之日起按中国人民银行规定的逾期贷款利率计算）。若甲方逾期付款超过30日，乙方有权解除合同，甲方应赔偿乙方由此遭受的全部损失。
          </p>
        </div>
        <br />
        <div>
          <p>
            二、订货和确认订货方式为甲方每天[]前通过传真、邮件方式向乙方下订单，乙方确认现有的货物品种后回复甲方。乙方确认订单后，订单生效。如果缺货，乙方应该尽快通知甲方，协商确认更换的品种。
          </p>
        </div>
        <br />
        <div>
          <p>三、送货和收货</p>
          <p>（一）乙方责任</p>
          <p>
            1、 乙方为甲方提供送货服务，并于收到甲方货物清单之次日 [
            上班时间]点将货物送到甲方指定的地点，即[ ]。该运输费用由[
            乙方]承担。到货后应协助乙方的工作人员清点验货进仓。
          </p>
          <p>
            2、 乙方不负责所配送的鲜活产品的自然损耗及数量差异，标准为：肉类 ±1%、鱼类 ±1%、蔬菜水果
            ±1%。
          </p>
          <p>
            3、
            乙方提供的商品必须符合国家关于商品、食品质量卫生、安全的相关法律规定，乙方可根据甲方的要求对生鲜食品提供相应的卫生检疫证明等文件。
          </p>
          <p>
            4、
            对于乙方销售的商品因质量问题导致甲方人员食物中毒或损害健康的，甲方应提供政府权威检验部门的检测证明，乙方应据此承担相应的法律责任。
          </p>
          <p>
            5、
            乙方为甲方提供每周商品报价或《邮报》，并按报价为甲方提供商品。未经报价商品，以乙方实际销售价格为准。
          </p>
          <p>（二）甲方责任</p>
          <p>1、 甲方在验货后方收货，甲方的签收视为甲方对所送货物的外包装状态及数量无异议。</p>
          <p>
            2、
            甲方必须指定专人与乙方联系此项业务（专人身份证复印件附后），并指定使用专门的顾客卡号结帐。若需委派其他人联系此项业务，甲方必须出具加盖甲方公章的委托书并通知乙方。对于甲方指定人经签字确认后在乙方发生的任何采购行为，乙方均视为甲方的采购行为，甲方应承担一切责任及后果，甲方亦对其委派人员进行的采购行为予以承认。甲方现指定以下人员联系业务：
            甲方指定职务：采购，姓名： ，联系电话： ，电子邮件： 。如有变动，甲方应书面通知乙方。
            麦德龙卡卡号为：
          </p>
          <p>
            3、
            甲方每次验收货物完毕，由其指定人在乙方提供的销售发票复印件上签字认可，并将已签字的发票复印交双方留存。
          </p>
          <p>
            4、 在指定订货时间内（每天[ ]至[
            ]）由以下甲方一位指定人经签字确认后的订货单，在乙方发生的任何采购行为，乙方均视为甲方的采购行为，甲方应承担一切责任及后果。如甲方指定人离职或更换，甲方应在第一时间书面通知乙方，以便乙方及时调整。在甲方书面通知乙方前该原指定人员的采购行为仍应视为甲方的采购行为，甲方应承担向乙方的付款责任。
          </p>
          <p>
            5、
            乙方为甲方建立帐本，每天由甲方收货人员签字确认送货金额。甲方应指定固定的收货验收人员，并将其签字样本提供给乙方保存。甲方收货人员的签署表明甲方已收货并验收合格。
          </p>
          <p>6、 甲方如需反季节蔬菜或海鲜等特殊商品的订货，应提前三天向乙方咨询并确定。</p>
          <div />
        </div>
        <br />
        <div>
          <p>四、退换货及售后服务</p>
          <p>
            1、
            生鲜类食品：甲方应在收到货物当天提出退换货要求。如确属商品质量问题，乙方应予以退换货；其他情况，双方应有好协商。
          </p>
          <p>
            2、
            除生鲜类以外的食品、酒类、洗化类商品：甲方应在收到货物后[30]天内提出。如确属商品质量问题，乙方应予以退换货；其他情况，双方应友好协商。
          </p>
          <p>
            3、
            服装、鞋类、纺织用品、厨房设备、办公用品等商品：甲方应在收到货物后[3]天内提出。如确属商品质量问题，乙方应予以退换货；其他情况，双方应友好协商。
          </p>
          <p>4、 家用电器：退换货及售后服务按原厂标准。</p>
        </div>
        <br />
        <div>
          <p>五、协议的有效期及终止</p>
          <p>
            1、 本协议的有效期为[ 壹]年，自[ ]年[ ]月[ ]日起至[ ]年[ ]月[
            ]日止。届期如需继续合作另行订立合同
          </p>
          <p>2、合同有效期内，任何一方欲提前终止本协议，应提前[ ]天以书面形式通知对方。</p>
          <p>
            3、
            如上述约定与《信用顾客协议》不符，以《信用顾客协议》上明确的期限为准。本协议随甲方信用顾客资格的终止以及《信用顾客协议》终止而终止。
          </p>
        </div>
        <br />
        <div>
          <p>六、不可抗力</p>
          <p>
            甲乙双方的任何一方由于不可抗力的原因不能履行或不能完全履行合同时，应尽快向对方通报原因，经有关主管机关证明后，可允许延期履行、部分履行或不履行，并可根据情况部分或全部免予承担违约责任。乙方如果因不可抗力造成货物质量不符合合同规定的，不以违约论，但验收前一切货物破损，包括因质量不符合规格甲方拒收所造成乙方损失的，甲方概不负责。
          </p>
        </div>
        <br />
        <div>
          <p>七、其他</p>
          <p>
            1、
            本合同与双方签署的其他文件的效力等级按照如下所述从（1）至（4）递减，即如（1）中文件所述与（2）中文件相抵触，以（1）中文件为准；以此类推：
            （1）《信用顾客银行转帐购物保证协议》及其补充协议、《信用购货申请表》、《信用顾客授权书》及其他与申请信用顾客有关的文件；
            （2）本合同（包括合同附件）及补充合同； （3）双方签订的其他合同；
            （4）双方签订的其他备忘录、会议纪要等文件。
          </p>
          <p>
            2、
            在双方合作过程中，因商品名称、属性、车辆运输、价格等方面而产生的分歧，双方应本着互谅互让的方针友好协商解决，协商不成，应提交被告所在地人民法院诉讼解决纠纷。
          </p>
          <p>3、 本协议一式肆份，双方各执二份。</p>
          <p>
            <span style={{ float: 'left' }}>甲方：</span>
            <span className="rightContent">乙方：锦江麦德龙现购自运有限公司 _____________商场</span>
          </p>
          <p>
            <span style={{ float: 'left' }}>帐号：</span>
            <span className="rightContent">帐号：</span>
          </p>
          <p>
            <span style={{ float: 'left' }}>开户行：</span>
            <span className="rightContent_bank">开户行：</span>
          </p>
          <p>
            <span style={{ float: 'left' }}>甲方代表：</span>
            <span className="rightContent_deputation">乙方代表：</span>
          </p>
          <p>
            <span style={{ float: 'left' }}>日期：</span>
            <span className="rightContent">日期：</span>
          </p>
        </div>
        <br />
        <br />
        <br />
        <div>
          <p>附件1 合规</p>
          <p>1、 合规条款：</p>
          <p>
            （1）
            双方同意采取所有必要和合理的措施来杜绝腐败和贿赂。鉴于此，一方不得直接或间接向对方或对方旗下任何其他公司的雇员或执行董事会的成员（包括其亲属）提供、承诺或授予利益或好处（例如，现金、贵重礼品或毫无业务目的邀请，如参加体育赛事、音乐会或文化活动），亦不得让第三方以任何其他形式提供、承诺或授予此类利益或好处。
          </p>
          <p>
            （2）
            甲方同意不为或不代表麦德龙或任何麦德龙集团公司，直接或间接的对i）任何政府官员或工作人员；ii)任何其他由外国政府掌控的政府官员或工作人员；
            iii)任何候选人或政党；或iv）有理由知道的任何个人或机构将直接或间接支付这些费用给上述i),ii)和iii)所列的人员，支付费用、贡献、捐赠、钱权交易、礼物或任何其他形式的价值，无论是以现金、支票或其他方式。
          </p>
          <p>
            （3）
            甲方确认知晓麦德龙集团业务原则，即避免利益冲突和处理利益冲突情况；提供和给予利益；索取和收受利益；适当处理公司信息；遵守反垄断法；非歧视；尊重公平的雇用条款和条件和遵守适用法律和公司准则。
          </p>
          <p>
            （4）
            如果甲方有任何违反本条1.1至1.3款内容的，且乙方就该等违约情况发出警告没有改善的，乙方有权不经通知即可终止双方已存在所有合同。如果是严重违反的，乙方无须进行预先警告。
          </p>
        </div>
      </div>
      <FooterToolbar>
        <Button
          key="back"
          onClick={() => {
            history.goBack();
          }}
        >
          返回
        </Button>
      </FooterToolbar>
    </PageContainer>
  );
};

export default Preview;
