import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, DatePicker, Select } from 'antd';
import moment from 'moment';
import InputLimit from '@components/Common/InputLimit';
import StationSelect from '@components/Common/StationSelect';
import CneButton from '@components/Common/Power/CneButton';
import styles from './addEdit.scss';

const FormItem = Form.Item;
const { Option } = Select;

class AddEditPlan extends PureComponent {

  static propTypes = {
    theme: PropTypes.string,
    addPlanLoading: PropTypes.bool,
    form: PropTypes.object,
    stations: PropTypes.array,
    stationDeviceTypes: PropTypes.array,
    planPageKey: PropTypes.string,
    planDetail: PropTypes.object,
    changeStore: PropTypes.func,
    addWorkPlan: PropTypes.func,
    editWorkPlan: PropTypes.func,
  };

  state = {
    saveMode: 'normal', // 普通保存normal, 继续保存continue
    planValue: 100, // 默认巡检
  }

  componentDidUpdate(preProps){ // 保存完成, 清除信息并关闭弹框;
    const { addPlanLoading, planDetail } = this.props;
    const preLoading = preProps.addPlanLoading;
    if (!addPlanLoading && preLoading && Object.keys(planDetail).length === 0) {
      // 新增页 保存请求完毕 && 上次数据被清除 => 请求成功
      const { saveMode } = this.state;
      saveMode === 'normal' ? this.cancelHandle() : this.props.form.resetFields(); // normal正常关闭 / continue重置继续添加
    }
  }

  componentWillUnmount(){
    this.props.form.resetFields();
  }

  backToList = () => { // 返回主列表页
    this.props.changeStore({ planPageKey: 'list' });
  }

  backList = () => this.props.changeStore({ planPageKey: 'list', planDetail: {} })

  saveAdd = () => this.onAddSave('normal');

  continueAdd = () => this.onAddSave('continue');

  editSave = () => {
    const { form, editWorkPlan, planDetail } = this.props;
    const { planId } = planDetail;
    form.validateFields(this.formInfoQuery(editWorkPlan, planId));
  }

  onAddSave = (saveMode) => {
    this.setState({ saveMode }, () => {
      this.props.form.validateFields(this.formInfoQuery(this.props.addWorkPlan));
    });
  }

  formInfoQuery = (queryMethod = () => {}, planId) => (err, values) => {
    if (!err) {
      const { stationList, firstStartTime, deadLine, ...rest} = values;
      let deadLineStr; // 循环周期为一次时, 失效时间不必填写, 默认为首次下发时间 +1 天;
      if (parseFloat(rest.cycleTypeCode) === 151) {
        deadLineStr = moment(firstStartTime).add(1, 'day').format('YYYY/MM/DD');
      } else {
        deadLineStr = moment(deadLine).format('YYYY/MM/DD');
      }
      queryMethod({
        ...rest,
        planId,
        stationCodes: stationList.map(e => e.stationCode),
        firstStartTime: firstStartTime.format('YYYY/MM/DD'),
        deadLine: deadLineStr,
      });
    }
  }

  cancelHandle = () => this.props.changeStore({ planPageKey: 'list', planDetail: {} })

  disabledStartDate = (cur) => cur.isBefore(moment(), 'day')

  disbleEndDate = (cur) => {
    const { form } = this.props;
    const { getFieldValue } = form;
    const startTime = getFieldValue('firstStartTime');
    return !startTime || cur.isBefore(startTime, 'day'); // || cur.isAfter(moment().add(5, 'year'), 'day');
  }

  // 计划类型
  planFunc = (value) => {
    const { form } = this.props;
    this.setState({
      planValue: value,
    });
    // 切换抄表计划-默认选中每月
    value === 200 && form.setFieldsValue({
      cycleTypeCode: 154,
    });
  };

  validPeriodDays = {
    151: 100,
    152: 1,
    153: 7,
    154: 30,
    155: 90,
    156: 180,
    157: 365,
  }

  render(){
    const { saveMode, planValue } = this.state;
    const { planPageKey, form, stations, stationDeviceTypes, addPlanLoading, planDetail, theme } = this.props;
    const { getFieldDecorator, getFieldsValue } = form;
    const {
      stations: initialStation = [],
      planTypeCode: initialPlanTypeCode = 100,
      inspectTypeCode: initialInspectTypeCode = 100001,
      firstStartTime: initialFirstStartTime = null,
      validPeriod: initialValidPeriod = null,
      cycleTypeCode: initialCycleTypeCode = null,
      planName: initialPlanName = '',
      deviceTypes: initialDeviceTypes = [],
      deadLine: initialDeadLine = null,
      inspectContent: initialInspectContent = '',
    } = (planPageKey === 'edit' ? planDetail : {}); // 默认值设置;
    const {
      firstStartTime = initialFirstStartTime,
      inspectTypeCode = initialInspectTypeCode,
      deviceTypeCodes = initialDeviceTypes,
      cycleTypeCode = initialCycleTypeCode,
      planTypeCode = initialPlanTypeCode,
    } = getFieldsValue(['inspectTypeCode', 'firstStartTime', 'deviceTypeCodes', 'cycleTypeCode', 'planTypeCode']);

    return (
      <section className={`${styles.addEditPlan} ${styles[theme]}`}>
        <h3 className={styles.top}>
          <span>添加计划</span>
          <i className={`iconfont icon-fanhui ${styles.backIcon}`} title="返回" onClick={this.backList} />
        </h3>
        <Form className={styles.addEditPlanForm}>
          <div className={styles.formBox}>
            <FormItem label="适用电站" colon={false} className={styles.eachPlanForm} >
              {getFieldDecorator('stationList', {
                rules: [{ required: true, message: '请选择电站' }],
                initialValue: initialStation,
              })(
                <StationSelect
                  data={stations.filter(e => (e.stationType === 1 && e.isConnected === 1))}
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
                initialValue: initialPlanTypeCode,
              })(
                planPageKey === 'edit' ? <span
                  style={{width: '200px', display: 'inline-block'}}
                >{planTypeCode === '100' ? '巡视计划' : '抄表计划'}</span> : <Select style={{width: '200px'}} getPopupContainer={() => this.planTypeRef} onChange={this.planFunc}>
                  <Option value={100}>巡视计划</Option>
                  <Option value={200}>抄表计划</Option>
                </Select>
              )}
              <span ref={(ref) => { this.planTypeRef = ref; }} />
            </FormItem>
            {(planPageKey === 'edit' ? planTypeCode === '100' : planTypeCode === 100) && <FormItem label="巡视类型" colon={false} className={styles.eachPlanForm} >
              {getFieldDecorator('inspectTypeCode', {
                rules: [{ required: true, message: '请选择巡视类型' }],
                initialValue: initialInspectTypeCode,
              })(
                planPageKey === 'edit' ? <span
                  style={{width: '200px', display: 'inline-block'}}
                >{planDetail.inspectTypeName}</span> : <Select
                  style={{width: '200px'}}
                  getPopupContainer={() => this.inspectTypeRef}
                >
                  <Option value={100001}>日常巡视</Option>
                  <Option value={100002}>设备巡检</Option>
                </Select>
              )}
              <span ref={(ref) => { this.inspectTypeRef = ref; }} />
              <span className={styles.addFormTips}>注：设备巡检将直接作为定期巡检，下发为巡检工单。</span>
            </FormItem>}
            <FormItem label="首次下发时间" colon={false} className={styles.eachPlanForm} >
              {getFieldDecorator('firstStartTime', {
                rules: [{ required: true, message: '请选择首次下发时间' }],
                initialValue: initialFirstStartTime ? moment(initialFirstStartTime) : moment(),
              })(
                <DatePicker
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
                initialValue: (planPageKey === 'edit') ? initialCycleTypeCode : 154,
                // initialValue: initialCycleTypeCode,
              })(
                <Select style={{width: '200px'}} getPopupContainer={() => this.cycleTypeRef}>
                  {planValue !== 200 && <Option value={151}>单次</Option>}
                  {planValue !== 200 && <Option value={152}>每天</Option>}
                  {planValue !== 200 && <Option value={153}>每周</Option>}
                  <Option value={154}>每月</Option>
                  {planValue !== 200 && <Option value={155}>每季度</Option>}
                  {planValue !== 200 && <Option value={156}>半年</Option>}
                  {planValue !== 200 && <Option value={157}>每年</Option>}
                </Select>
              )}
              <span ref={(ref) => { this.cycleTypeRef = ref; }} />
            </FormItem>
            <FormItem label="执行天数" colon={false} className={styles.eachPlanForm} >
              {getFieldDecorator('validPeriod', {
                rules: [{
                  required: true,
                  validator: (rule, value, callback)=>{
                    if (!value) {
                      callback('请输入执行天数');
                    } else {
                      const notNumber = isNaN(value);
                      const hasDemical = `${value}`.split('.')[1];
                      const wrongNumber = value < 0 || value > this.validPeriodDays[cycleTypeCode];
                      (notNumber || hasDemical || wrongNumber) && callback(
                        `执行天数需为不超过${this.validPeriodDays[cycleTypeCode] || 999}的整数`
                      );
                    }
                    callback();
                  },
                }],
                // initialValue: initialValidPeriod,
                initialValue: planPageKey === 'edit' ? initialValidPeriod : 2,
              })(
                <Input style={{width: '200px', marginRight: '4px'}} placeholder="请输入..." />
              )}
              天
              {cycleTypeCode && <span className={styles.addFormTips}>注：不超过{this.validPeriodDays[cycleTypeCode]}天</span>}
            </FormItem>
            {parseInt(inspectTypeCode, 10) === 100002 && <FormItem label="巡视名称" colon={false} className={styles.eachPlanForm} >
              {getFieldDecorator('planName', {
                rules: [{ required: true, max: 10, message: '请输入不超过10个字的巡视名称' }],
                initialValue: initialPlanName,
              })(
                <Input style={{width: '200px'}} placeholder="请输入..." />
              )}
              <span className={styles.addFormTips}>注：10个字以内</span>
            </FormItem>}
            {parseInt(inspectTypeCode, 10) === 100002 && <FormItem label="设备类型" colon={false} className={styles.eachPlanForm} >
              {getFieldDecorator('deviceTypeCodes', {
                rules: [{ required: true, message: '请选择设备类型' }],
                initialValue: initialDeviceTypes ? initialDeviceTypes.map(e => parseFloat(e.deviceTypeCode)) : [],
              })(
                <Select
                  style={{width: '200px'}}
                  mode="multiple"
                  getPopupContainer={() => this.deviceTypeRef}
                  {...(deviceTypeCodes && deviceTypeCodes.length > 0 ? {
                    maxTagCount: 0,
                    maxTagPlaceholder: `已选${deviceTypeCodes.length}/${stationDeviceTypes.length}`,
                  } : {})}
                >
                  {stationDeviceTypes.filter(e => e.deviceTypeName !== '全场信息汇总').map(e => (
                    <Option key={e.deviceTypeCode} value={e.deviceTypeCode}>{e.deviceTypeName}</Option>
                  ))}
                </Select>
              )}
              <span ref={(ref) => { this.deviceTypeRef = ref; }} />
            </FormItem>}
            {parseFloat(cycleTypeCode) !== 151 && <FormItem label="计划失效时间" colon={false} className={styles.eachPlanForm} >
              {getFieldDecorator('deadLine', {
                rules: [{ required: true, message: '请选择计划失效时间' }],
                initialValue: initialDeadLine ? moment(initialDeadLine) : moment().add(5, 'year'),
              })(
                <DatePicker
                  placeholder="选择时间"
                  style={{width: '200px'}}
                  allowClear={false}
                  disabled={planPageKey === 'add' && !firstStartTime}
                  disabledDate={this.disbleEndDate}
                  getCalendarContainer={() => this.deadLineRef}
                />
              )}
              <span ref={(ref) => { this.deadLineRef = ref; }} />
              <span className={styles.addFormTips}>注：该时间为计划整体结束时间，不针对单次。</span>
            </FormItem>}
            {parseInt(inspectTypeCode, 10) === 100001 && (planPageKey === 'edit' ? planTypeCode === '100' : planTypeCode === 100) && <FormItem label="巡视内容" colon={false} className={styles.eachPlanForm} >
              {getFieldDecorator('inspectContent', {
                rules: [{ required: true, message: '请输入巡视内容' }],
                initialValue: initialInspectContent,
              })(
                <InputLimit width={400} size={999} placeholder="请输入..." />
              )}
            </FormItem>}
          </div>
          <div className={styles.saveRow}>
            <CneButton
              onClick={planPageKey === 'add' ? this.saveAdd : this.editSave}
              loading={saveMode === 'normal' && addPlanLoading}
              className={styles.saveBtn}
              lengthMode="short"
            >保存</CneButton>
            {planPageKey === 'add' && <CneButton
              lengthMode="long"
              onClick={this.continueAdd}
              loading={saveMode === 'continue' && addPlanLoading}
              className={styles.continueSaveBtn}
            >保存并继续添加</CneButton>}
            {planPageKey === 'add' && <CneButton onClick={this.cancelHandle} className={styles.cancelSaveBtn} lengthMode="short">取消</CneButton>}
          </div>
        </Form>
      </section>
    );
  }
}

export default Form.create({
  onValuesChange: (props, changedValues, allFields) => {
    const { stationList = [], inspectTypeCode } = changedValues || {};
    if (// 设备巡检 + 选择电站 => 请求设备类型列表
      (inspectTypeCode === 100002 && allFields.stationList.length > 0)
        || (stationList.length > 0 && allFields.inspectTypeCode === 100002)
    ) {
      const tmpStationArr = stationList.length > 0 ? stationList : allFields.stationList;
      props.getStationDeviceTypes({ stationCodes: tmpStationArr.map(e => e.stationCode).join(',') });
    }
  },
})(AddEditPlan);

