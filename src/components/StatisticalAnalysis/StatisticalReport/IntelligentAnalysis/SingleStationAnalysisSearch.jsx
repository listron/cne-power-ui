import React,{ Component } from "react";
import PropTypes from 'prop-types';
import path from '../../../../constants/path';
import styles from './intelligentAnalysis.scss';
import StationSelect from '../../../Common/StationSelect';
import TimeSelect from '../../../Common/TimeSelect/TimeSelectIndex';
import moment from 'moment';
import { Button, message } from 'antd';

const { APIBasePath } = path.basePaths;
const { statisticalAnalysis } = path.APISubPaths;

class SingleStationAnalysisSearch extends Component{

  static propTypes = {
    stations: PropTypes.array,
    stationName:PropTypes.string,
    stationCode: PropTypes.number,
    changeIntelligentAnalysisStore: PropTypes.func,
    getSingleStationAnalysis: PropTypes.func,
    dateType: PropTypes.number,
    month: PropTypes.string,
    year: PropTypes.string,
    downLoadFile: PropTypes.func,
    startTime: PropTypes.string,
    reportShow: PropTypes.bool,
  };

  constructor(props){
    super(props);
    this.state = {
      startTime: moment().subtract(0, 'months').format('YYYY-MM-DD'),
      stationCode: '',
      stationName: '',
      year:'',
      month:'', 
      dateType:'',
    }
  }

  onTimeChange = (value) => { // 选择时间
    const { startTime, timeStyle } = value;
    this.props.changeIntelligentAnalysisStore({startTime});
    let dateType = timeStyle === 'month' ? 2 : 1;
    if(timeStyle === 'month'){
      this.setState({
        dateType: 2,
        year : moment(startTime).format('YYYY'),
      })
    }else if(timeStyle === 'day'){
      this.setState({
        dateType: 1,
        year: moment(startTime).format('YYYY'),
        month: moment(startTime).format('M'),
      })
    }
  }

  selectStation = (selectedStationInfo) => { // 选择电站
    this.setState({
      stationCode: selectedStationInfo[0].stationCode,
      stationName: selectedStationInfo[0].stationName,
    })
  }
  
  searchInfo = () => { // 查询
    const { getSingleStationAnalysis, changeIntelligentAnalysisStore } = this.props;
    const { dateType, month, year, stationCode, stationName } = this.state;
    if (!stationCode) {
      message.error("请选择电站名称！");
      return;
    }
    if (!moment(year).isValid()) {
      message.error("请选择统计时间！");
      return;
    }
    const params = { dateType, year, stationCode, stationName };
    dateType === 1 && (params.month = month);
    getSingleStationAnalysis({
      ...params
    });
    changeIntelligentAnalysisStore({
      ...params
    })
  }

  exportReport = () => { // 下载
    const { downLoadFile, stationCode, dateType, year, month } = this.props;
    const url = `${APIBasePath}${statisticalAnalysis.exportIntelligent}`;
    downLoadFile({ 
      url,
      fileName: ``,
      params: {
        stationCode,
        dateType, 
        year, 
        month
      },
    })
  }

  render(){
    const { stations, reportShow} = this.props;
    const { stationCode } = this.state;
    return(
      <div className={styles.singleStationAnalysisSearch}>
        <div className={styles.searchPart}>
          <div className={styles.leftLayout}>
            <div className={styles.stationSelect}>
              <span className={styles.text}>电站选择</span>
              <StationSelect 
                holderText={'请输入关键字快速查询'}
                data={stations.filter(e => e.stationType === 1)}
                onOK={this.selectStation}
                value={stationCode}
              />
            </div>
            <div className={styles.dateSelect}>
              <span className={styles.text}>统计时间</span>
              <TimeSelect
               showYearPick={false}
               onChange={this.onTimeChange}
               timerText={''}
               refuseDefault={true}
               value={{
                timeStyle: 'day',
                startTime: null,
               }}
              />
            </div>
            <Button className={styles.searchInfo} onClick={this.searchInfo}>查询</Button>
          </div>
            <Button className={styles.exportReport} onClick={this.exportReport} icon="download" disabled={!reportShow}>下载报告</Button>
        </div>
      </div>
    )
  }
}

export default SingleStationAnalysisSearch;