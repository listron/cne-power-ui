

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styles from './deviceList.scss';
import classnames from 'classnames';
import { Spin } from 'antd';
import { dataFormats } from '../../../../../../utils/utilFunc';

class PvmoduleList extends Component {
  static propTypes = {
    pvmoduleList: PropTypes.array,
    match: PropTypes.object,
    getPvmoduleList: PropTypes.func,
    loading: PropTypes.bool,
  }

  constructor(props) {
    super(props);
    this.state = {
      firstLoad: true,
      pvLevelStatus: '', // 为空的时候
    }
  }
  componentDidMount() {
    const { stationCode } = this.props.match.params;
    this.getData(stationCode);
  }

  componentWillReceiveProps(nextProps) {
    const { stationCode } = this.props.match.params;
    const nextParams = nextProps.match.params;
    const nextStation = nextParams.stationCode;
    if (nextStation !== stationCode) {
      clearTimeout(this.timeOutId);
      this.getData(nextStation);
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
    }, 10000);
  }
  compareName = (a, b) => {
    if (a['deviceName'] && b['deviceName']) {
      return a['deviceName'].localeCompare(b['deviceName']);
    }
  }

  buttonClick = (e) => {
    const { pvLevelStatus } = this.state;
    this.setState({ pvLevelStatus: e === pvLevelStatus ? '' : e })
  }
  render() {
    const { pvmoduleList, loading, pvLevelNums,deviceTypeCode } = this.props;
    const { pvLevelStatus } = this.state;
    const pvmoduleListSet = Array.from(new Set(pvmoduleList));
    let statusArray = ['big', 'normal', 'small', 'abnormal']
    const tmpPvmoduleList = pvLevelStatus ? pvmoduleListSet.filter(e => e.pvAllLevel.includes((statusArray.findIndex(item => item === pvLevelStatus)) + 1)) : pvmoduleListSet;
    // 评价等级(1-蓝色、2-绿色、3-橙色、4-红色)
    const pvStatus = [
      { name: 'normal', value: '正常', useName: 'pvNormalNum' },
      { name: 'small', value: '偏小', useName: 'pvSmallerNum' },
      { name: 'abnormal', value: '异常', useName: 'pvAbnormalNum' },
      { name: 'big', value: '偏大', useName: 'pvBiggerNum' },
    ];
    const baseLinkPath = "/hidden/monitorDevice";
    const { stationCode } = this.props.match.params;
    return (
      <div className={styles.pvmodule}>
        <div className={styles.pvmoduleList} >
          <div className={styles.pvmoduleListTop}>
            {pvStatus.map(item => {
              return (
                <p className={`${styles.pvmoduleSelect} ${styles[item.name]} ${pvLevelStatus === item.name && styles.active}`} key={item.name}
                  onClick={() => { this.buttonClick(item.name) }}>
                  {pvLevelStatus !== item.name && <i className={'iconfont icon-goon'}></i>}
                  {pvLevelStatus === item.name && <i className={'iconfont icon-done'}></i>}
                  {item.value} {pvLevelNums[item.useName] || '--'}
                </p>)
            })}
          </div>
          <div className={styles.pvmoduleCont}>
            {loading ? <Spin size="large" style={{ height: '100px', margin: '200px auto', width: '100%' }} /> :
              (tmpPvmoduleList.length > 0 ? tmpPvmoduleList.sort(this.compareName).map((item, index) => {
                const { deviceCode, deviceName } = item;
                const parentTypeCode= deviceCode.split('M')[1];
                return (
                  <div key={index} className={styles.pvmoduleItem} >
                    <div className={styles.deviceName} >
                      <i className="iconfont icon-nb" ></i>
                      <Link to={`${baseLinkPath}/${stationCode}/${parentTypeCode}/${deviceCode}`}>
                        {deviceName}
                      </Link>
                    </div>
                    <div className={styles.singlePvmodule}>
                      {item.electricityList.map((e, i) => {
                        let pointLevelName = ['big', 'normal', 'small', 'abnormal',][e.pointLevel - 1];
                        return (<span className={classnames({
                          normalValue: !!e.pointStatus,
                          commonStyle: true,
                          [pointLevelName]: !!e.pointStatus,
                        })} key={i}>
                          {!!e.pointStatus && dataFormats(e.pointValue, '--', 2, false)}
                        </span>)
                      })}
                    </div>
                  </div>
                );
              }) : <div className={styles.nodata} ><img src="/img/nodata.png" /></div>)
            }
          </div>

        </div>
      </div>
    )
  }
}

export default PvmoduleList;

