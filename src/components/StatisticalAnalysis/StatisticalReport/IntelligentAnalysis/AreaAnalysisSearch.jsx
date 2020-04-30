import React,{ Component } from 'react';
import PropTypes from 'prop-types';
import path from '../../../../constants/path';
import styles from './intelligentAnalysis.scss';
import TimeSelect from '../../../Common/TimeSelect/TimeSelectIndex';
import moment from 'moment';
import CneButton from '@components/Common/Power/CneButton';
import { message } from 'antd';

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
      startTime: moment().subtract(1, 'months').format('YYYY-MM-DD'),
      year: '',
      month: '',
      dateType: '',
    };
  }

  componentDidMount(){
    this.getStationData(this.props);
  }

  getStationData = (props) => {
    const { dateType, changeIntelligentAnalysisStore, getArea } = props;
    const { startTime } = this.state;
    const prams = {
      dateType,
      month: moment(startTime).format('M'),
      year: moment(startTime).format('YYYY'),
    };
    this.setState({
      ...prams,
    });
    changeIntelligentAnalysisStore({
      ...prams,
      dateType: 1,
    });
    getArea({
      dateType: 1,
      month: moment(startTime).format('M'),
      year: moment(startTime).format('YYYY'),
    });
  }

  onTimeChange = (value) => { // 选择时间
    const { changeIntelligentAnalysisStore } = this.props;
    const { startTime, timeStyle } = value;
    changeIntelligentAnalysisStore({ startTime });
    if(timeStyle === 'month'){
      this.setState({
        dateType: 2,
        year: moment(startTime).format('YYYY'),
      });
    }else if(timeStyle === 'day'){
      this.setState({
        dateType: 1,
        year: moment(startTime).format('YYYY'),
        month: moment(startTime).format('M'),
      });
    }
  }

  searchInfo = () => { // 查询
    const { getArea, changeIntelligentAnalysisStore } = this.props;
    const { year, month, dateType } = this.state;
    if (!moment(year).isValid()) {
      message.error('请选择统计时间！');
      return;
    }
    const params = { year, dateType };
    dateType === 1 && (params.month = month);
    getArea({
      ...params,
    });
    changeIntelligentAnalysisStore({
      ...params,
    });
  }

  exportReport = () => { // 下载
    const { downLoadFile, dateType, year, month } = this.props;
    const url = `${APIBasePath}${statisticalAnalysis.exportAreaCompare}`;
    downLoadFile({ 
      url,
      fileName: `区域对比分析报告`,
      params: {
        dateType, year, month,
      },
    });
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
                refuseDefault={true}
                value={{
                 timeStyle: 'day',
                 startTime: moment().subtract(1, 'months').format('YYYY-MM-DD'),
                 endTime: moment().subtract(1, 'months').format('YYYY-MM-DD'),
                }}
              />
            </div>
            <CneButton lengthMode="short" className={styles.searchInfo} onClick={this.searchInfo}>查询</CneButton>
          </div>
            <CneButton lengthMode="short" className={styles.exportReport} onClick={this.exportReport} antdIcon="download" disabled={!reportShow}>下载报告</CneButton>
        </div>
      </div>
    )
  }
}

export default AreaAnalysisSearch;