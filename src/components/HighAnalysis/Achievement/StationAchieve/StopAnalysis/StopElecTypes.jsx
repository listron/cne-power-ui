import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import { dataFormats } from '../../../../../utils/utilFunc';
import styles from './stop.scss';
const { Option } = Select;

class StopElecTypes extends Component {

  static propTypes = {
    stopElecType: PropTypes.string,
    stopChartTimeMode: PropTypes.string,
    stopElec: PropTypes.array,
    stopTopStringify: PropTypes.string,
    changeStore: PropTypes.func,
    getStopRank: PropTypes.func,
    getStopTrend: PropTypes.func,
    getStopTypes: PropTypes.func,
  }

  state = {
    showDetail: false,
    detailInfo: {},
  }

  resetElecTypes = (elecArr = []) => {
    const colors = [
      ['#ec8284', '#a42b2c'],
      ['#e59f2d', '#c66614'],
      ['#f2c605', '#e4de35'],
      ['#07c8ec', '#0397d4'],
      ['#1cb78a', '#0c8052'],
    ];
    const sumValue = elecArr.reduce((a, b) => (a + b.value), 0);
    return elecArr.map((e, i) => ({
      value: e.value,
      label: e.name,
      key: e.name,
      rate: dataFormats((e.value / sumValue * 100), '--', 2, true),
      color: colors[i % colors.length],
    })).sort((a, b) => b.value - a.value);
  }

  stopTypeChange = (stopElecType) => {
    const { stopChartTimeMode, stopTopStringify } = this.props;
    this.props.changeStore({ stopElecType });
    let tmpParams = {};
    try {
      tmpParams = JSON.parse(stopTopStringify);
    } catch (error) { console.log(error); }
    const params = {
      stationCodes: [tmpParams.code],
      deviceFullcodes: tmpParams.device,
      startTime: tmpParams.date[0],
      endTime: tmpParams.date[1],
    };
    this.props.getStopRank({ ...params, parentFaultId: stopElecType });
    this.props.getStopTrend({ ...params, parentFaultId: stopElecType, type: stopChartTimeMode });
    this.props.getStopTypes({ ...params, parentFaultId: stopElecType });
  }

  toShowDetail = (detailInfo) => this.setState({
    showDetail: true,
    detailInfo,
  })

  toHideDetail = () => this.setState({
    showDetail: false,
    detailInfo: {},
  })

  render() {
    const { stopElecType, stopElec } = this.props;
    const { showDetail, detailInfo } = this.state;
    const formattedElecs = this.resetElecTypes(stopElec);
    let detailLeft = 0;
    formattedElecs.find(e => {
      if(e.key !== detailInfo.key){
        detailLeft += parseFloat(e.rate);
      }
      return e.key === detailInfo.key;
    });
    return (
      <div className={styles.eleTypes}>
        <div className={styles.info}>
          {formattedElecs.map((e, i) => (
            e.rate > 0 ? <span
              key={e.key}
              className={`${styles.eachInfo} ${stopElecType === e.key ? styles.active : null}`}
              onMouseEnter={() => this.toShowDetail(e)}
              onMouseOut={() => this.toHideDetail()}
              style={{
                flexBasis: `${e.rate}%`,
                backgroundImage: `linear-gradient(90deg, ${e.color[0]} 0%, ${e.color[1]} 100%)`,
              }}
            >
              {e.label}
              {i === 0 && ` ${dataFormats(dataFormats(e.value) / 10000, '--', 2, true)}万kWh ${e.rate}%`}
            </span> : null
          ))}
          {showDetail && <section className={styles.detail} style={{
              left: `${detailLeft}%`,
          }}>
            <h3 className={styles.title}>{detailInfo.label}</h3>
            <div className={styles.lostContent}>
              <p className={styles.eachDetail}>
                <span className={styles.detailText}>损失电量</span>
                <span className={styles.detailText}>
                  {dataFormats(dataFormats(detailInfo.value) / 10000, '--', 2, true)}
                  万kWh
                </span>
              </p>
              <p className={styles.eachDetail}>
                <span className={styles.detailText}>占比</span>
                <span className={styles.detailText}>{detailInfo.rate}%</span>
              </p>
            </div>
          </section>}
        </div>
        <div>
          <span className={styles.stopTypeHanlder}>停机类型</span>
          <Select
            onChange={this.stopTypeChange}
            value={stopElecType}
            style={{width: '150px'}}
          >
            <Option value="all">全部类型</Option>
            {[...stopElec].sort((a, b) => a.parentFaultId - b.parentFaultId).map(e => (
              <Option key={e.name} value={e.parentFaultId}>{e.name}</Option>
            ))}
          </Select>
        </div>
      </div>
    );
  }
}

export default StopElecTypes;

