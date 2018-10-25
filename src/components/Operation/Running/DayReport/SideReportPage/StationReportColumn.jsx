
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
    <Col span={3} >电站名称</Col>
    <Col className={styles.withBorder} span={2} >
      <span>日斜面辐射总量</span>
      <span>{stationType === 0 ?`(${speedUtil})` : `(${radiaUtil})`}</span>
      <i className={styles.withRequired}>{requiredTargetObj.resourceValue && '*'}</i>
    </Col>
    <Col span={5} >
      <div className={styles.withBorderBottom}>年累计发电量({genUtil})</div>
      <Row >
        <Col span={8}>逆变器<i className={styles.withRequired}>{requiredTargetObj.yearGenInverter && '*'}</i></Col>
        <Col span={8}>集电线路<i className={styles.withRequired}>{requiredTargetObj.yearGenIntegrated && '*'}</i></Col>
        <Col span={8}>上网电量<i className={styles.withRequired}>{requiredTargetObj.yearGenInternet && '*'}</i></Col>
      </Row>
    </Col>
    <Col className={styles.withBorder} span={2} >等效小时数(h)<i className={styles.withRequired}>{requiredTargetObj.hour && '*'}</i></Col>
    <Col span={2} >年累计购网电量({genUtil})<i className={styles.withRequired}>{requiredTargetObj.buyPower && '*'}</i></Col>
    <Col className={styles.withBorder} span={5} >
      <div className={styles.withBorderBottom}>样板逆变器</div>
      <Row >
        <Col  span={10}>容量(MW)<i className={styles.withRequired}>{requiredTargetObj.modelInverterCapacity && '*'}</i></Col>
        <Col span={14}>日发电量({genUtil})<i className={styles.withRequired}>{requiredTargetObj.modelInverterPowerGen && '*'}</i></Col>
      </Row>
    </Col>
    <Col span={2}>装机容量(MW)</Col>
    <Col className={styles.withBorder} span={3} >操作</Col>
  </Row>)
}

export default StationReportColumn;