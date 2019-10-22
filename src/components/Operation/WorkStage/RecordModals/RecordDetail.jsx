import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import moment from 'moment';
import styles from './recordModals.scss';

class RecordDetail extends PureComponent {

  static propTypes = {
    recordDetailInfo: PropTypes.object,
  };

  recordBase = [
    {
      title: '电站',
      key: 'stations',
      render: (stations = []) => {
        return stations && stations.length > 0 ? stations.map(e => e.stationName) : '--';
      },
    }, {
      title: '完成时间',
      key: 'completeTime',
      render: (completeTime = null) => {
        return completeTime ? moment(completeTime).format('YYYY-MM-DD HH:mm:ss') : '--';
      },
    }, {
      title: '执行人',
      key: 'handleUser',
    }, {
      title: '记事内容',
      key: 'noteContent',
    },
  ]


  render(){
    const { recordDetailInfo } = this.props;
    return (
      <div className={styles.recordDetail}>
        {this.recordBase.map(e => {
          const value = recordDetailInfo[e.key];
          return (
            <p className={styles.eachRecord} key={e.key}>
              <span className={styles.recordTitle}>{e.title}</span>
              <span className={styles.recordValue}>{e.render ? e.render(value) : (value || '--')}</span>
            </p>
          );
        })}
        <div className={styles.detailHandle}>
          <Button onClick={this.toEdit}>编辑</Button>
          <Button onClick={this.toDelete}>删除</Button>
        </div>
      </div>
    );
  }
}

export default RecordDetail;
