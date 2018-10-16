import React from "react";
import PropTypes from "prop-types";
import {  Form,Select } from 'antd';
import styles from './productionAnalysis.scss';
import StationSelect from '../../../Common/StationSelect';
import TimeSelect from '../../../Common/TimeSelect';
import BarGraph from '../AllStationAnalysis/CommonGraph/BarGraph';
import PlanCompleteRateAnalysisBar from '../AllStationAnalysis/CommonGraph/PlanCompleteRateAnalysisBar';
import TableGraph from '../AllStationAnalysis/CommonGraph/TableGraph';
import WaterWave from '../AllStationAnalysis/CommonGraph/PlanCompletionRate/WaterWave';

const FormItem = Form.Item;
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
    const { getFieldDecorator } = this.props.form;

    return (
      <div className={styles.singleStationType}>
        <div className={styles.stationTimeFilter}>
          <div className={styles.leftFilter}>
            <div className={styles.stationFilter}><Form>
            <FormItem label="条件查询" colon={false}>
              {getFieldDecorator('stationCodes', {
                initialValue: [],
                rules: [{ required: true, message: '请选择电站' }]
              })(
                <StationSelect
                  data={stations.toJS()}
                  holderText={'电站名-区域'}
                  // multiple={true}
                  onChange={this.stationSelected}
                />
              )}
              { /*<div className={styles.tipText}>(点击<i className="iconfont icon-filter" />图标可选择)</div>*/}
            </FormItem>
          </Form></div>
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
              <WaterWave percent={30} height={100} />
              <div className={styles.stationTargetData}>
               <div className={styles.stationTargetValue}>1333.30</div>
               <div className={styles.stationTargetName}>{dateType==='month'||dateType==='year'?'年':'月'}实际发电量 万kWh</div>
               </div>
               <div className={styles.stationTargetData}>
               <div className={styles.stationTargetValue}>1333.30</div>
               <div className={styles.stationTargetName}>{dateType==='month'||dateType==='year'?'年':'月'}计划发电量 万kWh</div>
               </div>
               <div className={styles.stationTargetData}>
               <div className={styles.stationTargetValue}>1333.30</div>
               <div className={styles.stationTargetName}>上网电量 万kWh</div>
               </div>
               <div className={styles.stationTargetData}>
               <div className={styles.stationTargetValue}>1333.30</div>
               <div className={styles.stationTargetName}>购网电量 万kWh</div>
               </div>
            </div>

          </div>


          <div className={styles.targetGraphContainer}>
            <div className={styles.tabContainer}>
              <div className={styles.dataGraph}>
                <BarGraph graphId={'power'} yAxisName={'发电量 (万kWh)'} xAxisName={'发电量'} dateType={dateType} />
                <TableGraph />
              </div>
            </div>


            {dateType === 'month' || dateType === 'year' ? <div className={styles.tabContainer}>
              <div className={styles.dataGraph}>
                <PlanCompleteRateAnalysisBar graphId={'productionPlanCompleteRate'} yAxisName={'发电量 (万kWh)'} xAxisName={'发电量'} dateType={dateType} />
                <TableGraph />
              </div>
            </div> : ''}

            <div className={styles.tabContainer}>
              <div className={styles.dataGraph}>
                <BarGraph graphId={'buyPower'} yAxisName={'购网电量 (万kWh)'} xAxisName={'发电量'} dateType={dateType} />
                <BarGraph graphId={'savePower'} yAxisName={'上网电量 (万kWh)'} xAxisName={'发电量'} dateType={dateType} />
              </div>
            </div>

          </div>
        </div>

      </div>
    );
  }
}
export default Form.create()(ProductionAnalysis);