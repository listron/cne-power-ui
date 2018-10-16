import React from "react";
import PropTypes from "prop-types";
import { TimePicker, Icon, Button, Form, DatePicker, Select,  } from 'antd';
import { withRouter } from 'react-router-dom';
import styles from './operateAnalysis.scss';
import StationSelect from '../../../Common/StationSelect';
// import AlarmStatisticByType from './AlarmStatisticByType';

import TimeSelect from '../../../Common/TimeSelect';
import BarGraph from '../AllStationAnalysis/CommonGraph/BarGraph';
import PlanCompleteRateAnalysisBar from '../AllStationAnalysis/CommonGraph/PlanCompleteRateAnalysisBar';
import TableGraph from '../AllStationAnalysis/CommonGraph/TableGraph';
import PowerEfficency from '../AllStationAnalysis/CommonGraph/PowerEfficency';
import UsageRate from './UsageRate';
import LostPowerType from './LostPowerType';
import LostPowerTypeRate from './LostPowerTypeRate';
import LimitPowerRate from './LimitPowerRate';
import LimitPowerRateTable from './LimitPowerRateTable';

const FormItem = Form.Item;
const Option = Select.Option;
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
            <div className={styles.stationFilter}>
              <Form>
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
              </Form>
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
            <div className={styles.cardList}>
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
                <UsageRate graphId={'usageRateId'} title={'可利用率'} yAxisName={'可利用率'} legendOne={'电站可利用率'} legendTwo={'发电系统可利用率'} dateType={dateType} />
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
            <div className={styles.tabContainer}>
              <div className={styles.dataGraph}>
                <LostPowerType graphId={'lostPowerType'} yAxisName={'损失电量 (万kWh)'} xAxisName={'发电量'} dateType={dateType} />
                <div className={styles.LostPowerTypeRate}>
                  <div className={styles.LostPowerTypeTitle}>
                    <div>电量损失类型占比{}</div>
                    <div>损失电量:万kWh</div>
                  </div>
                  <LostPowerTypeRate graphId={'lostPowerTypeRate'} />
                </div>
              </div>
            </div>

            <div className={styles.tabContainer}>
              <div className={styles.dataGraph}>
                <LimitPowerRate graphId={'limitPowerRate'} yAxisName={'损失电量 (万kWh)'} xAxisName={'发电量'} dateType={dateType} />
                <LimitPowerRateTable />
              </div>
            </div>
            <div className={styles.bgStyle}>
              <div className={styles.fontStyle}>能耗分析</div>
            </div>
            <div className={styles.tabContainer}>
              <div className={styles.dataGraph}>
                <UsageRate graphId={'usageRateId2'} title={'厂用电情况'} yAxisName={'厂用电率'} legendOne={'厂用电率'} legendTwo={'综合厂用电率'} showyAxis={true} rightyAxis={'综合厂用电率'} dateType={dateType} />
                <UsageRate graphId={'usageRateId3'} title={'厂损情况'} yAxisName={'送出线损率'} legendOne={'送出线损率'} legendTwo={'厂损率'} showyAxis={true} rightyAxis={'厂损率'} dateType={dateType} />
              </div>
            </div>



          </div>
        </div>






      </div>
    );
  }
}
export default Form.create()(OperateAnalysis);