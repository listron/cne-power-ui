import React, { Component } from 'react';
import PropTypes, { number } from 'prop-types';
import { Form, Input, Select } from 'antd';
import styles from './meterRead.scss';
import moment from 'moment';

const Option = Select.Option;
const FormItem = Form.Item;

class EditableCell extends Component {
  static propTypes = {
    eventData: PropTypes.object,
    form: PropTypes.object,
    baseDeviceData: PropTypes.array,
    editEvent: PropTypes.func,
    saveEvent: PropTypes.func,
    cancelEvent: PropTypes.func,
    delEvent: PropTypes.func,
    changeMeter: PropTypes.func,
    changeMeterReadSetStore: PropTypes.func,
  }

  constructor(props){
    super(props);
    this.state = {
      isFromSave: false,
      meterNameValue: 'noData',
      meterTypeValue: 'noData',
      magnificationValue: 'noData',
      flatStartCodeValue: 'noData',
      lowStartCodeValue: 'noData',
      meterNumberValue: 'noData',
      peakStartCodeValue: 'noData',
      topStartCodeValue: 'noData',
      totalStartCodeValue: 'noData',
    };
  }

  onChangeColumn = (type, value) => { // 改变每列值
    const { eventData, changeMeterReadSetStore} = this.props;
    eventData[type] = value;
    this.props.editEvent(eventData, type);
    changeMeterReadSetStore({isEditList: eventData.editable});
    if (type === 'meterName') {
      this.setState({
        meterNameValue: value,
      });
    }else if (type === 'meterType') {
      this.setState({
        meterTypeValue: value,
      });
    }
  }

  saveEvent = (value) => { // 保存
    const { meterId, key } = value;
    const { form } = this.props;
    form.validateFieldsAndScroll((error, values)=>{
      if (error) {
        this.setState({
          isFromSave: true,
          meterNameValue: values.meterName ? values.meterName : '',
          meterNumberValue: values.meterNumber ? values.meterNumber : '',
          meterTypeValue: values.meterType ? values.meterType : '',
          magnificationValue: values.magnification ? values.magnification : '',
          flatStartCodeValue: values.flatStartCode ? values.flatStartCode : '',
          lowStartCodeValue: values.lowStartCode ? values.lowStartCode : '',
          peakStartCodeValue: values.peakStartCode ? values.peakStartCode : '',
          topStartCodeValue: values.topStartCode ? values.topStartCode : '',
          totalStartCodeValue: values.totalStartCode ? values.totalStartCode : '',
        });
      }
      if(!error){
        const eventData = {
          key,
          meterId,
          meterName: values.meterName,
          meterType: values.meterType,
          magnification: Number(values.magnification),
          flatStartCode: Number(values.flatStartCode),
          lowStartCode: Number(values.lowStartCode),
          meterNumber: Number(values.meterNumber),
          peakStartCode: Number(values.peakStartCode),
          topStartCode: Number(values.topStartCode),
          totalStartCode: Number(values.totalStartCode),
        };
        this.props.saveEvent(eventData);
      }
    });
  }

  cancelEvent = (value) => { // 取消
    this.props.cancelEvent(value);
  }

  delEvent = (value) => { // 删除
    this.props.delEvent(value);
  }

  changeMeter = (value) => { // 换表
    this.props.changeMeter(value);
  }

  render(){
    const { isFromSave, meterNameValue, meterNumberValue, meterTypeValue, magnificationValue, flatStartCodeValue, lowStartCodeValue, peakStartCodeValue, topStartCodeValue, totalStartCodeValue } = this.state;
    const { eventData, baseDeviceData = [], form } = this.props;
    const { getFieldDecorator } = form;
    const { editable, isRelDocket } = eventData;
    return(
      <div className={styles.editableCell}>
        {editable && <React.Fragment>
          <Form>
            <div className={styles.meterName}>
              <FormItem>
                {getFieldDecorator('meterName', {
                    rules: [{
                      required: true,
                      message: '请选择电表名称',
                    }],
                    initialValue: eventData.meterName,
                  })(
                    <Select
                      className={((!eventData.meterName && meterNameValue === 'noData') && styles.meterInpNull) || (meterNameValue === '' && styles.meterInpDel)}
                      placeholder="请选择电能表"
                      dropdownClassName={styles.meterNameSelect}
                      onChange={(value) => { this.onChangeColumn('meterName', value); }}
                    >
                      {baseDeviceData.map((item, index) => (
                        <Option key={item.deviceId} value={item.deviceName}>{item.deviceName}</Option>
                      ))}
                      <Option value="disabled" disabled>
                        <div className={!eventData.meterName && styles.noDataText}>
                          {baseDeviceData.length === 0 && !eventData.meterName && <i className={`iconfont icon-biao ${styles.meterIcon}`} />}
                          <span className={styles.meterNameText}>需要先去设备管理中添加电表</span>
                        </div>
                      </Option>
                  </Select>
                )}
              </FormItem>
            </div>
            <div className={`${styles.meterNumber} ${!isFromSave ? (eventData.meterNumber === undefined && styles.meterInpNull || (eventData.meterNumber === '' && styles.meterInpDel)) : ((eventData.meterNumber === '' || eventData.meterNumber === undefined) && styles.meterInpDel)}`}>
              <FormItem>
                {getFieldDecorator('meterNumber', {
                  rules: [{
                    required: true,
                    pattern: new RegExp(/(^[0-9]{1,10}$)/),
                    message: '最多输入10位整数',
                  }],
                  getValueFromEvent: (event) => {
                    return event.target.value.replace(/[^\d.]/g, '');
                  },
                  initialValue: eventData.meterNumber,
                  })(
                    <Input placeholder="请输入" onChange={(e) => { this.onChangeColumn('meterNumber', e.target.value); }} />
                )}
              </FormItem>
            </div>
            <div className={styles.meterType}>
              <FormItem>
                {getFieldDecorator('meterType', {
                  rules: [{
                    required: true,
                    message: '请选择计量类型',
                  }],
                  initialValue: eventData.meterType,
                })(
                  <Select
                    className={((!eventData.meterType && meterTypeValue === 'noData') && styles.meterInpNull) || (meterTypeValue === '' && styles.meterInpDel)}
                    dropdownClassName={styles.meterTypeSelect}
                    placeholder="请选择"
                    onChange={(value) => { this.onChangeColumn('meterType', value); }}
                  >
                    <Option value={1}>上网计量</Option>
                    <Option value={2}>发电计量</Option>
                  </Select>
                )}
              </FormItem>
            </div>
            <div className={`${styles.initCode} ${!isFromSave ? (eventData.magnification === undefined && styles.meterInpNull || (eventData.magnification === '' && styles.meterInpDel)) : ((eventData.magnification === '' || eventData.magnification === undefined) && styles.meterInpDel)}`}>
              <FormItem>
                {getFieldDecorator('magnification', {
                  rules: [{
                    required: true,
                    pattern: new RegExp(/(^[0-9]{1,6}$)|(^[0-9]{1,6}[\.]{1}[0-9]{1,2}$)/),
                    message: '最多输入6位整数和2位小数',
                  }],
                  getValueFromEvent: (event) => {
                    return event.target.value.replace(/[^\d.]/g, '');
                  },
                  initialValue: eventData.magnification,
                  })(
              <Input placeholder="请输入" onChange={(e) => { this.onChangeColumn('magnification', e.target.value); }} />
              )}
              </FormItem>
            </div>
            <div className={styles.switchType}>
              <div className={styles.switchTypeChild}>
                <span className={`${styles.totalStartCode} ${!isFromSave ? (eventData.totalStartCode === undefined && styles.meterInpNull) || (eventData.totalStartCode === '' && styles.meterInpDel) : ((eventData.totalStartCode === '' || eventData.totalStartCode === undefined) && styles.meterInpDel)}`}>
                  <FormItem>
                    {getFieldDecorator('totalStartCode', {
                      rules: [{
                        required: true,
                        pattern: new RegExp(/(^[0-9]{1,6}$)|(^[0-9]{1,6}[\.]{1}[0-9]{1,2}$)/),
                        message: '最多输入6位整数和2位小数',
                      }],
                      getValueFromEvent: (event) => {
                        return event.target.value.replace(/[^\d.]/g, '');
                      },
                      initialValue: eventData.totalStartCode,
                      })(
                      <Input placeholder="请输入" onChange={(e) => { this.onChangeColumn('totalStartCode', e.target.value); }} />
                      )}
                  </FormItem>
                </span>
                <span className={`${styles.topStartCode} ${!isFromSave ? (eventData.topStartCode === undefined && styles.meterInpNull) || (eventData.topStartCode === '' && styles.meterInpDel) : ((eventData.topStartCode === '' || eventData.topStartCode === undefined) && styles.meterInpDel)}`}>
                  <FormItem>
                    {getFieldDecorator('topStartCode', {
                      rules: [{
                        required: true,
                        pattern: new RegExp(/(^[0-9]{1,6}$)|(^[0-9]{1,6}[\.]{1}[0-9]{1,2}$)/),
                        message: '最多输入6位整数和2位小数',
                      }],
                      getValueFromEvent: (event) => {
                        return event.target.value.replace(/[^\d.]/g, '');
                      },
                      initialValue: eventData.topStartCode,
                      })(
                      <Input placeholder="请输入" onChange={(e) => { this.onChangeColumn('topStartCode', e.target.value); }} />
                      )}
                  </FormItem>
                </span>
                <span className={`${styles.peakStartCode} ${!isFromSave ? (eventData.peakStartCode === undefined && styles.meterInpNull) || (eventData.peakStartCode === '' && styles.meterInpDel) : ((eventData.peakStartCode === '' || eventData.peakStartCode === undefined) && styles.meterInpDel)}`}>
                  <FormItem>
                    {getFieldDecorator('peakStartCode', {
                      rules: [{
                        required: true,
                        pattern: new RegExp(/(^[0-9]{1,6}$)|(^[0-9]{1,6}[\.]{1}[0-9]{1,2}$)/),
                        message: '最多输入6位整数和2位小数',
                      }],
                      getValueFromEvent: (event) => {
                        return event.target.value.replace(/[^\d.]/g, '');
                      },
                      initialValue: eventData.peakStartCode,
                      })(
                      <Input placeholder="请输入" onChange={(e) => { this.onChangeColumn('peakStartCode', e.target.value); }} />
                      )}
                  </FormItem>
                </span>
                <span className={`${styles.flatStartCode} ${!isFromSave ? (eventData.flatStartCode === undefined && styles.meterInpNull) || (eventData.flatStartCode === '' && styles.meterInpDel) : ((eventData.flatStartCode === '' || eventData.flatStartCode === undefined) && styles.meterInpDel)}`}>
                  <FormItem>
                    {getFieldDecorator('flatStartCode', {
                      rules: [{
                        required: true,
                        pattern: new RegExp(/(^[0-9]{1,6}$)|(^[0-9]{1,6}[\.]{1}[0-9]{1,2}$)/),
                        message: '最多输入6位整数和2位小数',
                      }],
                      getValueFromEvent: (event) => {
                        return event.target.value.replace(/[^\d.]/g, '');
                      },
                      initialValue: eventData.flatStartCode,
                      })(
                      <Input placeholder="请输入" onChange={(e) => { this.onChangeColumn('flatStartCode', e.target.value); }} />
                      )}
                  </FormItem>
                </span>
                <span className={`${styles.lowStartCode} ${!isFromSave ? (eventData.lowStartCode === undefined && styles.meterInpNull) || (eventData.lowStartCode === '' && styles.meterInpDel) : ((eventData.lowStartCode === '' || eventData.lowStartCode === undefined) && styles.meterInpDel)}`}>
                  <FormItem>
                    {getFieldDecorator('lowStartCode', {
                      rules: [{
                        required: true,
                        pattern: new RegExp(/(^[0-9]{1,6}$)|(^[0-9]{1,6}[\.]{1}[0-9]{1,2}$)/),
                        message: '最多输入6位整数和2位小数',
                      }],
                      getValueFromEvent: (event) => {
                        return event.target.value.replace(/[^\d.]/g, '');
                      },
                      initialValue: eventData.lowStartCode,
                      })(
                      <Input placeholder="请输入" onChange={(e) => { this.onChangeColumn('lowStartCode', e.target.value); }} />
                      )}
                  </FormItem>
                </span>
              </div>
            </div>
            <div className={styles.updateTime}>{eventData.updateTime ? moment(eventData.updateTime).format('YYYY-MM-DD HH:mm:ss') : '--'}</div>
            <div className={styles.handler}>
              <i title={'取消'} className={`iconfont icon-closeall ${styles.cancel}`} onClick={() => { this.cancelEvent(eventData); }} />
              <i title={'保存'} className={`iconfont icon-save ${styles.save}`} onClick={() => { this.saveEvent(eventData); }} />
              <i />
            </div>
          </Form>
        </React.Fragment>}

          {!editable && <React.Fragment>
            <div className={styles.meterName}>{eventData.meterName}</div>
            <div className={styles.meterNumber}>{eventData.meterNumber}</div>
            <div className={styles.meterType}>{['上网计量', '发电计量'][eventData.meterType - 1]}</div>
            <div className={styles.initCode}>{eventData.magnification}</div>
            <div className={styles.switchType}>
              <div className={styles.switchTypeChild}>
                <span className={styles.totalStartCode}>{eventData.totalStartCode}</span>
                <span className={styles.topStartCode}>{eventData.topStartCode}</span>
                <span className={styles.peakStartCode}>{eventData.peakStartCode}</span>
                <span className={styles.flatStartCode}>{eventData.flatStartCode}</span>
                <span className={styles.lowStartCode}>{eventData.lowStartCode}</span>
              </div>
            </div>
            <div className={styles.updateTime}>{eventData.updateTime ? moment(eventData.updateTime).format('YYYY-MM-DD HH:mm:ss') : '--'}</div>
            <div className={styles.handler}>
              {isRelDocket === 0 ? <i title={'编辑'} className={`iconfont icon-edit ${styles.editBtn}`} onClick={() => { this.onChangeColumn('editable', true); }} /> : <i className={`iconfont icon-edit ${styles.disableBtn}`} />}
              <i title={'换表'} className={`iconfont icon-changedb ${styles.updateBtn}`} onClick={() => { this.changeMeter(eventData); }} />
              {isRelDocket === 0 ? <i title={'删除'} className={`iconfont icon-del ${styles.delBtn}`} onClick={() => { this.delEvent(eventData); }} /> : <i className={`iconfont icon-del ${styles.disableBtn}`} />}
            </div>
          </React.Fragment>}
      </div>
    );
  }
}

export default Form.create()(EditableCell);
