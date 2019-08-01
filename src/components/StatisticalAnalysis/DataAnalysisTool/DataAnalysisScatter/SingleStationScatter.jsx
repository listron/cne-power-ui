import React from 'react';
import PropTypes from 'prop-types';
import styles from './dataAnalysisStyle.scss';
import StationSelect from '../../../Common/StationSelect';
import ScatterContainer from './ScatterContainer';
import { Button, DatePicker, Cascader, Icon } from 'antd';
import moment from 'moment';
const { RangePicker } = DatePicker;
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
class SingleStationScatter extends React.Component {
  static propTypes = {
    stationCode: PropTypes.number,
    stations: PropTypes.array,
    scatterNames: PropTypes.array,
    changeToolStore: PropTypes.func,
    getScatterName: PropTypes.func,
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      isSwap: false,
      options,
      scatterNameValue: [],
      xPointName: '',
      yPointName: '',
    };
  }
  componentWillReceiveProps(nextProp) {
    const { scatterNames } = nextProp;
    const preScatterName = this.props.scatterNames;
    if (!preScatterName.length && scatterNames.length > 0) {
      const children = scatterNames.map((e, i) => ({
        value: `${e.xPointCode}_${e.yPointCode}`,
        label: `${e.pointsUnionName}`,
      }));
      const { options } = this.state;
      const firstOPtion = options.map((e, i) => {
        if (i === 0) { e.children = children; }
        return e;
      });
      console.log('firstOPtion: ', firstOPtion);

      const { xPointName, yPointName, xPointCode, yPointCode } = scatterNames[0];
      this.setState({ xPointName, yPointName, scatterNameValue: ['风速相关', `${xPointCode}_${yPointCode}`] });


    }
  }
  // componentDidUpdate(prevProps) {
  //   console.log('prevProps: ', prevProps);
  //   console.log('this.props: ', this.props);
  // }
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
    const { value } = selectedOptions[0];
    const typeValue = {
      '风速相关': 1,
      '功率相关': 2,
      '转速相关': 3,
      '震动相关': 4,
      '其他': 5,
    };
    const { getScatterName, stationCode, scatterNames } = this.props;
    getScatterName({
      stationCode,
      type: typeValue[value],
    });

    console.log('scatterNames: ', scatterNames);
    const children = scatterNames.map((e, i) => ({
      value: `${e.xPointCode}_${e.yPointCode}`,
      label: `${e.pointsUnionName}`,
    }));

    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    setTimeout(() => {
      targetOption.loading = false;
      targetOption.children = children;
      this.setState({
        options: [...this.state.options],
      });
    }, 1000);
  };


  onChangeContrast = (value, selectedOptions) => {
    console.log('selectedOptions: ', selectedOptions);
    console.log('value: ', value);
    const codeValue = value[value.length - 1];
    const { xPointCode, yPointCode } = codeValue.split('_');
    this.props.changeToolStore({
      xPointCode, yPointCode,
    });

  }
  getScatterData = () => {
    //请求数据
    const { stationCode, xPointCode, yPointCode, startTime, endTime } = this.props;
    this.props.getScatterData({
      stationCode,
      xPointCode,
      yPointCode,
      startTime,
      endTime,
    });
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
    const { stationCode, stations, scatterNames, scatterData } = this.props;
    console.log('scatterNames: ', scatterNames);
    const { isSwap, options, scatterNameValue, xPointName, yPointName } = this.state;
    console.log('xPointName: ', xPointName);
    console.log('yPointName: ', yPointName);

    const dateFormat = 'YYYY.MM.DD';
    const selectStation = stations.filter(e => e.stationType === 0);
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
              style={{ width: '240px' }}
            />
          </div>
          <div className={styles.headBottom}>
            <label className={styles.nameStyle}>散点</label>
            <Cascader
              options={options}
              value={scatterNameValue}
              loadData={this.loadData}
              onChange={this.onChangeContrast}
              style={{ width: '400px' }}
            />
            <div className={styles.contrastValue}>
              <Button className={isSwap ? styles.swapStyle : styles.defaultStyle} onClick={this.getScatterData}>{isSwap ? yPointName : xPointName}</Button>
              <Icon type="swap" className={isSwap ? styles.swapIcon : styles.nomalIcon} onClick={this.changeSwap} />
              <Button className={isSwap ? styles.swapStyle : styles.defaultStyle} onClick={this.downPic}>{isSwap ? xPointName : yPointName}</Button>
            </div>
            <Button className={styles.seachBtn} onClick={this.getScatterData}>查询</Button>
            <Button className={styles.seachBtn} onClick={this.downPic}>图片下载</Button>

          </div>
        </div>
        <div className={styles.scatterBox}>
          <ScatterContainer {...this.props} xPointName={xPointName} yPointName={yPointName} />
        </div>

      </div>
    );
  }
}



export default (SingleStationScatter);
