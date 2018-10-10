
import React from 'react';
import styles from './sideReportPage.scss';
import { Row, Col } from 'antd';

function StationReportColumn({ dayReportConfig, stationType }){
  // stationType === 0 : 风电站； // stationType === 1 :光伏电站
  const configUtil = dayReportConfig[0] || {};
  const radiaUtil = configUtil.radiation || '--'; // 辐射单位;
  const speedUtil = configUtil.radiation || '--'; // 风速单位;
  const genUtil = configUtil.power || '--'; // 辐射单位
  const requiredTargetObj = dayReportConfig[1] || {}; // 是否必填(展示*)
  return (<Row className={styles.stationReportColumn}>
    <Col>电站名称</Col>
    <Col>
      <span>日辐射总量</span>
      <span>{stationType === 0 ?speedUtil: radiaUtil}</span>
      {requiredTargetObj.resourceValue && '*'}
    </Col>
    <Col>
      <span>年累计发电量{genUtil}</span>
      <span>逆变器{requiredTargetObj.yearGenInverter && '*'}</span>
      <span>集电线路{requiredTargetObj.yearGenIntegrated && '*'}</span>
      <span>上网电量{requiredTargetObj.yearGenInternet && '*'}</span>
    </Col>
    <Col>等效小时数(h){requiredTargetObj.hour && '*'}</Col>
    <Col>年累计购网电量{genUtil}{requiredTargetObj.buyPower && '*'}</Col>
    <Col>
      <span>样板逆变器{genUtil}</span>
      <span>容量{requiredTargetObj.modelInverterCapacity && '*'}</span>
      <span>日发电量{requiredTargetObj.modelInverterPowerGen && '*'}</span>
    </Col>
    <Col>装机容量(MW)</Col>
    <Col>操作</Col>
  </Row>)
}

export default StationReportColumn;