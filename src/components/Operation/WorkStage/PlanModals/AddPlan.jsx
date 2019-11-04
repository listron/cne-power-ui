import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Form, Input, DatePicker, Select } from 'antd';
import moment from 'moment';
import InputLimit from '@components/Common/InputLimit';
import StationSelect from '@components/Common/StationSelect';
import styles from './planModals.scss';
const FormItem = Form.Item;
const { Option } = Select;

class AddPlan extends PureComponent {

  static propTypes = {
    theme: PropTypes.string,
    modalKey: PropTypes.string,
    saveRecordLoading: PropTypes.bool,
    showModal: PropTypes.bool,
    stageStations: PropTypes.array,
    stationDeviceTypes: PropTypes.array,
    form: PropTypes.object,
    recordDetailInfo: PropTypes.object,
    changeStore: PropTypes.func,
    addPlan: PropTypes.func,
  };

  state = {
    saveMode: 'normal', // 普通保存normal, 继续保存continue
  }

  componentDidUpdate(preProps){ // 保存完成, 清除信息并关闭弹框;
    const { saveRecordLoading, recordDetailInfo } = this.props;
    const preLoading = preProps.saveRecordLoading;
    if (!saveRecordLoading && preLoading && !recordDetailInfo) {
      // 新增页 保存请求完毕 && 上次数据被清除 => 请求成功
      const { saveMode } = this.state;
      saveMode === 'normal' ? this.cancelHandle() : this.props.form.resetFields(); // normal正常关闭 / continue重置继续添加
    }
  }

  componentWillUnmount(){
    this.props.form.resetFields();
  }

  cancelHandle = () => { // 关闭
    this.props.changeStore({
      showModal: false,
      modalKey: null,
      recordDetailInfo: null,
    });
    this.props.form.resetFields();
  }

  disabledStartDate = (cur) => cur.isBefore(moment(), 'day')

  disbleEndDate = (cur) => {
    const { form } = this.props;
    const { getFieldValue } = form;
    const startTime = getFieldValue('firstStartTime');
    return !startTime || cur.isBefore(startTime, 'day') || cur.isAfter(moment().add(5, 'year'), 'day');
  }

  saveAddRecord = () => this.onAddSave('normal');

  continueAddRecord = () => this.onAddSave('continue');

  onAddSave = (saveMode) => {
    this.setState({ saveMode }, () => {
      this.props.form.validateFields((err, values) => {
        if (!err) {
          const { stationList, firstStartTime, deadLine, ...rest} = values;
          this.props.addPlan({
            ...rest,
            stationCodes: stationList.map(e => e.stationCode),
            firstStartTime: firstStartTime.format('YYYY/MM/DD'),
            deadLine: deadLine && deadLine.format('YYYY/MM/DD'),
          });
        }
      });
    });
  }

  validPeriodDays = {
    152: 1,
    153: 7,
    154: 30,
    155: 90,
    156: 365,
    151: 100,
    157: 180,
  }

  render(){
    const { saveMode } = this.state;
    const { showModal, modalKey, form, stageStations, stationDeviceTypes, saveRecordLoading, theme } = this.props;
    const { getFieldDecorator, getFieldsValue } = form;
    const {
      firstStartTime,
      inspectTypeCode,
      deviceTypeCodes = [],
      cycleTypeCode,
    } = getFieldsValue(['inspectTypeCode', 'firstStartTime', 'deviceTypeCodes', 'cycleTypeCode']);
    return (
      <Modal
        title="添加计划"
        visible={showModal && modalKey === 'addPlan'}
        onCancel={this.cancelHandle}
        footer={null}
        width={800}
        wrapClassName={`${styles.addPlanFormModal} ${styles[theme]}`}
      >
        <Form className={styles.addPlanForm}>
          <div className={styles.planFormBox}>
            <FormItem label="适用电站" colon={false} className={styles.eachPlanForm} >
              {getFieldDecorator('stationList', {
                rules: [{ required: true, message: '请选择电站' }],
                initialValue: [],
              })(
                <StationSelect
                  data={stageStations}
                  multiple={true}
                  style={{ width: '200px' }}
                  stationShowNumber={true}
                  theme={theme}
                />
              )}
            </FormItem>
            <FormItem label="计划类型" colon={false} className={styles.eachPlanForm} >
              {getFieldDecorator('planTypeCode', {
                rules: [{ required: true, message: '请选择计划类型' }],
                initialValue: 100,
              })(
                <Select style={{width: '200px'}} getPopupContainer={() => this.planTypeRef}>
                  <Option value={100}>巡视计划</Option>
                </Select>
              )}
              <span ref={(ref) => { this.planTypeRef = ref; }} />
            </FormItem>
            <FormItem label="巡视类型" colon={false} className={styles.eachPlanForm} >
              {getFieldDecorator('inspectTypeCode', {
                rules: [{ required: true, message: '请选择巡视类型' }],
                initialValue: 100001,
              })(
                <Select style={{width: '200px'}} getPopupContainer={() => this.respectTypeRef}>
                  <Option value={100001}>日常巡检</Option>
                  <Option value={100002}>巡视巡检</Option>
                </Select>
              )}
              <span ref={(ref) => { this.respectTypeRef = ref; }} />
              <span className={styles.addFormTips}>注：巡视巡检将直接作为定期巡检，下发为巡检工单。</span>
            </FormItem>
            <FormItem label="首次下发时间" colon={false} className={styles.eachPlanForm} >
              {getFieldDecorator('firstStartTime', {
                rules: [{ required: true, message: '请选择首次下发时间' }],
                initialValue: moment(),
              })(
                <DatePicker
                  showTime
                  placeholder="选择时间"
                  style={{width: '200px'}}
                  allowClear={false}
                  disabledDate={this.disabledStartDate}
                  getCalendarContainer={() => this.firstStartRef}
                />
              )}
              <span ref={(ref) => { this.firstStartRef = ref; }} />
            </FormItem>
            <FormItem label="循环周期" colon={false} className={styles.eachPlanForm} >
              {getFieldDecorator('cycleTypeCode', {
                rules: [{ required: true, message: '请选择循环周期' }],
                initialValue: null,
              })(
                <Select style={{width: '200px'}} getPopupContainer={() => this.cycleTypeRef}>
                  <Option value={151}>一次</Option>
                  <Option value={152}>每天</Option>
                  <Option value={153}>每周</Option>
                  <Option value={154}>每月</Option>
                  <Option value={155}>每季度</Option>
                  <Option value={157}>半年</Option>
                  <Option value={156}>每年</Option>
                </Select>
              )}
              <span ref={(ref) => { this.cycleTypeRef = ref; }} />
            </FormItem>
            <FormItem label="执行工时" colon={false} className={styles.eachPlanForm} >
              {getFieldDecorator('validPeriod', {
                rules: [{
                  required: true,
                  validator: (rule, value, callback)=>{
                    if (!value) {
                      callback('请输入执行工时');
                    } else {
                      const notNumber = isNaN(value);
                      const hasDemical = value.split('.')[1];
                      const wrongNumber = value < 0 || value > this.validPeriodDays[cycleTypeCode];
                      (notNumber || hasDemical || wrongNumber) && callback(
                        `执行工时需为不超过${this.validPeriodDays[cycleTypeCode] || 999}的整数`
                      );
                    }
                    callback();
                  },
                }],
                initialValue: null,
              })(
                <Input style={{width: '200px'}} placeholder="请输入..." />
              )}
              天
              {cycleTypeCode && <span className={styles.addFormTips}>注：不超过{this.validPeriodDays[cycleTypeCode]}天</span>}
            </FormItem>
            {inspectTypeCode === 100002 && <FormItem label="巡视名称" colon={false} className={styles.eachPlanForm} >
              {getFieldDecorator('planName', {
                rules: [{ required: true, max: 10, message: '请输入不超过10个字的巡视名称' }],
                initialValue: '',
              })(
                <Input style={{width: '200px'}} placeholder="请输入..." />
              )}
               <span className={styles.addFormTips}>注：10个字以内</span>
            </FormItem>}
            {inspectTypeCode === 100002 && <FormItem label="设备类型" colon={false} className={styles.eachPlanForm} >
              {getFieldDecorator('deviceTypeCodes', {
                rules: [{ required: true, message: '请选择设备类型' }],
                initialValue: [],
              })(
                <Select
                  style={{width: '200px'}}
                  mode="multiple"
                  getPopupContainer={() => this.deviceTypeRef}
                  {...(deviceTypeCodes.length > 0 ? {
                    maxTagCount: 0,
                    maxTagPlaceholder: `已选${deviceTypeCodes.length}/${stationDeviceTypes.length}`,
                  } : {})}
                >
                  {stationDeviceTypes.map(e => (
                    <Option key={e.deviceTypeCode} value={e.deviceTypeCode}>{e.deviceTypeName}</Option>
                  ))}
                </Select>
              )}
              <span ref={(ref) => { this.deviceTypeRef = ref; }} />
            </FormItem>}
            <FormItem label="计划失效时间" colon={false} className={styles.eachPlanForm} >
              {getFieldDecorator('deadLine', {
                rules: [{ required: true, message: '请选择计划失效时间' }],
                initialValue: moment().add(5, 'year'),
              })(
                <DatePicker
                  showTime
                  placeholder="选择时间"
                  style={{width: '200px'}}
                  allowClear={false}
                  disabled={!firstStartTime}
                  disabledDate={this.disbleEndDate}
                  getCalendarContainer={() => this.deadLineRef}
                />
              )}
              <span ref={(ref) => { this.deadLineRef = ref; }} />
              <span className={styles.addFormTips}>注：该时间为计划整体结束时间，不针对单次。</span>
            </FormItem>
            {inspectTypeCode === 100001 && <FormItem label="巡视内容" colon={false} className={styles.eachPlanForm} >
              {getFieldDecorator('inspectContent', {
                rules: [{ required: true, message: '请输入巡视内容' }],
                initialValue: '',
              })(
                <InputLimit width={400} size={999} placeholder="请输入..." />
              )}
            </FormItem>}
          </div>
          <div className={styles.saveRow}>
            <Button
              onClick={this.saveAddRecord}
              loading={saveMode === 'normal' && saveRecordLoading}
              className={styles.saveBtn}
            >保存</Button>
            <Button
              onClick={this.continueAddRecord}
              loading={saveMode === 'continue' && saveRecordLoading}
              className={styles.continueSaveBtn}
            >保存并继续添加</Button>
            <Button onClick={this.cancelHandle} className={styles.cancelSaveBtn}>取消</Button>
          </div>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({
  onValuesChange: (props, changedValues, allFields) => {
    const { stationList = [], inspectTypeCode } = changedValues || {};
    if (// 巡视巡检 + 选择电站 => 请求设备类型列表
      (inspectTypeCode === 100002 && allFields.stationList.length > 0)
        || (stationList.length > 0 && allFields.inspectTypeCode === 100002)
    ) {
      const tmpStationArr = stationList.length > 0 ? stationList : allFields.stationList;
      props.getStationDeviceTypes({ stationCodes: tmpStationArr.map(e => e.stationCode).join(',') });
    }
  },
})(AddPlan);
