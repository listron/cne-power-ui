

import React, { Component } from 'react';
import { Progress } from 'antd';
import PropTypes from 'prop-types';
import styles from './style.scss';

/*
  带文字输入的进度条组件：
  说明： 
    1. 要求组件必须传输属性：value：实际值，total：总计划值，valueText：实际值文字描述，totalText：计划值文字描述;
*/
class CommonProgress extends Component {
  static propTypes = {
    value: PropTypes.string,//实际值，左上角
    total: PropTypes.string,//总计划值，右上角
    valueText: PropTypes.string,//实际值文字描述，左下角
    totalText: PropTypes.string,//计划值文字描述。右下角
    percent: PropTypes.string,//百分比，右边，选填，若无不显示
  }

  static defaultProps = {
    percent: '',//默认不显示百分比
  }

  constructor(props){
    super(props);
  }
  

  render(){
    const { value, total, valueText, totalText, percent} = this.props;
    return (
      <div className={styles.commonProgress}>
          <div className={styles.progressInfo}>
            <div className={styles.progressData}>
              <div className={styles.stationValue}>
                <div>{value}</div>
                <div>{total}</div>
              </div>
              <div className={styles.progressBar}>
                <Progress percent={value / total * 100} showInfo={false} status="active" />
              </div>
              <div className={styles.stationType}>
                <div>{valueText}</div>
                <div>{totalText}</div>
              </div>
            </div>
            {percent?<div className={styles.showInfo}>{percent}</div>:''}        
          </div>
      </div>
    )
  }
}

export default CommonProgress;
