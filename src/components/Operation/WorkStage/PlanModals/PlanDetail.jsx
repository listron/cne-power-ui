import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Popconfirm } from 'antd';
import moment from 'moment';
import styles from './recordModals.scss';

class RecordDetail extends PureComponent {

  static propTypes = {
    theme: PropTypes.string,
    recordDetailInfo: PropTypes.object,
    changeStore: PropTypes.func,
    deletRecord: PropTypes.func,
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

  toEdit = () => {
    this.props.changeStore({ modalKey: 'editRecord' }); // 去编辑
  }

  toRemove = () => { // 直接删除
    const { recordDetailInfo } = this.props;
    const { noteId } = recordDetailInfo || {};
    this.props.deletRecord({ noteId });
  }


  render(){
    const { recordDetailInfo, theme } = this.props;
    return (
      <div className={`${styles.recordDetail} ${styles[theme]}`}>
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
          <Popconfirm
            title="是否确认删除记事?"
            onConfirm={this.toRemove}
            okText="确定"
            cancelText="取消"
          >
            <Button>删除</Button>
          </Popconfirm>
        </div>
      </div>
    );
  }
}

export default RecordDetail;
