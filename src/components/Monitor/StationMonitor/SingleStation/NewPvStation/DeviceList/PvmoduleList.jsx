

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
    pvLevelNums: PropTypes.object,
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
    }, 60000);
  }

  pointStatus = {
    '801': { backgroundColor: '#f9b600', color: '#fff' },// 偏低
    '802': { backgroundColor: '#3e97d1', color: '#fff' }, // 偏高
    '803': { backgroundColor: '#a42b2c', color: '#fff' }, // 异常
    '400': { backgroundColor: '#ceebe0', color: '#199475' }, // 正常
    '500': { backgroundColor: '#f1f1f1', color: '#fff' }, // 无通讯
    '900': { backgroundColor: '#f1f1f1', color: '#fff' },// 未接入
  }

  buttonClick = (e) => {
    const { pvLevelStatus } = this.state;
    this.setState({ pvLevelStatus: e === pvLevelStatus ? '' : e })
  }
  render() {

    const { pvmoduleList, loading, pvLevelNums, deviceTypeCode } = this.props;
    const { pvLevelStatus } = this.state;
    const tmpPvmoduleList = pvLevelStatus ? pvmoduleList.filter(e => e.pvAllLevel.includes(pvLevelStatus)) : pvmoduleList;
    const pvStatus = [
      { name: 'normal', text: '正常', useName: 'pvNormalNum', pointStatus: '400' },
      { name: 'abnormal', text: '异常', useName: 'pvAbnormalNum', pointStatus: '803' },
      { name: 'small', text: '偏小', useName: 'pvSmallerNum', pointStatus: '801' },
      { name: 'big', text: '偏大', useName: 'pvBiggerNum', pointStatus: '802' },
    ];
    const baseLinkPath = "/hidden/monitorDevice";
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
                        onClick={() => { this.buttonClick(item.pointStatus) }}>
                        {pvLevelStatus !== item.pointStatus && <i className={'iconfont icon-goon'}></i>}
                        {pvLevelStatus === item.pointStatus && <i className={'iconfont icon-done'}></i>}
                        {item.text} {dataFormats(pvLevelNums[item.useName], '--', 0)}
                      </p>)
                  })}
              </div>
              <div className={styles.pvmoduleCont}>
                {(tmpPvmoduleList.length > 0 ? tmpPvmoduleList.map((item, index) => {
                  const { deviceCode, deviceName } = item;
                  const parentTypeCode = deviceCode && deviceCode.split('M')[1] || '';
                  return (
                    <div key={index} className={styles.pvmoduleItem} >
                      <div className={styles.deviceName} >
                        <i className="iconfont icon-nb" ></i>
                        {deviceCode && <Link to={`${baseLinkPath}/${stationCode}/${parentTypeCode}/${deviceCode}`}>
                          {deviceName}
                        </Link> ||  deviceName}
                      </div>
                      <div className={styles.singlePvmodule}>
                        {item.electricityList.map((e, i) => {
                          const colorStatus = this.pointStatus[e.pointStatus];
                          return (
                            <span
                              style={{ backgroundColor: colorStatus.backgroundColor, color: colorStatus.color }}
                              className={styles.commonStyle}
                              key={i}
                            >
                              {e.pointStatus !== '900' && dataFormats(e.pointValue, '--', 2, false)}
                            </span>)
                        })}
                      </div>
                    </div>
                  );
                }) : <div className={styles.nodata} ><img src="/img/nodata.png" /></div>)}
              </div>
            </React.Fragment>

          }

        </div>
      </div>
    )
  }
}

export default PvmoduleList;

