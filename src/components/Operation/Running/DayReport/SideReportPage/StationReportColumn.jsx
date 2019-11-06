
import React from 'react';
import PropTypes from 'prop-types';
import styles from './sideReportPage.scss';

const ElecPart = ({ title = '', eachText = [], required = false, extraStyle = {} }) => (
  <div className={styles.eachElecPart} style={extraStyle}>
    <div className={styles.elecTop}>
      <span>{title}</span>
      {required && <span className={styles.valueRequired}>*</span>}
    </div>
    <div className={styles.elecBottom}>
      <span>{eachText[0]}</span>
      <span>{eachText[1]}</span>
    </div>
  </div>
);

ElecPart.propTypes = {
  title: PropTypes.string,
  eachText: PropTypes.string,
  required: PropTypes.bool,
  extraStyle: PropTypes.object,
};

function StationReportColumn({ dayReportConfig, stationType }){
  // stationType === 0 : 风电站； // stationType === 1 :光伏电站
  const configUtil = dayReportConfig[0] || {};
  const radiaUtil = configUtil.radiation || '--'; // 辐射单位;
  const speedUtil = configUtil.speed || '--'; // 风速单位;
  const genUtil = configUtil.power || '--'; // 电量单位
  const requiredTargetObj = dayReportConfig[1] || {}; // 是否必填(展示*)
  // return (<Row className={styles.stationReportColumn}> // 2018-12-20更改。以下dom结构废弃。使用新的表头及样式。
  //   <Col span={3} >电站名称</Col>
  //   <Col className={styles.withBorder} span={2} >
  //     <span>{stationType > 0 ?'日斜面辐射总量' :'平均风速' }</span>
  //     <span>{stationType > 0 ?`(${radiaUtil})` :`(${speedUtil})` }</span>
  //     <i className={styles.withRequired}>{requiredTargetObj.resourceValue && '*'}</i>
  //   </Col>
  //   <Col span={5} >
  //     <div className={styles.withBorderBottom}>年累计发电量({genUtil})</div>
  //     <Row >
  //       <Col span={8}>{stationType > 0 ?'逆变器' :'风机机组' }<i className={styles.withRequired}>{requiredTargetObj.yearGenInverter && '*'}</i></Col>
  //       <Col span={8}>集电线路<i className={styles.withRequired}>{requiredTargetObj.yearGenIntegrated && '*'}</i></Col>
  //       <Col span={8}>上网电量<i className={styles.withRequired}>{requiredTargetObj.yearGenInternet && '*'}</i></Col>
  //     </Row>
  //   </Col>
  //   <Col className={styles.withBorder} span={2} >等效小时数(h)<i className={styles.withRequired}>{requiredTargetObj.hour && '*'}</i></Col>
  //   <Col span={2} >年累计购网电量({genUtil})<i className={styles.withRequired}>{requiredTargetObj.buyPower && '*'}</i></Col>
  //   <Col className={styles.withBorder} span={5} >
  //     <div className={styles.withBorderBottom}>{stationType > 0 ?'样板逆变器' :'样板风机' }</div>
  //     <Row >
  //       <Col  span={10}>容量(MW)<i className={styles.withRequired}>{requiredTargetObj.modelInverterCapacity && '*'}</i></Col>
  //       <Col span={14}>日发电量({genUtil})<i className={styles.withRequired}>{requiredTargetObj.modelInverterPowerGen && '*'}</i></Col>
  //     </Row>
  //   </Col>
  //   <Col span={2}>装机容量(MW)</Col>
  //   <Col className={styles.withBorder} span={3} >操作</Col>
  // </Row>)
  return (<div className={styles.stationReportColumn}>
    <div className={styles.stationName}>电站名称</div>
    <div className={styles.resource}>
      <div>{stationType > 0 ?'日累计辐射' :'日平均风速' }</div>
      <div>
        <span>{stationType > 0 ?`(${radiaUtil})` :`(${speedUtil})`}</span>
        {requiredTargetObj.resourceValue && <span className={styles.valueRequired}>*</span>}
      </div>
    </div>
    <ElecPart
      title={`${stationType > 0 ? '逆变器' : '风电机组'}发电量(${genUtil})`}
      eachText={['年', '日']}
      required={requiredTargetObj.yearGenInverter}
    />
    <ElecPart
      title={`集电线路发电量(${genUtil})`}
      eachText={['年', '日']}
      required={requiredTargetObj.yearGenIntegrated}
    />
    <ElecPart
      title={`上网电量(${genUtil})`}
      eachText={['年', '日']}
      required={requiredTargetObj.yearGenInternet}
    />
    <ElecPart
      title={`购网电量(${genUtil})`}
      eachText={['年', '日']}
      required={requiredTargetObj.buyPower}
    />
    <ElecPart
      title="样板机"
      eachText={['容量(MW)', `日发电量(${genUtil})`]}
      required={requiredTargetObj.modelInverterPowerGen || requiredTargetObj.modelInverterCapacity}
      extraStyle={{flexBasis: '16%'}}
    />
    <div className={styles.handle}>操作</div>
  </div>);
}

StationReportColumn.propTypes = {
  dayReportConfig: PropTypes.array,
  stationType: PropTypes.number,
};

export default StationReportColumn;
