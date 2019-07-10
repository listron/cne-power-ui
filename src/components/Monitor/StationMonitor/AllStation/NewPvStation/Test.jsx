import React from "react";
import PropTypes from "prop-types";
import styles from './pvStation.scss';
import { message, Select, Spin } from "antd";
import { Link } from 'react-router-dom';
import { dataFormats } from '../../../../../utils/utilFunc';
import { divideFormarts, multiplyFormarts, powerPoint } from '../../PvCommon/PvDataformat';
import OutputTenMin from './OutputTenMin';
const Option = Select.Option;
import SingleStaionList from './SingleStaionList';
import moment from 'moment';


class Test extends React.Component {
  static propTypes = {
    stationDataList: PropTypes.array,
    pvCapabilitydiagramsData: PropTypes.array,
    monitorPvUnit: PropTypes.object,
    areaChecked: PropTypes.bool,
  }
  constructor(props, context) {
    super(props, context)
    this.state = {
      sortStatusName: 'sort',
      ascend: true,
      selectStation: null,
      renderList: [],
      initList: [],
      spliceLength: 12, // 100条数据一渲染。
      topHeight: 150, // 假设的列表上方高度
    }
  }

  componentDidMount() {
    console.log(this.props.stationDataList)
    const main = document.getElementById('main');
    const { stationDataList } = this.props;
    const { sortStatusName, ascend, selectStation, topHeight, renderList } = this.state;
    const filterStationList = selectStation ? stationDataList.filter(e => e.stationCode === selectStation) : stationDataList;
    const sortType = ascend ? 1 : -1;
    const newStationsList = filterStationList.sort((a, b) => {
      return sortType * (a[sortStatusName] - b[sortStatusName]);
    });
    // if (this.state.renderList.length < stationDataList.length) {
    //   setInterval(() => { this.initRender(stationDataList); }, 3000)
    // }
    this.initRender(stationDataList);
    let startTime = moment().unix(); // 开始时间
    main.addEventListener('scroll', (e) => { // 需要防抖。
      if (this.timeout !== null) clearTimeout(this.timeout);
      let curTime = moment().unix(); // 当前时间
      if (curTime - startTime >= 1000) { // 时间差>=1秒直接执行
        const clientH = document.documentElement.clientHeight; // 客户端高度
        const scrollTop = main.scrollTop; // 卷曲出去的高度
        const tableHeight = this.newPinterest.clientHeight; // 表格现在的高度。
        const resHeight = tableHeight - topHeight - scrollTop - clientH;
        if (resHeight < 20) { //表格内容
          if (renderList.length < stationDataList.length) {
            this.initRender(newStationsList);
          }
        }
        startTime = curTime;
      } else { // 否则延时执行，像滚动了一下，差值<1秒的那种也要执行
        this.timeout = setTimeout(() => {
          const clientH = document.documentElement.clientHeight; // 客户端高度
          const scrollTop = main.scrollTop; // 卷曲出去的高度
          const tableHeight = this.newPinterest.clientHeight; // 表格现在的高度。
          const resHeight = tableHeight - topHeight - scrollTop - clientH;
          if (resHeight < 20) { //表格内容
            if (renderList.length < stationDataList.length) {
              this.initRender(newStationsList);
            }
          }
        }, 300);
      }

    });
  }

  componentWillUpdate() {
    console.time()
  }

  componentDidUpdate() {
    console.timeEnd()
  }




  // getSnapshotBeforeUpdate(prevProps, prevState) {
  //   const { stationDataList } = this.props;

  // }



  conditionChange = (value) => {
    this.setState({ selectStation: value })
  }

  sortStatus = (value) => {
    const { sortStatusName, ascend } = this.state;
    let currentAscend = true;
    if (sortStatusName === value) {
      currentAscend = !ascend
    }
    this.setState({
      sortStatusName: value,
      ascend: currentAscend
    })
  }

  dealData = (stationDataList) => { // 处理数据
    const { areaChecked } = this.props;
    let filteredStation = [];
    if (stationDataList.length > 0) {
      if (areaChecked) {
        const temType = stationDataList.sort((a, b) => { return a['provinceName'].localeCompare(b['provinceName']) });
        temType.forEach(e => {
          let findExactStation = false;
          filteredStation.forEach(m => {
            if (m.regionName === e.regionName) {
              findExactStation = true;
              m.stations.push(e);
            }
          })
          if (!findExactStation) {
            filteredStation.push({
              regionName: e.regionName,
              stations: [e]
            })
          }
        });
      } else {
        filteredStation = stationDataList
      }

    }
    return filteredStation
  }



  initRender = (initList) => { // 初次 => todo 若初始数据小于要求分割长度。
    const { renderList, spliceLength } = this.state;
    const tmp = initList.slice(renderList.length, spliceLength + renderList.length);
    this.setState({
      renderList: renderList.concat(tmp),
      renderLoading: true,
    }, () => {
      this.setState({ renderLoading: false });
    });
  }

  render() {
    const { stationDataList, pvCapabilitydiagramsData, monitorPvUnit } = this.props;
    const { sortStatusName, ascend } = this.state;
    const { renderList, renderLoading } = this.state;
    console.log('renderList', renderList)
    const sortName = [
      { text: '默认排序', id: 'sort' },
      { text: '日利用小时 ', id: 'equivalentHours' },
      { text: '告警事件', id: 'alarmNum' },
      { text: '低效逆变器', id: 'lowEfficiencyInverterNum' },
      { text: '异常支路数 ', id: 'anomalousBranchNum' },
      { text: '日发电量', id: 'dayPower' },
      { text: '瞬时辐射', id: 'instantaneous' },
      { text: '实时功率', id: 'stationPower' },
    ];
    const filteredStation = this.dealData(renderList);
    console.log('renderLoading', renderLoading)
    return (
      <div className={styles.stationCardContainer}>
        <div ref={'selectBody'}></div>
        <div className={styles.filterCondition}>
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="请选择电站"
            optionFilterProp="children"
            onChange={this.conditionChange}
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            getPopupContainer={() => this.refs.selectBody}
          // value={selectStation}
          >
            <Option value={''} key={''}>{'全部电站'}</Option>
            {stationDataList.map(list => {
              return <Option key={list.stationCode} value={list.stationCode}>{list.stationName}</Option>
            })}
          </Select>
          <div className={styles.sortCondition}>
            {sortName.map(list => {
              return (<div onClick={() => { this.sortStatus(list.id) }} key={list.id} className={`${styles.sortStatus}
                ${sortStatusName === list.id && styles['activeSortStatus']}`}>
                {list.text}
                {sortStatusName === list.id && ascend && <i className={`iconfont icon-back ${styles.ascend}`}></i>}
                {sortStatusName === list.id && !ascend && <i className={`iconfont icon-back ${styles.descend}`}></i>}
              </div>)
            })}
          </div>
        </div>

        <div className={styles.staionsListBox} ref={ref => this.newPinterest = ref}
        //  style={{ height: stationDataList.length * 320 }}
        >
          {stationDataList.length > 0 && <div className={styles.staionsList}>
            {filteredStation.map((item, index) => {
              const filterChartData = pvCapabilitydiagramsData.filter(e => e.stationCode === item.stationCode);
              return (<SingleStaionList
                singleStation={item}
                filterChartData={filterChartData}
                monitorPvUnit={monitorPvUnit}
              />)
            })}
          </div> || <div className={styles.noData}><img src="/img/nodata.png" style={{ width: 223, height: 164 }} /></div>}
          {/* {stationDataList.length > 0 && filteredStation.map((list, key) => {
            const stationStatusList = list.stations.sort((a, b) => {
              return 900 - b.stationStatus === 0 ? -1 : 1
            })
            return (<div className={styles.regionList} key={key}  >
              <div className={styles.regionName}>{list.regionName}</div>
              <div className={styles.staionsList}>
                {stationStatusList.map((item, index) => {
                  const filterChartData = pvCapabilitydiagramsData.filter(e => e.stationCode === item.stationCode);
                  <SingleStaionList
                    singleStation={item}
                    filterChartData={filterChartData}
                    monitorPvUnit={monitorPvUnit}
                  />
                })}
              </div>
            </div>)

          }) || <div className={styles.noData}><img src="/img/nodata.png" style={{ width: 223, height: 164 }} /></div>
          } */}
          {renderLoading && <Spin size="large" style={{ height: '100px', margin: '200px auto', width: '100%' }} /> || null}
          <div>
          </div>
        </div>

      </div>
    )
  }
}
export default (Test)