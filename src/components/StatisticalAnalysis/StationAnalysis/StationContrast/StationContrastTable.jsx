import React from "react";
import PropTypes from "prop-types";
import { Table, Row, Col,Popover  } from 'antd';
import styles from './stationContrast.scss';
import StationContrastDetail from './StationContrastDetail';

class StationContrastTable extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    form: PropTypes.object,
    stations: PropTypes.array,
    toChangeStationContrastStore: PropTypes.func,
    getStationContrast: PropTypes.func,
    stationCode: PropTypes.string,
    dateType: PropTypes.string,
    year: PropTypes.string,
    getStationContrastDetail: PropTypes.func,
    month: PropTypes.string,
    stationContrastDetail: PropTypes.array,
    stationContrastList: PropTypes.array,
  }
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  tableColumn = () => {

  }
  showContrastDetail = (e) => {
    const { stations, stationCode, dateType, year, month } = this.props;
    this.props.toChangeStationContrastStore({
      column: e.currentTarget.getAttribute('data-rowName'),
    })
    this.props.getStationContrastDetail({
      stationCode,
      dateType,
      year,
      month,
      column: e.currentTarget.getAttribute('data-rowName'),
    });
  }
  render() {
    const { loading, stations,stationContrastDetail, stationContrastList  } = this.props;
    const baseName =[
      { 
        baseClassifyName: '基本信息',
        rowName: [
          '电站名称',
          '并网时间',
          '装机容量（MW）',
          '区域',
          '装机台数',
        ],
      },
      {
        baseClassifyName: '资源情况',
        rowName: [
          '斜面辐射总量（MJ/㎡）',
          '日照时数（h）',
          '平均气温（℃）',
        ]
      },
      {
        baseClassifyName: '发电情况',
        rowName: [
          '计划发电量（万kWh）',
          '实际发电量（万kWh）',
          '计划完成率（%）',
          '上网电量（万kWh）',
          '购网电量（万kWh）',
        ]
      },
      {
        baseClassifyName: '运行情况',
        rowName: [
          'PR（%）',
          'CPR（%）',
          '理论发电量（万kWh）',
          '等效利用小时数（h）',
          '损失电量等效时（h）',
          '发电系统可利用率（%）',
          '电站可利用率（%）',
          '限电损失等效时（h）',
          '变电故障损失等效时（h）',
          '计划停机损失等效时（h）',
          '发电系统故障损失等效时（h）',
          '技改大修损失等效时（h）',
          '场外因素损失等效时（h）',
          '限电率（%）',
          '厂用电率（%）',
          '综合厂用电率（%）',
          '厂损率（%）',
          '送出线损率（%）',
        ],
      },
    ];
    const content = (
      <div>
        <StationContrastDetail 
          {...this.props}
        />
      </div>
    );
    const columnName = [
      'resourceValue',
      'sunshineHours',
      'tempAvg',
      'planGen',
      'genValid',
      'planFinshRatio',
      'genInternet',
      'buyPower',
      'pr',
      'cpr',
      'theoryPower',
      'equivalentHours',
      'lostPowerHours',
      'deviceAvailability',
      'stationAvailability',
      'limitPowerHours',
      'subStatioinHours',
      'planShutdownHours',
      'faultPowerHours',
      'technicalHours',
      'courtHours',
      'limitPowerRate',
      'plantPowerRate',
      'comPlantPowerRate',
      'plantLossRate',
      'sendLineRate',
    ]
    return (
      <Row className={styles.stationContrastTable} >
        <Col span={6} className={styles.baseNameBox} >
          {baseName.map((e,i)=> {
            return (<Row className={styles.baseName} key={i}>
              <Col className={styles.baseClassifyName} span={4}>{e.baseClassifyName}</Col>
              <Col className={styles.rowName} span={20}>
                {e.rowName.map((item,index)=>{
                  return (<div key={index}>{item}</div>)
                })}
              </Col>
            </Row>);
          })}
        </Col>
        {stationContrastList && stationContrastList.length===2 && 
          (<Col className={styles.stationOne} span={18} >
            <div>
              <div  className={styles.baseInfoBg} >{stationContrastList[0].stationName || '--'}</div>
              <div  className={styles.baseInfoBg} >{stationContrastList[1].stationName || '--'}</div>
            </div>
            <div>
              <div className={styles.baseInfoBg} >{stationContrastList[0].ongridTime || '--'}</div>
              <div className={styles.baseInfoBg} >{stationContrastList[1].ongridTime || '--'}</div>
            </div>
            <div>
              <div className={styles.baseInfoBg} >{stationContrastList[0].capacity || '--'}</div>
              <div className={styles.baseInfoBg} >{stationContrastList[1].capacity || '--'}</div>
            </div>
            <div>
              <div className={styles.baseInfoBg} >{stationContrastList[0].regionName || '--'}</div>
              <div className={styles.baseInfoBg} >{stationContrastList[1].regionName || '--'}</div>
            </div>
            <div>
              <div className={styles.baseInfoBg} >{stationContrastList[0].unitCount || '--'}</div>
              <div className={styles.baseInfoBg} >{stationContrastList[1].unitCount || '--'}</div>
            </div>
            {columnName.map((item,index)=>{
              return (
                <div key={index} data-rowname={item} onClick={this.showContrastDetail} >
                  <Popover content={content} trigger="click" className={styles.contrastDetailPopover} placement="bottom" overlayClassName={styles.contrastOverlayClassName} >
                    <span className={styles.stationOne} >{stationContrastList[0][item] || '--'}</span>
                    <span className={styles.stationTwo} >{stationContrastList[1][item] || '--'}</span>
                  </Popover>
                </div>
              );
            })}
          </Col>)
        }
      </Row>
    );
  }
}
export default StationContrastTable;