import React from 'react';
import { Form, Select, Input, DatePicker } from 'antd';
import PropTypes from 'prop-types';
import StationSelect from '@components/Common/StationSelect';
import styles from './planModals.scss';

const FormItem = Form.Item;
const { Option } = Select;


const formItemCreate = ({Item, label, colon = false, className = styles.eachRecordForm }) => { // formItem工厂
  return (
    <FormItem label={label} colon={colon} className={className} >
      {Item}
    </FormItem>
  );
};

formItemCreate.propTypes = {
  className: PropTypes.string,
  colon: PropTypes.bool,
  label: PropTypes.string,
  Item: PropTypes.object,
};

const StationForm = ({ getFieldDecorator, stageStations }) => formItemCreate({ // 电站选择
  label: '电站',
  Item: getFieldDecorator('stationList', {
    rules: [{ required: true, message: '请选择电站' }],
    initialValue: [],
  })(
    <StationSelect
      data={stageStations}
      multiple={true}
      style={{ width: '200px' }}
    />
  ),
});

const PlanTypeForm = ({ getFieldDecorator }) => formItemCreate({
  label: '计划类型',
  Item: getFieldDecorator('planType', {
    rules: [{ required: true, message: '请选择计划类型' }],
    initialValue: '巡视计划',
  })(
    <Select>
      <Option value="巡视计划">巡视计划</Option>
    </Select>
  ),
});

const InspectTypeForm = ({ getFieldDecorator }) => formItemCreate({
  label: '巡视类型',
  Item: getFieldDecorator('inspectType', {
    rules: [{ required: true, message: '请选择巡视类型' }],
    initialValue: '日常巡检',
  })(
    <Select>
      <Option value="日常巡检">日常巡检</Option>
      <Option value="巡视巡检">巡视巡检</Option>
    </Select>
  ),
});

const BeginForm = ({ getFieldDecorator }) => formItemCreate({
  label: '首次计划开始时间',
  Item: getFieldDecorator('startTime', {
    rules: [{ required: true, message: '请选择开始时间' }],
    initialValue: null,
  })(
    <DatePicker showTime placeholder="选择时间" style={{width: '200px'}} allowClear={false} />
  ),
});

const PlanDatesForm = ({ getFieldDecorator }) => formItemCreate({
  label: '计划天数',
  Item: getFieldDecorator('planDates', {
    rules: [{ required: true, message: '请选择开始时间' }],
    initialValue: '',
  })(
    <Input style={{width: '200px'}} placeholder="请输入..." />
  ),
});

const CircleForm = ({ getFieldDecorator }) => formItemCreate({
  label: '循环周期',
  Item: getFieldDecorator('circleDates', {
    rules: [{ required: true, message: '请选择循环周期' }],
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
  ),
});

const PlanEndForm = ({ getFieldDecorator }) => formItemCreate({ // 普通巡检独有
  label: '计划截止时间',
  Item: getFieldDecorator('endTime', {
    rules: [{ required: true, message: '请选择截止时间' }],
    initialValue: null,
  })(
    <DatePicker showTime placeholder="选择时间" style={{width: '200px'}} allowClear={false} />
  ),
});

const LookContentForm = ({ getFieldDecorator }) => formItemCreate({ // 普通巡检独有
  label: '巡视内容',
  Item: getFieldDecorator('contentInfo', {
    rules: [{ required: true, message: '请输入巡视内容' }],
    initialValue: '',
  })(
    <Input style={{width: '200px'}} placeholder="请输入..." />
  ),
});

const InspectNameForm = ({ getFieldDecorator }) => formItemCreate({ // 巡视巡检独有
  label: '巡检名称',
  Item: getFieldDecorator('inspectName', {
    rules: [{ required: true, message: '请输入巡视名称' }],
    initialValue: '',
  })(
    <Input style={{width: '200px'}} placeholder="请输入..." />
  ),
});

const DeviceTypeForm = ({ getFieldDecorator }) => formItemCreate({ // 巡视巡检独有
  label: '设备类型',
  Item: getFieldDecorator('deviceType', {
    rules: [{ required: true, message: '请选择设备类型' }],
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
  ),
});


export {
  StationForm,
  PlanTypeForm,
  InspectTypeForm,
  BeginForm,
  PlanDatesForm,
  CircleForm,
  PlanEndForm,
  LookContentForm,
  InspectNameForm,
  DeviceTypeForm,
};









