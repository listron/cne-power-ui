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
import { throttle } from 'lodash';
import { isThisSecond } from "date-fns";



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
      topHeight: 400, // 假设的列表上方高度
      stationCodeList: [], // 请求图表数据的code
      newStationsList: [], // 处理完之后的
    }
  }

  componentDidMount() {
    this.changeStationData()
    const main = document.getElementById('main');
    main.addEventListener('scroll', throttle(() => {
      if (this.newPinterest) {
        const { renderList, topHeight } = this.state;
        const clientH = document.documentElement.clientHeight; // 客户端高度
        const scrollTop = main.scrollTop; // 卷曲出去的高度
        const tableHeight = this.newPinterest.clientHeight; // 表格现在的高度。
        const resHeight = tableHeight + topHeight - scrollTop - clientH;
        if (resHeight < 50) { //表格内容
          if (renderList.length < stationDataList.length) {
            this.initRender(newStationsList);
          }
        }
      }
    }, 1000))

  }


  componentWillUpdate(nextProps, nextState) {
    if (nextProps.stationDataList.length > 0) {
      // this.initRender()
    }
  }


  changeStationData = () => {
    const { stationDataList } = this.props;
    const { sortStatusName, ascend, selectStation, } = this.state;
    const filterStationList = selectStation ? stationDataList.filter(e => e.stationCode === selectStation) : stationDataList;
    const sortType = ascend ? 1 : -1;
    const newStationsList = filterStationList.sort((a, b) => {
      return sortType * (a[sortStatusName] - b[sortStatusName]);
    });
    this.setState({ newStationsList }, () => {
      this.initRender(newStationsList);
    })
  }


  // componentWillUpdate() {
  //   console.time()
  // }

  // componentDidUpdate() {
  //   console.timeEnd()
  // }


  // getSnapshotBeforeUpdate(prevProps, prevState) {
  //   const { stationDataList } = this.props;

  // }



  conditionChange = (value) => {
    this.setState({ selectStation: value })
  }

  sortStatus = (value) => {  // 排序
    const { sortStatusName, ascend } = this.state;
    let currentAscend = true;
    if (sortStatusName === value) {
      currentAscend = !ascend
    }
    this.setState({
      sortStatusName: value,
      ascend: currentAscend
    }, () => {
      console.log(234243)
      this.changeStationData(2323)
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


  initRender = (initList = []) => { // 初次 => todo 若初始数据小于要求分割长度。
    const { renderList, spliceLength, stationCodeList } = this.state;
    const tmp = initList.slice(renderList.length, spliceLength + renderList.length);
    this.setState({
      renderList: renderList.concat(tmp),
      stationCodeList: stationCodeList.concat(tmp.map(e => e.stationCode))
    }, () => {
      this.setState({ renderLoading: false });
    });
  }

  render() {
    const { stationDataList, pvCapabilitydiagramsData, monitorPvUnit } = this.props;
    const { sortStatusName, ascend } = this.state;
    const { renderList, renderLoading, stationCodeList } = this.state;
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
          {renderList.length < stationDataList.length && <Spin size="large" style={{ margin: '30px auto', width: '100%' }} className={styles.loading} />}
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

          <div>
          </div>
        </div>

      </div>
    )
  }
}
export default (Test)