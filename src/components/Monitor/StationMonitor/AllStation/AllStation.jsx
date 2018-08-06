import React from 'react';
import PropTypes from 'prop-types';
import styles from './allStation.scss'
import { Tabs, Progress, Icon } from 'antd';
import WindStation from '../AllStation/WindStation/WindStation.jsx';
import PvStation from '../AllStation/PvStation/PvStation.jsx';
import Map from './map.jsx'

const TabPane = Tabs.TabPane;


class Allstation extends React.Component {
  static PropTypes = {

  }
  constructor(props, context) {
    super(props, context)
  }
  render() {
    return (
      <div className={styles.stationContainer}>
        <div className="card-container">
          <Tabs type="card">
            <TabPane tab="全部" key="1">
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
              <div className={styles.stationNav}>
                <div className={styles.showType}>
                  <Icon type="global" />
                </div>
                <div className={styles.typeTotal}>
                  <div className={styles.windTotal}>风电25</div>
                  <div className={styles.pvTotal}>光伏6</div>
                </div>
              </div>

              <Map />
            </TabPane>
            <TabPane tab="风电" key="2">
              <WindStation />
            </TabPane>
            <TabPane tab="光伏" key="3">
              <PvStation />
            </TabPane>
          </Tabs>
        </div>

      </div>
    )
  }
}


export default Allstation
