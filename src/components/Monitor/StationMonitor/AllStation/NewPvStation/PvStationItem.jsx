import React from 'react';
import PropTypes from 'prop-types';
import styles from './pvStation.scss';
import {Select, Spin} from 'antd';

const Option = Select.Option;
import SingleStaionList from './SingleStaionList';
import {throttle} from 'lodash';


class PvStationItem extends React.Component {
  static propTypes = {
    stationDataList: PropTypes.array,
    pvCapabilitydiagramsData: PropTypes.array,
    monitorPvUnit: PropTypes.object,
    areaChecked: PropTypes.bool,
    aralmstatus: PropTypes.bool,
    stationType: PropTypes.string,
    regionName: PropTypes.string,
    changeMonitorStationStore: PropTypes.func,
    getPvCapabilitydiagrams: PropTypes.func,
    theme: PropTypes.string,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      sortStatusName: 'sort',
      ascend: true,
      selectStation: [],
      renderList: [],
      spliceLength: 12, // 100条数据一渲染。
      topHeight: 400, // 假设的列表上方高度
      newStationsList: [], // 排序完成之后的所有电站
    };
  }

  componentDidMount() {
    const {stationDataList, areaChecked} = this.props;
    this.changeStationData({stationDataList, areaChecked});
    const main = document.getElementById('main');
    main.addEventListener('scroll', throttle(() => {
      if (this.newPinterest) {
        const {renderList, topHeight} = this.state;
        const clientH = document.documentElement.clientHeight; // 客户端高度
        const scrollTop = main.scrollTop; // 卷曲出去的高度
        const tableHeight = this.newPinterest.clientHeight; // 表格现在的高度。
        const resHeight = tableHeight + topHeight - scrollTop - clientH;
        if (resHeight < 50) { //表格内容
          if (renderList.length < this.props.stationDataList.length) {
            this.initRender();
          }
        }
      }
    }, 1000));
  }

  componentWillReceiveProps(nextPorps) {
    let noChange = true; // 数据定时刷新 不增加滚动的列数
    const {areaChecked, stationType, aralmstatus, regionName} = this.props;
    if (areaChecked !== nextPorps.areaChecked || stationType !== nextPorps.stationType || aralmstatus !== nextPorps.aralmstatus || regionName !== nextPorps.regionName) { // 切换 区域、告警、状态、按区域分组
      this.setState({renderList: []});
      noChange = false;
    }
    this.changeStationData({
      stationDataList: nextPorps.stationDataList,
      areaChecked: nextPorps.areaChecked,
      noChange,
    });
  }

  componentWillUnmount() {
    const main = document.getElementById('main');
    main && main.removeEventListener('scroll', () => {
      return false;
    }, true);
  }

  changeStationData = ({stationDataList = [], areaChecked = false, noChange = false}) => { // 处理数据 排序规则
    const {sortStatusName, ascend, selectStation} = this.state;
    const filterStationList = selectStation.length > 0 ? stationDataList.filter(e => selectStation.includes(e.stationCode)) : stationDataList;
    const sortType = ascend ? 1 : -1;
    const stationSortList = filterStationList.sort((a, b) => { // 排序
      return sortType * (a[sortStatusName] - b[sortStatusName]);
    });

    let newStationsList = stationSortList.sort((a, b) => { // 状态排序 未接入的放在最后
      return 900 - b.stationStatus === 0 ? -1 : 1;
    });

    if (areaChecked) { // 是否分组排序
      newStationsList = newStationsList.sort((a, b) => {
        return a['regionName'].localeCompare(b['regionName']);
      });
    }
    this.setState({newStationsList}, () => {
      this.initRender(noChange);
    });
  };

  conditionChange = (value) => { // 条件查询
    this.setState({selectStation: value, renderList: []}, () => {
      const {stationDataList, areaChecked} = this.props;
      this.changeStationData({stationDataList, areaChecked});
    });

  };

  sortStatus = (value) => { // 排序
    const {sortStatusName, ascend} = this.state;
    let currentAscend = true;
    if (sortStatusName === value) {
      currentAscend = !ascend;
    }
    this.setState({
      sortStatusName: value,
      ascend: currentAscend,
      renderList: [],
    }, () => {
      const {stationDataList, areaChecked} = this.props;
      this.changeStationData({stationDataList, areaChecked});
    });
  };


  dealData = (stationDataList) => { //  分组显示
    const {areaChecked} = this.props;
    const filteredStation = [];
    if (stationDataList.length > 0) {
      if (areaChecked) {
        stationDataList.forEach(e => {
          let findExactStation = false;
          filteredStation.forEach(m => {
            if (m.regionName === e.regionName) {
              findExactStation = true;
              m.stations.push(e);
            }
          });
          if (!findExactStation) {
            filteredStation.push({
              regionName: e.regionName,
              stations: [e],
            });
          }
        });
      } else {
        filteredStation.push({
          regionName: '',
          stations: stationDataList,
        });
      }

    }
    return filteredStation;
  };


  initRender = (noChange) => { //  渲染todolist 的条数
    const {renderList, spliceLength, newStationsList} = this.state;
    const {regionName} = this.props;
    const tmp = newStationsList.slice(0, spliceLength + renderList.length);
    const update = newStationsList.slice(0, renderList.length);
    const thisTmp = newStationsList.slice(renderList.length, spliceLength + renderList.length);
    if (noChange) { // 一分钟数据只更新数据，不更新处理图的数据
      this.setState({
        renderList: update,
      });
    } else {
      this.setState({
        renderList: tmp,
      });
      this.props.changeMonitorStationStore({stationCodes: tmp.map(e => e.stationCode)});
      this.props.getPvCapabilitydiagrams({
        nowStationCodes: thisTmp.map(e => e.stationCode),
        stationCodes: tmp.map(e => e.stationCode),
        regionName,
      });
    }
  };

  render() {
    const {stationDataList, pvCapabilitydiagramsData = [], monitorPvUnit} = this.props;
    const {sortStatusName, ascend, selectStation} = this.state;
    const {renderList} = this.state;
    const sortName = [
      { text: '默认排序', id: 'sort' },
      { text: '日等效时 ', id: 'equivalentHours' },
      { text: '告警事件', id: 'alarmNum' },
      { text: '异常支路数 ', id: 'anomalousBranchNum' },
      { text: '日发电量', id: 'dayPower' },
      { text: '瞬时辐射', id: 'instantaneous' },
      { text: '实时功率', id: 'stationPower' },
    ];
    const filteredStation = this.dealData(renderList);
    return (
      <div className={styles.stationCardContainer}>
        <div ref={'selectBody'}></div>
        <div className={styles.filterCondition}>
          <Select
            showSearch
            mode="multiple"
            style={{width: 200}}
            placeholder="请选择电站"
            optionFilterProp="children"
            onChange={this.conditionChange}
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            getPopupContainer={() => this.refs.selectBody}
          >
            {/* <Option value={''} key={''}>{'全部电站'}</Option> */}
            {stationDataList.map(list => {
              return <Option key={list.stationCode} value={list.stationCode}>{list.stationName}</Option>;
            })}
          </Select>
          <div className={styles.sortCondition}>
            {sortName.map(list => {
              return (<div onClick={() => {
                this.sortStatus(list.id);
              }} key={list.id} className={`${styles.sortStatus}
                ${sortStatusName === list.id && styles['activeSortStatus']}`}>
                {list.text}
                {sortStatusName === list.id && ascend && <i className={`iconfont icon-back ${styles.ascend}`}></i>}
                {sortStatusName === list.id && !ascend && <i className={`iconfont icon-back ${styles.descend}`}></i>}
              </div>);
            })}
          </div>
        </div>

        <div className={styles.staionsListBox} ref={ref => (this.newPinterest = ref)}>
          {stationDataList.length > 0 &&
          <React.Fragment>
            {filteredStation.map((list, key) => {
              return (<div className={styles.regionList} key={key}>
                <div className={styles.regionName}>{list.regionName}</div>
                <div className={styles.staionsList}>
                  {list.stations.map((item, index) => {
                    const filterChartData = pvCapabilitydiagramsData.filter(e => e.stationCode === item.stationCode);
                    return (<SingleStaionList
                      key={index.toString()}
                      singleStation={item}
                      filterChartData={filterChartData}
                      monitorPvUnit={monitorPvUnit}
                      theme={this.props.theme}
                    />);
                  })}
                </div>
              </div>);
            })}
            {/* 在筛选条件下不显示loading */}
            {(renderList.length < stationDataList.length && selectStation.length === 0) &&
            <Spin size="large" style={{margin: '30px auto', width: '100%'}} className={styles.loading} />}
          </React.Fragment>
          || <div className={styles.noData}><img src="/img/nodata.png" style={{width: 223, height: 164}} /></div>
          }
          <div>
          </div>
        </div>

      </div>
    );
  }
}

export default (PvStationItem);
