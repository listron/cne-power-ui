

import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
      pvLevelStatus:'', // 为空的时候
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

  buttonClick=(e)=>{
    const {pvLevelStatus}=this.state;
    this.setState({pvLevelStatus:e===pvLevelStatus?'':e})
  }
  render() {
    const { pvmoduleList, loading, pvLevelNums } = this.props;
    const {pvLevelStatus}=this.state;
    const pvmoduleListSet = Array.from(new Set(pvmoduleList));
    let statusArray=['big', 'normal', 'small','abnormal']
    const tmpPvmoduleList= pvLevelStatus ? pvmoduleListSet.filter(e=>e.pvAllLevel.includes((statusArray.findIndex(item=>item===pvLevelStatus))+1)):pvmoduleListSet;
    // const pvLevelNums = {
    //   pvNormalNum: '101',
    //   pvSmallerNum: '201',
    //   pvBiggerNum: '302',
    //   pvAbnormalNum: '403',
    // }
    // console.log('pvmoduleList', pvmoduleList)
    // 评价等级(1-蓝色、2-绿色、3-橙色、4-红色)
    
    return (
      <div className={styles.pvmodule}>
        <div className={styles.pvmoduleList} >
          <div className={styles.pvmoduleListTop}>
            <p className={`${styles.normal} ${pvLevelStatus==='normal' && styles.active}` } onClick={()=>{this.buttonClick('normal')}}>正常 {pvLevelNums.pvNormalNum || '--'}</p>
            <p className={`${styles.small} ${pvLevelStatus==='small' && styles.active}`} onClick={()=>{this.buttonClick('small')}}>偏小 {pvLevelNums.pvSmallerNum || '--'}</p>
            <p className={`${styles.abnormal} ${pvLevelStatus==='abnormal' && styles.active}`} onClick={()=>{this.buttonClick('abnormal')}}>异常 {pvLevelNums.pvBiggerNum || '--'}</p>
            <p className={`${styles.big} ${pvLevelStatus==='big' && styles.active}`} onClick={()=>{this.buttonClick('big')}}>偏大 {pvLevelNums.pvAbnormalNum || '--'}</p>
          </div>
          <div className={styles.pvmoduleCont}>
            {loading ? <Spin size="large" style={{ height: '100px', margin: '200px auto', width: '100%' }} /> :
              (tmpPvmoduleList.length > 0 ? tmpPvmoduleList.sort(this.compareName).map((item, index) => {
                return (
                  <div key={index} className={styles.pvmoduleItem} >
                    <div className={styles.deviceName} ><i className="iconfont icon-nb" ></i>{item.deviceName}</div>
                    {item.electricityList.map((e, i) => {
                      let pointLevelName = ['big', 'normal', 'small','abnormal',][e.pointLevel - 1];
                      return (<span className={classnames({
                        normalValue: !!e.pointStatus,
                        commonStyle: true,
                        [pointLevelName]: !!e.pointStatus,
                      })} key={i}>
                        {!!e.pointStatus && dataFormats(e.pointValue, '--', 1, false)}
                      </span>)
                    })}
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
