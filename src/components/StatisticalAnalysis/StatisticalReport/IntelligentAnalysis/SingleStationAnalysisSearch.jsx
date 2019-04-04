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
    stationCode: PropTypes.string,
  };

  constructor(props){
    super(props);
  }

  onTimeChange = () => { // 选择时间

  }

  selectStation = () => { // 选择电站

  }

  searchInfo = () => { // 查询

  }

  exportReport = () => { // 下载

  }

  render(){
    const { stationCode, stations } = this.props;
    console.log(stationCode)

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

export default SingleStationAnalysisSearch;