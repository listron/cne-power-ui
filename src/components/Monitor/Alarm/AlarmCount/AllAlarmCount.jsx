import React from "react";
import PropTypes from "prop-types";
import { Icon, DatePicker, Select, Tabs } from 'antd';
import styles from './alarmCount.scss';
import FilterCondition from '../../../Common/FilterCondition/FilterCondition'
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const TabPane = Tabs.TabPane;


class AllAlarmCount extends React.Component {
  static propTypes = {

  }
  constructor(props) {
    super(props);
    this.state = {
      showStationSelect: false,
      key: 'graph',
    };
  }

  componentDidMount() {
    const { queryPramas, getAlarmStatistic } = this.props;
    getAlarmStatistic(queryPramas)
  }

  typeSelect = (value) => {
    const { queryPramas, getAlarmStatistic } = this.props;
    getAlarmStatistic({ ...queryPramas, stationType: value })
  }

  onChangeTab = () => {

  }


  render() {
    const { stationTypeCount, stations, queryPramas = {} } = this.props;
    const { stationType } = queryPramas;
    const filterStation = stations.filter(e => e.stationType === +stationType);
    const { showFilter, key } = this.state;
    const operations = (
      <div className={styles.exportData}>
        <button className={styles.exportBtn} onClick={this.exportAlarm}>数据导出</button>
      </div >
    );
    return (
      <div className={styles.alarmCount}>
        <div className={styles.typeSelect}>
          {stationTypeCount === 'multiple' &&
            <div className={styles.type}>
              <div className={styles[`${+stationType === 0 && 'active'}`]} onClick={() => { this.typeSelect(0) }} >风电</div>
              <div className={styles[`${+stationType === 1 && 'active'}`]} onClick={() => { this.typeSelect(1) }}>光伏</div>
            </div>
          }
          <div className={styles.operation} style={{ marginRight: '50px', color: '#199475' }} onClick={this.showStationSelect}>
            单电站告警统计 <i className="iconfont icon-filter"></i>
          </div>
        </div>
        <div className={styles.serchSelect}>
          <FilterCondition
            option={['stationName', 'period']}
            stations={filterStation || []}
            onChange={this.onChangeFilter}
          />
        </div>
        <div className={styles.alarmCountCont}>
          <Tabs
            animated={false}
            tabBarGutter={0}
            className={styles.tabContainer}
            activeKey={key}
            tabBarExtraContent={operations}
            onChange={this.onChangeTab}>
            <TabPane tab={<i className="iconfont icon-drawing"></i>} key="graph" >
              图表
              {/* <AlarmStatisticGraph  {...this.props} /> */}
            </TabPane>
            <TabPane tab={<i className="iconfont icon-table"></i>} key="table" >
              表格
              {/* <AlarmStatisticTable {...this.props} onTableChange={this.props.onTableChange} /> */}
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}
export default AllAlarmCount;