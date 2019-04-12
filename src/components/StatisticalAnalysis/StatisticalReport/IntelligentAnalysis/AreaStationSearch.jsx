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
  };

  constructor(props){
    super(props);
  }

  onTimeChange = () => { // 选择时间

  }

  onAreaChange = ( value ) => { // 选择区域
    const { changeIntelligentAnalysisStore, regionName } = this.props;
    changeIntelligentAnalysisStore({
      regionName: value,
    })
    console.log(value)
  }

  searchInfo = () => { // 查询
    const { getAreaStation, regionName, startTime, areaPartABean, areaPartBBean, areaPartCBean, areaPartDBean } = this.props;
    getAreaStation({
      areaPartABean,
      areaPartBBean,
      areaPartCBean,
      areaPartDBean,
    })
  }

  exportReport = () => { // 下载

  }

  render(){
    const { startTime, stations, regionName } = this.props;
    let regionSet = new Set();
    stations.forEach(e=>{
      e.regionName && regionSet.add(e.regionName);
    });
    // console.log(regionSet)
    // console.log(regionName)
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
              onChange={this.onAreaChange}>
                <Option value={null}>全部</Option>
                  {[...regionSet].map(e=>(
                    <Option value={e} key={e}>{e}</Option>
                  ))}
              </Select>
            </div>
            <div className={styles.dateSelect}>
              <span className={styles.text}>统计时间</span>
              <TimeSelect
                showYearPick={false} // 不包括'多年'选项
                onChange={this.onTimeChange}
                timerText={''}
                value={{
                 timeStyle: 'day',
                 startTime: moment().subtract(0, 'months').format('YYYY-MM-DD'),
                 endTime: moment().subtract(1, 'day').format('YYYY-MM-DD')
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

export default AreaStationSearch;