import React,{ Component } from "react";
import PropTypes from 'prop-types';
import styles from './intelligentAnalysis.scss';
import TimeSelect from '../../../Common/TimeSelect/TimeSelectIndex';
import moment from 'moment';
import { Button, Select } from 'antd';

const Option = Select.Option;

class AreaStationSearch extends Component{

  static propTypes = {
    stations: PropTypes.array,
    regionName: PropTypes.string,
    startTime: PropTypes.string,
    changeIntelligentAnalysisStore: PropTypes.func,
    getAreaStation: PropTypes.func,
    downLoadFile: PropTypes.func,
    reportShow: PropTypes.bool,
  };

  constructor(props){
    super(props);
  }

  onTimeChange = (value) => { // 选择时间
    const { startTime, timeStyle } = value;
    const { changeIntelligentAnalysisStore } = this.props;

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
  }

  selectArea = ( regionName ) => { // 选择区域
    const { changeIntelligentAnalysisStore } = this.props;
    changeIntelligentAnalysisStore({
      regionName,
    })
  }

  searchInfo = () => { // 查询
    const { getAreaStation, regionName, year, month, dateType } = this.props;
    const params = { regionName, year, month, dateType };
    getAreaStation({
      ...params
    })
  }

  exportReport = () => { // 下载
    const { downLoadFile, stationCode, dateType, year, month } = this.props;
    const url = `${APIBasePath}${statisticalAnalysis.exportIntelligent}`;

    downLoadFile({ 
      url,
      fileName: `同区域电站对比报告`,
      params: {
        stationCode, dateType, year, month
      },
    })
  }

  render(){
    const { stations, regionName, reportShow } = this.props;
    let regionSet = new Set();
    stations.forEach(e => {
      e.regionName && regionSet.add(e.regionName);
    });
    return(
      <div className={styles.areaStationSearch}>
        <div className={styles.searchPart}>
          <div className={styles.leftLayout}>
            <div className={styles.regionStationSelect}>
              <span className={styles.text}>区域选择</span>
              <Select 
                className={styles.searchInput} 
                placeholder="请选择" 
                value={ regionName }
                onChange={this.selectArea}>
                  <Option value={null}>全部</Option>
                    {[...regionSet].map(e=>(
                      <Option value={e} key={e}>{e}</Option>
                    ))}
              </Select>
            </div>
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
            <Button className={styles.exportReport} onClick={this.exportReport} icon="download" disabled={reportShow === false}>下载报告</Button>
        </div>
      </div>
    )
  }
}

export default AreaStationSearch;