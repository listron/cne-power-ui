import React from "react";
import PropTypes from "prop-types";
import {  Select } from 'antd';
import styles from './stationResourceAnalysis.scss';
import StationSelect from '../../../Common/StationSelect';
import TimeSelect from '../../../Common/TimeSelect';
import BarGraph from '../AllStationAnalysis/CommonGraph/BarGraph';
import LightDistribution from './LightDistribution';
import TableGraph from '../AllStationAnalysis/CommonGraph/TableGraph';
import YearLightDistributionTable from './YearLightDistributionTable';
import WeatherStatus from './WeatherStatus';
import LostPowerTypeRate from '../OperateAnalysis/LostPowerTypeRate';


class ProductionAnalysis extends React.Component {
  static propTypes = {
    stations: PropTypes.object,
    stationType: PropTypes.string,
    stationCode: PropTypes.array,
    pageSize: PropTypes.number,
    pageNum: PropTypes.number,
    orderField: PropTypes.string,
    orderCommand: PropTypes.string,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    history: PropTypes.object,
  }
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount() {

  }

  render() {

    const { stationType, stations, dateType } = this.props;


    return (
      <div className={styles.singleStationType}>
        <div className={styles.stationTimeFilter}>
          <div className={styles.leftFilter}>
            <div className={styles.stationFilter}>
         条件查询
                <StationSelect
                  data={stations.toJS()}
                  holderText={'电站名-区域'}
                  // multiple={true}
                  onChange={this.stationSelected}
                />
             </div>
            <TimeSelect day={true} {...this.props} />
          </div>
          <span className={styles.rightContent}>数据统计截止时间8月20日</span>
        </div>

        <div className={styles.componentContainer}>


          <div className={styles.title}>

            <div className={styles.stationStatus}>
              <div className={styles.status}>
                <span className={styles.stationIcon}><i className="iconfont icon-pvlogo"></i></span>
                {`电站名-区域：xxxxxx`}
                计划完成情况{}
              </div>

              <span className={styles.rightFont}>并网时间:2018年3月10号</span>

            </div>
            <div className={styles.graph}>
              
              
               <div className={styles.stationTargetData}>
               <div className={styles.stationTargetValue}>821.22</div>
               <div className={styles.stationTargetName}>斜面辐射总量 MJ/㎡ </div>
               </div>
               <div className={styles.stationTargetData}>
               <div className={styles.stationTargetValue}>800</div>
               <div className={styles.stationTargetName}>日照时数 h </div>
               </div>
               <div className={styles.stationTargetData}>
               <div className={styles.stationTargetValue}>21.01</div>
               <div className={styles.stationTargetName}>平均气温 ℃</div>
               </div>
            </div>

          </div>


          <div className={styles.targetGraphContainer}>
            <div className={styles.tabContainer}>
              <div className={styles.dataGraph}>
                <BarGraph graphId={'power'} yAxisName={'辐射总量 (MJ/㎡)'} xAxisName={'辐射总量 '} dateType={dateType} />
                <TableGraph />
              </div>
            </div>


             <div className={styles.tabContainer}>
              <div className={styles.dataGraph}>
                <LightDistribution graphId={'LightDistribution'} yAxisName={'发电量 (万kWh)'} xAxisName={'发电量'} dateType={dateType} />
               {dateType==='year'?<YearLightDistributionTable />:<TableGraph />} 
              </div>
            </div> 

            <div className={styles.tabContainer}>
              <div className={styles.dataGraph}>
                <WeatherStatus graphId={'weatherId'} yAxisName={'损失电量 (万kWh)'} xAxisName={'发电量'} dateType={dateType} />
                <div className={styles.LostPowerTypeRate}>
                  <div className={styles.LostPowerTypeTitle}>
                    <div>天气情况占比{}</div>
                    
                  </div>
                  <LostPowerTypeRate graphId={'weatherRate'} />
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    );
  }
}
export default (ProductionAnalysis);