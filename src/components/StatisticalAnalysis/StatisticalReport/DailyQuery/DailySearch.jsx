import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Radio, DatePicker, Button, Input } from 'antd';
import moment from 'moment';
import styles from './dailyQuery.scss';
import StationSelect from '../../../Common/StationSelect';
import AutoSelect from '../../../Common/AutoSelect';

const { RangePicker } = DatePicker;

class DailySearch extends Component {
  static propTypes = {
    stations: PropTypes.array,
    quotaData: PropTypes.array,
    stationTypeCount: PropTypes.string,
    tableType: PropTypes.string,
    stationType: PropTypes.number,
    queryParam: PropTypes.object,
    changeDailyQueryStore: PropTypes.func,
    getQuota: PropTypes.func,
    getQuotaList: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      stationCodes: [], // 选中的电站
      keyword: '', // 故障信息 - 关键字
      powerInformation: '', // 限电原因
      indexCodes: [], // 关键指标的codes
    };
  }

  componentDidMount(){
    const { getQuota, stationType } = this.props;
    getQuota({ // 请求指标树
      stationType,
    });
  }

  onStationTypeChange = (stationType) => { // 切换风/光tab页
    const { changeDailyQueryStore } = this.props;
    changeDailyQueryStore({
      stationType,
    });
  }

  checkWind = () => this.onStationTypeChange(0); // 选中风电站
  checkPv = () => this.onStationTypeChange(1); // 选中光伏电站

  onCategory = (e) => { // 切换查询类别
    const { changeDailyQueryStore } = this.props;
    const tableType = e.target.value;
    changeDailyQueryStore({
      tableType,
    });
  }

  selectStation = (selectedStationInfo) => { // 选择电站
    const stationCodes = selectedStationInfo.map(cur => {
      return cur.stationCode;
    });
    console.log('stationCodes: ', stationCodes);

    this.setState({
      stationCodes: stationCodes,
    });
  }

  onQuotaChange = (quota) => { // 关键指标 - 选择指标
    const indexCodes = quota.map(e=>{
      return e.value;
    });
    this.setState({
      indexCodes,
    });
  }

  onfaultChange =() => { // 故障信息 - 类型

  }

  onKeyword = (e) => { // 故障信息 - 关键字
    this.setState({
      keyword: e.target.value,
    });
  }

  onPowerInformation = (e) => { // 限电信息 - 限电原因
    this.setState({
      powerInformation: e.target.value,
    });
  }

  timeChange = (time) => { // 选择时间
    const { changeDailyQueryStore, queryParam } = this.props;
    const timeLength = time.length > 0;
    let startDate = timeLength ? moment(time[0]).startOf('day').format('YYYY-MM-DD') : null;
    let endDate = timeLength ? moment(time[1]).startOf('day').format('YYYY-MM-DD') : null;
    const isToday = moment(endDate).isSame(moment(), 'd');
    isToday ? endDate = moment().format('YYYY-MM-DD') : endDate;
    changeDailyQueryStore({
      queryParam: {
        ...queryParam,
        startDate,
        endDate,
      },
    });
  }

  onSearch = () => { // 查询
    const { queryParam, getQuotaList } = this.props;
    const { stationCodes, indexCodes } = this.state;
    getQuotaList({
      queryParam: {
        ...queryParam,
        stationCodes,
      },
      indexCodes,

    });
  }

  onReset = () => { // 重置
    const { changeDailyQueryStore, queryParam } = this.props;
    changeDailyQueryStore({
      queryParam: {
        ...queryParam,
        startDate: null,
        endDate: null,
      },
    });
  }

  render(){
    const { stationTypeCount, stationType, stations, queryParam, tableType, quotaData } = this.props;
    const { list } = quotaData;
    console.log('quotaData',quotaData)
    const { stationCodes } = queryParam;
    const { keyword, powerInformation } = this.state;

    return(
      <div className={styles.dailySearch}>
        {stationTypeCount === 'multiple' && <div className={styles.typeCheck}>
          <div className={stationType === 0 ? styles.typeActive: styles.typeNormal} onClick={this.checkWind}>风电</div>
          <div className={stationType === 1 ? styles.typeActive: styles.typeNormal} onClick={this.checkPv}>光伏</div>
          <div className={styles.holder} />
        </div>}
        <div className={styles.searchPart}>
          <div className={styles.category}>
            <span className={styles.text}>查询类别</span>
            <Radio.Group defaultValue="quotaList" buttonStyle="solid" onChange={this.onCategory}>
              <Radio.Button value="quotaList">关键指标</Radio.Button>
              <Radio.Button value="faultList">故障信息</Radio.Button>
              <Radio.Button value="limitList">限电信息</Radio.Button>
            </Radio.Group>
          </div>

          <div className={styles.searchChange}>
            <div className={styles.stationSelect}>
              <span className={styles.text}>电站名称</span>
              <StationSelect
                data={typeof(stationType) === 'number' ? stations.filter(e => e.stationType === stationType) : stations}
                onOK={this.selectStation}
                value={stations.filter(e => e.stationCode === stationCodes)}
                disabledStation={stations.filter(e => e.isConnected === 0).map(e => e.stationCode)}
                multiple={true}
                stationShowNumber={true}
              />
            </div>

            {
              tableType === 'quotaList' &&
              <div className={styles.quotaSelect}>
                <span className={styles.text}>选择指标</span> {/* 关键指标页面的搜索框 */}
                <AutoSelect
                  style={{width: '150px'}}
                  holderText="请选择"
                  data={quotaData}
                  // value={list}
                  maxTagCount={0}
                  multiple={true}
                  onChange={this.onQuotaChange}
                />
              </div>
            }

            {
              tableType === 'faultList' &&
              <div className={styles.faultInformation}> {/* 故障信息页面的搜索框 */}
                <div className={styles.lossElectric}>
                  <span className={styles.text}>类型</span>
                  {/* <AutoSelect
                    style={{width: '150px'}}
                    holderText="请选择"
                    data={quotaInfo}
                    value={quotas}
                    maxTagCount={0}
                    multiple={true}
                    onChange={this.onfaultChange}
                  /> */}
                </div>
                <div className={styles.keyword}>
                  <span className={styles.text}>关键字</span>
                  <Input className={styles.defectDescription} value={keyword} placeholder="请输入故障原因和故障处理进展关键字" onChange= {this.onKeyword} />
                </div>
              </div>
            }
            {
              tableType === 'limitList' &&
              <div className={styles.powerInformation}> {/* 限电信息页面的搜索框 */}
                <span className={styles.text}>限电原因</span>
                <Input className={styles.defectDescription} value={powerInformation} placeholder="请输入限电原因关键字" onChange= {this.onPowerInformation} />
              </div>
            }
            <div className={styles.timeSelect}>
              <span className={styles.text}>时间</span>
              <RangePicker format="YYYY-MM-DD" onChange={this.timeChange} />
            </div>

            <Button className={styles.search} onClick={this.onSearch}>查询</Button>
            <span className={styles.reset} onClick={this.onReset}>重置</span>
          </div>
        </div>
      </div>
    );
  }
}

export default DailySearch;
