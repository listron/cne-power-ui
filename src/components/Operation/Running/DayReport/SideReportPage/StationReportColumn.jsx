
import React from 'react';
import styles from './sideReportPage.scss';
import { Row, Col } from 'antd';

function StationReportColumn({ dayReportConfig }){
  const configUtil = dayReportConfig[0] || {};

  return (<Row className={styles.stationReportColumn}>
    <Col span={3} >电站名称</Col>
    <Col className={styles.withBorder} span={2} >
      <span>日辐射总量</span>
      <span>({configUtil.radiation || '--'})</span>
    </Col>
    <Col span={6} >
      <div className={styles.withBorderBottom}>年累计发电量(万kWh)</div>
      <Row >
        <Col span={8}>逆变器</Col>
        <Col span={8}>集电线路</Col>
        <Col span={8}>上网电量</Col>
      </Row>
    </Col>
    <Col className={styles.withBorder} span={2} >等效小时数(h)*</Col>
    <Col span={2} >年累计购网电量(万kWh)<i className={styles.withRequired}>*</i></Col>
    <Col className={styles.withBorder} span={4} >
      <div className={styles.withBorderBottom}>样板逆变器(万kWh)</div>
      <Row >
        <Col  span={12}>容量</Col>
        <Col span={12}>日发电量</Col>
      </Row>
    </Col>
    <Col span={2}>装机容量(MW)</Col>
    <Col className={styles.withBorder} span={3} >操作</Col>
  </Row>)
}

export default StationReportColumn;