import React from 'react';
import PropTypes from 'prop-types';
import styles from './faultWarn.scss';

export default class FaultWarn extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    history: PropTypes.object,
    faultWarnList: PropTypes.array,
  };

  faultWarnFunc = (stationCode) => {
    const { faultWarnList } = this.props;
    // 跳转到单风场预警
    //存储单风场故障数量和总数
    localStorage.setItem('faultAllWarnList', JSON.stringify(faultWarnList));
    this.props.history.push(`/analysis/faultDiagnose/fanWarn/${stationCode}`);
  };

  render() {
    const { faultWarnList } = this.props;
    const item = faultWarnList && faultWarnList.map(cur => {
      return (
        <div key={cur.stationCode} className={styles.faultWarnCenter} onClick={() => this.faultWarnFunc(cur.stationCode)}>
          <div className={styles.faultWarnCenterTop}>
            <div>{cur.stationName}</div>
          </div>
          <div className={styles.faultWarnCenterIcon}>
            <i className="iconfont icon-windlogo" />
            <span>{cur.faultUnitCount}</span>
            <span>{`/${cur.stationUnitCount}`}</span>
          </div>
          {(Number(cur.faultUnitCount) > 0) && (
            <div className={styles.faultWarnCenterBottom}>
              {cur.mainModules && cur.mainModules.map(item => {
                return (
                  <div key={item}>
                    {item}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    });
    return (
      <div className={styles.faultWarnMain}>
        {!faultWarnList || faultWarnList.length === 0 ? <div className={styles.noData}><img src="/img/nodata.png" style={{ width: 223, height: 164 }} /></div> : item }
      </div>
    );
  }
}
