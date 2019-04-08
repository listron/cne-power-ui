import React,{ Component } from "react";
import PropTypes from 'prop-types';
import styles from './intelligentAnalysis.scss';
import TimeSelect from '../../../Common/TimeSelect/TimeSelectIndex';
import moment from 'moment';
import { Button, Select } from 'antd';

const Option = Select.Option;

class RegionStation extends Component{

  static propTypes = {
    
  };

  constructor(props){
    super(props);
  }

  onTimeChange = () => { // 选择时间

  }

  onRegionChange = () => { // 选择区域

  }

  searchInfo = () => { // 查询

  }

  exportReport = () => { // 下载

  }

  render(){
    const {  } = this.props;
    console.log()

    return(
      <div className={styles.regionStation}>
        <div className={styles.searchPart}>
          <div className={styles.leftLayout}>
            <div className={styles.regionStationSelect}>
              <span className={styles.text}>区域选择</span>
              {/* <Select 
              className={styles.searchInput} 
              placeholder="请输入..." 
              onChange={this.onRegionChange}>
                <Option>123</Option>
              </Select> */}
            </div>
            <div className={styles.dateSelect}>
              <span className={styles.text}>统计时间</span>
              <TimeSelect
                showYearPick={false} // 不包括'多年'选项
                onChange={this.onTimeChange}
                timerText={''}
                value={{
                 timeStyle: 'month',
                 startTime: moment().subtract(1, 'day').format('YYYY-MM-DD'),
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

export default RegionStation;