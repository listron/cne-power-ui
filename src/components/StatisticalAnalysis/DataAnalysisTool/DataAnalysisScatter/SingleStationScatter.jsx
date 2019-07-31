import React from 'react';
import PropTypes from 'prop-types';
import styles from './dataAnalysisStyle.scss';
import StationSelect from '../../../Common/StationSelect';
import { Button, DatePicker, Cascader, Icon } from 'antd';
import moment from 'moment';
const { RangePicker } = DatePicker;

class SingleStationScatter extends React.Component {
  static propTypes = {
    stationCode: PropTypes.number,
    stations: PropTypes.array,
    changeToolStore: PropTypes.func,
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      isSwap: false,
    };
  }
  selectStationCode = (stationCodeArr) => {
    const { stationCode } = stationCodeArr[0];
    console.log('stationCode: ', stationCode);
    this.props.changeToolStore({
      stationCode,
    });

  }
  changeTime = (date, dateString) => {
    console.log('dateString: ', dateString);
    console.log('date: ', date);

  }
  loadData = (selectedOptions) => {
    console.log('selectedOptions: ', selectedOptions);

  }
  onChangeContrast = (value) => {
    console.log('value: ', value);

  }
  getScatterData = () => {
    //请求数据
  }
  downPic = () => {
    //下载照片
  }
  changeSwap = () => {
    this.setState({
      isSwap: !this.state.isSwap,
    });
  }
  render() {
    const { stationCode, stations } = this.props;
    const { isSwap } = this.state;
    const options = [{
      value: '风速相关',
      label: '风速相关',
      isLeaf: false,
    },
    {
      value: '功率相关',
      label: '功率相关',
      isLeaf: false,
    }, {
      value: '转速相关',
      label: '转速相关',
      isLeaf: false,
    }, {
      value: '震动相关',
      label: '震动相关',
      isLeaf: false,
    }, {
      value: '其他',
      label: '其他',
      isLeaf: false,
    },
    ];
    console.log('stationCode: ', stationCode);
    const dateFormat = 'YYYY.MM.DD';
    const selectStation = stations.filter(e => e.stationCode === 0);
    return (
      <div className={styles.singleStationBox}>
        <div className={styles.headBox}>
          <div className={styles.headTop}>
            <label className={styles.nameStyle}>电站</label>
            <StationSelect
              onOK={this.selectStationCode}
              data={selectStation}
              value={stations.filter(e => e.stationCode === stationCode)}
            />

            <label className={styles.nameStyle}>时间</label>
            <RangePicker
              defaultValue={[moment(moment().subtract(1, 'months'), dateFormat), moment(moment(), dateFormat)]}
              format={dateFormat}
              onChange={this.changeTime}
            />
          </div>
          <div className={styles.headBottom}>
            <label className={styles.nameStyle}>散点</label>
            <Cascader
              options={options}
              loadData={this.loadData}
              onChange={this.onChangeContrast}
            />
            <div className={styles.contrastValue}>
              <Button className={isSwap ? styles.swapStyle : styles.defaultStyle} onClick={this.getScatterData}>x轴</Button>
              <Icon type="swap" className={isSwap ? styles.swapIcon : styles.nomalIcon} onClick={this.changeSwap} />
              <Button className={isSwap ? styles.swapStyle : styles.defaultStyle} onClick={this.downPic}>y轴</Button>
            </div>
            <Button className={styles.seachBtn} onClick={this.getScatterData}>查询</Button>
            <Button className={styles.seachBtn} onClick={this.downPic}>图片下载</Button>

          </div>
        </div>
        <div className={styles.scatterBox}></div>

      </div>
    );
  }
}
export default (SingleStationScatter);
