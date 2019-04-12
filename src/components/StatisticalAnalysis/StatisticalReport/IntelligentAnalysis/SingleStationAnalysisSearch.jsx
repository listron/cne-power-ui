import React,{ Component } from "react";
import PropTypes from 'prop-types';
import styles from './intelligentAnalysis.scss';
import StationSelect from '../../../Common/StationSelect';
import TimeSelect from '../../../Common/TimeSelect/TimeSelectIndex';
import moment from 'moment';
import { Button } from 'antd';


class SingleStationAnalysisSearch extends Component{

  static propTypes = {
    stations: PropTypes.array,
    stationName:PropTypes.string,
    stationCode: PropTypes.number,
    changeIntelligentAnalysisStore: PropTypes.func,
    getSingleStationAnalysis: PropTypes.func,
    dataType: PropTypes.string,
    monthTime: PropTypes.string,
    yearTime: PropTypes.string,
    genValid: PropTypes.string,
    generatinCapacity: PropTypes.object,
    systematicStatistics: PropTypes.object,
    completionRate: PropTypes.object,
    lossOfElectricity: PropTypes.object,
    month: PropTypes.string,
    year: PropTypes.string,
  };

  constructor(props){
    super(props);
    this.state = {
      isShow: false ,
      startTime: moment().subtract(0, 'months').format('YYYY-MM-DD'),
      dataType: 'day',
      month: '',
      year: '',
      stationCode: null,
      stationName: null,
    }
  }

  onTimeChange = (value) => { // 选择时间
    const { changeIntelligentAnalysisStore } = this.props;
    const { startTime, timeStyle } = value;
    // console.log("111111",startTime,value);

    let dateType = timeStyle === 'month' ? 2 : 1;
    if(timeStyle === 'month'){
      let year=startTime;
      changeIntelligentAnalysisStore({dateType,year})
    }
    if(timeStyle === 'day'){
      let year=moment(startTime).format('YYYY');
      let month=moment(startTime).format('MM');
    
      changeIntelligentAnalysisStore({
        dateType,
        month,
        year,
      })
    }
  
    // this.setState({
    //   startTime: '',
    //   dataType: '',
    //   month: '',
    //   year: '',
    // })
    // changeIntelligentAnalysisStore({
    //   startTime,
    //   dataType,
    //   month: startTime.format('MM'),
    //   year: startTime.format('YYYY')
    // })
  }

  selectStation = (selectedStationInfo) => { // 选择电站
    const { changeIntelligentAnalysisStore } = this.props;
    const { stationName, stationCode } = selectedStationInfo[0];
    changeIntelligentAnalysisStore({
      stationCode,
      stationName
    })
    // this.setState({
    //   stationCode,
    //   stationName
    // })
  }
  
  searchInfo = () => { // 查询
    const {  dateType, month, year,stationCode } = this.props;
    const params = { dateType, month, year, stationCode};
    const { getSingleStationAnalysis } = this.props;
    getSingleStationAnalysis({
      ...params
    });
  }

  exportReport = () => { // 下载

  }

  render(){
    const { stations } = this.props;
    const { startTime, dataType, stationCode } = this.state;
    return(
      <div className={styles.SingleStationAnalysisSearch}>
        <div className={styles.searchPart}>
          <div className={styles.leftLayout}>
            <div className={styles.stationSelect}>
              <span className={styles.text}>电站选择</span>
              <StationSelect 
                holderText={'请输入关键字快速查询'}
                data={stations}
                onOK={this.selectStation}
                value={stationCode}
                // disabledStation={stations.filter(e => e.isConnected === 0).map(e => e.stationCode)} // 未接入电站不可选
              />
            </div>
            <div className={styles.dateSelect}>
              <span className={styles.text}>统计时间</span>
              <TimeSelect
                showYearPick={false}
                onChange={this.onTimeChange}
                timerText={''}
                value={{
                 timeStyle: dataType,
                 startTime,
                }}
              />
            </div>
            <Button className={styles.searchInfo} onClick={this.searchInfo}>查询</Button>
          </div>
            <Button className={styles.exportReport} onClick={this.exportReport} icon="download">下载报告</Button>
        </div>
      </div>
    )
  }
}

export default SingleStationAnalysisSearch;