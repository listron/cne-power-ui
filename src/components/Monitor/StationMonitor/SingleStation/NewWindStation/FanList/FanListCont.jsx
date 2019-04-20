

import React from 'react';
import PropTypes from 'prop-types';
import styles from './fanList.scss';
import { Tabs, Switch, Radio, Table, Progress, Spin, Select } from 'antd';
import FanItem from './FanItem';
import FanTable from './FanTable';
const TabPane = Tabs.TabPane;
const Option = Select.Option;

class FanListCont extends React.Component {
  static propTypes = {
    match: PropTypes.object,
    pointparams: PropTypes.object,
    getPointparams: PropTypes.func,
    getNewFanList: PropTypes.func,
    changeSingleStationStore: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      cardPointParams: 'Default',
      alarmSwitch: false,
      currentPage: 1,
      pageSize: 10,
    }
  }

  componentDidMount() {
    const { stationCode } = this.props.match.params;
    this.getData(stationCode);
    this.props.getPointparams()
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
      pageSize
    })
  }



  getData = (stationCode) => {// 获取数据
    const { getNewFanList } = this.props;
    const { firstLoad } = this.state;
    getNewFanList({ stationCode, firstLoad });
    this.timeOutId = setTimeout(() => {
      if (firstLoad) {
        this.setState({ firstLoad: false });
      }
      this.getData(stationCode);
    }, 10000);
  }

  pointparamsChange = (e) => {
    this.setState({
      cardPointParams: e
    })
  }


  operations = () => { // 下拉筛选框
    const { pointparams,fanDisplay } = this.props;
    const { alarmSwitch } = this.state;
    let optionList = [];
    for (let key in pointparams) {
      optionList.push(<Option value={key} key={key}>{pointparams[key]}</Option>)
    }
    const operations = (<div className={styles.inverterRight} >
      {fanDisplay === 'deviceCard' &&
        <Select defaultValue="整机系统" style={{ width: 190, marginRight: 24 }} onChange={this.pointparamsChange}>
          {optionList}
        </Select>
      }
      <Switch onChange={this.onSwitchAlarm} value={alarmSwitch} style={{marginRight:8}} /> 告警
    </div>);
    return operations
  }

  fanDisplay = (e) => { // 改变风机展示的状态
    this.props.changeSingleStationStore({ fanDisplay: e })
  }



  render() {
    const { loading, deviceTypeCode, currentStatus } = this.props;
    const { alarmSwitch, currentPage, pageSize, cardPointParams } = this.state;
    return (
      <div className={styles.fanListCont}>
        <Tabs defaultActiveKey="1" tabBarExtraContent={this.operations()} onChange={this.fanDisplay}>
          <TabPane tab={<span><i className="iconfont icon-grid" ></i></span>} key="deviceCard" className={styles.inverterBlockBox} >
            <FanItem  {...this.props} cardPointParams={cardPointParams} alarmSwitch={alarmSwitch} />
          </TabPane>
          <TabPane tab={<span><i className="iconfont icon-table" ></i></span>} key="deviceTable" className={styles.inverterTableBox} >
            <FanTable
              {...this.props}
              alarmSwitch={alarmSwitch}
              currentPage={currentPage}
              pageSize={pageSize}
              onPaginationChange={this.onPaginationChange}
            />
          </TabPane>
          <TabPane tab={<span> <i className="iconfont icon-map"></i></span>} key="deviceMap" className={styles.inverterMapBox} >
            {/* <Map testId="wind_bmap_station" {...this.props} stationDataList={this.mapData(filteredDeviceList, deviceTypeCode)} /> */}
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

export default FanListCont;
