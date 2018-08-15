import React from "react";
import PropTypes from "prop-types";
import styles from './windstation.scss';
import Map from '../map.jsx';
import WindStationHeader from './windStationHeader.jsx';
import WindStationItem from './WIndStationItem.jsx';
import WindStationList from './WIndStationList.jsx';
import { Tabs, Icon, Radio, Switch } from "antd";

class WindStation extends React.Component {
  static propTypes = {
    sort: PropTypes.string,
    ascend: PropTypes.bool,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    windMonitorStation: PropTypes.object,
    totalNum: PropTypes.number,
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      key: '1',
      checked: false,
      stationType: 'all',
      totalNum:0
    }
  }
 
  onHandleAlarm = (checked) => {
    this.setState({
      checked
    })
  }
  onHandleStation = (e) => {
    this.setState({
      stationType: e.target.value
    })
  }
  setkey = (activekey) => {
    this.setState({ key: activekey })
  }

 

  render() {
    let { key, checked, stationType } = this.state;
    const { windMonitorStation } = this.props;
    const { stationDataList } = windMonitorStation;
    const newStationDataList = stationDataList.filter(e => {
      return !checked || (checked && e.alarmNum > 0)
    }).filter(e => {
      if (stationType === 'all') {
        return true
      } else if (stationType === 'normal') {
        return e.stationStatus.stationStatus === '400'
      } else if (stationType === 'dataInterruption') {
        return e.stationStatus.stationStatus === '500'
      } else if (stationType === 'networkInterruption') {
        return e.stationStatus.stationStatus === '900'
      } else if (stationType === 'unconnection') {
        return e.stationStatus.stationStatus === '900'
      }
    })
    //console.log(newStationDataList)
    

    const TabPane = Tabs.TabPane;
    //tabs筛选部分
    const operations = (
      <div>
        <Switch onChange={this.onHandleAlarm} />告警
    <Radio.Group
          defaultValue="all"
          buttonStyle="solid"
          onChange={this.onHandleStation}
          style={{ marginLeft: 20 }}
        >
          <Radio.Button value="all">全部</Radio.Button>
          <Radio.Button value="normal">通讯正常</Radio.Button>
          <Radio.Button value="dataInterruption">数据中断</Radio.Button>
          <Radio.Button value="networkInterruption">网络中断</Radio.Button>
          <Radio.Button value="unconnection">未接入</Radio.Button>
        </Radio.Group>
      </div>
    );
    let provinceNum = () => {
      let ary = [];
      this.props.windMonitorStation.stationDataList.forEach((item, index) => {
        let findProvince = false

        ary.forEach(e => {
          if (e.provinceName === item.provinceName) {
            findProvince = true;
            e.provinceNum += 1;
          }
        })
        if (!findProvince) {
          ary.push({
            provinceName: item.provinceName,
            provinceNum: 1
          })
        }
      })
      //console.log(ary);
      return ary;
    }
    const province = (
      <div>
        {provinceNum().map((item, index) => {
          return (
            <span key={index}>{item.provinceName}:{item.provinceNum}&nbsp;&nbsp;</span>
          )
        })}
      </div>
    )
    return (
      <div className={styles.WindStation}>
        <WindStationHeader {...this.props} />
        <Tabs activeKey={key} tabBarExtraContent={key !== '3' ? operations : province} onChange={this.setkey}>
          <TabPane
            tab={
              <span>
                <Icon type="appstore" />
              </span>
            }
            key="1"
          >
            <WindStationItem {...this.props} stationDataList={newStationDataList} />

          </TabPane>
          <TabPane
            tab={
              <span>
                <Icon type="bars" />
              </span>
            }
            key="2"
          >
            <WindStationList {...this.props} stationDataList={newStationDataList} />

          </TabPane>
          <TabPane
            tab={
              <span>
                <Icon type="global" />
              </span>
            }
            key="3"
          >
            <Map {...this.props} testId="wind_bmap_station" />
          </TabPane>
        </Tabs>,

      </div>
    )
  }
}
export default WindStation
