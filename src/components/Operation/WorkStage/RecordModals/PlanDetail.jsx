import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Popconfirm } from 'antd';
import moment from 'moment';
import CneButton from '@components/Common/Power/CneButton';
import { handleRight } from '@utils/utilFunc';
import styles from './recordModals.scss';

class PlanDetail extends PureComponent {

  static propTypes = {
    theme: PropTypes.string,
    saveRecordLoading: PropTypes.bool,
    recordDetailInfo: PropTypes.object,
    setPlanComplete: PropTypes.func,
  };

  planBase = [
    {
      title: '计划下发时间',
      key: 'sendTime',
    }, {
      title: '计划类型',
      key: 'planTypeName',
    }, {
      title: '巡视类型',
      key: 'inspectTypeName',
    }, {
      title: '执行天数',
      key: 'validPeriod',
      render: (validPeriod) => (validPeriod === 0 || validPeriod > 0) ? `${validPeriod}天` : '--',
    }, {
      title: '截止时间',
      key: 'deadline',
    }, {
      title: '电站',
      key: 'stations',
      render: (stations = []) => {
        return stations && stations.length > 0 ? stations.map(e => e.stationName) : '--';
      },
    }, {
      title: '巡视内容',
      key: 'inspectContent',
    },
  ]

  completeBase = [
    {
      title: '完成时间',
      key: 'completeTime',
      render: (completeTime) => completeTime ? moment(completeTime).format('YYYY-MM-DD HH:mm:ss') : '--',
    }, {
      title: '工作时间',
      key: 'consumeDays',
      render: (consumeDays) => (consumeDays === 0 || consumeDays > 0) ? `${consumeDays}天` : '--',
    }, {
      title: '执行人',
      key: 'handleUser',
    },
  ]

  handleComplete = () => {
    const { recordDetailInfo } = this.props;
    const { noteId } = recordDetailInfo;
    this.props.setPlanComplete({ taskIds: [noteId] });
  }

  render(){
    const { recordDetailInfo, theme, saveRecordLoading } = this.props;
    const { completeTime } = recordDetailInfo; // 任务是否完成的判断
    const planArr = completeTime ? [...this.planBase, ...this.completeBase] : this.planBase;
    const finishRecordRight = handleRight('operation_workStation_finish');
    return (
      <div className={`${styles.recordDetail} ${styles[theme]}`}>
        {planArr.map(e => {
          const value = recordDetailInfo[e.key];
          return (
            <p className={styles.eachRecord} key={e.key}>
              <span className={styles.recordTitle}>{e.title}</span>
              <span className={styles.recordValue}>{e.render ? e.render(value) : (value || '--')}</span>
            </p>
          );
        })}
        {finishRecordRight && !completeTime && <div className={styles.handleComplete}>
          <Popconfirm
            title="是否标记为已完成?"
            onConfirm={this.handleComplete}
            okText="确定"
            cancelText="取消"
          >
            <CneButton loading={saveRecordLoading} lengthMode="long" iconname="icon-markdone" lengthMode="long">
              标记为完成
            </CneButton>
          </Popconfirm>
        </div>}
      </div>
    );
  }
}

export default PlanDetail;
