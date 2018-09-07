

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './pvStation.scss';
import { Carousel,Row, Col,Icon, Button, } from 'antd';
import { Link } from 'react-router-dom';

class CardSection extends Component {
  static propTypes = {
    match: PropTypes.object,
    weatherList: PropTypes.array,
    operatorList: PropTypes.array, 
    alarmList: PropTypes.object,
    workList: PropTypes.object,
    getWeatherList: PropTypes.func,
  }

  constructor(props){
    super(props);
    this.state={
      weatherIndex: 0,
      disabled1: true,
      disabled2: false,
    }
  }

  componentDidMount() {
    const { stationCode } = this.props.match.params;
    this.getData(stationCode);
  }

  componentWillReceiveProps(nextProps){
    const { stationCode } = this.props.match.params;
    const nextParams = nextProps.match.params;
    const nextStation = nextParams.stationCode;
    if( nextStation !== stationCode ){
      clearTimeout(this.timeOutId);
      this.getData(nextStation);
    }
    // this.props.changeSingleStationStore({deviceTypeCode: nextProps.deviceTypeCode});
  }

  componentWillUnmount(){
    clearTimeout(this.timeOutId);
  }

  getData = (stationCode) => {
    this.props.getWeatherList({stationCode});
    this.timeOutId = setTimeout(()=>{
      this.getData(stationCode);
    },3600000);
  }

  prev = () => {
    let weatherIndex = this.state.weatherIndex;
    this.setState({
      disabled2: false
    })
    let list = document.getElementsByClassName('weather');
    for (let i = 0; i < list.length; i++) {
      list[i].style.display = 'none';
    }
    document.getElementById(weatherIndex).style.display = 'inline-block';
    document.getElementById(weatherIndex + 1).style.display = 'inline-block';
    if (weatherIndex === 0) {
      this.setState({
        disabled1: true
      })
    } else {
      this.setState({
        weatherIndex: weatherIndex - 2
      })
    }
  }
  next = () => {
    let weatherIndex = this.state.weatherIndex;
    this.setState({
      disabled1: false
    })
    let list = document.getElementsByClassName('weather');
    for (let i = 0; i < list.length; i++) {
      list[i].style.display = 'none';
    }
    document.getElementById(weatherIndex + 2).style.display = 'inline-block';
    if (weatherIndex !== 4) {
      document.getElementById(weatherIndex + 3).style.display = 'inline-block';
    }
    if (weatherIndex === 4) {
      this.setState({
        disabled2: true
      })
    } else {
      this.setState({
        weatherIndex: weatherIndex + 2
      })
    }
  }
  render(){
    const {operatorList,weatherList,alarmList,workList } = this.props;
    const { disabled1,disabled2,} = this.state;
    let tmpOperatorList = [];
    if(operatorList){
      for(var i=0;i<operatorList.length;i+=3){
        tmpOperatorList.push(operatorList.slice(i,i+3));
      }
    }
    const ticketList = "/operation/ticket/list";
    const  alarmRealtime= "/monitor/alarm/realtime";
    return (
      <div className={styles.cardSection}>
        <Row gutter={16}  type="flex" justify="space-around" >
          <Col  span={6}>
            <div className={styles.operatorList} >
              <div className={styles.cardTitle}>电站运维人员</div>
              <Carousel autoplay dots={true} arrow={true} >
                {tmpOperatorList.length>0 ?
                  tmpOperatorList.map((item,index)=>{
                    return (<div key={index} className={styles.operatorContent} >
                      {item.map((e,i)=>{
                        return (
                          <div key={i} className={styles.userInfo} >
                            <Row>
                              <Col span={8}><div>{e.userFullName || e.userName}</div></Col>
                              <Col span={8}><div>{e.roleDesc}</div></Col>
                              <Col span={8}><div>{e.phoneNum}</div></Col>
                            </Row>
                          </div>
                        )
                      })}
                    </div>)
                  }) : <div className={styles.nopeople} ><div>暂未设置</div><img src="/img/nopeople.png" /></div>
                }
              </Carousel>
              {/* <img src="/img/blurbg.png" className={styles.blurbg} /> */}
            </div>
          </Col>
          <Col  span={6}>
            <div className={styles.weatherList}>
              {weatherList && weatherList.length>0 && 
                <div>
                  <Button type="primary" onClick={this.prev} disabled={disabled1} className={styles.weatherLeft} >
                    <Icon type="left" />
                  </Button>
                  <Button  type="primary" onClick={this.next} disabled={disabled2} className={styles.next} className={styles.weatherRight} >
                    <Icon type="right" />
                  </Button>
                </div>
              }
              {weatherList && weatherList.length>0 ? 
                weatherList.map((e,i)=>{
                  if(i<2){
                    return (<div style={{display:'inline-block',margin: '0 5px',}} key={e.date} className="weather"  id={Number(i)} >
                      <div>{i === 0 ? '今天' : (i === 1 ? '明天' : e.date )}</div>
                      <div><i className="" ></i></div>
                      <div className={i===0?styles.lightGreen:''}>{e.night.templow}-{e.day.temphigh}℃</div>
                      <div className={i===0?styles.lightGreen:''}>{e.day.weather}</div>
                      <div className={i===0?styles.lightGreen:''}>{e.day.winddirect}{e.day.windpower}</div>
                    </div>);
                  }else{
                    return (<div style={{display:'none',margin: '0 5px',}} key={e.date} className="weather" id={Number(i)} >
                      <div>{i === 0 ? '今天' : (i === 1 ? '明天' : e.date )}</div>
                      <div className={i===0?styles.lightGreen:''}>{e.night.templow}-{e.day.temphigh}℃</div>
                      <div className={i===0?styles.lightGreen:''}>{e.day.weather}</div>
                      <div className={i===0?styles.lightGreen:''}>{e.day.winddirect}{e.day.windpower}</div>
                    </div>);
                  }
                }) : <div className={styles.noweather} >暂无天气数据</div>
              }
            </div>
          </Col>
          <Col  span={6}>
            <div title="活动告警" className={styles.alarmList} >
              <div className={styles.cardTitle}>
                <span>活动告警</span>
                <Link to={alarmRealtime} target="_blank" ><i className="iconfont icon-more"></i></Link>
              </div>
              {alarmList &&
                <div className={styles.alarmContent} >
                  <div><div>{alarmList.oneWarningNum===null ? '--' : alarmList.oneWarningNum}</div><div className={styles.oneWarning}>一级</div></div>
                  <div><div>{alarmList.twoWarningNum===null ? '--' : alarmList.twoWarningNum}</div><div className={styles.twoWarning}>二级</div></div>
                  <div><div>{alarmList.threeWarningNum===null ? '--' : alarmList.threeWarningNum}</div><div className={styles.threeWarning}>三级</div></div>
                  <div><div>{alarmList.fourWarningNum===null ? '--' : alarmList.fourWarningNum}</div><div className={styles.fourWarning}>四级</div></div>
                </div>
              }
            </div>
          </Col>
          <Col  span={6}>
            <div title="电站工单" className={styles.workList} >
              <div className={styles.cardTitle}>
                <span>电站工单</span>
                <Link to={ticketList}  target="_blank"   >
                  <i className="iconfont icon-more" ></i>
                </Link>
              </div>
              {workList &&
                <div className={styles.workContent} >
                  <div><div>{workList.worklistNewNum===null ? '--' : workList.worklistNewNum}</div><div>今日新增</div></div>
                  <div><div>{workList.worklistHandleNum===null ? '--' : workList.worklistHandleNum}</div><div>处理中</div></div>
                  <div><div>{workList.worklistCompleteNum===null ? '--' : workList.worklistCompleteNum}</div><div>今日完成</div></div>
                </div>
              }
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}

export default CardSection;
