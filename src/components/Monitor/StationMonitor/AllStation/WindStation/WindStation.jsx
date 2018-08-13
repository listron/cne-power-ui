import React from "react";
import PropTypes from "prop-types";
import styles from './windstation.scss';
import WindMap from './WindStationMap.jsx';
import WIndStationItem from './WIndStationItem.jsx';
import WIndStationList from './WIndStationList.jsx';
import { Progress, Tabs, Icon, Button, Radio, Switch, Table } from "antd";
import WindStationList from "./WIndStationList.jsx";

const TabPane = Tabs.TabPane;
//tabs筛选部分
const operations = (
  <div>
    <Switch defaultChecked onChange={onHandleAlarm} />告警
    <Radio.Group
      defaultValue="a"
      buttonStyle="solid"
      style={{ marginLeft: 20 }}
    >
      <Radio.Button value="a">全部</Radio.Button>
      <Radio.Button value="b">通讯正常</Radio.Button>
      <Radio.Button value="c">数据中断</Radio.Button>
      <Radio.Button value="d">网络中断</Radio.Button>
      <Radio.Button value="e">未接入</Radio.Button>
    </Radio.Group>
  </div>
);
function onHandleAlarm(checked) {
  console.log(`switch to ${checked}`);
}

class WindStation extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.TabPane = Tabs.TabPane;
  }
  render() {
    return (
      <div className={styles.WindStation}>
        <div className={styles.headStation}>
          <div className={styles.typeIcon}>
            <div className={styles.leftIcon}>
              <img src="" alt="" />
            </div>
            <div className={styles.rightIcon}>
              <img src="" alt="" />
            </div>
          </div>
          <div className={styles.progressInfo}>
            <div className={styles.progressData}>
              <div className={styles.stationValue}>
                <div>125.67</div>
                <div>12345.56</div>
              </div>
              <div className={styles.progressBar}>
                <Progress percent={50} showInfo={false} status="active" />
              </div>
              <div className={styles.stationType}>
                <div>月发电量 万kWh</div>
                <div>月发电量 万kWh</div>
              </div>
            </div>
          </div>
          <div className={styles.stationCollect}>
            <div className={styles.equipmentNum}>
              <div className={styles.dataValue}>331</div>
              <div className={styles.dataName}>装机台数</div>
            </div>
            <div className={styles.windSpeed}>
              <div className={styles.dataValue}>331.75</div>
              <div className={styles.dataName}>辐射</div>
            </div>
            <div className={styles.dayStation}>
              <div className={styles.dataValue}>331.75</div>
              <div className={styles.dataName}>日发电量 万kWh</div>
            </div>
            <div className={styles.monthStation}>
              <div className={styles.dataValue}>331.75</div>
              <div className={styles.dataName}>月发电量 万kWh</div>
            </div>

          </div>
          <div className={styles.progressInfo}>
            <div className={styles.progressData}>
              <div className={styles.stationValue}>
                <div>125.67</div>
                <div>12345.56</div>
              </div>
              <div className={styles.progressBar}>
                <Progress percent={50} status="active" />
              </div>
              <div className={styles.stationType}>
                <div>月发电量 万kWh</div>
                <div>月发电量 万kWh</div>
              </div>
            </div>
          </div>
        </div>
        <Tabs defaultActiveKey="1" tabBarExtraContent={operations} >
          <TabPane
            tab={
              <span>
                <Icon type="appstore" />
              </span>
            }
            key="1"
          >
            <WIndStationItem />

          </TabPane>
          <TabPane
            tab={
              <span>
                <Icon type="bars" />
              </span>
            }
            key="2"
          >
            <WindStationList />

          </TabPane>
          <TabPane
            tab={
              <span>
                <Icon type="global" />
              </span>
            }
            key="3"
          >
            <WindMap />
          </TabPane>
        </Tabs>,

      </div>
    )
  }
}


export default WindStation
