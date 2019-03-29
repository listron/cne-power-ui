import React from "react";
import PropTypes from "prop-types";
import { Icon, DatePicker, Select, Tabs, Table } from 'antd';
import styles from './alarmCount.scss';
import FilterCondition from '../../../Common/FilterCondition/FilterCondition';
import { AllStationTableColumn } from './AlarmCountTable';
import CommonPagination from '../../../Common/CommonPagination';
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
      tabSelect: 'graph',
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

  onChangeTab = (value) => {
    this.setState({ tabSelect: value })
  }

  onPaginationChange = ({ currentPage, pageSize }) => { // 分页改变 
    const { queryPramas } = this.props;
    this.props.changeAlarmCountStore({ queryPramas: { ...queryPramas, pageNum: currentPage, pageSize, } })
  }

  tableChange = (pagination, filter, sorter) => {// 点击表头 排序
    const field = sorter.field;
    const arr = ['stationName', 'alarmNum', 'oneWarningNum', 'twoWarningNum', 'threeWarningNum', 'fourWarningNum', 'handleAvgTime', 'oneHandleAvgTime', 'twoHandleAvgTime', 'threeWarningNum', 'fourHandleAvgTime'];
    const { queryPramas, getAlarmStatistic } = this.props;
    getAlarmStatistic({
      ...queryPramas,
      orderField: (arr.findIndex(e => e === field) + 1).toString(),
      orderCommand: sorter.order === 'ascend' ? '1' : '2'
    })
  };



  render() {
    const { stationTypeCount, stations, queryPramas = {}, alarmStatistic, } = this.props;
    const { pageNum, pageSize } = queryPramas;
    const totalNum = alarmStatistic.length;
    let startRow = (pageNum - 1) * pageSize;
    let endRow = pageNum * pageSize;
    endRow = (endRow > totalNum) ? totalNum : endRow;
    let alarmData = alarmStatistic.slice(startRow, endRow).map(item => ({
      ...item,
      key: item.stationCode,
    }));
    const { stationType } = queryPramas;
    const filterStation = stations.filter(e => e.stationType === +stationType);
    const { showFilter, tabSelect } = this.state;
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
            activeKey={tabSelect}
            tabBarExtraContent={operations}
            onChange={this.onChangeTab}>
            <TabPane tab={<i className="iconfont icon-drawing"></i>} key="graph" >
              图表
              {/* <AlarmStatisticGraph  {...this.props} /> */}
              <div className={styles.explanation}>  平均处理时间:所选时间内，电站消除的、且已转工单告警的持续时间平均值。 </div>
            </TabPane>
            <TabPane tab={<i className="iconfont icon-table"></i>} key="table" >
              <div className={styles.pagination}>
                <CommonPagination pageSize={pageSize} currentPage={pageNum} total={totalNum} onPaginationChange={this.onPaginationChange} />
              </div>
              <Table
                columns={AllStationTableColumn()}
                dataSource={alarmData}
                onChange={this.tableChange}
                pagination={false}
                locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
              />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}
export default AllAlarmCount;