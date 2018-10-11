
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
      <span>日辐射总量</span>
      <span>{stationType === 0 ?speedUtil: radiaUtil}</span>
      {requiredTargetObj.resourceValue && '*'}
    </Col>
    <Col span={6} >
      <div className={styles.withBorderBottom}>年累计发电量{genUtil}</div>
      <Row >
        <Col span={8}>逆变器{requiredTargetObj.yearGenInverter && '*'}</Col>
        <Col span={8}>集电线路{requiredTargetObj.yearGenIntegrated && '*'}</Col>
        <Col span={8}>上网电量{requiredTargetObj.yearGenInternet && '*'}</Col>
      </Row>
    </Col>
    <Col className={styles.withBorder} span={2} >等效小时数(h){requiredTargetObj.hour && '*'}</Col>
    <Col span={2} >年累计购网电量{genUtil}<i className={styles.withRequired}>{requiredTargetObj.buyPower && '*'}</i></Col>
    <Col className={styles.withBorder} span={4} >
      <div className={styles.withBorderBottom}>样板逆变器{genUtil}</div>
      <Row >
        <Col  span={12}>容量{requiredTargetObj.modelInverterCapacity && '*'}</Col>
        <Col span={12}>日发电量{requiredTargetObj.modelInverterPowerGen && '*'}</Col>
      </Row>
    </Col>
    <Col span={2}>装机容量(MW)</Col>
    <Col className={styles.withBorder} span={3} >操作</Col>
  </Row>)
}

export default StationReportColumn;