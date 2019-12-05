import React, {Component} from 'react';
import PropTypes from 'prop-types';
import PowerProgress from '../DeviceMonitorCommon/PowerProgress';
import styles from '../eachDeviceMonitor.scss';
import inverterStyles from './inverter.scss';
import { DeviceValueFormat } from '../../../../Common/UtilComponent';
import { dataFormat, dataFormats } from '../../../../../utils/utilFunc';

class InverterStatistics extends Component{
  static propTypes = {
    deviceDetail: PropTypes.object,
    subDeviceList: PropTypes.array,
    theme: PropTypes.string,
    pointNameFunc: PropTypes.func,
    pointNameArr: PropTypes.array,
  };
  constructor(props) {
    super(props);
    this.statusColor = {
      light: {
        '500': { color: 'transparent', backgroundColor: '#f1f1f1', cursor: 'pointer' }, // 无通讯
        '900': { color: 'transparent', backgroundColor: '#f1f1f1', cursor: 'default' }, // 未接入
        '802': { color: '#fff', backgroundColor: '#3e97d1', cursor: 'pointer', border: '2px solid #0063a3' }, // 偏大 - 蓝
        '400': { color: '#199475', backgroundColor: '#ceebe0', cursor: 'pointer', border: '2px solid #199475' }, // 正常 - 绿
        '801': { color: '#fff', backgroundColor: '#f9b600', cursor: 'pointer', border: '2px solid #e08031' }, // 偏小 - 橙
        '803': { color: '#fff', backgroundColor: '#a42b2c', cursor: 'pointer', border: '2px solid #ffa1a1' }, // 异常 - 红
      },
      dark: {
        '500': { color: 'transparent', backgroundColor: '#405080', cursor: 'pointer' }, // 无通讯
        '900': { color: 'transparent', backgroundColor: '#405080', cursor: 'default' }, // 未接入
        '802': { color: '#fff', backgroundColor: '#4d5fe2', cursor: 'pointer', border: '2px solid transparent' }, // 偏大 - 蓝
        '400': { color: '#fff', backgroundColor: '#00baff', cursor: 'pointer', border: '2px solid transparent' }, // 正常 - 绿
        '801': { color: '#fff', backgroundColor: '#f8b14e', cursor: 'pointer', border: '2px solid transparent' }, // 偏小 - 橙
        '803': { color: '#fff', backgroundColor: '#fd6e8f', cursor: 'pointer', border: '2px solid transparent' }, // 异常 - 红
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
    const { pointNameFunc, pointNameArr } = this.props;
    // pointStatus === 400正常，取边框颜色，其他的状态取背景颜色，产品说UI是这么设计的
    const colorParams = pointStatus === '400' ? '#199475' : bgcColor;
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
      color: '#666666',
      backgroundColor: '#dfdfdf',
    };
    if(pointIndex === selectPointIndex || selectPointIndex === '' || pointStatus === '900') {
      styleParams = {};
    }
    return styleParams;
  };

  render(){
    const { deviceDetail, subDeviceList, theme } = this.props;
    const { devicePower, deviceCapacity, powerDay, powerMonth, powerYear, deviceTypeCode } = deviceDetail;
    // powerDay = isNaN(parseFloat(powerDay)) ? ' -- ' : parseFloat(powerDay);
    // powerMonth = isNaN(parseFloat(powerMonth)) ? ' -- ' : parseFloat(powerMonth);
    // powerYear = isNaN(parseFloat(powerYear)) ? ' -- ' : parseFloat(powerYear);
    // deviceTypeCode === '201' 集中式逆变器 206 组串式逆变器
    // 取出子集组串接口优化后删。
    const subDeviceArr = !subDeviceList.length && subDeviceList.electricityList ? (subDeviceList.electricityList || []) : subDeviceList;
    const seriesGroup = Math.ceil(subDeviceList.length / 4);
    const seriesGroupWidth = Math.ceil(seriesGroup / 2) * 200;
    return (
      <div className={`${styles.statisticsBox} ${inverterStyles.statisticsBox}`} onClick={this.resetBranchDetailsFunc}>
        <div className={inverterStyles.inverterInfo}>
          <div className={styles.deviceIcon}>
            <span className="iconfont icon-nb" />
          </div>
          <PowerProgress devicePower={devicePower} deviceCapacity={deviceCapacity} theme={theme} />
          <div className={styles.timerDayGen}>
            <div className={styles.genNum}>
              <DeviceValueFormat value={dataFormats(powerDay, '--', 2)} />
            </div>
            <div className={styles.empty} />
            <div className={styles.genText}>日发电量 (kWh)</div>
          </div>
          <div className={styles.timerGen}>
            <div className={styles.genNum}>
              <DeviceValueFormat value={dataFormats(powerMonth, '--', 2)} />
            </div>
            <div className={styles.empty} />
            <div className={styles.genText}>月累计发电量 (kWh)</div>
          </div>
          <div className={styles.timerGen}>
            <div className={styles.genNum}>
              <DeviceValueFormat value={dataFormats(powerYear, '--', 2)} />
            </div>
            <div className={styles.empty} />
            <div className={styles.genText}>年累计发电量 (kWh)</div>
          </div>
        </div>
        {deviceTypeCode === '206' && <div className={inverterStyles.seriesCurrent} style={{ width: `${seriesGroupWidth}px` }}>
          {subDeviceArr.map((cur, i) => (
            <span
              className={inverterStyles.eachCurrent}
              onClick={(e) => {return this.branchDetailsFunc(e, i, cur.pointStatus, this.statusColor[theme][cur.pointStatus].backgroundColor);}}
              key={i}
              style={{
                ...this.statusColor[theme][cur.pointStatus],
                marginRight: (i + 1) % 4 === 0 ? '20px' : '6px',
                border: this.borderFunc(cur.pointStatus, i),
                ...this.otherStylesFunc(i, cur.pointStatus),
              }}
            >{dataFormat(cur.pointValue, '--', 2)}</span>
          ))}
        </div>}
      </div>
    );
  }
}

export default InverterStatistics;
