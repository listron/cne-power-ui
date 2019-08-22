import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Radio, DatePicker, Button, Input, message } from 'antd';
import moment from 'moment';
import styles from './dailyQuery.scss';
import StationSelect from '../../../Common/StationSelect';
import AutoSelect from '../../../Common/AutoSelect';

const { RangePicker } = DatePicker;

class DailySearch extends Component {
  static propTypes = {
    stations: PropTypes.array,
    quotaData: PropTypes.array,
    faultData: PropTypes.array,
    stationTypeCount: PropTypes.string,
    tableType: PropTypes.string,
    stationType: PropTypes.number,
    objectType: PropTypes.number,
    queryParam: PropTypes.object,
    listParam: PropTypes.object,
    changeDailyQueryStore: PropTypes.func,
    getQuota: PropTypes.func,
    getQuotaList: PropTypes.func,
    getFaultList: PropTypes.func,
    getFault: PropTypes.func,
    getLimitList: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      stationCodes: [], // 选中的电站
      selectStations: [],
      keyWord: '', // 故障信息 - 关键字
      powerInformation: '', // 限电原因
      quotaInfoData: [], // 关键指标的codes
      faultIds: [], // 故障信息的Ids
      dateValue: [],
    };
  }

  componentDidMount(){
    const { getQuota, getFault, stationType, objectType } = this.props;
    getQuota({ // 请求指标树
      stationType,
    });
    getFault({ // 请求故障类型树
      stationType,
      objectType,
    });
  }

  onStationTypeChange = (stationType) => { // 切换风/光tab页
    const { changeDailyQueryStore, getQuota, getFault, objectType, queryParam } = this.props;
    this.setState({
      stationCodes: [],
      selectStations: [],
      keyWord: '',
      powerInformation: '',
      quotaInfoData: [],
      faultIds: [],
      dateValue: [],
    });

    changeDailyQueryStore({
      stationType,
      keyWord: '',
      powerInformation: '',
      queryParam: {
        ...queryParam,
        stationCodes: [],
      },
      quotaListData: {},
      faultListData: {},
      limitListData: {},
    });

    getQuota({ // 请求指标树
      stationType,
    });

    getFault({ // 请求故障类型树
      stationType,
      objectType,
    });
  }

  checkWind = () => this.onStationTypeChange(0); // 选中风电站
  checkPv = () => this.onStationTypeChange(1); // 选中光伏电站

  onCategory = (e) => { // 切换查询类别
    const { changeDailyQueryStore, queryParam, listParam } = this.props;
    const tableType = e.target.value;
    changeDailyQueryStore({
      tableType,
      keyWord: '',
      powerInformation: '',
      queryParam: {
        ...queryParam,
        stationCodes: [],
      },
      listParam:{
        ...listParam,
        pageNum: 1,
        pageSize: 10,
      },
      quotaListData: {},
      faultListData: {},
      limitListData: {},
      quotaInfoData: [],
    });
    this.setState({
      stationCodes: [],
      selectStations: [],
      keyWord: '',
      powerInformation: '',
      quotaInfoData: [],
      faultIds: [],
      dateValue: [],
    });
  }

  selectStation = (selectedStationInfo) => { // 选择电站
    const stationCodes = selectedStationInfo.map(cur => {
      return cur.stationCode;
    });
    this.setState({
      stationCodes,
      selectStations: selectedStationInfo,
    });
  }

  onQuotaChange = (quota) => { // 关键指标 - 选择指标
    this.setState({
      quotaInfoData: quota,
    });
  }

  onfaultChange =(fault) => { // 故障信息 - 类型
    const faultIds = fault.map(e => {
      return e.value;
    });
    this.setState({
      faultIds,
    });
  }

  onKeyword = (e) => { // 故障信息 - 关键字
    this.setState({
      keyWord: e.target.value,
    });
    const { changeDailyQueryStore } = this.props;
    changeDailyQueryStore({
      keyWord: e.target.value,
    });
  }

  onPowerInformation = (e) => { // 限电信息 - 限电原因
    this.setState({
      powerInformation: e.target.value,
    });
    const { changeDailyQueryStore } = this.props;
    changeDailyQueryStore({
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
    this.setState({
      dateValue: time,
    });
  }

  onSearch = () => { // 查询
    const { tableType, queryParam, listParam, changeDailyQueryStore, getQuotaList, getFaultList, getLimitList } = this.props;
    const { stationCodes, quotaInfoData, faultIds, keyWord } = this.state;
    const { startDate, endDate } = queryParam;
    const { pageNum, pageSize } = listParam;
    if (stationCodes.length === 0) {
      message.warning('请选择电站名称！');
      return;
    }
    if (!startDate) {
      message.warning('请选择时间！');
      return;
    }
    changeDailyQueryStore({
      queryParam: {
        ...queryParam,
        stationCodes,
        startDate,
        endDate,
      },
      listParam: {
        ...listParam,
        pageNum,
        pageSize,
      },
      quotaInfoData,
      faultIds,
    });

    const indexCodes = quotaInfoData.map(e => {
      return e.value;
    });

    tableType === 'quotaList' && getQuotaList({ stationCodes, startDate, endDate, pageNum, pageSize, indexCodes });
    tableType === 'faultList' && getFaultList({ stationCodes, startDate, endDate, pageNum, pageSize, faultIds, keyWord });
    tableType === 'limitList' && getLimitList({ stationCodes, startDate, endDate, pageNum, pageSize, keyWord });
  }

  onReset = () => { // 重置
    this.setState({
      stationCodes: [],
      selectStations: [],
      keyWord: '',
      powerInformation: '',
      quotaInfoData: [],
      faultIds: [],
      dateValue: [],
    });
  }

  render(){
    const { stationTypeCount, stationType, stations, tableType, quotaData, faultData } = this.props;
    const { keyWord, powerInformation, quotaInfoData, faultIds, selectStations, dateValue } = this.state;
    const quotaCode = quotaInfoData.map(e => {
      return e.value;
    });
    const searchInfo = !!keyWord || !!powerInformation || faultIds.length !== 0 || quotaInfoData.length !== 0 || selectStations.length !== 0 || dateValue.length !== 0;
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
                value={selectStations}
                disabledStation={stations.filter(e => e.isConnected === 0).map(e => e.stationCode)}
                multiple={true}
                stationShowNumber={true}
              />
            </div>

            {
              tableType === 'quotaList' &&
              <div className={styles.quotaSelect}>
                <span className={styles.text}>选择指标</span>
                <AutoSelect
                  style={{width: '150px'}}
                  holderText="请选择"
                  data={quotaData}
                  value={quotaCode}
                  maxTagCount={0}
                  multiple={true}
                  onChange={this.onQuotaChange}
                />
              </div>
            }

            {
              tableType === 'faultList' &&
              <div className={styles.faultInformation}>
                <div className={styles.lossElectric}>
                  <span className={styles.text}>类型</span>
                  <AutoSelect
                    style={{width: '150px'}}
                    holderText="请选择"
                    data={faultData}
                    value={faultIds}
                    maxTagCount={0}
                    multiple={true}
                    onChange={this.onfaultChange}
                  />
                </div>
                <div className={styles.keyWord}>
                  <span className={styles.text}>关键字</span>
                  <Input className={styles.defectDescription} value={keyWord} placeholder="请输入故障原因和故障处理进展关键字" onChange= {this.onKeyword} />
                </div>
              </div>
            }

            {
              tableType === 'limitList' &&
              <div className={styles.powerInformation}>
                <span className={styles.text}>限电原因</span>
                <Input className={styles.defectDescription} value={powerInformation} placeholder="请输入限电原因关键字" onChange= {this.onPowerInformation} />
              </div>
            }

            <div className={styles.timeSelect}>
              <span className={styles.text}>时间</span>
              <RangePicker format="YYYY-MM-DD" onChange={this.timeChange} value={dateValue} />
            </div>

            <Button className={styles.search} onClick={this.onSearch}>查询</Button>
            {searchInfo && <span className={styles.reset} onClick={this.onReset}>重置</span>}
          </div>
        </div>
      </div>
    );
  }
}

export default DailySearch;
