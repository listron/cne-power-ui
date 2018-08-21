

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './pvStation.scss';
import { Carousel,Row, Col,Icon } from 'antd';

class CardSection extends Component {
  static propTypes = {
    weatherList: PropTypes.array,
    operatorList: PropTypes.array, 
    alarmList: PropTypes.object,
    workList: PropTypes.object, 
  }

  constructor(props){
    super(props);
  }
  
  render(){
    const {operatorList,weatherList,alarmList,workList } = this.props;
    let tmpOperatorList = [];
    for(var i=0;i<operatorList.length;i+=3){
      tmpOperatorList.push(operatorList.slice(i,i+3));
    }
    return (
      <div className={styles.cardSection}>
        <Row gutter={16}  type="flex" justify="space-around" >
          <Col  span={6}>
            <div className={styles.operatorList} >
              <div className={styles.cardTitle}>电站运维人员</div>
              <Carousel autoplay dots={true} arrow={true} >
                {tmpOperatorList.length>0 &&
                  tmpOperatorList.map((item,index)=>{
                    return (<div key={index} className={styles.operatorContent} >
                      {item.map(e=>{
                        return (
                          <div key={e.userFullName} ><span>{e.userFullName}</span><span style={{margin: "0 10px"}}>{e.roleName}</span><span>{e.phoneNum}</span></div>
                        )
                      })}
                    </div>)
                  })
                }
              </Carousel>
            </div>
          </Col>
          <Col  span={6}>
            <div className={styles.weatherList}>
              <Icon type="left"  className={styles.weatherLeft} />
              <Icon type="right"   className={styles.weatherRight} />
              <Carousel autoplay={false} dots={false} arrow={true} >
                {weatherList.length>0 &&
                  weatherList.map(e=>{
                    return (<div key={e.dateDay} className={styles.weatherContent}>
                      <div>{e.dateDay}</div>
                      <div>{e.tempLow}-{e.tempHigh}℃</div>
                      <div>{e.weather}</div>
                      <div>{e.windDirect}</div>
                    </div>);
                  })
                }
              </Carousel>
            </div>
          </Col>
          <Col  span={6}>
            <div title="活动告警" className={styles.alarmList} >
              <div className={styles.cardTitle}><span>活动告警</span><i className="iconfont icon-more"></i></div>
              {alarmList &&
                <div className={styles.alarmContent} >
                  <div><div>{alarmList.oneWarningNum}</div><div className={styles.oneWarning}>一级</div></div>
                  <div><div>{alarmList.twoWarningNum}</div><div className={styles.twoWarning}>二级</div></div>
                  <div><div>{alarmList.threeWarningNum}</div><div className={styles.threeWarning}>三级</div></div>
                  <div><div>{alarmList.fourWarningNum}</div><div className={styles.fourWarning}>四级</div></div>
                </div>
              }
            </div>
          </Col>
          <Col  span={6}>
            <div title="电站工单" className={styles.workList} >
              <div className={styles.cardTitle}><span>电站工单</span><i className="iconfont icon-more"></i></div>
              {workList &&
                <div className={styles.workContent} >
                  <div><div>{workList.worklistNewNum}</div><div>今日新增</div></div>
                  <div><div>{workList.worklistHandleNum}</div><div>处理中</div></div>
                  <div><div>{workList.worklistCompleteNum}</div><div>今日完成</div></div>
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
