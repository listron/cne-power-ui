import React, { Component } from 'react';
import StationTypeTag from './StationTypeTag';
import styles from './homeParts.scss';
import PropTypes from 'prop-types';
import { dataFormat } from '../../../utils/utilFunc';
import { showNoData, hiddenNoData } from '../../../constants/echartsNoData';

class EqpHours extends Component{
  static propTypes = {
    eqpHour: PropTypes.object,
    hasMultipleType: PropTypes.bool,
    getEqpHours: PropTypes.func,
  }

  constructor(props){
    super(props);
    this.state = {
      eqpType: 'wind',
      rectNum: 20,
      rectWidth: 6,
    }
  }

  changeEqpType = (eqpType) => {
    this.setState({ eqpType });
    this.props.getEqpHours(eqpType);
  }

  render(){
    const { eqpType, rectWidth, rectNum } = this.state;
    const { eqpHour } = this.props;
    const averageHour = dataFormat(eqpHour.average);
    const stationDataArr = eqpHour.hourList || [];
    const maxHour = stationDataArr[0] && stationDataArr[0].average || 100;
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
                  const hourRectNum = e.average/maxHour*rectNum;
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
              <span className={styles.hour}>{dataFormat(e.average)}h</span>
            </div>
          ))}
        </div>
        <div className={styles.average} >
          <span className={styles.averageText} >平均: </span>
          <span className={styles.averageNum}>{averageHour}</span>
          <span className={styles.averageText}>h</span>
        </div>
      </section>
    )
  }
}

export default EqpHours;
