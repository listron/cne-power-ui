import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Spin, Modal, Input, Form, message, notification, Alert } from 'antd';
import EditableCell from './EditableCell';
import CneTips from '../../../Common/Power/CneTips/index';
import styles from './meterRead.scss';
import CneButton from '../../../Common/Power/CneButton';

const FormItem = Form.Item;

class MeterReadTable extends Component{
  static propTypes= {
    tableLoading: PropTypes.bool,
    meterListError: PropTypes.bool,
    isListTip: PropTypes.bool,
    isEditList: PropTypes.bool,
    isPriceTip: PropTypes.bool,
    isEditPrice: PropTypes.bool,
    meterListData: PropTypes.array,
    currentEventList: PropTypes.array,
    baseDeviceData: PropTypes.array,
    getUpDateMeterList: PropTypes.func,
    getDeleteMeterList: PropTypes.func,
    getChangeMeterList: PropTypes.func,
    changeMeterReadSetStore: PropTypes.func,
    getAddMeterList: PropTypes.func,
    getMeterList: PropTypes.func,
    stationCode: PropTypes.number,
    addDataNum: PropTypes.number,
    form: PropTypes.object,
    stationName: PropTypes.string,
  }

  constructor(props){
    super(props);
    this.state = {
      addEventList: [], // 添加行
      currentEventList: [], // 操作行
      showWarningTip: false, // 删除行提示
      deleteMeterId: null, // 电表id
      warningTipText: null, // 删除弹框内容
      modalVisible: false, // 显示换表弹框
      modalMeterName: '', // 换表框电表名称
      modalMeterType: '', // 换表框计量类型
      modalInitCode: '', // 换表框倍率
      modalMeterNumber: '', // 换表框电表号
      showModalTip: false, // 换表弹框二次确认弹框
      modalTipText: '', // 换表弹框二次确认弹框内容
      delArr: null,
      oldTotalEndCode: 'noData',
      oldTopEndCode: 'noData',
      oldPeakEndCode: 'noData',
      oldFlatEndCode: 'noData',
      oldLowEndCode: 'noData',
      newTotalStartCode: 'noData',
      newTopStartCode: 'noData',
      newPeakStartCode: 'noData',
      newFlatStartCode: 'noData',
      newLowStartCode: 'noData',
      newMagnification: 'noData',
      newMeterNumber: 'noData',
    };
  }

  componentWillReceiveProps(nextProps){
    const { meterListData } = nextProps;
    if (this.props.tableLoading && !nextProps.tableLoading) {
      const { currentEventList } = this.state;
      currentEventList.forEach(trData => {
        if (trData.editable) {
          const index = meterListData.findIndex(e => e.meterId === trData.meterId);
          meterListData[index] = trData;
        }
      });
      this.setState({ currentEventList: meterListData });
    }
  }

  addEvent = () => { //添加新行
    const { addEventList } = this.state;
    const { changeMeterReadSetStore, isEditPrice, isEditList } = this.props;
    if (isEditPrice) { // 编辑电价时提示先保存电价再进行其他操作
      changeMeterReadSetStore({isPriceTip: true});
      setTimeout(() => {
        changeMeterReadSetStore({ isPriceTip: false });
      }, 3000);
      return;
    }
    if (addEventList.length >= 1) { // 电表添加新行时提示先保存后再进行其他操作
      changeMeterReadSetStore({ isListTip: true });
      setTimeout(() => {
        changeMeterReadSetStore({ isListTip: false });
      }, 3000);
      return;
    }
    if (isEditList) { // 编辑电表时提示先保存电表再进行其他操作
      changeMeterReadSetStore({ isListTip: true });
      setTimeout(() => {
        changeMeterReadSetStore({ isListTip: false });
      }, 3000);
      return;
    }
    const keyIndex = addEventList.length > 0 && addEventList[addEventList.length - 1].key.split('add')[1] || 0;
    const addKey = {key: `add${+keyIndex + 1}`};
    addEventList.push(addKey);
    this.setState({ addEventList: addEventList });
    changeMeterReadSetStore({addDataNum: addEventList.length});
  }

  saveEvent = (value) => { // 保存
    const { key, editable, updateTime, isRelDocket, meterId, ...rest } = value;
    const { addEventList, currentEventList } = this.state;
    const { getUpDateMeterList, getAddMeterList, stationCode, stationName, changeMeterReadSetStore } = this.props;
    if (meterId) { // 编辑行
      const index = currentEventList.findIndex(e => e.meterId === meterId);
      changeMeterReadSetStore({isEditList: false});
      getUpDateMeterList({ meterId, ...rest, func: () => { currentEventList[index].editable = false; this.setState({ currentEventList }); }});
    }else { // 添加行
      const addIndex = addEventList.findIndex(e => e.key === value.key);
      changeMeterReadSetStore({isEditList: false});
      getAddMeterList({ stationCode, stationName, ...rest, func: () => { addEventList.splice(addIndex, 1); this.setState({ addEventList });}});
    }
  }

  editEvent = (trData, type) => { // 编辑
    const { meterId } = trData;
    const { currentEventList, addEventList} = this.state;
    const { addDataNum, changeMeterReadSetStore, isEditPrice, isEditList } = this.props;

    if (isEditPrice) {
      changeMeterReadSetStore({isPriceTip: true});
      setTimeout(() => {
        changeMeterReadSetStore({ isPriceTip: false });
      }, 3000);
      return;
    }
    if (meterId) {
      if (addDataNum > 1) {
        changeMeterReadSetStore({ isListTip: true });
        setTimeout(() => {
          changeMeterReadSetStore({ isListTip: false });
        }, 3000);
        return;
      }
      if (type === 'editable' && isEditList) {
        changeMeterReadSetStore({ isListTip: true });
        setTimeout(() => {
          changeMeterReadSetStore({ isListTip: false });
        }, 3000);
        return;
      }
      const index = currentEventList.findIndex(e => e.meterId === meterId);
      currentEventList[index] = trData;
      this.setState({currentEventList: currentEventList});
    }
    if (!meterId) {
      const findIndex = addEventList.findIndex(e => e.key === trData.key);
      addEventList[findIndex] = trData;
      this.setState({ addEventList: addEventList });
      changeMeterReadSetStore({addDataNum: addEventList.length, isEditList: false});
    }
  }

  delEvent = (value) => { // 删除
    const { meterId } = value;
    const { addDataNum, changeMeterReadSetStore, isEditPrice, isEditList } = this.props;
    if (isEditPrice) {
      changeMeterReadSetStore({isPriceTip: true});
      setTimeout(() => {
        changeMeterReadSetStore({ isPriceTip: false });
      }, 3000);
      return;
    }
    if (addDataNum > 1) {
      changeMeterReadSetStore({ isListTip: true });
      setTimeout(() => {
        changeMeterReadSetStore({ isListTip: false });
      }, 3000);
      return;
    }
    if (isEditList) {
      changeMeterReadSetStore({ isListTip: true });
      setTimeout(() => {
        changeMeterReadSetStore({ isListTip: false });
      }, 3000);
      return;
    }
    if (meterId) {
      this.setState({
        delArr: [value.meterId],
        showWarningTip: true,
        deleteMeterId: meterId,
        warningTipText: <div><p>删除后无法恢复，但不会影响已审核的抄表。</p><p>是否继续删除？</p></div>,
      });
    }
  }

  cancelWarningTip = () => { // 关闭删除弹框
    this.setState({ showWarningTip: false });
  }

  confirmWarningTip = () => { // 确认删除
    const { deleteMeterId, delArr } = this.state;
    const { getDeleteMeterList } = this.props;
      this.setState({
        showWarningTip: false,
        deleteMeterId: '',
      });
      getDeleteMeterList({meterId: deleteMeterId});
  }

  cancelEvent = (value) => { // 取消
    const { meterId } = value;
    const { currentEventList, addEventList } = this.state;
    const { changeMeterReadSetStore, getMeterList, stationCode, isEditList } = this.props;
    if (meterId) {
      const index = currentEventList.findIndex(e => e.meterId === meterId);
      currentEventList[index].editable = false;
      this.setState({currentEventList});
      changeMeterReadSetStore({meterListData: [], isEditList: false});
      getMeterList({stationCode});
    }else {
      const addIndex = addEventList.findIndex(e => e.key === value.key);
      addEventList.splice(addIndex, 1);
      this.setState({ addEventList });
      changeMeterReadSetStore({addDataNum: addEventList.length, isEditList: false});
    }
  }

  changeMeter = (value) => { // 换表
    const { addDataNum, changeMeterReadSetStore, isEditPrice, isEditList } = this.props;
    if (isEditPrice) {
      changeMeterReadSetStore({isPriceTip: true});
      setTimeout(() => {
        changeMeterReadSetStore({ isPriceTip: false });
      }, 3000);
      return;
    }
    if (addDataNum > 1) {
      changeMeterReadSetStore({ isListTip: true });
      setTimeout(() => {
        changeMeterReadSetStore({ isListTip: false });
      }, 3000);
      return;
    }
    if (isEditList) {
      changeMeterReadSetStore({ isListTip: true });
      setTimeout(() => {
        changeMeterReadSetStore({ isListTip: false });
      }, 3000);
      return;
    }
    this.setState({
      modalVisible: true,
      modalMeterName: value.meterName,
      modalMeterType: value.meterType,
      modalInitCode: value.magnification,
      modalMeterNumber: value.meterNumber,
      deleteMeterId: value.meterId,
    });
  }

  modalHandleOk = () => { // 换表确认
    const { form } = this.props;
    form.validateFieldsAndScroll((error, values)=>{
      if(error){
        this.setState({
          oldTotalEndCode: values.oldTotalEndCode,
          oldTopEndCode: values.oldTopEndCode,
          oldPeakEndCode: values.oldPeakEndCode,
          oldFlatEndCode: values.oldFlatEndCode,
          oldLowEndCode: values.oldLowEndCode,
          newTotalStartCode: values.newTotalStartCode,
          newTopStartCode: values.newTopStartCode,
          newPeakStartCode: values.newPeakStartCode,
          newFlatStartCode: values.newFlatStartCode,
          newLowStartCode: values.newLowStartCode,
          newMagnification: values.newMagnification,
          newMeterNumber: values.newMeterNumber,
        });
        return;
      }
      this.setState({
        showModalTip: true,
        modalTipText: '请确认信息填写无误，换表后将无法修改旧电表止码。',
      });
    });
  }

  modalCancelTip = () => { // 取消换表弹框-二次确认框
    this.setState({
      showModalTip: false,
    });
  }

  modalConfirmTip = () => { // 确定换表-二次确认框
    const { deleteMeterId, modalInitCode, modalMeterNumber } = this.state;
    const { getChangeMeterList, form } = this.props;
    this.setState({
      showModalTip: false,
      modalVisible: false,
    });
    form.validateFieldsAndScroll((error, values)=>{
      if(!error){
        getChangeMeterList({
          meterId: deleteMeterId,
          oldMagnification: modalInitCode,
          oldMeterNumber: modalMeterNumber,
          oldTotalEndCode: Number(values.oldTotalEndCode),
          oldTopEndCode: Number(values.oldTopEndCode),
          oldPeakEndCode: Number(values.oldPeakEndCode),
          oldFlatEndCode: Number(values.oldFlatEndCode),
          oldLowEndCode: Number(values.oldLowEndCode),
          newMagnification: Number(values.newMagnification),
          newMeterNumber: Number(values.newMeterNumber),
          newTotalStartCode: Number(values.newTotalStartCode),
          newTopStartCode: Number(values.newTopStartCode),
          newPeakStartCode: Number(values.newPeakStartCode),
          newFlatStartCode: Number(values.newFlatStartCode),
          newLowStartCode: Number(values.newLowStartCode),
        });
      }
    });
  }

  modalHandleCancel = () => { // 换表取消
    this.setState({
      modalVisible: false,
      oldTotalEndCode: 'noData',
      oldTopEndCode: 'noData',
      oldPeakEndCode: 'noData',
      oldFlatEndCode: 'noData',
      oldLowEndCode: 'noData',
      newTotalStartCode: 'noData',
      newTopStartCode: 'noData',
      newPeakStartCode: 'noData',
      newFlatStartCode: 'noData',
      newLowStartCode: 'noData',
      newMagnification: 'noData',
      newMeterNumber: 'noData',
    });
  }

  meterChange = (type, e) => { // 换表数据
    if (type === 'oldTotalEndCode') {
      this.setState({
        oldTotalEndCode: e.target.value ? e.target.value : '',
      });
    }else if (type === 'oldTopEndCode') {
      this.setState({
        oldTopEndCode: e.target.value ? e.target.value : '',
      });
    }else if (type === 'oldPeakEndCode') {
      this.setState({
        oldPeakEndCode: e.target.value ? e.target.value : '',
      });
    }else if (type === 'oldFlatEndCode') {
      this.setState({
        oldFlatEndCode: e.target.value ? e.target.value : '',
      });
    }else if (type === 'oldLowEndCode') {
      this.setState({
        oldLowEndCode: e.target.value ? e.target.value : '',
      });
    }else if (type === 'newTotalStartCode') {
      this.setState({
        newTotalStartCode: e.target.value ? e.target.value : '',
      });
    }else if (type === 'newTopStartCode') {
      this.setState({
        newTopStartCode: e.target.value ? e.target.value : '',
      });
    }else if (type === 'newPeakStartCode') {
      this.setState({
        newPeakStartCode: e.target.value ? e.target.value : '',
      });
    }else if (type === 'newFlatStartCode') {
      this.setState({
        newFlatStartCode: e.target.value ? e.target.value : '',
      });
    }else if (type === 'newLowStartCode') {
      this.setState({
        newLowStartCode: e.target.value ? e.target.value : '',
      });
    }else if (type === 'newMeterNumber') {
      this.setState({
        newMeterNumber: e.target.value ? e.target.value : '',
      });
    }else if (type === 'newMagnification') {
      this.setState({
        newMagnification: e.target.value ? e.target.value : '',
      });
    }
  }

  render(){
    const { tableLoading, meterListError, baseDeviceData, isListTip, isPriceTip, changeMeterReadSetStore } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { addEventList, currentEventList, showWarningTip, showModalTip, warningTipText, modalTipText, modalVisible, modalMeterName, modalMeterType, modalMeterNumber, modalInitCode, oldTotalEndCode, oldTopEndCode, oldPeakEndCode, oldFlatEndCode, oldLowEndCode, newTotalStartCode, newTopStartCode, newPeakStartCode, newFlatStartCode, newLowStartCode, newMeterNumber, newMagnification } = this.state;

    return(
      <div className={styles.meterReadTable}>
        {showWarningTip && <CneTips visible={showWarningTip} onCancel={this.cancelWarningTip} onConfirm={this.confirmWarningTip} tipText={warningTipText} confirmText={'是'} cancelText={'否'} width={260} />}
        {showModalTip && <CneTips visible={showModalTip} onCancel={this.modalCancelTip} onConfirm={this.modalConfirmTip} tipText={modalTipText} width={260} />}
        {isListTip && <Alert message="请先保存当前电表设置" type="warning" />}
        {isPriceTip && <Alert message="请先保存当前电价设置" type="warning" />}

        <Modal
          title="更换电表"
          visible={modalVisible}
          onOk={this.modalHandleOk}
          onCancel={this.modalHandleCancel}
          wrapClassName={styles.modalModal}
          okText={'确定换表'}
          width={450}
          closable={false}
          destroyOnClose={true}
        >
          <div className={styles.meterModalContent}>
            <div className={styles.modalTitle}>电表基础信息</div>
            <div className={styles.modalMeterName}><span>电表名称：{modalMeterName}</span></div>
            <div className={styles.modalMeterType}>计量类型：{['上网计量', '发电计量'][modalMeterType - 1]}</div>
            <div className={styles.meterText}>
              <Form>
                <div className={styles.oldMeter}>
                  <div className={styles.title}>旧电表信息</div>
                  <div className={styles.meterContent}>
                    <div className={styles.modalMeterNumber}>表号：{modalMeterNumber}</div>
                    <div className={styles.modalInitCode}>倍率：{modalInitCode}</div>
                    <div className={styles.oldData}>旧电表止码</div>
                    <div className={`${styles.oldTotalEndCode} ${(oldTotalEndCode === 'noData' && styles.meterInpNull) || (!oldTotalEndCode && styles.meterInpDel)}`}>
                      <FormItem label="总" colon={false}>
                        {getFieldDecorator('oldTotalEndCode', {
                            rules: [{
                              required: true,
                              pattern: new RegExp(/(^[0-9]{1,6}$)|(^[0-9]{1,6}[\.]{1}[0-9]{1,2}$)/),
                              message: '最多输入6位整数和2位小数',
                            }],
                            getValueFromEvent: (event) => {
                              return event.target.value.replace(/[^\d.]/g, '');
                            },
                            initialValue: '',
                          })(
                            <Input placeholder={'请输入'} onChange={(e) => this.meterChange('oldTotalEndCode', e)} />
                        )}
                      </FormItem>
                    </div>
                    <div className={`${styles.oldTopEndCode} ${(oldTopEndCode === 'noData' && styles.meterInpNull) || (!oldTopEndCode && styles.meterInpDel)}`}>
                      <FormItem label="尖" colon={false}>
                        {getFieldDecorator('oldTopEndCode', {
                            rules: [{
                              required: true,
                              pattern: new RegExp(/(^[0-9]{1,6}$)|(^[0-9]{1,6}[\.]{1}[0-9]{1,2}$)/),
                              message: '最多输入6位整数和2位小数',
                            }],
                            getValueFromEvent: (event) => {
                              return event.target.value.replace(/[^\d.]/g, '');
                            },
                            initialValue: '',
                          })(
                            <Input placeholder={'请输入'} onChange={(e) => this.meterChange('oldTopEndCode', e)} />
                        )}
                      </FormItem>
                    </div>
                    <div className={`${styles.oldPeakEndCode} ${(oldPeakEndCode === 'noData' && styles.meterInpNull) || (!oldPeakEndCode && styles.meterInpDel)}`}>
                      <FormItem label="峰" colon={false}>
                        {getFieldDecorator('oldPeakEndCode', {
                            rules: [{
                              required: true,
                              pattern: new RegExp(/(^[0-9]{1,6}$)|(^[0-9]{1,6}[\.]{1}[0-9]{1,2}$)/),
                              message: '最多输入6位整数和2位小数',
                            }],
                            getValueFromEvent: (event) => {
                              return event.target.value.replace(/[^\d.]/g, '');
                            },
                            initialValue: '',
                          })(
                            <Input placeholder={'请输入'} onChange={(e) => this.meterChange('oldPeakEndCode', e)} />
                        )}
                      </FormItem>
                    </div>
                    <div className={`${styles.oldFlatEndCode} ${(oldFlatEndCode === 'noData' && styles.meterInpNull) || (!oldFlatEndCode && styles.meterInpDel)}`}>
                      <FormItem label="平" colon={false}>
                        {getFieldDecorator('oldFlatEndCode', {
                          rules: [{
                            required: true,
                            pattern: new RegExp(/(^[0-9]{1,6}$)|(^[0-9]{1,6}[\.]{1}[0-9]{1,2}$)/),
                            message: '最多输入6位整数和2位小数',
                          }],
                          getValueFromEvent: (event) => {
                            return event.target.value.replace(/[^\d.]/g, '');
                          },
                          initialValue: '',
                        })(
                          <Input placeholder={'请输入'} onChange={(e) => this.meterChange('oldFlatEndCode', e)} />
                          )}
                      </FormItem>
                    </div>
                    <div className={`${styles.oldLowEndCode} ${(oldLowEndCode === 'noData' && styles.meterInpNull) || (!oldLowEndCode && styles.meterInpDel)}`}>
                      <FormItem label="谷" colon={false}>
                        {getFieldDecorator('oldLowEndCode', {
                            rules: [{
                              required: true,
                              pattern: new RegExp(/(^[0-9]{1,6}$)|(^[0-9]{1,6}[\.]{1}[0-9]{1,2}$)/),
                              message: '最多输入6位整数和2位小数',
                            }],
                            getValueFromEvent: (event) => {
                              return event.target.value.replace(/[^\d.]/g, '');
                            },
                            initialValue: '',
                          })(
                            <Input placeholder={'请输入'} onChange={(e) => this.meterChange('oldLowEndCode', e)} />
                        )}
                      </FormItem>
                    </div>
                  </div>
                </div>
                <div className={styles.newMeter}>
                  <div className={styles.title}>新电表信息</div>
                  <div className={styles.meterContent}>
                  <div className={styles.modalMeterNumber}>
                    <div className={`${styles.newMeterNumber} ${(newMeterNumber === 'noData' && styles.meterInpNull) || (!newMeterNumber && styles.meterInpDel)}`}>
                        <FormItem label="表号" colon={true}>
                            {getFieldDecorator('newMeterNumber', {
                                rules: [{
                                  required: true,
                                  pattern: new RegExp(/^[1-9][0-9]{0,10}$/),
                                  message: '最多输入10位整数',
                                }],
                                getValueFromEvent: (event) => {
                                  return event.target.value.replace(/[^\d.]/g, '');
                                },
                                initialValue: '',
                            })(
                              <Input placeholder={'请输入'} onChange={(e) => this.meterChange('newMeterNumber', e)} />
                            )}
                          </FormItem>
                      </div>
                    </div>
                    <div className={styles.modalInitCode}>
                      <div className={`${styles.newMagnification} ${(newMagnification === 'noData' && styles.meterInpNull) || (!newMagnification && styles.meterInpDel)}`}>
                        <FormItem label="倍率" colon={true}>
                            {getFieldDecorator('newMagnification', {
                                rules: [{
                                  required: true,
                                  pattern: new RegExp(/^[1-9][0-9]{0,5}$/),
                                  message: '最多输入6位整数',
                                }],
                            getValueFromEvent: (event) => {
                              return event.target.value.replace(/[^\d.]/g, '');
                            },
                                initialValue: '',
                              })(
                                <Input placeholder={'请输入'} onChange={(e) => this.meterChange('newMagnification', e)} />
                            )}
                          </FormItem>
                      </div>
                    </div>
                    <div className={styles.newData}>新电表初始止码</div>
                    <div className={`${styles.newTotalStartCode} ${(newTotalStartCode === 'noData' && styles.meterInpNull) || (!newTotalStartCode && styles.meterInpDel)}`}>
                      <FormItem label="总" colon={false}>
                        {getFieldDecorator('newTotalStartCode', {
                            rules: [{
                              required: true,
                              pattern: new RegExp(/(^[0-9]{1,6}$)|(^[0-9]{1,6}[\.]{1}[0-9]{1,2}$)/),
                              message: '最多输入6位整数和2位小数',
                            }],
                            getValueFromEvent: (event) => {
                              return event.target.value.replace(/[^\d.]/g, '');
                            },
                            initialValue: '',
                          })(
                            <Input placeholder={'请输入'} onChange={(e) => this.meterChange('newTotalStartCode', e)} />
                        )}
                      </FormItem>
                    </div>
                    <div className={`${styles.newTopStartCode} ${(newTopStartCode === 'noData' && styles.meterInpNull) || (!newTopStartCode && styles.meterInpDel)}`}>
                      <FormItem label="尖" colon={false}>
                        {getFieldDecorator('newTopStartCode', {
                            rules: [{
                              required: true,
                              pattern: new RegExp(/(^[0-9]{1,6}$)|(^[0-9]{1,6}[\.]{1}[0-9]{1,2}$)/),
                              message: '最多输入6位整数和2位小数',
                            }],
                            getValueFromEvent: (event) => {
                              return event.target.value.replace(/[^\d.]/g, '');
                            },
                            initialValue: '',
                          })(
                            <Input placeholder={'请输入'} onChange={(e) => this.meterChange('newTopStartCode', e)} />
                        )}
                      </FormItem>
                    </div>
                    <div className={`${styles.newPeakStartCode} ${(newPeakStartCode === 'noData' && styles.meterInpNull) || (!newPeakStartCode && styles.meterInpDel)}`}>
                      <FormItem label="峰" colon={false}>
                        {getFieldDecorator('newPeakStartCode', {
                            rules: [{
                              required: true,
                              pattern: new RegExp(/(^[0-9]{1,6}$)|(^[0-9]{1,6}[\.]{1}[0-9]{1,2}$)/),
                              message: '最多输入6位整数和2位小数',
                            }],
                            getValueFromEvent: (event) => {
                              return event.target.value.replace(/[^\d.]/g, '');
                            },
                            initialValue: '',
                          })(
                            <Input placeholder={'请输入'} onChange={(e) => this.meterChange('newPeakStartCode', e)} />
                        )}
                      </FormItem>
                    </div>
                    <div className={`${styles.newFlatStartCode} ${(newFlatStartCode === 'noData' && styles.meterInpNull) || (!newFlatStartCode && styles.meterInpDel)}`}>
                      <FormItem label="平" colon={false}>
                        {getFieldDecorator('newFlatStartCode', {
                            rules: [{
                              required: true,
                              pattern: new RegExp(/(^[0-9]{1,6}$)|(^[0-9]{1,6}[\.]{1}[0-9]{1,2}$)/),
                              message: '最多输入6位整数和2位小数',
                            }],
                            getValueFromEvent: (event) => {
                              return event.target.value.replace(/[^\d.]/g, '');
                            },
                            initialValue: '',
                          })(
                            <Input placeholder={'请输入'} onChange={(e) => this.meterChange('newFlatStartCode', e)} />
                        )}
                      </FormItem>
                    </div>
                    <div className={`${styles.newLowStartCode} ${(newLowStartCode === 'noData' && styles.meterInpNull) || (!newLowStartCode && styles.meterInpDel)}`}>
                      <FormItem label="谷" colon={false}>
                        {getFieldDecorator('newLowStartCode', {
                            rules: [{
                              required: true,
                              pattern: new RegExp(/(^[0-9]{1,6}$)|(^[0-9]{1,6}[\.]{1}[0-9]{1,2}$)/),
                              message: '最多输入6位整数和2位小数',
                            }],
                            initialValue: '',
                          })(
                            <Input placeholder={'请输入'} onChange={(e) => this.meterChange('newLowStartCode', e)} />
                        )}
                      </FormItem>
                    </div>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </Modal>

        <div className={styles.tableTop}>
          <span className={styles.title}>电表设置</span>
          <CneButton className={styles.addBtn} onClick={this.addEvent}>
            <i className={`iconfont icon-newbuilt ${styles.addIcon}`} />
            <span className={styles.text}>添加</span>
          </CneButton>
        </div>
        <div className={styles.tableMain}>
          <div className={styles.tableHeader}>
            <div className={styles.meterName}> 电表名称</div>
            <div className={styles.meterNumber}> 表号</div>
            <div className={styles.meterType}> 计量类型</div>
            <div className={styles.initCode}> 电表倍率</div>
            <div className={styles.switchType}>
              <div className={styles.switchTypeParent}>初始底码</div>
              <div className={styles.switchTypeChild}>
                <span className={styles.totalStartCode}>总</span>
                <span className={styles.topStartCode}>尖</span>
                <span className={styles.peakStartCode}>峰</span>
                <span className={styles.flatStartCode}>平</span>
                <span className={styles.lowStartCode}>谷</span>
              </div>
            </div>
            <div className={styles.updateTime}> 更新时间</div>
            <div className={styles.handler}> 操作</div>
          </div>
          <div className={styles.tableContent}>
            {currentEventList.map((e, index) => {
              return { ...e, key: e.meterId, editable: !!e.editable};
              }).map(list => {
              return (<EditableCell
                eventData={list}
                changePoint={this.changeEditPoint}
                saveEvent={this.saveEvent}
                editEvent={this.editEvent}
                cancelEvent={this.cancelEvent}
                delEvent={this.delEvent}
                changeMeter={this.changeMeter}
                baseDeviceData={baseDeviceData}
                changeMeterReadSetStore={changeMeterReadSetStore}
                />);
            })}

            {addEventList.map((e, index) => {
              return { ...e, key: e.key, editable: true };
            }).map(list => {
              return (<EditableCell
                eventData={list}
                changePoint={this.changeEditPoint}
                saveEvent={this.saveEvent}
                editEvent={this.editEvent}
                cancelEvent={this.cancelEvent}
                delEvent={this.delEvent}
                changeMeter={this.changeMeter}
                baseDeviceData={baseDeviceData}
                changeMeterReadSetStore={changeMeterReadSetStore}
                />);
            })}

            {/* 没有更多数据 */}
            {currentEventList.length > 0 && <div className={styles.img}><img width="97" height="72" src="/img/notabdata97-72.png" /></div>}
            {/*没有数据或者请求数据失败*/}
            {(!tableLoading && currentEventList.length === 0) &&
              <div className={styles.img}>
                {meterListError && <img width="84" height="77" src="/img/datawrong.png" /> || <img width="223" height="164" src="/img/nodata.png" />}
              </div>
            }
          </div>
        </div>
        {/* 数据加载loading */}
        {tableLoading && <div className={styles.spin}><Spin tip="数据加载中"></Spin></div>}
      </div>
    );
  }
}

export default Form.create()(MeterReadTable);
