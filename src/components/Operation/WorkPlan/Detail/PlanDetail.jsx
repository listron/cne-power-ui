import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Switch, Popconfirm, Spin } from 'antd';
import styles from './detail.scss';

class PlanDetail extends PureComponent {

  static propTypes = {
    theme: PropTypes.string,
    planDetailHandleLoading: PropTypes.bool,
    planDetail: PropTypes.object,
    setWorkPlanStatus: PropTypes.func,
    getStationDeviceTypes: PropTypes.func,
    changeStore: PropTypes.func,
  };

  backToList = () => { // 返回主列表页
    this.props.changeStore({ planPageKey: 'list' });
  }

  compareKeys = [ // 日志比较参考项
    {
      title: '适用电站',
      dataIndex: 'stations',
      render: (stations = []) => stations.map(e => e.stationName).join(','),
    }, {
      title: '首次下发时间',
      dataIndex: 'firstStartTime',
    }, {
      title: '执行工时',
      dataIndex: 'validPeriod',
      render: (validPeriod) => `${validPeriod}天`,
    }, {
      title: '循环周期',
      dataIndex: 'cycleTypeName',
    }, {
      title: '巡检名称',
      dataIndex: 'planName',
    }, {
      title: '设备类型',
      dataIndex: 'deviceTypes',
      render: (deviceTypes = []) => deviceTypes.map(e => e.deviceTypeName).join(','),
    }, {
      title: '计划失效时间',
      dataIndex: 'deadLine',
    }, {
      title: '巡视内容',
      dataIndex: 'inspectContent',
    },
  ]

  detailBase = [
    {
      title: '适用电站',
      dataIndex: 'stations',
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
      title: '首次下发时间',
      dataIndex: 'firstStartTime',
      render: ({ firstStartTime, firstStartWeek }) => {
        return <span>{firstStartTime || '--'} {firstStartWeek}</span>;
      },
    }, {
      title: '执行工时',
      dataIndex: 'validPeriod',
      render: ({ validPeriod }) => `${validPeriod || '--'}天`,
    }, {
      title: '循环周期',
      dataIndex: 'cycleTypeName',
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
      render: ({ planStatus }) => (
        <Popconfirm
          title={planStatus === 1 ? '确认停用该计划？该计划会在停用后停止自动下发！' : '确认启用该计划？该计划会在启用后自动开始下发！'}
          onConfirm={() => this.onPlanStatusCheck({ planStatus: planStatus === 1 ? 2 : 1 })}
          okText="确定"
          cancelText="取消"
        >
          <Switch checked={planStatus === 1} />
        </Popconfirm>
      ),
    }, {
      title: '操作日志',
      dataIndex: 'planLogs',
      render: ({ planLogs = [] }) => planLogs.filter(e => e.before).map(e => { // e.before需要存在
        const { createTime = '--', before, after } = e || {};
        const { createName = '--' } = after;
        const eachDiff = this.compareDiff(before, (after || {})); // 比较前后日志不同信息 输出为数组
        return (
          <div key={createTime} className={styles.looger}>
            <div className={styles.diffLeft}>
              <span className={styles.logTip}>【操作人】</span>
              <span title={createName} className={`${styles.logValue} ${styles.loggerName}`}>{createName}</span>
              <span className={styles.logTip}>【操作时间】</span>
              <span className={styles.logValue}>{createTime}</span>
            </div>
            <div>
              {eachDiff.map(difftexts => (
                difftexts ? <div key={difftexts[0]} className={styles.diffPart}>
                  <span className={styles.logTip}>【{difftexts[0]}】</span>
                  <span className={styles.logValue}>{difftexts[1]}</span>
                  <span className={styles.logTip}> 改为 </span>
                  <span className={styles.logValue}>{difftexts[2]}</span>
                </div> : null
              ))}
            </div>
          </div>
        );
      }),
    },
  ]

  compareDiff = (before = {}, after = {}) => this.compareKeys.map(detail => { // 比较前后日志不同信息 输出为数组
    const { render, dataIndex, title } = detail;
    const preText = render ? render(before[dataIndex]) : before[dataIndex];
    const nextText = render ? render(after[dataIndex]) : after[dataIndex];
    if (preText !== nextText) {
      return [title, preText, nextText];
    }
    return;
  });

  onPlanStatusCheck = ({ planStatus }) => {
    const { planDetail } = this.props;
    const { planId } = planDetail || {};
    this.props.setWorkPlanStatus({ planId, planStatus });
  }


  toEdit = () => {
    const { planDetail } = this.props;
    const { stations = [], inspectTypeCode } = planDetail || {};
    // // 若是巡视巡检, 请求对应的设备类型列表;
    if (parseFloat(inspectTypeCode) === 100002) {
      this.props.getStationDeviceTypes({
        stationCodes: stations.map(e => e.stationCode).join(','),
      });
    }
    this.props.changeStore({ planPageKey: 'edit' });
  }

  backList = () => this.props.changeStore({ planPageKey: 'list', planDetail: {} })

  render(){
    const { planDetail, theme, planDetailHandleLoading } = this.props;
    const { inspectTypeCode = 100001 } = planDetail || {}; // 巡检计划类型 日常：100001；巡视巡检：100002
    const detailBaseInfo = [
      ...this.detailBase,
      ...(parseFloat(inspectTypeCode) === 100001 ? this.baseDaily : this.baseInspect),
      ...this.baseEnd,
    ];
    return (
      <section className={`${styles.planDetail} ${styles[theme]}`}>
        <h3 className={styles.detailTop}>
          <span>查看计划</span>
          <span className={styles.topHandle}>
            <Button onClick={this.toEdit}>编辑</Button>
            <Icon onClick={this.backList} type="arrow-left" className={styles.backIcon} />
          </span>
        </h3>
        <div className={styles.detailContent}>
          <Spin tip="数据加载中..." spinning={planDetailHandleLoading}>
            {detailBaseInfo.map(e => (
              <div className={styles.eachContent} key={e.title}>
                <div className={styles.detailTitle}>{e.title}</div>
                <div className={styles.detailValue}>{e.render ? e.render(planDetail) : (planDetail[e.dataIndex] || '--')}</div>
              </div>
            ))}
          </Spin>
        </div>
      </section>
    );
  }
}

export default PlanDetail;
