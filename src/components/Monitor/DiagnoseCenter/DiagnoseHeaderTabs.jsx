import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './diagnoseStyles.scss';

class DiagnoseHeaderTabs extends Component {
  static propTypes = {
    pageKey: PropTypes.string,
    // deviceShowType: PropTypes.string,
    // endTime: PropTypes.string,
    // stationCode: PropTypes.number,
    // changeAllDeviceStore: PropTypes.func,
    // getDeviceModel: PropTypes.func,
    // getAllDeviceCurveData: PropTypes.func,
    circlingQueryList: PropTypes.func,
    stopCircleQueryList: PropTypes.func,
    changeStore: PropTypes.func,
  }
  // pageKey: 'alarm', // 激活页 alarm告警事件 diagnose诊断时间 data数据事件
  pages = [{
    name: '告警事件',
    value: 'alarm',
  }, {
    name: '诊断时间',
    value: 'diagnose',
  }, {
    name: '数据事件',
    value: 'data',
  }]

  changePage = (pageKey) => {
    console.log(pageKey);
    // 停止当前页面定时请求
    this.props.stopCircleQueryList();
    // 清空并重置当前页面所有数据
    this.props.changeStore({ pageKey });
    // 启动下一个页面的定时实时请求
    this.props.circlingQueryList({});
  }

  render() {
    const { pageKey } = this.props;
    return (
      <div className={styles.diagnoseHeaderTabs} >
        <span className={styles.leftHolder} />
        {this.pages.map(e => (
          <React.Fragment key={e.value}>
            <span
              onClick={() => this.changePage(e.value)}
              className={`${styles.tab} ${e.value === pageKey ? styles.active : styles.inactive}`}
            >{e.name}</span>
            <span className={styles.tabHolder} />
          </React.Fragment>
        ))}
        <span className={styles.rightHolder} />
      </div>
    );
  }
}

export default DiagnoseHeaderTabs;
