import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, message } from 'antd';
import CneButton from '../../../Common/Power/CneButton';
import styles from './meterRead.scss';
import moment from 'moment';

const FormItem = Form.Item;

class PowerPrice extends Component{
  static propTypes= {
    priceDetailData: PropTypes.object,
    form: PropTypes.object,
    getMeterPrice: PropTypes.func,
    changeMeterReadSetStore: PropTypes.func,
    theme: PropTypes.string,
    addDataNum: PropTypes.number,
    stationCode: PropTypes.number,
    isEditList: PropTypes.bool,
    priceLoading: PropTypes.bool,
  }

  constructor(props){
    super(props);
    this.state = {
      isEdit: false, // 是否在编辑状态
      isTopPriceError: false, // 所填项为空时添加input错误样式
      isPeakPriceError: false,
      isFlatPriceError: false,
      isLowPriceError: false,
      isDiscountRateError: false,
      isTopPriceTip: false, // 所填项为空时弹出提示语
      isPeakPriceTip: false,
      isFlatPriceTip: false,
      isLowPriceTip: false,
      isDiscountRateTip: false,
      topPriceValue: '--',
      peakPriceValue: '--',
      flatPriceValue: '--',
      lowPriceValue: '--',
      discountRateValue: '--',
    };
  }

  cancelEvent = () => { // 取消编辑
    const { changeMeterReadSetStore } = this.props;
    this.setState({
      isEdit: false,
      isTopPriceError: false, // 所填项为空时添加input错误样式
      isPeakPriceError: false,
      isFlatPriceError: false,
      isLowPriceError: false,
      isDiscountRateError: false,
      isTopPriceTip: false, // 所填项为空时弹出提示语
      isPeakPriceTip: false,
      isFlatPriceTip: false,
      isLowPriceTip: false,
      isDiscountRateTip: false,
      topPriceValue: '--',
      peakPriceValue: '--',
      flatPriceValue: '--',
      lowPriceValue: '--',
      discountRateValue: '--',
    });
    changeMeterReadSetStore({isEditPrice: false, isEditList: false});
  }

  saveEvent = () => { // 保存
    const { isTopPriceTip, isPeakPriceTip, isFlatPriceTip, isLowPriceTip, isDiscountRateTip } = this.state;
    const { form, getMeterPrice, stationCode, changeMeterReadSetStore, priceDetailData } = this.props;
    form.validateFieldsAndScroll((error, values)=>{
      if (values.topPrice === ('' || null) && values.peakPrice === ('' || null) && values.flatPrice === ('' || null) && values.lowPrice === ('' || null) && values.discountRate === ('' || null)) { // 若都为空，则显示详情页
        this.setState({
          isEdit: false,
        });
        changeMeterReadSetStore({isEditPrice: false, isEditList: false});
        return;
      }

      if (error) {
        this.setState({
          topPriceValue: values.topPrice ? values.topPrice : '',
          peakPriceValue: values.peakPrice ? values.peakPrice : '',
          flatPriceValue: values.flatPrice ? values.flatPrice : '',
          lowPriceValue: values.lowPrice ? values.lowPrice : '',
          discountRateValue: values.discountRate ? values.discountRate : '',
        });
      }

      if(!error){
        let priceValues = {};
        priceValues = form.getFieldsValue(); // 得到所有input值
        let priceArr = Object.values(priceValues); // 将对象变为数组
        const priceData = priceArr.find(e =>{ // 发现有input输入为空或者本来就为null的值
          return (e === '' || e === null);
        });

        if (priceData === '' || priceData === null) { // 如果有空值就显示错误样式
          if (values.topPrice === ('' || null)) {
            this.setState({
              isTopPriceError: true,
            });
          }
          if (values.peakPrice === ('' || null)) {
            this.setState({
              isPeakPriceError: true,
            });
          }
          if (values.flatPrice === ('' || null)) {
            this.setState({
              isFlatPriceError: true,
            });
          }
          if (values.lowPrice === ('' || null)) {
            this.setState({
              isLowPriceError: true,
            });
          }
          if (values.discountRate === ('' || null)) {
            this.setState({
              isDiscountRateError: true,
            });
          }
          return; // 有未填项不允许提交
        }

        if (isTopPriceTip || isPeakPriceTip || isFlatPriceTip || isLowPriceTip || isDiscountRateTip) { // 所填项的其中一项校验不通过就不能保存
          return;
        }

        this.setState({
          isEdit: false,
        });
        changeMeterReadSetStore({isEditPrice: false, isEditList: false});
        getMeterPrice({
          stationCode,
          powerPriceId: priceDetailData.powerPriceId,
          topPrice: Number(values.topPrice),
          peakPrice: Number(values.peakPrice),
          flatPrice: Number(values.flatPrice),
          lowPrice: Number(values.lowPrice),
          discountRate: Number(values.discountRate),
        });
      }
    });
  }

  editEvent = () => { // 编辑
    const { addDataNum, changeMeterReadSetStore, isEditList } = this.props;
    if (addDataNum > 1 || isEditList) { // 当电表添加或者编辑时，电价不可编辑
      changeMeterReadSetStore({ isListTip: true });
      setTimeout(() => {
        changeMeterReadSetStore({ isListTip: false });
      }, 2000);
      return;
    }
    this.setState({
      isEdit: true,
    });
    changeMeterReadSetStore({isEditPrice: true});
  }



  priceChange = (type, e) => {
    const { value } = e.target || {};
    const regRules = [/^[0-9]{1,2}$/, /(^[0-9]{1,2}[\.]{1}[0-9]{1,4}$)/, /(^[0-9]{1,2}[\.]{1}$)/, /(^\s*$)/];
    const discountRateRegRules = [/^100$|^(\d|[1-9]\d)$/, /(^\s*$)/];
    if (type === 'topPrice') {
      const resultPass = regRules.some(e => e.test(value));
      if(resultPass){ // 通过正则校验
        this.setState({
          isTopPriceTip: false,
        });
      }else {
        this.setState({
          isTopPriceTip: true,
        });
      }
      if (value === '') {
        this.setState({
          isTopPriceError: true,
        });
      }else{
        this.setState({
          isTopPriceError: false,
        });
      }
      this.setState({
        topPriceValue: e.target.value ? e.target.value : '',
      });
    }else if (type === 'peakPrice') {
      const resultPass = regRules.some(e => e.test(value));
      if(resultPass){ // 通过正则校验
        this.setState({
          isPeakPriceTip: false,
        });
      }else {
        this.setState({
          isPeakPriceTip: true,
        });
      }
      if (value === '') {
        this.setState({
          isPeakPriceError: true,
        });
      }else{
        this.setState({
          isPeakPriceError: false,
        });
      }
      this.setState({
        peakPriceValue: e.target.value ? e.target.value : '',
      });
    }else if (type === 'flatPrice') {
      const resultPass = regRules.some(e => e.test(value));
      if(resultPass){ // 通过正则校验
        this.setState({
          isFlatPriceTip: false,
        });
      }else {
        this.setState({
          isFlatPriceTip: true,
        });
      }
      if (value === '') {
        this.setState({
          isFlatPriceError: true,
        });
      }else{
        this.setState({
          isFlatPriceError: false,
        });
      }
      this.setState({
        flatPriceValue: e.target.value ? e.target.value : '',
      });
    }else if (type === 'lowPrice') {
      const resultPass = regRules.some(e => e.test(value));
      if(resultPass){ // 通过正则校验
        this.setState({
          isLowPriceTip: false,
        });
      }else {
        this.setState({
          isLowPriceTip: true,
        });
      }
      if (value === '') {
        this.setState({
          isLowPriceError: true,
        });
      }else{
        this.setState({
          isLowPriceError: false,
        });
      }
      this.setState({
        lowPriceValue: e.target.value ? e.target.value : '',
      });
    }else if (type === 'discountRate') {
      const resultPass = discountRateRegRules.some(e => e.test(value));
      if(resultPass){ // 通过正则校验
        this.setState({
          isDiscountRateTip: false,
        });
      }else {
        this.setState({
          isDiscountRateTip: true,
        });
      }
      if (value === '') {
        this.setState({
          isDiscountRateError: true,
        });
      }else{
        this.setState({
          isDiscountRateError: false,
        });
      }
      this.setState({
        discountRateValue: e.target.value ? e.target.value : '',
      });
    }
  }

  render(){
    const { isEdit, isTopPriceError, isPeakPriceError, isFlatPriceError, isLowPriceError, isDiscountRateError, topPriceValue, peakPriceValue, flatPriceValue, lowPriceValue, discountRateValue, isTopPriceTip, isPeakPriceTip, isFlatPriceTip, isLowPriceTip, isDiscountRateTip } = this.state;
    const { priceDetailData, theme, form, priceLoading } = this.props;
    const { updateTime, topPrice, peakPrice, flatPrice, lowPrice, discountRate } = priceDetailData;
    const { getFieldDecorator } = form;
    return(
      <div className={`${styles.powerPrice} ${styles[theme]}`}>
        <div className={styles.priceTop}>
          <span className={styles.title}>自用电电价设置</span>
          <div className={styles.topRight}>
            {updateTime && <span>
              <span>更新时间：</span>
              <span className={styles.updateTime}>{moment(updateTime).format('YYYY-MM-DD HH:mm:ss')}</span>
            </span>}
            {isEdit && <div>
              <CneButton className={styles.cancelBtn} onClick={this.cancelEvent}>取消</CneButton>
              <CneButton className={styles.saveBtn} onClick={this.saveEvent}>
                <i className={`iconfont icon-save ${styles.saveIcon}`} />
                <span className={styles.text}>保存</span>
              </CneButton>
            </div>}
            {!isEdit && <CneButton className={styles.editBtn} onClick={this.editEvent}>
              <i className={`iconfont icon-edit ${styles.editIcon}`} />
              <span className={styles.text}>编辑</span>
            </CneButton>}
          </div>
        </div>
        <div className={styles.priceContent}>
          {isEdit && <div className={styles.priceInfo}>
            <Form>
              <div className={styles.topPrice}>
                <div className={`${styles.priceData} ${topPriceValue === '--' ? ((priceDetailData.topPrice === undefined || priceDetailData.topPrice === null) && styles.meterInpNull) : (topPriceValue === '' && styles.meterInpDel)} ${isTopPriceError && styles.meterInpDel}`}>
                  <span className={styles.text}>尖时段</span>
                  <FormItem>
                    {getFieldDecorator('topPrice', {
                      initialValue: priceDetailData.topPrice,
                      })(
                        <Input placeholder="请输入" onChange={(e) => this.priceChange('topPrice', e)} />
                    )}
                  </FormItem>
                  {isTopPriceTip && <div className={styles.tipText}>最多输入2位整数和4位小数</div>}
                  <span className={styles.unit}>元/kWh</span>
                </div>
              </div>
              <div className={styles.peakPrice}>
                <div className={`${styles.priceData} ${peakPriceValue === '--' ? ((priceDetailData.peakPrice === undefined || priceDetailData.peakPrice === null) && styles.meterInpNull) : (peakPriceValue === '' && styles.meterInpDel)} ${isPeakPriceError && styles.meterInpDel}`}>
                  <span className={styles.text}>峰时段</span>
                    <FormItem>
                      {getFieldDecorator('peakPrice', {
                        initialValue: priceDetailData.peakPrice,
                        })(
                          <Input placeholder="请输入" onChange={(e) => this.priceChange('peakPrice', e)} />
                      )}
                    </FormItem>
                    {isPeakPriceTip && <div className={styles.tipText}>最多输入2位整数和4位小数</div>}
                    <span className={styles.unit}>元/kWh</span>
                </div>
              </div>
              <div className={styles.flatPrice}>
                <div className={`${styles.priceData} ${flatPriceValue === '--' ? ((priceDetailData.flatPrice === undefined || priceDetailData.flatPrice === null) && styles.meterInpNull) : (flatPriceValue === '' && styles.meterInpDel)} ${isFlatPriceError && styles.meterInpDel}`}>
                  <span className={styles.text}>平时段</span>
                  <FormItem>
                    {getFieldDecorator('flatPrice', {
                      initialValue: priceDetailData.flatPrice,
                      })(
                        <Input placeholder="请输入" onChange={(e) => this.priceChange('flatPrice', e)} />
                    )}
                  </FormItem>
                  {isFlatPriceTip && <div className={styles.tipText}>最多输入2位整数和4位小数</div>}
                  <span className={styles.unit}>元/kWh</span>
                </div>
              </div>
              <div className={styles.lowPrice}>
                <div className={`${styles.priceData}  ${lowPriceValue === '--' ? ((priceDetailData.lowPrice === undefined || priceDetailData.lowPrice === null) && styles.meterInpNull) : (lowPriceValue === '' && styles.meterInpDel)} ${isLowPriceError && styles.meterInpDel}`}>
                  <span className={styles.text}>谷时段</span>
                  <FormItem>
                    {getFieldDecorator('lowPrice', {
                      initialValue: priceDetailData.lowPrice,
                      })(
                        <Input placeholder="请输入" onChange={(e) => this.priceChange('lowPrice', e)} />
                    )}
                  </FormItem>
                  {isLowPriceTip && <div className={styles.tipText}>最多输入2位整数和4位小数</div>}
                  <span className={styles.unit}>元/kWh</span>
                </div>
              </div>
              <div className={styles.discountRate}>
                <div className={`${styles.discountRateInfo} ${discountRateValue === '--' ? ((priceDetailData.discountRate === undefined || priceDetailData.discountRate === null) && styles.meterInpNull) : (discountRateValue === '' && styles.meterInpDel)} ${isDiscountRateError && styles.meterInpDel}`}>
                  <span className={styles.text}>折扣率</span>
                  <FormItem>
                    {getFieldDecorator('discountRate', {
                      initialValue: priceDetailData.discountRate,
                      })(
                        <Input placeholder="请输入" onChange={(e) => this.priceChange('discountRate', e)} />
                    )}
                  </FormItem>
                  {isDiscountRateTip && <div className={styles.tipText}>1-100的整数</div>}
                  <span className={styles.unit}>%</span>
                </div>
              </div>
            </Form>
          </div>}

          {!isEdit && <div className={styles.priceInfo}>
            <div className={styles.topPrice}><span className={styles.text}>尖时段</span><span className={styles.num}>{!priceLoading ? ((topPrice === 0 ? topPrice.toString() : topPrice) || '--') : topPriceValue}元/kWh</span></div>
            <div className={styles.peakPrice}><span className={styles.text}>峰时段</span><span className={styles.num}>{!priceLoading ? ((peakPrice === 0 ? peakPrice.toString() : peakPrice) || '--') : peakPriceValue}元/kWh</span></div>
            <div className={styles.flatPrice}><span className={styles.text}>平时段</span><span className={styles.num}>{!priceLoading ? ((flatPrice === 0 ? flatPrice.toString() : flatPrice) || '--') : flatPriceValue}元/kWh</span></div>
            <div className={styles.lowPrice}><span className={styles.text}>谷时段</span><span className={styles.num}>{!priceLoading ? ((lowPrice === 0 ? lowPrice.toString() : lowPrice) || '--') : lowPriceValue}元/kWh</span></div>
            <div className={styles.discountRate}><span className={styles.text}>折扣率</span><span className={styles.num}>{!priceLoading ? ((discountRate === 0 ? discountRate.toString() : discountRate) || '--') : discountRateValue}%</span></div>
          </div>}
        </div>
      </div>
    );
  }
}

export default Form.create()(PowerPrice);
