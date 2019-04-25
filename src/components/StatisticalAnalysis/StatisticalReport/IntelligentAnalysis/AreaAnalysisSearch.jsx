import React,{ Component } from "react";
import PropTypes from 'prop-types';
import path from '../../../../constants/path';
import styles from './intelligentAnalysis.scss';
import TimeSelect from '../../../Common/TimeSelect/TimeSelectIndex';
import moment from 'moment';
import { Button, message } from 'antd';

const { APIBasePath } = path.basePaths;
const { statisticalAnalysis } = path.APISubPaths;

class AreaAnalysisSearch extends Component{

  static propTypes = {
    changeIntelligentAnalysisStore: PropTypes.func,
    getArea: PropTypes.func,
    dateType: PropTypes.number,
    month: PropTypes.string,
    year: PropTypes.string,
    reportShow: PropTypes.bool,
    downLoadFile: PropTypes.func,
  };

  constructor(props){
    super(props);
    this.state = {
      year:'',
      month:'', 
      dateType:'',
      startTime: moment().subtract(0, 'months').format('YYYY-MM-DD'),
    }
  }

  onTimeChange = (value) => { // 选择时间
    const { startTime, timeStyle } = value;
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
        month: moment(startTime).format('MM'),
      })
    }
  }
  
  searchInfo = () => { // 查询
    const { getArea, changeIntelligentAnalysisStore } = this.props;
    const { year, month, dateType } = this.state;
    if (!moment(month).isValid() && !moment(year).isValid()) {
      message.error("请选择统计时间！");
      return;
    }
    const params = { year, dateType };
    dateType === 1 && (params.month = month);
    getArea({
      ...params
    });
    changeIntelligentAnalysisStore({
      ...params
    });
  }

  exportReport = () => { // 下载
    const { downLoadFile, dateType, year, month } = this.props;
    const url = `${APIBasePath}${statisticalAnalysis.exportAreaCompare}`;
    downLoadFile({ 
      url,
      fileName: `区域对比分析报告`,
      params: {
        dateType, year, month
      },
    })
  }

  render(){
    const { reportShow } = this.props;

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
                needDefault={false}
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

export default AreaAnalysisSearch;