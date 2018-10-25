import React from "react";
import PropTypes from "prop-types";
import { Row, Col,Popover  } from 'antd';
import styles from './stationContrast.scss';
import StationContrastDetail from './StationContrastDetail';
import {stationContrastDataInfo, stationContrastBaseName}from '../../../../constants/stationContrastBaseInfo';

class StationContrastTable extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    form: PropTypes.object,
    stations: PropTypes.array,
    toChangeStationContrastStore: PropTypes.func,
    getStationContrast: PropTypes.func,
    stationCode: PropTypes.array,
    dateType: PropTypes.string,
    year: PropTypes.array,
    getStationContrastDetail: PropTypes.func,
    month: PropTypes.number,
    stationContrastDetail: PropTypes.array,
    stationContrastList: PropTypes.array,
  }
  constructor(props) {
    super(props);
    this.state = {

    };
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
      column: e.currentTarget.getAttribute('data-datafieldname'),
    });
  }

  onVisibleChange = (item) => {
    if(!item){
      this.props.toChangeStationContrastStore({
        stationContrastDetail:[],
      });
    }
  }

  render() {
    const { stationContrastList  } = this.props;
    const content = (
      <div>
        <StationContrastDetail 
          {...this.props}
        />
      </div>
    );
    
    return (
      <Row className={styles.stationContrastTable} >
        <Col span={6} className={styles.baseNameBox} >
          {stationContrastBaseName.map((e,i)=> {
            return (<Row className={styles.baseName} key={i}>
              <Col className={styles.baseClassifyName} span={4}><span>{e.baseClassifyName}</span></Col>
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
            {Object.entries(stationContrastDataInfo).map((item,index)=>{
              const differHighLight = stationContrastList[0][item[0]] && stationContrastList[1][item[0]] && ((Math.abs(stationContrastList[0][item[0]]-stationContrastList[1][item[0]])/stationContrastList[1][item[0]])>0.2);
              const highLightColumn = [
                'equivalentHours',
                'lostPowerHours',
                'limitPowerHours',
                'subStatioinHours',
                'planShutdownHours',
                'faultPowerHours',
                'technicalHours',
                'courtHours',
              ];
              
              return (
                <div key={index} data-rowname={item[0]} data-datafieldname={item[1]} onClick={this.showContrastDetail} >
                  <Popover content={content} trigger="click" onVisibleChange={item=>this.onVisibleChange(item)} className={highLightColumn.includes(item[0]) ? (differHighLight ? styles.differHighLight:styles.contrastDetailPopover) : styles.contrastDetailPopover} placement="bottom" overlayClassName={styles.contrastOverlayClassName} >
                    <span className={styles.stationOne} >{stationContrastList[0][item[0]] || '--'}</span>
                    <span className={styles.stationTwo} >{stationContrastList[1][item[0]] || '--'}</span>
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