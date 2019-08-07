

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styles from './deviceList.scss';
import { Spin } from 'antd';
import { dataFormats } from '../../../../../../utils/utilFunc';
import { throttle } from 'lodash';

class PvmoduleList extends Component {
  static propTypes = {
    pvmoduleList: PropTypes.array,
    match: PropTypes.object,
    getPvmoduleList: PropTypes.func,
    loading: PropTypes.bool,
    pvLevelNums: PropTypes.object,
    moduleTime: PropTypes.number,
  }

  constructor(props) {
    super(props);
    this.state = {
      firstLoad: true,
      pvLevelStatus: '', // 为空的时候
      renderList: [],
      spliceLength: 72, // 30条数据一渲染。
      topHeight: 400, // 假设的列表上方高度
      newList: [],
    };
  }

  componentDidMount() {
    const { stationCode } = this.props.match.params;
    this.getData(stationCode);
    const main = document.getElementById('main');
    main.addEventListener('scroll', throttle(() => {
      if (this.newPinterest) {
        const { renderList, topHeight } = this.state;
        const clientH = document.documentElement.clientHeight; // 客户端高度
        const scrollTop = main.scrollTop; // 卷曲出去的高度
        const tableHeight = this.newPinterest.clientHeight; // 表格现在的高度。
        const resHeight = tableHeight + topHeight - scrollTop - clientH;
        if (resHeight < 50) { //表格内容
          if (renderList.length < this.props.pvmoduleList.length) {
            this.initRender(true);
          }
        }
      }
    }, 1000));
  }

  componentWillReceiveProps(nextProps) {
    const { stationCode } = this.props.match.params;
    const nextParams = nextProps.match.params;
    const nextStation = nextParams.stationCode;
    if (nextStation !== stationCode) {
      clearTimeout(this.timeOutId);
      this.getData(nextStation);
    }
    if (nextProps.moduleTime !== this.props.moduleTime) {
      this.changeStationData(nextProps.pvmoduleList);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeOutId);
  }

  getData = (stationCode) => {
    const { firstLoad } = this.state;
    this.props.getPvmoduleList({ stationCode, firstLoad });
    this.timeOutId = setTimeout(() => {
      if (firstLoad) {
        this.setState({ firstLoad: false });
      }
      this.getData(stationCode);
    }, 60000);
  }


  changeStationData = (pvmoduleList) => { // 改变数据之后改变
    const { pvLevelStatus } = this.state;
    const tmpPvmoduleList = pvLevelStatus ? pvmoduleList.filter(e => e.pvAllLevel.includes(pvLevelStatus)) : pvmoduleList;
    this.setState({ newList: tmpPvmoduleList }, () => {
      this.initRender();
    });
  }


  initRender = (initLoad) => { //  渲染todolist 的条数
    const { renderList, spliceLength, newList } = this.state;
    const tmp = newList.slice(0, spliceLength + renderList.length);
    const updateTmp = newList.slice(0, renderList.length || spliceLength);
    this.setState({
      renderList: initLoad ? tmp : updateTmp,
    });
  }

  pointStatus = {
    '801': { backgroundColor: '#f9b600', color: '#fff' }, // 偏低
    '802': { backgroundColor: '#3e97d1', color: '#fff' }, // 偏高
    '803': { backgroundColor: '#a42b2c', color: '#fff' }, // 异常
    '400': { backgroundColor: '#ceebe0', color: '#199475' }, // 正常
    '500': { backgroundColor: '#f1f1f1', color: '#fff' }, // 无通讯
    '900': { backgroundColor: '#f1f1f1', color: '#fff' }, // 未接入
  }

  buttonClick = (e) => {
    const { pvLevelStatus } = this.state;
    const { pvmoduleList } = this.props;
    this.setState({
      pvLevelStatus: e === pvLevelStatus ? '' : e,
      renderList: [],
    }, () => { this.changeStationData(pvmoduleList); });
  }

  render() {
    const { pvmoduleList, loading, pvLevelNums } = this.props;
    const { pvLevelStatus, renderList } = this.state;
    const tmpPvmoduleList = pvLevelStatus ? pvmoduleList.filter(e => e.pvAllLevel.includes(pvLevelStatus)) : pvmoduleList;
    const pvStatus = [
      { name: 'normal', text: '正常', useName: 'pvNormalNum', pointStatus: '400' },
      { name: 'abnormal', text: '异常', useName: 'pvAbnormalNum', pointStatus: '803' },
      { name: 'small', text: '偏小', useName: 'pvSmallerNum', pointStatus: '801' },
      { name: 'big', text: '偏大', useName: 'pvBiggerNum', pointStatus: '802' },
    ];
    const baseLinkPath = '/hidden/monitorDevice';
    const { stationCode } = this.props.match.params;
    return (
      <div className={styles.pvmodule}>
        <div className={styles.pvmoduleList} >
          {loading ? <Spin size="large" style={{ height: '100px', margin: '200px auto', width: '100%' }} /> :
            <React.Fragment>
              <div className={styles.pvmoduleListTop}>
                {
                  pvStatus.map(item => {
                    return (
                      <p className={`${styles.pvmoduleSelect} ${styles[item.name]} ${pvLevelStatus === item.pointStatus && styles.active}`} key={item.name}
                        onClick={() => { this.buttonClick(item.pointStatus); }}>
                        {pvLevelStatus !== item.pointStatus && <i className={'iconfont icon-goon'}></i>}
                        {pvLevelStatus === item.pointStatus && <i className={'iconfont icon-done'}></i>}
                        {item.text} {dataFormats(pvLevelNums[item.useName], '--', 0)}
                      </p>);
                  })}
              </div>
              <div className={styles.pvmoduleCont} ref={ref => this.newPinterest = ref}>
                {(tmpPvmoduleList.length > 0 ?
                  <React.Fragment>
                    {renderList.map((item, index) => {
                      const { deviceCode, deviceName } = item;
                      const parentTypeCode = deviceCode && deviceCode.split('M')[1] || '';
                      return (
                        <div key={item.deviceCode} className={styles.pvmoduleItem} >
                          <div className={styles.deviceName} >
                            <i className="iconfont icon-nb" ></i>
                            {deviceCode && <Link to={`${baseLinkPath}/${stationCode}/${parentTypeCode}/${deviceCode}`}>
                              {deviceName}
                            </Link> || deviceName}
                          </div>
                          <div className={styles.singlePvmodule}>
                            {item.electricityList.map((e, i) => {
                              const colorStatus = this.pointStatus[e.pointStatus];
                              return (
                                <span
                                  style={{ backgroundColor: colorStatus.backgroundColor, color: colorStatus.color }}
                                  className={styles.commonStyle}
                                  key={e.pointName}
                                >
                                  {e.pointStatus !== '900' && dataFormats(e.pointValue, '--', 2, false)}
                                </span>);
                            })}
                          </div>
                        </div>
                      );
                    })}
                    {renderList.length > 0 && (renderList.length < tmpPvmoduleList.length) && <Spin size="large" style={{ margin: '30px auto', width: '100%' }} className={styles.loading} />}
                  </React.Fragment>
                  : <div className={styles.nodata} ><img src="/img/nodata.png" /></div>)}
              </div>
            </React.Fragment>
          }
        </div>
      </div>
    );
  }
}

export default PvmoduleList;

