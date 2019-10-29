import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Switch } from 'antd';
import styles from './detail.scss';

class PlanDetail extends PureComponent {

  static propTypes = {
    planPageKey: PropTypes.string,
    planDetail: PropTypes.object,
    changeStore: PropTypes.func,
  };

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
                  <span className={styles.logTip}>{createName}</span>
                  <span className={styles.logTip}>【操作时间】</span>
                  <span className={styles.logTip}>{createTime}</span>
                  <span className={styles.logTip}>操作类型</span>
                  <span className={styles.logTip}>{operateInfo[operateType] || '--'}</span>
                </div>
              );
            })}
          </div>
        );
      },
    },
  ]

  toEdit = () => this.props.changeStore({ planPageKey: 'edit' })

  backList = () => this.props.changeStore({ planPageKey: 'list', planDetail: {} })

  render(){
    const { planDetail } = this.props;
    const { inspectTypeCode = 100001 } = planDetail || {}; // 巡检计划类型 日常：100001；巡视巡检：100002
    const detailBaseInfo = [
      ...this.detailBase,
      ...(inspectTypeCode === 100001 ? this.baseDaily : this.baseInspect),
      ...this.baseEnd,
    ];
    return (
      <section className={styles.planDetail}>
        <h3 className={styles.detailTop}>
          <span>查看计划</span>
          <span className={styles.topHandle}>
            <Button onClick={this.toEdit}>编辑</Button>
            <Icon onClick={this.backList} type="arrow-left" className={styles.backIcon} />
          </span>
        </h3>
        <div className={styles.detailContent}>
          {detailBaseInfo.map(e => (
            <div className={styles.eachContent} key={e.title}>
              <span className={styles.detailTitle}>{e.title}</span>
              <span className={styles.detailValue}>{e.render ? e.render(planDetail) : (planDetail[e.dataIndex] || '--')}</span>
            </div>
          ))}
        </div>
      </section>
    );
  }
}

export default PlanDetail;
