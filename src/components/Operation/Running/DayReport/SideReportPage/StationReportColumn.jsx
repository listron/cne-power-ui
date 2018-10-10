
import React from 'react';
import styles from './sideReportPage.scss';
import { Row, Col } from 'antd';

function StationReportColumn({ dayReportConfig }){
  const configUtil = dayReportConfig[0] || {};

  return (<Row className={styles.stationReportColumn}>
    <Col>电站名称</Col>
    <Col>
      <span>日辐射总量</span>
      <span>{configUtil.radiation || '--'}</span>
    </Col>
    <Col>
      <span>年累计发电量(万kWh)</span>
      <span>逆变器</span>
      <span>集电线路</span>
      <span>上网电量</span>
    </Col>
    <Col>等效小时数(h)*</Col>
    <Col>年累计购网电量(万kWh)*</Col>
    <Col>
      <span>样板逆变器(万kWh)</span>
      <span>容量</span>
      <span>日发电量</span>
    </Col>
    <Col>装机容量(MW)</Col>
    <Col>操作</Col>
  </Row>)
}

export default StationReportColumn;