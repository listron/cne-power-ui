import React from "react";
import PropTypes from "prop-types";
import { Tooltip } from 'antd';

import styles from "./faultWarnAlgorithm.scss";

export default class FaultWarnAlgorithm extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    history: PropTypes.object,
    match: PropTypes.object,
    algoModelData: PropTypes.object,
    getAlgoModel: PropTypes.func,
    stationCode: PropTypes.number
  };

  componentWillReceiveProps(nextProps) {
    const {
      match: {params: {fanWarnId: currentSingleStationCode}},
      getAlgoModel,
    } = this.props;
    const { match: {params: {fanWarnId: nextSingleStationCode}} } = nextProps;
    const params = {
      stationCode: nextSingleStationCode,
    };
    if (currentSingleStationCode !== nextSingleStationCode) {
      // 算法模型调用
      getAlgoModel(params);
    }
  }

  titleFunc = (fan) => {
    let  str = "";
    for(let i = 0;i< fan.length-1; i++){
      str+= fan[i].deviceName + "、";
    }
    return <span>{str + fan[fan.length-1].deviceName}</span>;
  };

  detailsFunc = (algorithmId, taskId) => {
    const {
      history,
      match: {
        params:{
          fanWarnId
        }
      },
    } = this.props;
    // 跳到按模型单风机详情图表展示
    history.push(`/hidden/analysis/all/fan/${fanWarnId}`);
    // localStore存储有故障的风机
    localStorage.setItem("deviceFullCode", "");
    localStorage.setItem("faultWarnNum", "");
    localStorage.setItem("algorithmId", algorithmId);
    localStorage.setItem("taskId", taskId);
  };

  render() {
    const { algoModelData: {
      healthList,
      largeSizeList,
      natureList
    } } = this.props;
    const largeSizeItem = largeSizeList && largeSizeList.map((cur, index) => {
      return (
        <div
          className={(cur.windTurbines.length === 0 || !cur.windTurbines) ? styles.successItem : styles.warnItem}
          key={cur.taskId + index}
          onClick={() => {return this.detailsFunc(cur.algorithmId, cur.taskId)}}
        >
          <div>
            {cur.algorithmName}
          </div>
          {(cur.windTurbines.length === 0 || !cur.windTurbines) ? <div>
            <span><span>{cur.faultUnitCount}</span><span>风机</span></span>
          </div> : <div>
            <Tooltip placement="bottom" title={this.titleFunc(cur.windTurbines)}>
              <span><span>{cur.faultUnitCount}</span><span>风机</span></span>
            </Tooltip>
          </div>}
          <div>
            <span>检测日期</span><span>{`${cur.startTime}~${cur.endTime}`}</span>
          </div>
        </div>
      );
    });
    const natureItem = natureList && natureList.map(cur => {
      return (
        <div
          className={cur.windTurbines.length === 0 || !cur.windTurbines ? styles.successItem : styles.warnItem}
          key={cur.taskId}
          onClick={() => {return this.detailsFunc(cur.algorithmId, cur.taskId)}}
        >
          <div>
            {cur.algorithmName}
          </div>
          {(cur.windTurbines.length === 0 || !cur.windTurbines) ? <div>
            <span><span>{cur.faultUnitCount}</span><span>风机</span></span>
            </div> : <div>
            <Tooltip placement="bottom" title={this.titleFunc(cur.windTurbines)}>
              <span>{cur.faultUnitCount}</span><span>风机</span>
            </Tooltip>
          </div>}
          <div>
            <span>检测日期</span><span>{`${cur.startTime}~${cur.endTime}`}</span>
          </div>
        </div>
      );
    });
    const healthItem = healthList && healthList.map(cur => {
      return (
        <div
          className={cur.windTurbines.length === 0 || !cur.windTurbines ? styles.successItem : styles.warnItem}
          key={cur.taskId}
          onClick={() => {return this.detailsFunc(cur.algorithmId, cur.taskId)}}
        >
          <div>
            {cur.algorithmName}
          </div>
          {(cur.windTurbines.length === 0 || !cur.windTurbines) ? <div>
            <span><span>{cur.faultUnitCount}</span><span>风机</span></span>
          </div> : <div>
            <Tooltip placement="bottom" title={this.titleFunc(cur.windTurbines)}>
              <span>{cur.faultUnitCount}</span><span>风机</span>
            </Tooltip>
          </div>}
          <div>
            <span>检测日期</span><span>{`${cur.startTime}~${cur.endTime}`}</span>
          </div>
        </div>
      );
    });
    return (
      <div className={styles.faultWarnAlgorithm}>
        {(largeSizeItem.length === 0 && natureItem.length === 0 && healthItem.length === 0) ? (
          <div className={styles.noData}><img src="/img/nodata.png" style={{ width: 223, height: 164 }} /></div>
        ) : (
          <div>
            {(largeSizeItem.length !== 0) && (
              <div>
                <div className={styles.title}>
                  大部件
                </div>
                <div className={styles.warnBox}>
                  {largeSizeItem}
                </div>
              </div>
            )}
            {(natureItem.length !== 0) && (
              <div>
                <div className={styles.title}>
                  性能预警
                </div>
                <div className={styles.warnBox}>
                  {natureItem}
                </div>
              </div>
            )}
            {(healthItem.length !== 0) && (
              <div>
                <div className={styles.title}>
                  设备健康
                </div>
                <div className={styles.warnBox}>
                  {healthItem}
                </div>
              </div>
            )}
          </div>
        )}
    </div>
    );
  }
}
