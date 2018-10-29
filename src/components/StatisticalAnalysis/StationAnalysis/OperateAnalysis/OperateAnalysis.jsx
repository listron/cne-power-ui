import React from "react";
import PropTypes from "prop-types";
import { TimePicker, Icon, Button, DatePicker, Select } from "antd";
import { withRouter } from "react-router-dom";
import styles from "./operateAnalysis.scss";
import StationSelect from "../../../Common/StationSelect";
// import AlarmStatisticByType from './AlarmStatisticByType';

import TimeSelect from "../../../Common/TimeSelect";
import BarGraph from "../AllStationAnalysis/CommonGraph/BarGraph";
import PlanCompleteRateAnalysisBar from "../AllStationAnalysis/CommonGraph/PlanCompleteRateAnalysisBar";
import TableGraph from "../AllStationAnalysis/CommonGraph/TableGraph";
import PowerEfficency from "../AllStationAnalysis/CommonGraph/ThreeYaxis";
import UsageRate from "./UsageRate";
import LostPowerType from "./LostPowerType";
import LostPowerTypeRate from "./LostPowerTypeRate";
import LimitPowerRate from "./LimitPowerRate";
import LimitPowerRateTable from "./LimitPowerRateTable";
import moment from 'moment';

const Option = Select.Option;
class OperateAnalysis extends React.Component {
  static propTypes = {
    stationType: PropTypes.string,
    changeOperateStationStore: PropTypes.func,
    getOperatePlanComplete: PropTypes.func,
    getComponentPowerStatistic: PropTypes.func,
    getLimitPowerRate: PropTypes.func,
    getLostPowerType: PropTypes.func,
    getYearLimitPowerRate: PropTypes.func,
    getPlantPower: PropTypes.func,
    getUsageRate: PropTypes.func,
    getPowerEfficiency: PropTypes.func,
    getlostPower: PropTypes.func,
    dateType: PropTypes.string,
    year: PropTypes.number,
    month: PropTypes.string,
    stations: PropTypes.object,
    // operatePlanCompleteData: PropTypes.object,
    componentPowerStatisticData: PropTypes.object,
    usageRatecData: PropTypes.object,
    lostPowerTypeData: PropTypes.object,
    limitpowerData: PropTypes.array,
    yearLimitpowerData: PropTypes.object,
    plantPowerDat: PropTypes.object,
  };
  constructor(props) {
    super(props);
    this.state = {
      onGridTime: '',
      stationName: '',

    };
  }
  componentDidMount() {
    // console.log('this.props', this.props)
    // const { dateType, year, month, stations } = this.props;
    // const curYear = Number(moment().format('YYYY'));
    // let prams = {
    //   stationCode: stations.toJS()[0].stationCode,
    //   dateType,
    //   year
    // };
    // this.props.changeOperateStationStore(prams)
    // this.props.getOperatePlanComplete(prams)
    // this.props.getComponentPowerStatistic(prams)
    // this.props.getLostPowerType(prams)
    // this.props.getLimitPowerRate(prams)
    // // nextProps.getYearLimitPowerRate(prams)
    // this.props.getPlantPower(prams)
  }

  componentWillReceiveProps(nextProps) {
    const { dateType, year, month, stations, stationCode } = nextProps;
    const curYear = Number(moment().format('YYYY'));
    console.log("nextProps", nextProps)
    let prams = {
      stationCode: stationCode ? stationCode : stations.toJS()[0].stationCode,
      dateType,
      year: curYear,
    }
    let yearPrams = {
      stationCode: stationCode ? stationCode : stations.toJS()[0].stationCode,
      dateType: "year",
      year: curYear,
    }

    // let color = ['#a42b2c',]
    if (year) {
      if (dateType === "month" && this.props.year !== year) {
        // console.log(123);
        this.props.changeOperateStationStore(prams)
        nextProps.getOperatePlanComplete(yearPrams)
        nextProps.getComponentPowerStatistic(yearPrams)
        nextProps.getPowerEfficiency({
          stationCode: stations.toJS()[0].stationCode,
          dateType,
          year: [curYear],
        })
        nextProps.getlostPower({
          stationCode: stations.toJS()[0].stationCode,
          dateType,
          year: [curYear],
          dataType: "lostPower"
        })
        nextProps.getUsageRate(prams)
        nextProps.getLostPowerType(prams)
        nextProps.getLimitPowerRate(prams)
        // nextProps.getYearLimitPowerRate(prams)
        nextProps.getPlantPower(prams)
      }
    } else {
      this.props.changeOperateStationStore(prams)

    }


  }

  stationSelected = (rest) => {
    // console.log('stationCode', rest[0].stationCode)
    const stationCode = rest[0].stationCode
    this.props.changeOperateStationStore({ stationCode })
  }

  addXaixsName = (value, dateType) => {
    let result = '';
    switch (dateType) {
      case 'month':
        result = value + ' 月'
        break;
      case 'year':
        result = value
      case 'day':
        result = value + ' 日';
      default:
        break;
    }
    return result
  }

  changeDate = (data) => {
    console.log(123, data);
    this.changeOperateStationStore(data)
  }

  render() {
    const { stationType, stations, dateType, stationCode, year, operateAvalibaData, operatePlanCompleteData, powerData, lostPowerData, efficiencyData, usageData, lostPowerTypeDatas, limitPowerData,
      yearLimitpowerData, plantPowerData } = this.props;

    // 发电效率    
    const PowerEffectiveData={
      xData:efficiencyData && efficiencyData.map((e, i) => { return this.addXaixsName(e.date, dateType) }),
      yData:{
        barData:{
          hours:efficiencyData && efficiencyData.map((e, i) => (e.hours ? parseFloat(e.hours).toFixed(2) : "--"))
        },
        lineData:{
          light: efficiencyData && efficiencyData.map((e, i) => (e.light ? parseFloat(e.light).toFixed(2) : "--")),
          pr:efficiencyData && efficiencyData.map((e, i) => (e.pr ? parseFloat(e.pr).toFixed(2) : "--"))
        }
      }
    }

    // 可利用率
    let stationUtilization = usageData && usageData.map((e, i) => (e.stationUtilization ? parseFloat(e.stationUtilization).toFixed(2) : "--"));
    let deviceUtilization = usageData && usageData.map((e, i) => (e.deviceUtilization ? parseFloat(e.deviceUtilization).toFixed(2) : "--"));
    let xData = usageData && usageData.map((e, i) => { return this.addXaixsName(e.date, dateType) })
    let station = ''
    stationCode ? station = stations.toJS().filter(e => e.stationCode === stationCode) : '';
    let lineData = {
      xData: xData,
      yData: [
        stationUtilization,
        deviceUtilization
      ]
    };



    // 损失电量
    const currentYear = parseInt(year).toString();
    const lastYear = (parseInt(year) - 1).toString();
    const barGraphThatYear = lostPowerData && lostPowerData.map((e, i) => (e.thatYearData ? parseFloat(e.thatYearData).toFixed(2) : "--"));
    const barGraphLastYear = lostPowerData && lostPowerData.map((e, i) => (e.lastYearData ? parseFloat(e.lastYearData).toFixed(2) : "--"));
    const barGraphmonth = lostPowerData && lostPowerData.map((e, i) => { return this.addXaixsName(e.date, dateType) });
    const barGraphYearOnYear = lostPowerData && lostPowerData.map((e, i) => (e.yearOnYear ? parseFloat(e.yearOnYear).toFixed(2) : "--"));

    //损失电站类型
    const lostPowerTypeData = lostPowerTypeDatas && lostPowerTypeDatas.lostpower;
    let lostpower = {
      date: lostPowerTypeData && lostPowerTypeData.map((e, i) => { return this.addXaixsName(e.date, dateType) }),
      limit: lostPowerTypeData && lostPowerTypeData.map((e, i) => (e.limit ? parseFloat(e.limit).toFixed(2) : "--")),
      electric: lostPowerTypeData && lostPowerTypeData.map((e, i) => (e.electric ? parseFloat(e.electric).toFixed(2) : "--")),
      plane: lostPowerTypeData && lostPowerTypeData.map((e, i) => (e.plane ? parseFloat(e.plane).toFixed(2) : "--")),
      system: lostPowerTypeData && lostPowerTypeData.map((e, i) => (e.system ? parseFloat(e.system).toFixed(2) : "--")),
      other: lostPowerTypeData && lostPowerTypeData.map((e, i) => (e.other ? parseFloat(e.other).toFixed(2) : "--"))
    };
    let summary = lostPowerTypeDatas && lostPowerTypeDatas.summary;


    // 限电率同比
    const limitPower = {
      xData: limitPowerData && limitPowerData.map((e, i) => { return this.addXaixsName(e.date, dateType) }),
      yData: {
        lineData: {
          thatYearLostPowerRate: limitPowerData && limitPowerData.map((e, i) => (e.thatYearLostPowerRate ? parseFloat(e.thatYearLostPowerRate).toFixed(2) : "--")),
          lastyearLostPowerRate: limitPowerData && limitPowerData.map((e, i) => (e.lastyearLostPowerRate ? parseFloat(e.lastyearLostPowerRate).toFixed(2) : "--")),
          lostPowerRateYearOnYear: limitPowerData && limitPowerData.map((e, i) => (e.lostPowerRateYearOnYear ? parseFloat(e.lostPowerRateYearOnYear).toFixed(2) : "--")),
        },
        barData: {
          thatYearLostPower: limitPowerData && limitPowerData.map((e, i) => (e.thatYearLostPower ? parseFloat(e.thatYearLostPower).toFixed(2) : "--")),
          lastyearLostPower: limitPowerData && limitPowerData.map((e, i) => (e.lastyearLostPower ? parseFloat(e.lastyearLostPower).toFixed(2) : "--"))
        }
      }
    }

    // 能耗分析
    let plantLost = {
      xData: plantPowerData && plantPowerData.map((e, i) => { return this.addXaixsName(e.date, dateType) }),
      yData: [
        plantPowerData && plantPowerData.map((e, i) => (e.plantPower ? parseFloat(e.plantPower).toFixed(2) : "--")),
        plantPowerData && plantPowerData.map((e, i) => (e.comPlant ? parseFloat(e.comPlant).toFixed(2) : "--"))
      ]
    };
    const useLost = {
      xData: plantPowerData && plantPowerData.map((e, i) => { return this.addXaixsName(e.date, dateType) }),
      yData: [
        plantPowerData && plantPowerData.map((e, i) => (e.sendLine ? parseFloat(e.sendLine).toFixed(2) : "--")),
        plantPowerData && plantPowerData.map((e, i) => (e.plantLoss ? parseFloat(e.plantLoss).toFixed(2) : "--"))
      ]
    };


    return (
      <div className={styles.singleStationType}>
        <div className={styles.stationTimeFilter}>
          <div className={styles.leftFilter}>
            <div className={styles.stationFilter}>
              <span className={styles.text}>条件查询</span>
              <StationSelect
                data={stations.toJS()}
                holderText={"电站名-区域"}
                value={this.state.staionCode}
                // multiple={true}
                onChange={this.stationSelected}
              />
            </div>
            <TimeSelect day={true} {...this.props} changeAllStationStore={this.changeDate} />
          </div>
          <span className={styles.rightContent}>数据统计截止时间{moment().subtract(1, 'days').format('YYYY年MM月DD日')}</span>
        </div>

        <div className={styles.componentContainer}>
          <div className={styles.title}>
            <div className={styles.stationStatus}>
              <div className={styles.status}>
                <span className={styles.stationIcon}>
                  <i className="iconfont icon-pvlogo" />
                </span>
                {`电站名-区域：${station && station[0].stationName}`}
                <span>计划完成情况({operatePlanCompleteData && operatePlanCompleteData.date})</span>
              </div>

              <span className={styles.rightFont}>并网时间:{moment(station && station[0].onGridTime).format('YYYY年MM月DD日') || "--"}</span>
            </div>
            <div className={styles.graph}>
              <div className={styles.stationTargetData}>
                <div className={styles.stationTargetValue}>{operatePlanCompleteData && operatePlanCompleteData.pr || '--'}</div>
                <div className={styles.stationTargetName}>PR </div>
              </div>
              <div className={styles.stationTargetData}>
                <div className={styles.stationTargetValue}>{operatePlanCompleteData && operatePlanCompleteData.cpr || '--'}</div>
                <div className={styles.stationTargetName}>CPR </div>
              </div>
              <div className={styles.stationTargetData}>
                <div className={styles.stationTargetValue}>{operatePlanCompleteData && operatePlanCompleteData.theoryPower || '--'}</div>
                <div className={styles.stationTargetName}>理论发电量 万kWh</div>
              </div>
              <div className={styles.stationTargetData}>
                <div className={styles.stationTargetValue}>{operatePlanCompleteData && operatePlanCompleteData.actualPower || '--'}</div>
                <div className={styles.stationTargetName}>实际发电量 万kWh</div>
              </div>
              <div className={styles.stationTargetData}>
                <div className={styles.stationTargetValue}>{operatePlanCompleteData && operatePlanCompleteData.lostPower || '--'}</div>
                <div className={styles.stationTargetName}>损失电量 万kWh</div>
              </div>
            </div>
          </div>
          <div className={styles.cardContainer}>
            <div className={styles.cardList}>
              <div className={styles.cardItem}>
                <div>光资源</div>
                <div>辐射总量 {powerData && powerData.resourceValue || '--'}MJ/㎡</div>
                <div>理论发电量 {powerData && powerData.theoryGen || '--'}万kWh</div>
              </div>
              <Icon type="double-right" theme="outlined" />
              <div className={styles.cardItem}>
                <div>光伏组件</div>
                <div>发电量 {powerData && powerData.componentGen || '--'}万kWh</div>
                <div>光伏组件吸收损耗 {powerData && powerData.componentLost || '--'}万kWh</div>
              </div>
              <Icon type="double-right" theme="outlined" />
              <div className={styles.cardItem}>
                <div>逆变器</div>
                <div>发电量 {powerData && powerData.inverterGen || '--'}万kWh</div>
                <div>逆变器损耗 {powerData && powerData.inverterLost || '--'}万kWh</div>
              </div>
              <Icon type="double-right" theme="outlined" />
              <div className={styles.cardItem}>
                <div>集电线路</div>
                <div>发电量 {powerData && powerData.integratedGen || '--'}万kWh</div>
                <div>集电线路及箱变损耗 {powerData && powerData.integratedLost || '--'}万kWh</div>
              </div>
              <Icon type="double-right" theme="outlined" />
              <div className={styles.cardItem}>
                <div>升压站/关口表</div>
                <div>上网电量 {powerData && powerData.internetGen || '--'}万kWh</div>
                <div>升压站损耗 {powerData && powerData.internetLost || '--'}万kWh</div>
              </div>
            </div>
          </div>

          <div className={styles.targetGraphContainer}>
            <div className={styles.bgStyle}>
              <div className={styles.fontStyle}>发电效率分析</div>
            </div>
            <div className={styles.tabContainer}>
              <div className={styles.dataGraph}>
                <PowerEfficency
                  graphId={"powerEfficency"}
                  dateType={dateType}
                  title={"发电效率"}
                  data={PowerEffectiveData}
                />
                <TableGraph
                  tableType={'pr'}
                  dateType={dateType}
                  dataArray={efficiencyData} />
              </div>
            </div>
            <div className={styles.tabContainer}>
              <div className={styles.dataGraph}>
                {lineData && (
                  <UsageRate
                    graphId={"usageRateId"}
                    title={"可利用率"}
                    yAxisName={["电站可利用率", "发电系统可利用率"]}
                    xAxisName={"可利用率"}
                    data={lineData}
                  />
                )}
                <TableGraph
                  tableType={'utilization'}
                  dateType={dateType}
                  dataArray={usageData} />
              </div>
            </div>

            <div className={styles.bgStyle}>
              <div className={styles.fontStyle}>损失电量分析</div>
            </div>
            <div className={styles.tabContainer}>
              <div className={styles.dataGraph}>
                <BarGraph
                  graphId={'lostPower'}
                  yAxisName={'损失电量 (万kWh)'}
                  xAxisName={'损失电量同比'}
                  dateType={dateType}
                  title={dateType === "year" ? "损失电量环比" : "损失电量同比"}
                  currentYear={currentYear}
                  lastYear={lastYear}
                  barGraphThatYear={barGraphThatYear}
                  barGraphLastYear={barGraphLastYear}
                  barGraphmonth={barGraphmonth}
                  barGraphYearOnYear={barGraphYearOnYear} />
                <TableGraph
                  dateType={dateType}
                  tableType={'lostPowerTB'}
                  currentYear={currentYear}
                  lastYear={lastYear}
                  dataArray={lostPowerData}
                />
              </div>
            </div>
            <div className={styles.tabContainer}>
              <div className={styles.dataGraph}>
                <LostPowerType
                  graphId={"lostPowerType"}
                  yAxisName={"损失电量 (万kWh)"}
                  title={"电量损失类型"}
                  xAxisName={"损失电量"}
                  dateType={dateType}
                  data={lostpower}
                />
                <div className={styles.LostPowerTypeRate}>
                  <div className={styles.LostPowerTypeTitle}>
                    <div>
                      电量损失类型占比(
                      {"2018年9月"})
                    </div>
                    <div>损失电量:万kWh</div>
                  </div>
                  <LostPowerTypeRate graphId={"lostPowerTypeRate"} data={summary} yAxisName={'损失电量'} />
                </div>
              </div>
            </div>

            <div className={styles.tabContainer}>
              <div className={styles.dataGraph}>
                <LimitPowerRate
                  graphId={"limitPowerRate"}
                  yAxisName={"损失电量 (万kWh)"}
                  xAxisName={"发电量"}
                  title={'限电率同比'}
                  dateType={dateType}
                  data={limitPower}
                  currentYear={currentYear}
                  lastYear={lastYear}
                />
                <LimitPowerRateTable
                  tableType={'limitPower'}
                  currentYear={currentYear}
                  dateType={dateType}
                  lastYear={lastYear}
                  dataArray={limitPowerData}
                />
              </div>
            </div>
            <div className={styles.bgStyle}>
              <div className={styles.fontStyle}>能耗分析</div>
            </div>
            <div className={styles.tabContainer}>
              <div className={styles.dataGraphs}>
                <UsageRate
                  graphId={"usageRateId2"}
                  title={"厂用电情况"}
                  yAxisName={["厂用电率", "综合厂用电率"]}
                  xAxisName={"厂用电情况"}
                  data={plantLost}
                />
                <UsageRate
                  graphId={"usageRateId3"}
                  title={"厂损情况"}
                  xAxisName={"厂损情况"}
                  yAxisName={["送出线损率", "厂损率"]}
                  data={useLost}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default OperateAnalysis;
