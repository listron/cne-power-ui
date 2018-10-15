import React from "react";
import PropTypes from "prop-types";
import { Tabs, TimePicker ,Icon} from 'antd';
import { withRouter } from 'react-router-dom';
import styles from './productionAnalysis.scss';
// import AlarmStatisticByType from './AlarmStatisticByType';

import TimeSelect from '../../../Common/TimeSelect';
import BarGraph from '../AllStationAnalysis/CommonGraph/BarGraph';
import PlanCompletionRate from '../AllStationAnalysis/CommonGraph/PlanCompletionRate';
import PlanCompleteRateAnalysisBar from '../AllStationAnalysis/CommonGraph/PlanCompleteRateAnalysisBar';
import TableGraph from '../AllStationAnalysis/CommonGraph/TableGraph';




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
    getStationsAlarmStatistic: PropTypes.func,
    showPage: PropTypes.string,
    changeProductionStationStore: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
    
    };
  }
  componentDidMount() {

  }
 
 



  render() {
  
    const { stationType, stations,dateType } = this.props;
  
 
    return (
      <div className={styles.singleStationType}>
        <div className={styles.componentContainer}>
          <div className={styles.title}>
            
            <div className={styles.titleLeft}>
              
              <div className={styles.stationStatus}>
                <div className={styles.status}>
                  <span className={styles.stationIcon}><i className="iconfont icon-pvlogo"></i></span>
                  {`电站名-区域：xxxxxx}`}
                </div>
                <div>
                  <span>并网时间:2018年3月10号</span>
                  <span>数据统计截止时间8月20日</span>
                </div>
              </div>
            </div>
            
          </div>
          <TimeSelect day={true} {...this.props} />
          <PlanCompletionRate dateType={dateType} />
          <div className={styles.targetGraphContainer}>


           
            <div className={styles.tabContainer}>
              <div className={styles.dataGraph}>
                <BarGraph graphId={'power'} yAxisName={'发电量 (万kWh)'} xAxisName={'发电量'} dateType={dateType} />
                <TableGraph />
              </div>          
            </div>

            
              {dateType==='month'||dateType==='year'?<div className={styles.tabContainer}>
              <div className={styles.dataGraph}>
                <PlanCompleteRateAnalysisBar graphId={'productionPlanCompleteRate'} yAxisName={'发电量 (万kWh)'} xAxisName={'发电量'} dateType={dateType} />
                <TableGraph />
              </div>
            </div>:''}
                
             


          
            <div className={styles.tabContainer}>
              <div className={styles.dataGraph}>
                <BarGraph graphId={'buyPower'} yAxisName={'购网电量 (万kWh)'} xAxisName={'发电量'} dateType={dateType} />
                <BarGraph graphId={'savePower'} yAxisName={'上网电量 (万kWh)'} xAxisName={'发电量'} dateType={dateType} />
              </div>
            </div>


          </div>
          <div></div>
        </div>






      </div>
    );
  }
}
export default withRouter(ProductionAnalysis);