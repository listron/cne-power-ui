import React, {Component} from 'react';
import PropTypes from 'prop-types';
import PowerProgress from '../DeviceMonitorCommon/PowerProgress';
import {DeviceValueFormat} from '../../../../Common/UtilComponent';
import {dataFormat, dataFormats} from '../../../../../utils/utilFunc';
import { Tooltip } from 'antd';

import styles from './confluencebox.scss';

const EachRecord = ({ text, value, unit, show }) => (
  <div className={styles.eachRecord}>
    <span className={styles.text}>{text}</span>
    <span className={show && styles.specialColor}><DeviceValueFormat value={value} /></span>
    <span className={styles.unit}>{unit}</span>
    {show &&
    <span className={styles.tooltipName}>
      <Tooltip placement="bottom" overlayStyle={{ maxWidth: 500, fontSize: '12px' }} title={show}> <i className="iconfont icon-help"></i>
      </Tooltip>
    </span>}
  </div>
);

EachRecord.propTypes = {
  text: PropTypes.string,
  value: PropTypes.string,
  unit: PropTypes.string,
  show: PropTypes.bool,
};

class ConfluenceStatistics extends Component{

  static propTypes = {
    deviceDetail: PropTypes.object,
    subDeviceList: PropTypes.array,
    pointNameArr: PropTypes.array,
    theme: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.statusColor = {
      light: {
        '500': {color: 'transparent', backgroundColor: '#f1f1f1', cursor: 'pointer'}, // 无通讯
        '900': {color: 'transparent', backgroundColor: '#f1f1f1', cursor: 'default'}, // 未接入
        '802': {color: '#fff', backgroundColor: '#3e97d1', cursor: 'pointer', border: '2px solid #0063a3'}, // 偏大 - 蓝
        '400': {color: '#199475', backgroundColor: '#ceebe0', cursor: 'pointer', border: '2px solid #199475'}, // 正常 - 绿
        '801': {color: '#fff', backgroundColor: '#f9b600', cursor: 'pointer', border: '2px solid #e08031'}, // 偏小 - 橙
        '803': {color: '#fff', backgroundColor: '#a42b2c', cursor: 'pointer', border: '2px solid #ffa1a1'}, // 异常 - 红
      },
      // 注：深色系border说不开发，先默认透明
      dark: {
        '500': {color: 'transparent', backgroundColor: '#405080', cursor: 'pointer'}, // 无通讯
        '900': {color: 'transparent', backgroundColor: '#405080', cursor: 'default'}, // 未接入
        '802': {color: '#fff', backgroundColor: '#4d5fe2', cursor: 'pointer', border: '2px solid transparent'}, // 偏大 - 蓝
        '400': {color: '#fff', backgroundColor: '#00baff', cursor: 'pointer', border: '2px solid transparent'}, // 正常 - 绿
        '801': {color: '#fff', backgroundColor: '#f8b14e', cursor: 'pointer', border: '2px solid transparent'}, // 偏小 - 橙
        '803': {color: '#fff', backgroundColor: '#fd6e8f', cursor: 'pointer', border: '2px solid transparent'}, // 异常 - 红
      },
    };
  }

  // 切换选中支路
  branchDetailsFunc = (e, pointIndex, pointStatus, bgcColor) => {
    // 阻止冒泡
    e.stopPropagation();
    if(pointStatus === '900') {
      return false;
    }
    // pointStatus === 400正常，取边框颜色，其他的状态取背景颜色，产品说UI是这么设计的
    const colorParams = pointStatus === '400' ? '#199475' : bgcColor;
    const { pointNameFunc, pointNameArr } = this.props;
    if(pointNameArr.length > 0){
      let flag = true; // 判断是否执行
      pointNameArr && pointNameArr.forEach(cur => {
        if(cur.pointIndex === pointIndex) {
          flag = false;
          pointNameFunc(pointNameArr.filter((cur) => (cur.pointIndex !== pointIndex)));
        }
      });
      if(flag) {
        flag = true;
        // 选中的支路名称
        pointNameFunc([{pointIndex, bgcColor: colorParams}]);
      }
      return false;
    }
    // 选中的支路名称
    return pointNameFunc([{pointIndex, bgcColor: colorParams}]);
  };


  // 重置所有支路
  resetBranchDetailsFunc = () => {
    const { pointNameFunc } = this.props;
    pointNameFunc([]);
  };

  // 边框颜色
  borderFunc = (pointStatus, pointIndex) => {
    const { pointNameArr, theme } = this.props;
    let borderStyles = null;
    pointNameArr.forEach(cur => {
      if(cur.pointIndex === pointIndex) {
        // 返回border
        borderStyles = this.statusColor[theme][pointStatus].border;
      }
    });
    return borderStyles === null ? '2px solid transparent' : borderStyles;
  };

  // 如果有选中的支路颜色，改变背景色
  otherStylesFunc = (pointIndex, pointStatus) => {
    const { pointNameArr } = this.props;
    // 选中的支路下标
    const selectPointIndex = pointNameArr && pointNameArr.length > 0 ? pointNameArr[0].pointIndex : '';
    // 默认灰色背景
    let styleParams = {
      color: '#353535',
      backgroundColor: '#d4d4d4',
    };
    if(pointIndex === selectPointIndex || selectPointIndex === '' || pointStatus === '900') {
      styleParams = {};
    }
    return styleParams;
  };

  render() {
    const {
      deviceDetail,
      subDeviceList = [],
      theme = 'light',
    } = this.props;
    const {devicePower, deviceCapacity, voltage, voltageValidation, electricity, electricityValidation, temperature, temperatureValidation, dispersionRatio} = deviceDetail;
    const subDeviceArr = !subDeviceList.length && subDeviceList.electricityList ? (subDeviceList.electricityList || []) : subDeviceList;
    return (
      <div className={`${styles.confluenceStatistics} ${styles[theme]}`} onClick={this.resetBranchDetailsFunc}>
        <div className={styles.confluenceInfo}>
          <div className={styles.deviceIcon}>
            <span className="iconfont icon-hl" />
          </div>
          <PowerProgress devicePower={devicePower} deviceCapacity={deviceCapacity} theme={theme} />
          <div className={styles.line} />
          <div className={styles.elecInfo}>
          <EachRecord text="电压" value={dataFormats(voltage, '--', 2)} unit="V" show={voltageValidation} />
          <EachRecord text="电流" value={dataFormats(electricity, '--', 2)} unit="A" show={electricityValidation} />
        </div>
        <div className={styles.line} />
        <div className={styles.statisticsInfo}>
            <EachRecord text="温度" value={dataFormats(temperature, '--', 2)} unit="℃" show={temperatureValidation} />
            <EachRecord text="离散率" value={dataFormats(dispersionRatio, '--', 2)} unit="%" />
          </div>
        </div>
        <div className={styles.seriesCurrent}>
          {subDeviceArr.map((cur, i) => (
            <span
              className={styles.eachCurrent}
              onClick={(e) => {return this.branchDetailsFunc(e, i, cur.pointStatus, this.statusColor[theme][cur.pointStatus].backgroundColor);}}
              key={i}
              style={{
                ...this.statusColor[theme][cur.pointStatus],
                border: this.borderFunc(cur.pointStatus, i),
                ...this.otherStylesFunc(i, cur.pointStatus),
              }}
            >{dataFormat(cur.pointValue, '--', 2)}</span>
          ))}
        </div>
      </div>
    );
  }
}

ConfluenceStatistics.propTypes = {
  deviceDetail: PropTypes.object,
  subDeviceList: PropTypes.array,
  theme: PropTypes.string,
  pointNameFunc: PropTypes.func,
};

export default ConfluenceStatistics;
