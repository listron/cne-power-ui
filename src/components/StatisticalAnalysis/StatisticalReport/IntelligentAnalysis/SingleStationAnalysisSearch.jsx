import React,{ Component } from "react";
import PropTypes from 'prop-types';
import path from '../../../../constants/path';
import styles from './intelligentAnalysis.scss';
import StationSelect from '../../../Common/StationSelect';
import TimeSelect from '../../../Common/TimeSelect/TimeSelectIndex';
import moment from 'moment';
import { Button } from 'antd';

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
  };

  constructor(props){
    super(props);
  }

  onTimeChange = (value) => { // 选择时间
    const { startTime, timeStyle } = value;
    const { changeIntelligentAnalysisStore } = this.props;

    let dateType = timeStyle === 'month' ? 2 : 1;
    if(timeStyle === 'month'){
      let year = startTime;
      changeIntelligentAnalysisStore({
        dateType,
        year
      })
    }else if(timeStyle === 'day'){
      let year = moment(startTime).format('YYYY');
      let month = moment(startTime).format('MM');
      changeIntelligentAnalysisStore({
        dateType,
        month,
        year,
      })
    }
  }

  selectStation = (selectedStationInfo) => { // 选择电站
    const { changeIntelligentAnalysisStore } = this.props;
    const { stationName, stationCode } = selectedStationInfo[0];
    changeIntelligentAnalysisStore({
      stationCode,
      stationName
    })
  }
  
  searchInfo = () => { // 查询
    const { getSingleStationAnalysis, dateType, month, year, stationCode } = this.props;
    const params = { dateType, month, year, stationCode };

    getSingleStationAnalysis({
      ...params
    });
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
    const { stations, stationCode, reportShow } = this.props;
    return(
      <div className={styles.singleStationAnalysisSearch}>
        <div className={styles.searchPart}>
          <div className={styles.leftLayout}>
            <div className={styles.stationSelect}>
              <span className={styles.text}>电站选择</span>
              <StationSelect 
                holderText={'请输入关键字快速查询'}
                data={stations}
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
                value={{
                 timeStyle: 'day',
                 startTime: moment().subtract(1, 'months').format('YYYY-MM-DD'),
                }}
              />
            </div>
            <Button className={styles.searchInfo} onClick={this.searchInfo}>查询</Button>
          </div>
            <Button className={styles.exportReport} onClick={this.exportReport} icon="download" disabled={reportShow === false}>下载报告</Button>
        </div>
      </div>
    )
  }
}

export default SingleStationAnalysisSearch;