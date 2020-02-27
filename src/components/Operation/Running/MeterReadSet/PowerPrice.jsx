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
  }

  constructor(props){
    super(props);
    this.state = {
      isEdit: false, // 是否在编辑状态
      topPriceValue: 'noData',
      peakPriceValue: 'noData',
      flatPriceValue: 'noData',
      lowPriceValue: 'noData',
      discountRateValue: 'noData',
    };
  }

  cancelEvent = () => { // 取消编辑
    const { changeMeterReadSetStore } = this.props;
    this.setState({
      isEdit: false,
    });
    changeMeterReadSetStore({isEditPrice: false});
  }

  saveEvent = (value) => { // 保存
    const { form, getMeterPrice, stationCode, changeMeterReadSetStore, priceDetailData } = this.props;
    form.validateFieldsAndScroll((error, values)=>{
      if(!error){
        this.setState({
          isEdit: false,
        });
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
    changeMeterReadSetStore({isEditPrice: false});
  }

  editEvent = () => { // 编辑
    const { addDataNum, changeMeterReadSetStore, isEditList } = this.props;
    if (addDataNum > 1 || isEditList) { // 当电表添加或者编辑时，电价不可编辑
      changeMeterReadSetStore({ isListTip: true });
      setTimeout(() => {
        changeMeterReadSetStore({ isListTip: false });
      }, 3000);
      return;
    }
    this.setState({
      isEdit: true,
    });
    changeMeterReadSetStore({isEditPrice: true});
  }

  priceChange = (type, e) => {
    if (type === 'topPrice') {
      this.setState({
        topPriceValue: e.target.value ? e.target.value : '',
      });
    }else if (type === 'peakPrice') {
      this.setState({
        peakPriceValue: e.target.value ? e.target.value : '',
      });
    }else if (type === 'flatPrice') {
      this.setState({
        flatPriceValue: e.target.value ? e.target.value : '',
      });
    }else if (type === 'lowPrice') {
      this.setState({
        lowPriceValue: e.target.value ? e.target.value : '',
      });
    }else if (type === 'discountRate') {
      this.setState({
        discountRateValue: e.target.value ? e.target.value : '',
      });
    }
  }

  render(){
    const { isEdit, topPriceValue, peakPriceValue, flatPriceValue, lowPriceValue, discountRateValue } = this.state;
    const { priceDetailData, theme, form } = this.props;
    const { updateTime } = priceDetailData;
    console.log('priceDetailData: ', priceDetailData);
    const { getFieldDecorator } = form;
    return(
      <div className={`${styles.powerPrice} ${styles[theme]}`}>
        <div className={styles.priceTop}>
          <span className={styles.title}>自用电电价设置</span>
          <div className={styles.topRight}>
            <span>更新时间：</span>
            <span className={styles.updateTime}>{moment(updateTime).format('YYYY-MM-DD h:mm:ss')}</span>
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
                <div className={`${styles.priceData} ${topPriceValue === 'noData' && priceDetailData.topPrice === undefined && styles.meterInpNull || !topPriceValue && styles.meterInpDel}`}>
                  <span className={styles.text}>尖时段</span>
                  <FormItem>
                    {getFieldDecorator('topPrice', {
                      rules: [{
                        required: true,
                        pattern: new RegExp(/(^[0-9]{1,2}$)|(^[0-9]{1,2}[\.]{1}[0-9]{1,4}$)/),
                        message: '最多输入2位整数和4位小数',
                      }],
                      getValueFromEvent: (event) => {
                        return event.target.value.replace(/[^\d.]/g, '');
                      },
                      initialValue: priceDetailData.topPrice,
                      })(
                        <Input placeholder="请输入" onChange={(e) => this.priceChange('topPrice', e)} />
                    )}
                  </FormItem>
                  <span className={styles.unit}>元/kWh</span>
                </div>
              </div>
              <div className={styles.peakPrice}>
                <div className={`${styles.priceData} ${peakPriceValue === 'noData' && priceDetailData.peakPrice === undefined && styles.meterInpNull || !peakPriceValue && styles.meterInpDel}`}>
                  <span className={styles.text}>峰时段</span>
                    <FormItem>
                      {getFieldDecorator('peakPrice', {
                        rules: [{
                          required: true,
                          pattern: new RegExp(/(^[0-9]{1,2}$)|(^[0-9]{1,2}[\.]{1}[0-9]{1,4}$)/),
                          message: '最多输入2位整数和4位小数',
                        }],
                        getValueFromEvent: (event) => {
                          return event.target.value.replace(/[^\d.]/g, '');
                        },
                        initialValue: priceDetailData.peakPrice,
                        })(
                          <Input placeholder="请输入" onChange={(e) => this.priceChange('peakPrice', e)} />
                      )}
                    </FormItem>
                    <span className={styles.unit}>元/kWh</span>
                </div>
              </div>
              <div className={styles.flatPrice}>
                <div className={`${styles.priceData} ${flatPriceValue === 'noData' && priceDetailData.flatPrice === undefined && styles.meterInpNull || !flatPriceValue && styles.meterInpDel}`}>
                  <span className={styles.text}>平时段</span>
                  <FormItem>
                    {getFieldDecorator('flatPrice', {
                      rules: [{
                        required: true,
                        pattern: new RegExp(/(^[0-9]{1,2}$)|(^[0-9]{1,2}[\.]{1}[0-9]{1,4}$)/),
                        message: '最多输入2位整数和4位小数',
                      }],
                      getValueFromEvent: (event) => {
                        return event.target.value.replace(/[^\d.]/g, '');
                      },
                      initialValue: priceDetailData.flatPrice,
                      })(
                        <Input placeholder="请输入" onChange={(e) => this.priceChange('flatPrice', e)} />
                    )}
                  </FormItem>
                  <span className={styles.unit}>元/kWh</span>
                </div>
              </div>
              <div className={styles.lowPrice}>
                <div className={`${styles.priceData}  ${lowPriceValue === 'noData' && priceDetailData.lowPrice === undefined && styles.meterInpNull || !lowPriceValue && styles.meterInpDel}`}>
                  <span className={styles.text}>谷时段</span>
                  <FormItem>
                    {getFieldDecorator('lowPrice', {
                      rules: [{
                        required: true,
                        pattern: new RegExp(/(^[0-9]{1,2}$)|(^[0-9]{1,2}[\.]{1}[0-9]{1,4}$)/),
                        message: '最多输入2位整数和4位小数',
                      }],
                      getValueFromEvent: (event) => {
                        return event.target.value.replace(/[^\d.]/g, '');
                      },
                      initialValue: priceDetailData.lowPrice,
                      })(
                        <Input placeholder="请输入" onChange={(e) => this.priceChange('lowPrice', e)} />
                    )}
                  </FormItem>
                  <span className={styles.unit}>元/kWh</span>
                </div>
              </div>
              <div className={styles.discountRate}>
                <div className={`${styles.discountRateInfo} ${discountRateValue === 'noData' && priceDetailData.discountRate === undefined && styles.meterInpNull || !discountRateValue && styles.meterInpDel}`}>
                  <span className={styles.text}>折扣率</span>
                  <FormItem>
                    {getFieldDecorator('discountRate', {
                      rules: [{
                        required: true,
                        pattern: new RegExp(/^[0-9]\d*$/, 'g'),
                        message: '整数',
                      }],
                      getValueFromEvent: (event) => {
                        return event.target.value.replace(/[^\d]/g, '');
                      },
                      initialValue: priceDetailData.discountRate,
                      })(
                        <Input placeholder="请输入" onChange={(e) => this.priceChange('discountRate', e)} />
                    )}
                  </FormItem>
                  <span className={styles.unit}>%</span>
                </div>
              </div>
            </Form>
          </div>}

          {!isEdit && <div className={styles.priceInfo}>
            <div className={styles.topPrice}><span className={styles.text}>尖时段</span><span className={styles.num}>{priceDetailData.topPrice || '--'}元/kWh</span></div>
            <div className={styles.peakPrice}><span className={styles.text}>峰时段</span><span className={styles.num}>{priceDetailData.peakPrice || '--'}元/kWh</span></div>
            <div className={styles.flatPrice}><span className={styles.text}>平时段</span><span className={styles.num}>{priceDetailData.flatPrice || '--'}元/kWh</span></div>
            <div className={styles.lowPrice}><span className={styles.text}>谷时段</span><span className={styles.num}>{priceDetailData.lowPrice || '--'}元/kWh</span></div>
            <div className={styles.discountRate}><span className={styles.text}>折扣率</span><span className={styles.num}>{priceDetailData.discountRate || '--'}%</span></div>
          </div>}
        </div>
      </div>
    );
  }
}

export default Form.create()(PowerPrice);
