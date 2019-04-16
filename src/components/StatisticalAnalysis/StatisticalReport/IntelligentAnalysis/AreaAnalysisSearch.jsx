import React,{ Component } from "react";
import PropTypes from 'prop-types';
import path from '../../../../constants/path';
import styles from './intelligentAnalysis.scss';
import TimeSelect from '../../../Common/TimeSelect/TimeSelectIndex';
import moment from 'moment';
import { Button } from 'antd';

const { APIBasePath } = path.basePaths;
const { statisticalAnalysis } = path.APISubPaths;

class AreaAnalysisSearch extends Component{

  static propTypes = {
    stations: PropTypes.array,
    changeIntelligentAnalysisStore: PropTypes.func,
    getSingleStationAnalysis: PropTypes.func,
    dateType: PropTypes.number,
    month: PropTypes.string,
    year: PropTypes.string,
    reportShow: PropTypes.bool,
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
  
  searchInfo = () => { // 查询
    const { getSingleStationAnalysis, dateType, month, year } = this.props;
    const params = { dateType, month, year };

    getSingleStationAnalysis({
      ...params
    });
  }

  exportReport = () => { // 下载
    const { downLoadFile, dateType, year, month } = this.props;
    const url = `${APIBasePath}${statisticalAnalysis.exportIntelligent}`;
    downLoadFile({ 
      url,
      fileName: `区域对比分析报告`,
      params: {
        dateType, year, month
      },
    })
  }

  render(){
    return(
      <div className={styles.areaAnalysisSearch}>
        <div className={styles.searchPart}>
          <div className={styles.leftLayout}>
            <div className={styles.dateSelect}>
              <span className={styles.text}>统计时间</span>
              <TimeSelect
                showYearPick={false}
                onChange={this.onTimeChange}
                timerText={''}
                value={{
                 timeStyle: 'day',
                 startTime: moment().subtract(0, 'months').format('YYYY-MM-DD'),
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

export default AreaAnalysisSearch;