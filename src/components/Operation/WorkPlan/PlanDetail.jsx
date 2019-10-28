import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './plan.scss';

class PlanDetail extends PureComponent {

  static propTypes = {
    planPageKey: PropTypes.string,
    changeStore: PropTypes.func,
  };

  backToList = () => { // 返回主列表页
    this.props.changeStore({ planPageKey: 'list' });
  }

  detailBase = [
    {
      title: '适用电站',
      key: 'stations',
      render: ({ stations }) => {
        const stationStr = stations.map(e => e.stationName).join(',');
        return (<div title={stationStr}>{stationStr || '--'}</div>);
      },
    }, {
      title: '计划类型',
      key: 'planTypeName',
    }, {
      title: '巡视类型',
      key: 'inspectTypeName',
    }, {
      title: '首次计划开始时间',
      key: 'firstStartTime',
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
      render: ({ deviceTypes }) => {
        const deviceTypeStr = deviceTypes.map(e => e.deviceTypeName).join(',');
        return (<div title={deviceTypeStr}>{deviceTypeStr || '--'}</div>);
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
      dataIndex: 'planStatus',
      render: ({ nextSendTime, nextSendWeek }) => {
        return <span>{nextSendTime || '--'} {nextSendWeek}</span>;
      },
    }, {
      title: '操作日志',
      dataIndex: 'planLogs',
//       createTime	String	节点日期(yyyy-MM-dd HH:mm:ss)
// operateType	String	操作类型
// 1 增
// 2改 
// 3 删
// 4 其他操作
// before	Object	改前
// after	Object	改后
      render: ({ planLogs }) => {
        return <span></span>;
      },
    },
  ]

  render(){
    const { planPageKey, planDetail } = this.props;
    return (
      <div className={styles.planDetail} style={{ transform: planPageKey === 'detail' ? 'translateX(0)' : 'translateX(100%)' }}>
        <h3>
          <span>查看计划</span>
          <span>
            <span>编辑</span>
            <span onClick={this.backToList}>返回</span>
          </span>
        </h3>
        <div>
          内容部分
        </div>
      </div>
    );
  }
}

export default PlanDetail;
