import React, { Component } from 'react';
import StationTypeTag from './StationTypeTag';
import styles from './homeParts.scss';
import PropTypes from 'prop-types';
import { showNoData, hiddenNoData } from '../../../constants/echartsNoData';

class EqpHours extends Component{
  static propTypes = {
    hasMultipleType: PropTypes.bool
  }

  constructor(props){
    super(props);
    this.state = {
      eqpType: 'all',
      rectNum: 20,
      rectWidth: 6,
    }
  }

  changeEqpType = (eqpType) => {
    this.setState({ eqpType });
  }

  render(){
    const { eqpType, rectWidth, rectNum } = this.state;
    const stationDataArr = [
      { stationName: '盐源下大沟', hour: 10},
      { stationName: '富川朝东', hour: 9.5},
      { stationName: '富川潮汐', hour: 8},
      { stationName: '芜湖饮马河', hour: 7.75},
      { stationName: '成吉思汗', hour: 6.87},
    ];
    const maxHour = stationDataArr[0].hour;
    let tmpArr = [];
    tmpArr.length = rectNum;
    tmpArr.fill(0);
    return (
      <section className={styles.eqpHours}>
        <h3>等效利用小时数 TOP5</h3>
        <div className={styles.checkTags}>
          <StationTypeTag showTotal={false} activeType={eqpType} onChange={this.changeEqpType} />
        </div>
        <div className={styles.stationProgress}>
          {stationDataArr.map(e=>(
            <div className={styles.eachStation} key={e.stationName}>
              <span className={styles.stationName}>{e.stationName}</span>
              <div style={{width: `${rectNum*(rectWidth + 2)}px`}} className={styles.hourRectGroup}>{
                tmpArr.map((each, index)=>{ // 根据比例计算需要占多少个块，并计算最后一个块的宽度
                  const hourRectNum = e.hour/maxHour*rectNum;
                  let innerWidth = 0;
                  if(hourRectNum >= index + 1){ // 超出部分
                    innerWidth = rectWidth;
                  }else if(hourRectNum > index && hourRectNum < index + 1){ // 部分渲染
                    innerWidth = Math.ceil((hourRectNum - index) * rectWidth);
                  }else if(hourRectNum <= index){ // 未达到的等效小时
                    innerWidth = 0;
                  }
                  return (
                    <div 
                      key={index} 
                      className={styles.eachRect} 
                      style={{width: `${rectWidth}px`,height: `${rectWidth}px`}} 
                    >
                      <div style={{width: `${innerWidth}px`}} className={styles.highLightRect}></div>
                    </div>
                  )
                })
              }</div>
              <span className={styles.hour}>{e.hour}h</span>
            </div>
          ))}
        </div>
        <div className={styles.average} >
          <span className={styles.averageText} >平均: </span>
          <span className={styles.averageNum}>9.95</span>
          <span className={styles.averageText}>h</span>
        </div>
      </section>
    )
  }
}

export default EqpHours;
