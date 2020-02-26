import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { message } from 'antd';
import styles from './meterRead.scss';
import MeterReadTable from './MeterReadTable';
import PowerPrice from './PowerPrice';

class MeterReadSingleSatation extends Component{
  static propTypes= {
    stationName: PropTypes.string,
    theme: PropTypes.string,
    changeMeterReadSetStore: PropTypes.func,
    addDataNum: PropTypes.number,
    isEditPrice: PropTypes.bool,
    isEditList: PropTypes.bool,
  }
  constructor(props){
    super(props);
  }
  onBack = () => {
    const { addDataNum, changeMeterReadSetStore, isEditPrice, isEditList } = this.props;
    if (isEditPrice) {
      changeMeterReadSetStore({isPriceTip: true});
      setTimeout(() => {
        changeMeterReadSetStore({ isPriceTip: false });
      }, 3000);
      return;
    }
    if (addDataNum > 1) {
      changeMeterReadSetStore({ isListTip: true });
      setTimeout(() => {
        changeMeterReadSetStore({ isListTip: false });
      }, 3000);
      return;
    }
    if (isEditList) {
      changeMeterReadSetStore({ isListTip: true });
      setTimeout(() => {
        changeMeterReadSetStore({ isListTip: false });
      }, 3000);
      return;
    }
    changeMeterReadSetStore({showPage: 'allStation'});
  }

  render(){
    const { stationName, theme } = this.props;
    return(
      <div className={`${styles.meterReadSingle} ${styles[theme]}`}>
        <div className={styles.meterReadSingleTop}>
          <div className={styles.text}><i className="iconfont icon-biao" />{stationName} - 电表设置</div>
          <div className={styles.backIcon} onClick={this.onBack}><i className="iconfont icon-fanhui" /></div>
        </div>
        <MeterReadTable {...this.props} />
        <PowerPrice {...this.props} />
      </div>
    );
  }
}

export default MeterReadSingleSatation;
