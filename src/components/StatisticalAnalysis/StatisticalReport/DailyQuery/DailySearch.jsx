import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Radio, DatePicker, Input, message } from 'antd';
import moment from 'moment';
import styles from './dailyQuery.scss';
import StationSelect from '../../../Common/StationSelect';
import AutoSelect from '../../../Common/AutoSelect';
import CneButton from '@components/Common/Power/CneButton';

const { RangePicker } = DatePicker;

class DailySearch extends Component {
  static propTypes = {
    stations: PropTypes.array,
    quotaData: PropTypes.array,
    faultData: PropTypes.array,
    stationTypeCount: PropTypes.string,
    tableType: PropTypes.string,
    stationType: PropTypes.number,
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
    const { getQuota, getFault, stationType } = this.props;
    getQuota({ // 请求指标树
      stationType,
    });
    getFault({ // 请求故障类型树
      stationType,
    });
  }

  componentWillReceiveProps(nextProps){
    const { quotaData, faultData, queryParam } = nextProps;
    const preQueryParam = this.props.queryParam;

    if (JSON.stringify(preQueryParam.stationCodes) !== JSON.stringify(queryParam.stationCodes)) { // 当选择的电站前后不一致时，‘类型’和‘指标’就需要重新全部选中
      if(this.props.tableType === 'quotaList'){
        const quotaInfoData = this.getAllQuotaCode(quotaData);
        this.setState({
          quotaInfoData,
        });
      }
      if(this.props.tableType === 'faultList'){
        const faultIds = this.getAllfaultId(faultData);
        this.setState({
          faultIds,
        });
      }
    }
  }

  getAllQuotaCode(quotas = []){ // 选中全部指标
    const codes = [];
    quotas.forEach(e => {
      const {children = []} = e || {};
      codes.push(e);
      children.forEach(m => {
        codes.push(m);
      });
    });
    return codes;
  }

  getAllfaultId(faults = []){ // 选中全部故障信息类型
    const codes = [];
    faults.forEach(e => {
      const {children = []} = e || {};
      codes.push(e);
      if (children) {
        children.forEach(m => {
          const {children = []} = m || {};
          codes.push(m);
          if (children) { // 故障类型的层级是三层
            children.forEach(n => {
              codes.push(n);
            });
          }
        });
      }
    });
    return codes;
  }

  onStationTypeChange = (stationType) => { // 切换风/光tab页
    const { changeDailyQueryStore, getQuota, getFault, queryParam } = this.props;
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
      quotaInfoData: [],
    });

    getQuota({ // 请求指标树
      stationType,
    });

    getFault({ // 请求故障类型树
      stationType,
    });
  }

  checkWind = () => this.onStationTypeChange(0); // 选中风电站
  checkPv = () => this.onStationTypeChange(1); // 选中光伏电站

  onCategory = (e) => { // 切换查询类别
    const { changeDailyQueryStore, queryParam, listParam } = this.props;
    const tableType = e.target.value;
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
      tableType,
      keyWord: '',
      powerInformation: '',
      queryParam: {
        ...queryParam,
        stationCodes: [],
      },
      listParam: {
        ...listParam,
        pageNum: 1,
        pageSize: 10,
      },
      quotaListData: {},
      faultListData: {},
      limitListData: {},
      quotaInfoData: [],
      faultIds: [],
    });
  }

  selectStation = (selectedStationInfo) => { // 选择电站
    const { getQuota, getFault, stationType, changeDailyQueryStore, queryParam } = this.props;
    const stationCodes = selectedStationInfo.map(cur => {
      return cur.stationCode;
    });
    this.setState({
      stationCodes,
      selectStations: selectedStationInfo,
    });
    changeDailyQueryStore({
      queryParam: {
        ...queryParam,
        stationCodes,
      }});
    getQuota({ // 请求指标树
      stationType,
    });
    getFault({ // 请求故障类型树
      stationType,
    });
  }

  onQuotaChange = (quota) => { // 关键指标 - 选择指标
    this.setState({
      quotaInfoData: quota,
    });
  }

  onfaultChange =(fault) => { // 故障信息 - 类型
    // const faultIds = fault.map(e => {
    //   return e.value;
    // });
    this.setState({
      faultIds: fault,
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
    let startDate = timeLength ? moment(time[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss') : null;
    let endDate = timeLength ? moment(time[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss') : null;
    const isToday = moment(endDate).isSame(moment(), 'd');
    isToday ? endDate = moment().format('YYYY-MM-DD HH:mm:ss') : endDate;
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
    const { stationCodes, quotaInfoData, faultIds, keyWord, powerInformation, dateValue } = this.state;
    const { startDate, endDate } = queryParam;
    const { pageNum, pageSize } = listParam;
    if (stationCodes.length === 0) {
      message.warning('请选择电站名称！');
      return;
    }
    if (tableType === 'quotaList' && quotaInfoData.length === 0) {
      message.warning('请选择指标！');
      return;
    }
    if (dateValue.length === 0) {
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
    }).filter(e => {
      return e > 1000;
    });

    const faults = faultIds.map(e => {
      return e.value;
    });

    tableType === 'quotaList' && getQuotaList({ stationCodes, startDate: moment(startDate).format('YYYY-MM-DD'), endDate: moment(endDate).format('YYYY-MM-DD'), pageNum, pageSize, indexCodes });
    tableType === 'faultList' && getFaultList({ stationCodes, startDate, endDate, pageNum, pageSize, faultIds: faults, keyWord });
    tableType === 'limitList' && getLimitList({ stationCodes, startDate, endDate, pageNum, pageSize, keyWord: powerInformation });
  }

  onReset = () => { // 重置
    const { changeDailyQueryStore } = this.props;
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
      quotaListData: {},
      faultListData: {},
      limitListData: {},
      quotaInfoData: [],
      faultIds: [],
    });
  }

  render(){
    const disabledDate = (current) => { // 不可选未来日期
      return current && current > moment().endOf('day');
    };
    const { stationTypeCount, stationType, stations, tableType, quotaData, faultData } = this.props;
    const { keyWord, powerInformation, quotaInfoData, faultIds, selectStations, dateValue } = this.state;
    const quotaCode = quotaInfoData.map(e => {
      return e.value;
    });

    const faultId = faultIds.map(e => {
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
                    value={faultId}
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
              <RangePicker format="YYYY-MM-DD" onChange={this.timeChange} value={dateValue} disabledDate={disabledDate} />
            </div>

            <CneButton lengthMode="short" className={styles.search} onClick={this.onSearch}>查询</CneButton>
            {searchInfo && <CneButton lengthMode="short" className={styles.reset} onClick={this.onReset}>重置</CneButton>}
          </div>
        </div>
      </div>
    );
  }
}

export default DailySearch;
