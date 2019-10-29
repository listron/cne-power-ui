import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Switch, Form, Input, DatePicker, Select } from 'antd';
import styles from './addEdit.scss';

const FormItem = Form.Item;
const { Option } = Select;

class AddEditPlan extends PureComponent {

  state = {
    saveMode: 'normal', // 普通保存normal, 继续保存continue
  }

  static propTypes = {
    planPageKey: PropTypes.string,
    planDetail: PropTypes.object,
    changeStore: PropTypes.func,
  };

  componentWillUnmount(){
    this.props.form.resetFields();
  }

  backToList = () => { // 返回主列表页
    this.props.changeStore({ planPageKey: 'list' });
  }

  detailBase = [
    {
      title: '适用电站',
      key: 'stations',
      render: ({ stations = [] }) => {
        const stationStr = stations.map(e => e.stationName).join(',');
        return (<span title={stationStr}>{stationStr || '--'}</span>);
      },
    }, {
      title: '计划类型',
      dataIndex: 'planTypeName',
    }, {
      title: '巡视类型',
      dataIndex: 'inspectTypeName',
    }, {
      title: '首次计划开始时间',
      dataIndex: 'firstStartTime',
      render: ({ firstStartTime, firstStartWeek }) => {
        return <span>{firstStartTime || '--'} {firstStartWeek}</span>;
      },
    }, {
      title: '循环周期',
      dataIndex: 'cycleTypeName',
    }, {
      title: '执行工时',
      dataIndex: 'validPeriod',
      render: ({ validPeriod }) => `${validPeriod || '--'}天`,
    },
  ]

  baseDaily = [ // 日常巡视独有
    {
      title: '计划失效时间',
      dataIndex: 'deadLine',
    }, {
      title: '巡视内容',
      dataIndex: 'inspectContent',
    },
  ]

  baseInspect = [ // 巡视计划独有
    {
      title: '巡检名称',
      dataIndex: 'planName',
    }, {
      title: '计划失效时间',
      dataIndex: 'deadLine',
    }, {
      title: '设备类型',
      dataIndex: 'deviceTypes',
      render: ({ deviceTypes = [] }) => {
        const deviceTypeStr = deviceTypes.map(e => e.deviceTypeName).join(',');
        return (<span title={deviceTypeStr}>{deviceTypeStr || '--'}</span>);
      },
    },
  ]

  baseEnd = [ // 剩下的公用信息部分
    {
      title: '制定人',
      dataIndex: 'createName',
    }, {
      title: '下次下发时间',
      dataIndex: 'nextSendTime',
      render: ({ nextSendTime, nextSendWeek }) => {
        return <span>{nextSendTime || '--'} {nextSendWeek}</span>;
      },
    }, {
      title: '启用开关',
      dataIndex: 'planStatus', // 1 启用 2 停用
      render: ({ planStatus }) => <Switch disabled checked={planStatus === 1} />,
    }, {
      title: '操作日志',
      dataIndex: 'planLogs',
      render: ({ planLogs = [] }) => {
        const operateInfo = ['--', '新增', '编辑', '删除', '其他'];
        return (
          <div>
            {planLogs.map(e => {
              const { createTime = '--', operateType, after = {} } = e || {};
              const { createName = '--' } = after;
              return (
                <div key={createTime}>
                  <span className={styles.logTip}>【操作人】</span>
                  <span className={styles.logValue}>{createName}</span>
                  <span className={styles.logTip}>【操作时间】</span>
                  <span className={styles.logValue}>{createTime}</span>
                  <span className={styles.logTip}>【操作类型】</span>
                  <span className={styles.logValue}>{operateInfo[operateType] || '--'}</span>
                </div>
              );
            })}
          </div>
        );
      },
    },
  ]

  backList = () => this.props.changeStore({ planPageKey: 'list', planDetail: {} })

  render(){
    const { saveMode } = this.state;
    const { form, stageStations, stationDeviceTypes, saveRecordLoading, planDetail } = this.props;
    const { getFieldDecorator, getFieldsValue } = form;
    const { firstStartTime, inspectTypeCode } = getFieldsValue(['inspectTypeCode', 'firstStartTime']);
    return (
      <section className={styles.addNew}>
        <h3 className={styles.detailTop}>
          <span>添加计划</span>
          <span className={styles.topHandle}>
            <Icon onClick={this.backList} type="arrow-left" className={styles.backIcon} />
          </span>
        </h3>
        <div className={styles.detailContent}>
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
                  />
                )}
              </FormItem>
              <FormItem label="计划类型" colon={false} className={styles.eachPlanForm} >
                {getFieldDecorator('planTypeCode', {
                  rules: [{ required: true, message: '请选择计划类型' }],
                  initialValue: 100,
                })(
                  <Select style={{width: '200px'}}>
                    <Option value={100}>巡视计划</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem label="巡视类型" colon={false} className={styles.eachPlanForm} >
                {getFieldDecorator('inspectTypeCode', {
                  rules: [{ required: true, message: '请选择巡视类型' }],
                  initialValue: 100001,
                })(
                  <Select style={{width: '200px'}}>
                    <Option value={100001}>日常巡检</Option>
                    <Option value={100002}>巡视巡检</Option>
                  </Select>
                )}
                <span className={styles.addFormTips}>注：巡视巡检将直接作为定期巡检，下发为巡检工单。</span>
              </FormItem>
              <FormItem label="首次计划开始时间" colon={false} className={styles.eachPlanForm} >
                {getFieldDecorator('firstStartTime', {
                  rules: [{ required: true, message: '请选择开始时间' }],
                  initialValue: null,
                })(
                  <DatePicker
                    showTime
                    placeholder="选择时间"
                    style={{width: '200px'}}
                    allowClear={false}
                    disabledDate={this.disabledStartDate}
                  />
                )}
              </FormItem>
              <FormItem label="计划天数" colon={false} className={styles.eachPlanForm} >
                {getFieldDecorator('validPeriod', {
                  rules: [{
                    required: true,
                    validator: (rule, value, callback)=>{
                      if (!value) {
                        callback('请输入计划天数');
                      } else {
                        const notNumber = isNaN(value);
                        const hasDemical = value.split('.')[1];
                        const wrongNumber = value < 0 || value > 999;
                        (notNumber || hasDemical || wrongNumber) && callback('计划天数需为不大于999的整数');
                      }
                      callback();
                    },
                  }],
                  initialValue: null,
                })(
                  <Input style={{width: '200px'}} placeholder="请输入..." />
                )}
                天
              </FormItem>
              <FormItem label="循环周期" colon={false} className={styles.eachPlanForm} >
                {getFieldDecorator('cycleTypeCode', {
                  rules: [{ required: true, message: '请选择循环周期' }],
                  initialValue: null,
                })(
                  <Select style={{width: '200px'}}>
                    <Option value={152}>每天</Option>
                    <Option value={153}>每周</Option>
                    <Option value={154}>每月</Option>
                    <Option value={155}>每季度</Option>
                    <Option value={156}>每年</Option>
                    <Option value={151}>一次</Option>
                    <Option value={157}>半年</Option>
                  </Select>
                )}
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
                  <Select style={{width: '200px'}}>
                    {stationDeviceTypes.map(e => (
                      <Option key={e.deviceTypeCode} value={e.deviceTypeCode}>{e.deviceTypeName}</Option>
                    ))}
                  </Select>
                )}
              </FormItem>}
              <FormItem label="计划截止时间" colon={false} className={styles.eachPlanForm} >
                {getFieldDecorator('deadLine', {
                  rules: [{ required: true, message: '请选择计划截止时间' }],
                  initialValue: null,
                })(
                  <DatePicker
                    showTime
                    placeholder="选择时间"
                    style={{width: '200px'}}
                    allowClear={false}
                    disabled={!firstStartTime}
                    disabledDate={this.disbleEndDate}
                  />
                )}
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
        </div>
      </section>
    );
  }
}

export default Form.create({
  onValuesChange: (props, changedValues, allFields) => {
    const { stationList = [], inspectTypeCode } = changedValues || {};
    if (// 巡视巡检 + 选择电站 => 请求设备类型列表
      (inspectTypeCode === 100002 && allFields.stationList) > 0
        || (stationList.length > 0 && allFields.inspectTypeCode === 100002)
    ) {
        props.getStationDeviceTypes({ stationCodes: stationList.map(e => e.stationCode).join(',') });
    }
  },
})(AddEditPlan);
