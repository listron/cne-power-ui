import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Form, Input, DatePicker, Select } from 'antd';
import moment from 'moment';
import InputLimit from '@components/Common/InputLimit';
import StationSelect from '@components/Common/StationSelect';
import * as FormItems from './FormCreateFunc';
import styles from './planModals.scss';
const FormItem = Form.Item;
const { Option } = Select;

class AddPlan extends PureComponent {

  static propTypes = {
    modalKey: PropTypes.string,
    showModal: PropTypes.bool,
    stageStations: PropTypes.array,
    form: PropTypes.object,
    changeStore: PropTypes.func,
  };

  state = {
    saveMode: 'normal', // 普通保存normal, 继续保存continue
  }

  componentDidUpdate(preProps){ // 保存完成, 清除信息并关闭弹框;
    // const { saveRecordLoading, recordDetailInfo, modalKey } = this.props;
    // const preLoading = preProps.saveRecordLoading;
    // if (modalKey === 'addRecord' && !saveRecordLoading && preLoading && !recordDetailInfo) {
    //   // 新增页 保存请求完毕 && 上次数据被清除 => 请求成功
    //   const { saveMode } = this.state;
    //   saveMode === 'normal' ? this.cancelAdd() : this.props.form.resetFields(); // normal正常关闭 / continue重置继续添加
    // }
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
  }

  render(){
    const { showModal, modalKey, form, stageStations } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        title="添加计划"
        visible={showModal && modalKey === 'addPlan'}
        onCancel={this.cancelHandle}
        footer={null}
        width={625}
      >
        <FormItems.StationForm getFieldDecorator={getFieldDecorator} stageStations={stageStations} />
        <FormItems.PlanTypeForm getFieldDecorator={getFieldDecorator} />
        <FormItems.InspectTypeForm getFieldDecorator={getFieldDecorator} />
        <FormItems.BeginForm getFieldDecorator={getFieldDecorator} />
        <FormItems.PlanDatesForm getFieldDecorator={getFieldDecorator} />
        <FormItems.CircleForm getFieldDecorator={getFieldDecorator} />
        <FormItems.PlanEndForm getFieldDecorator={getFieldDecorator} />
        <FormItems.LookContentForm getFieldDecorator={getFieldDecorator} />
        <FormItems.InspectNameForm getFieldDecorator={getFieldDecorator} />
        <FormItems.DeviceTypeForm getFieldDecorator={getFieldDecorator} />
        {/* <FormItem label="适用电站" colon={false} className={styles.eachRecordForm} >
          {getFieldDecorator('stationList', {
            rules: [{ required: true, message: '请选择电站' }],
            initialValue: [],
          })(
            <StationSelect
              data={stageStations}
              multiple={true}
              style={{ width: '200px' }}
            />
          )}
        </FormItem> */}
        {/* <FormItem label="计划类型" colon={false} className={styles.eachRecordForm} >
          {getFieldDecorator('planType', {
            rules: [{ required: true, message: '请选择计划类型' }],
            initialValue: '巡视计划',
          })(
            <Select>
              <Option value="巡视计划">巡视计划</Option>
            </Select>
          )}
        </FormItem> */}
        {/* <FormItem label="巡视类型" colon={false} className={styles.eachRecordForm} >
          {getFieldDecorator('lookType', {
            rules: [{ required: true, message: '请选择巡视类型' }],
            initialValue: '日常巡检',
          })(
            <Select>
              <Option value="日常巡检">日常巡检</Option>
              <Option value="巡视巡检">巡视巡检</Option>
            </Select>
          )}
          <span>注：巡视巡检将直接作为定期巡检，下发为巡检工单。</span>
        </FormItem> */}
        {/* <FormItem label="首次计划开始时间" colon={false} className={styles.eachRecordForm} >
          {getFieldDecorator('startTime', {
            rules: [{ required: true, message: '请选择开始时间' }],
            initialValue: null,
          })(
            <DatePicker showTime placeholder="选择时间" style={{width: '200px'}} allowClear={false} />
          )}
        </FormItem> */}
        {/* <FormItem label="计划天数" colon={false} className={styles.eachRecordForm} >
          {getFieldDecorator('planDates', {
            rules: [{ required: true, message: '请选择开始时间' }],
            initialValue: null,
          })(
            <Input style={{width: '200px'}} placeholder="请输入..." />
          )}
          天
        </FormItem> */}
        {/* <FormItem label="循环周期" colon={false} className={styles.eachRecordForm} >
          {getFieldDecorator('circleDates', {
            rules: [{ required: true, message: '请选择开始时间' }],
            initialValue: null,
          })(
            <Select>
              <Option value="everyDay">每天</Option>
              <Option value="everyWeek">每周</Option>
              <Option value="everyMonth">每月</Option>
              <Option value="everySeason">每季度</Option>
              <Option value="everyYear">每年</Option>
              <Option value="once">一次</Option>
              <Option value="halfYear">半年</Option>
            </Select>
          )}
        </FormItem> */}
        {/* 日常巡视独有内容 */}
        {/* <FormItem label="计划截止时间" colon={false} className={styles.eachRecordForm} >
          {getFieldDecorator('circleDates', {
            rules: [{ required: true, message: '请选择开始时间' }],
            initialValue: null,
          })(
            <Select>
              <Option value="everyDay">每天</Option>
              <Option value="everyWeek">每周</Option>
              <Option value="everyMonth">每月</Option>
              <Option value="everySeason">每季度</Option>
              <Option value="everyYear">每年</Option>
              <Option value="once">一次</Option>
              <Option value="halfYear">半年</Option>
            </Select>
          )}
        </FormItem> */}
        {/* 日常巡视独有内容 */}
      </Modal>
    );
  }
}

export default Form.create({})(AddPlan);
