import React from "react";
import PropTypes from "prop-types";
import { TimePicker, Icon } from 'antd';
import { withRouter } from 'react-router-dom';
import styles from './operateAnalysis.scss';
// import AlarmStatisticByType from './AlarmStatisticByType';

import TimeSelect from '../../../Common/TimeSelect';
import BarGraph from '../AllStationAnalysis/CommonGraph/BarGraph';
import PlanCompleteRateAnalysisBar from '../AllStationAnalysis/CommonGraph/PlanCompleteRateAnalysisBar';
import TableGraph from '../AllStationAnalysis/CommonGraph/TableGraph';
import PowerEfficency from '../AllStationAnalysis/CommonGraph/PowerEfficency';
import UsageRate from './UsageRate'






class OperateAnalysis extends React.Component {
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

    const { stationType, stations, dateType } = this.props;


    return (
      <div className={styles.singleStationType}>
        <div className={styles.stationTimeFilter}>
          <div className={styles.leftFilter}>
            <div className={styles.stationFilter}>条件查询</div>
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
                <div className={styles.stationTargetValue}>87.34%</div>
                <div className={styles.stationTargetName}>PR </div>
              </div>
              <div className={styles.stationTargetData}>
                <div className={styles.stationTargetValue}>88.88%</div>
                <div className={styles.stationTargetName}>CDR </div>
              </div>
              <div className={styles.stationTargetData}>
                <div className={styles.stationTargetValue}>1333.30</div>
                <div className={styles.stationTargetName}>理论发电量 万kWh</div>
              </div>
              <div className={styles.stationTargetData}>
                <div className={styles.stationTargetValue}>1333.30</div>
                <div className={styles.stationTargetName}>实际发电量 万kWh</div>
              </div>
              <div className={styles.stationTargetData}>
                <div className={styles.stationTargetValue}>1333.30</div>
                <div className={styles.stationTargetName}>损失电量 万kWh</div>
              </div>

            </div>

          </div>

          <div className={styles.cardContainer}>
          <div  className={styles.cardList}>
          <div className={styles.cardItem}>
              <div>光资源</div>
              <div>辐射总量 888MJ/㎡</div>
              <div>理论发电量  888万kWh</div>
            </div>
            <Icon type="double-right" theme="outlined" />
            <div className={styles.cardItem}>
              <div>光资源</div>
              <div>辐射总量 888MJ/㎡</div>
              <div>理论发电量  888万kWh</div>
            </div>
            <Icon type="double-right" theme="outlined" />
            <div className={styles.cardItem}>
              <div>光资源</div>
              <div>辐射总量 888MJ/㎡</div>
              <div>理论发电量  888万kWh</div>
            </div>
            <Icon type="double-right" theme="outlined" />
            <div className={styles.cardItem}>
              <div>光资源</div>
              <div>辐射总量 888MJ/㎡</div>
              <div>理论发电量  888万kWh</div>
            </div>
            <Icon type="double-right" theme="outlined" />
            <div className={styles.cardItem}>
              <div>光资源</div>
              <div>辐射总量 888MJ/㎡</div>
              <div>理论发电量  888万kWh</div>
            </div>
            </div>
            
          </div>
          <div className={styles.targetGraphContainer}>

          <div className={styles.bgStyle}>
          <div className={styles.fontStyle}>发电效率分析</div>
        </div>

       
        <div className={styles.tabContainer}>
          <div className={styles.dataGraph}>
            <PowerEfficency graphId={'powerEfficency'} yAxisName={'损失电量 (万kWh)'} xAxisName={'发电量'} dateType={dateType} />
            <TableGraph />
          </div>
        </div>
        <div className={styles.tabContainer}>
        <div className={styles.dataGraph}>
          <UsageRate graphId={'usageRateId'} yAxisName={'损失电量 (万kWh)'} xAxisName={'发电量'} dateType={dateType} />
          <TableGraph />
        </div>
      </div>


           <div className={styles.bgStyle}>
              <div className={styles.fontStyle}>损失电量分析</div>
            </div>
            <div className={styles.tabContainer}>
              <div className={styles.dataGraph}>
                <BarGraph graphId={'lostPower'} yAxisName={'损失电量 (万kWh)'} xAxisName={'发电量'} dateType={dateType} />
                <TableGraph />
              </div>
            </div>

            

          </div>
        </div>






      </div>
    );
  }
}
export default withRouter(OperateAnalysis);