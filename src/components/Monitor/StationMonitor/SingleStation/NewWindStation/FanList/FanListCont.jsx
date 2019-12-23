
import React from 'react';
import PropTypes from 'prop-types';
import styles from './fanList.scss';
import { Tabs, Switch, Radio, Table, Progress, Spin, Select } from 'antd';
import FanItem from './FanItem';
import FanTable from './FanTable';
import { Building } from '../../../../../Common/Building/Building';
const TabPane = Tabs.TabPane;
const Option = Select.Option;

class FanListCont extends React.Component {
  static propTypes = {
    match: PropTypes.object,
    pointparams: PropTypes.object,
    getPointparams: PropTypes.func,
    getFanList: PropTypes.func,
    changeSingleStationStore: PropTypes.func,
    fanList: PropTypes.object,
    fanDisplay: PropTypes.string,
    loading: PropTypes.bool,
    alarmSwitch: PropTypes.bool,
  }

  static defaultProps = {
    loading: true,
  }

  constructor(props) {
    super(props);
    this.state = {
      cardPointParams: 'Default',
      alarmSwitch: false,
      currentPage: 1,
      pageSize: 10,
      firstLoad: true,
    };
  }

  componentDidMount() {
    const { stationCode } = this.props.match.params;
    this.getData(stationCode);
    this.props.getPointparams();
  }

  componentWillReceiveProps(nextProps) {
    const { stationCode } = this.props.match.params;
    const nextStationCode = nextProps.match.params.stationCode;
    if (nextStationCode !== stationCode) {
      clearTimeout(this.timeOutId);
      this.getData(nextStationCode);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeOutId);
  }

  onSwitchAlarm = (e) => {
    this.setState({
      alarmSwitch: e,
      currentPage: 1,
    });
  }

  onPaginationChange = ({ currentPage, pageSize }) => {//分页器
    this.setState({
      currentPage,
      pageSize,
    });
  }


  getData = stationCode => { // 获取数据
    const { firstLoad } = this.state;
    this.props.getNewFanList({ stationCode, firstLoad });
    this.timeOutId = setTimeout(() => {
      if (firstLoad) {
        this.setState({ firstLoad: false });
      }
      this.getData(stationCode);
    }, 10000);
  }

  pointparamsChange = (e) => {
    this.setState({
      cardPointParams: e,
    });
  }


  operations = () => { // 下拉筛选框
    const { pointparams, fanDisplay } = this.props;
    const { alarmSwitch, cardPointParams } = this.state;
    const list = ['Default', 'NC005', 'GN010', 'GN001', 'RT001', 'TM101', 'NC001', 'TM105', 'NC004'];
    const optionList = list.map(e => {
      return <Option value={e} key={e}>{pointparams[e]}</Option>;
    });
    const operations = (<div className={styles.inverterRight} >
      {fanDisplay === 'deviceCard' &&
        <Select style={{ width: 190, marginRight: 24 }} onChange={this.pointparamsChange} value={cardPointParams}>
          {optionList}
        </Select>
      }
      <Switch onChange={this.onSwitchAlarm} value={alarmSwitch} style={{ marginRight: 8 }} /> 只看告警
    </div>);
    return operations;
  }

  fanDisplay = (e) => { // 改变风机展示的状态
    this.props.changeSingleStationStore({ fanDisplay: e });
  }

  filterStatusDataList = () => { // 删选数据
    const { alarmSwitch } = this.state;
    const { fanList, currentStatus } = this.props;
    const { deviceList = [] } = fanList;
    const newStationDataList = deviceList.filter(e => { return !alarmSwitch || (alarmSwitch && e.alarmNum > 0); }).filter(e => {
      if (currentStatus === 0) {
        return true
      }  return e.deviceStatus === currentStatus 
    });
    return newStationDataList;
  }



  render() {
    const { currentPage, pageSize, cardPointParams } = this.state;
    const { fanDisplay, loading } = this.props;
    return (
      <div className={styles.fanListCont}>
        <div className={styles.StationTitle} >
          <div className={styles.tabs}>
            <i className={`${'iconfont icon-grid iconTab'} ${fanDisplay === 'deviceCard' && styles.activeCard}`}
              onClick={() => { this.fanDisplay('deviceCard'); }}> </i>
            <i className={`${'iconfont icon-table iconTab'} ${fanDisplay === 'deviceTable' && styles.activeCard}`} onClick={() => { this.fanDisplay('deviceTable'); }}></i>
            <i className={`${'iconfont icon-map iconTab'} ${fanDisplay === 'deviceMap' && styles.activeCard}`} onClick={() => { this.fanDisplay('deviceMap'); }}></i>
          </div>
          <div>
            {this.operations()}
          </div>
        </div>
        {fanDisplay === 'deviceCard' &&
          (loading ? <Spin size="large" style={{ height: '100px', margin: '200px auto', width: '100%' }} /> :
            <FanItem
              {...this.props}
              cardPointParams={cardPointParams}
              deviceList={this.filterStatusDataList()}
            />)}
        {fanDisplay === 'deviceTable' &&
          <FanTable
            {...this.props}
            currentPage={currentPage}
            pageSize={pageSize}
            onPaginationChange={this.onPaginationChange}
            deviceList={this.filterStatusDataList()}
          />}
        {fanDisplay === 'deviceMap' && <div className={styles.building}></div>}
      </div>
    );
  }
}

export default FanListCont;
