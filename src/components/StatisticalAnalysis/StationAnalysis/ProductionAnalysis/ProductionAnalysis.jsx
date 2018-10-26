import React from "react";
import PropTypes from "prop-types";
import { Radio } from 'antd';
import styles from './productionAnalysis.scss';
import StationSelect from '../../../Common/StationSelect';
import TimeSelect from '../../../Common/TimeSelect';
import BarGraph from '../AllStationAnalysis/CommonGraph/BarGraph';
//import PlanCompleteRateAnalysisBar from '../AllStationAnalysis/CommonGraph/PlanCompleteRateAnalysisBar';
import TableGraph from '../AllStationAnalysis/CommonGraph/TableGraph';
import WaterWave from '../AllStationAnalysis/CommonGraph/PlanCompletionRate/WaterWave';
import ThreeYaxis from '../AllStationAnalysis/CommonGraph/ThreeYaxis';
import moment from 'moment';


class ProductionAnalysis extends React.Component {
  static propTypes = {
    stations: PropTypes.object,
    match: PropTypes.object,
    stationType: PropTypes.string,
    allStationAvalibaData: PropTypes.array,  
    history: PropTypes.object,
    getAllStationAvalibaData: PropTypes.func,
    changeAllStationStore: PropTypes.func,
    ProductionPlanComplete: PropTypes.func,
    getSingleStationProductionData: PropTypes.func,
    getSingleStationPlanRateData: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount() {
    const { getAllStationAvalibaData,stations,userId,stationCode, changeAllStationStore, ProductionPlanComplete,getSingleStationProductionData,getSingleStationPlanRateData,  year, dateType,  } = this.props;
    console.log(stationCode);
   
    const currentYear = moment().format('YYYY');
    const curYear = Number(moment().format('YYYY'));

    const currentMonth = Number(moment().format('MM'));
    let time = year ? year : [`${currentYear}`];
    changeAllStationStore({ year: [`${currentYear}`], month: currentMonth })
    getAllStationAvalibaData(
      {
        userId: userId,
        year: time,
        dateType,
        stationCode:'360',
      }
    )
    ProductionPlanComplete({
      stationCode: "360",
      year:curYear,
      dateType:'month',
    

    })
    getSingleStationProductionData({
      stationCode: '360',
      dateType:'month',
      year: currentYear,

    })
    getSingleStationPlanRateData({
      stationCode:'360',
      year:[curYear],
      dateType:'month'

    })
  }
  componentWillReceiveProps(nextProps) {
    const { year,userId, dateType, stations,changeAllStationStore, ProductionPlanComplete,getAllStationAvalibaData,getSingleStationProductionData,getSingleStationPlanRateData  } = this.props;
    const stationItems = stations.toJS();
    const stationItem = stationItems&&stationItems[0];
    let stationCode=stationItem&&stationItem.stationCode;
    console.log(stationCode);
    // if(stationCode){
    //   this.props.changeAllStationStore({stationCode})
    // }
    console.log(this.props.stationCode);
    console.log(nextProps.stationCode);
    const currentYear = [moment().format('YYYY')];
    const currentTableYear = Number(moment().format('YYYY'));
    const currentMonth = Number(moment().format('MM'));
    const curYearNum=nextProps.year[0].split('-')[0];
    const curMonthNum=nextProps.year[0].split('-')[1];
    // console.log(curYearNum,curMonthNum);

    const curMonth = moment().format('YYYY-MM');
    const curMonthArray = [moment().format('YYYY-MM')]

    const curYear = Number(nextProps.year)
    const curYearPlan = nextProps.year[nextProps.year.length - 1];
    const selectYear = [Number(moment().subtract(5, 'year').format('YYYY')), Number(moment().format('YYYY'))];
    let rangeYear = [];
    for (let i = selectYear[0]; i < selectYear[1] + 1; i++) {
      rangeYear.push(i.toString())
    }
    const nextPropsSelectYear=[Number(nextProps.year[0]),Number(nextProps.year[1])]
    let nextRangeYear = [];
    for (let i = nextPropsSelectYear[0]; i < nextPropsSelectYear[1] + 1; i++) {
      nextRangeYear.push(i.toString())
    }
   
  
    //月->月
    if (dateType === 'month' && nextProps.dateType === 'month') {
      if (nextProps.year[0] !== this.props.year[0]){
        ProductionPlanComplete({
          stationCode: "360",
          year:curYear,
          dateType:'month',   
        })
        getSingleStationProductionData({
          stationCode: '360',
          dateType:'month',
          year: currentYear,
    
        })
        getSingleStationPlanRateData({
          stationCode:'360',
          year:[curYear],
          dateType:'month'
    
        })
      }
    }
    //月/年->日
    if (dateType !== nextProps.dateType && nextProps.dateType === 'day') {
      ProductionPlanComplete({
        stationCode: "360",
        year:curYear,
        month:10,
        dateType:'day',  
      })
      getSingleStationProductionData({
        stationCode: '360',
        dateType:'day',
        year: currentYear,
  
      })


    }
    //日->日
    if (dateType === 'day' && nextProps.dateType === 'day') {
      if (nextProps.year[0] !== this.props.year[0]) {

        ProductionPlanComplete({
          stationCode: "360",
          year:curYear,
          month:10,
          dateType:'day',
        
    
        })
        getSingleStationProductionData({
          stationCode: '360',
          dateType:'day',
          year: nextProps.year,
    
        })
      }
    }

    //月/日->年
    if (dateType !== nextProps.dateType && nextProps.dateType === 'year') {
      getAllStationAvalibaData(
        {
          userId: userId,
          year: rangeYear,
          dateType:nextProps.dateType,
          stationCode:'360'
        }
      )
      ProductionPlanComplete({
        stationCode: "360",
        year:curYear,
        dateType:nextProps.dateType
      
  
      })
      getSingleStationProductionData({
        stationCode: '360',
        dateType:nextProps.dateType,
        year: currentYear,
  
      })
      getSingleStationPlanRateData({
        stationCode:'360',
        year:selectYear,
        dateType:nextProps.dateType,
  
      })


    }
    //年/日->月
    if (dateType !== nextProps.dateType && nextProps.dateType === 'month') {
      ProductionPlanComplete({
        stationCode: "360",
        year:curYear,
        dateType:nextProps.dateType,
      
  
      })
      getSingleStationProductionData({
        stationCode: '360',
        dateType:nextProps.dateType,
        year: currentYear,
  
      })
      getSingleStationPlanRateData({
        stationCode:'360',
        year:[curYear],
        dateType:nextProps.dateType,
  
      })

    }
    //年->年
    if (dateType === 'year' && nextProps.dateType === 'year') {
      if (nextProps.year[0] !== this.props.year[0] || nextProps.year[1] !== this.props.year[1]) {
        getAllStationAvalibaData(
          {
            userId: userId,
            year: nextRangeYear,
            dateType,
            stationCode:'360'
          }
        )
        ProductionPlanComplete({
          stationCode: "360",
          year:Number(nextProps.year[1]),
          dateType,
        
    
        })
        getSingleStationProductionData({
          stationCode: '360',        
          year: nextRangeYear,
          dateType,
    
        })
        getSingleStationPlanRateData({
          stationCode:'360',
          year:nextPropsSelectYear,
          dateType,    
        })
      }
    }
  }
  stationSelected = (stationSelect) => { // 存储选中的电站
    this.props.changeAllStationStore({
      stationCode:stationSelect[0].stationCode
    })
  }
  selectYear() {
    const {allStationAvalibaData}=this.props;
    console.log(allStationAvalibaData);
    let yearArray=[].map((e,i)=>(Number(e.year))) ;
    let currentYear=Math.max(...yearArray).toString()
 
    return (
      <Radio.Group defaultValue={currentYear}  buttonStyle="solid" onChange={this.handleTime}>
       {[].map((e,index)=>{        
         if(e.isTrue===true){
          return   <Radio.Button value={e.year} key={index}  style={{margin:'0 5px'}}>{e.year}年</Radio.Button>
         }else{
          return   <Radio.Button value={e.year} key={index} disabled style={{margin:'0 5px'}}>{e.year}年</Radio.Button>
         }
       }
       )}
      </Radio.Group>
    )

  }
  render() {

    const { stationType, stations, dateType ,year,changeAllStationStore} = this.props;
    //console.log(123,dateType )
    const statisticTime=moment().subtract(1, 'days').format('YYYY年MM月DD日');
    const stationItem = stations.toJS();
    //console.log(stationItem[0]);
 
    const stationGridTime = 0?stationItem.onGridTime.moment().format('YYYY年MM月DD日'):'--';
   

    
    return (
      <div className={styles.singleStationType}>
        <div className={styles.stationTimeFilter}>
          <div className={styles.leftFilter}>
            <div className={styles.stationFilter}>
              <span className={styles.text}>条件查询</span>
              <StationSelect
                data={stations.toJS()}
                holderText={'电站名-区域'}
                // multiple={true}
                onChange={this.stationSelected}
              />
            </div>
            <TimeSelect day={true} changeAllStationStore={changeAllStationStore} dateType={dateType} />
          </div>
          <span className={styles.rightContent}>数据统计截止时间{statisticTime}</span>
        </div>

        <div className={styles.componentContainer}>


          <div className={styles.title}>

            <div className={styles.stationStatus}>
              <div className={styles.status}>
                <span className={styles.stationIcon}><i className="iconfont icon-pvlogo"></i></span>
                {`电站名-区域：`}
                计划完成情况{dateType==='year'?this.selectYear():`(  ${Number(year)}年  ) `}
              </div>

              <span className={styles.rightFont}>并网时间{stationGridTime}</span>

            </div>
            <div className={styles.graph}>
              <WaterWave percent={30} height={100} />
              <div className={styles.stationTargetData}>
                <div className={styles.stationTargetValue}>1333.30</div>
                <div className={styles.stationTargetName}>{dateType === 'month' || dateType === 'year' ? '年' : '月'}实际发电量 万kWh</div>
              </div>
              <div className={styles.stationTargetData}>
                <div className={styles.stationTargetValue}>1333.30</div>
                <div className={styles.stationTargetName}>{dateType === 'month' || dateType === 'year' ? '年' : '月'}计划发电量 万kWh</div>
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
                <BarGraph
                  graphId={'power'}
                  yAxisName={'发电量 (万kWh)'}
                  xAxisName={'发电量'}
                  title={dateType==='year'?'发电量环比':'发电量同比'}
                  dateType={dateType} />
                <TableGraph />
              </div>
            </div>


            {dateType === 'month' || dateType === 'year' ? <div className={styles.tabContainer}>
              <div className={styles.dataGraph}>
                <ThreeYaxis
                  graphId={'productionPlanCompleteRate'}
                  // dateType={dateType}
                  title="计划完成率"
                />
                <TableGraph />
              </div>
            </div> : ''}

            <div className={styles.tabContainer}>
              <div className={styles.dataGraphs}>
                <BarGraph 
                graphId={'buyPower'} 
                yAxisName={'购网电量 (万kWh)'} 
                xAxisName={'购网电量'} 
                dateType={dateType} 
                title={dateType==='year'?'购网电量环比':'购网电量同比'}
                />
                <BarGraph graphId={'savePower'} yAxisName={'上网电量 (万kWh)'} xAxisName={'上网电量'} dateType={dateType}            title={dateType==='year'?'上网电量环比':'上网电量同比'}
                />
              </div>
            </div>

          </div>
        </div>

      </div>
    );
  }
}
export default (ProductionAnalysis);