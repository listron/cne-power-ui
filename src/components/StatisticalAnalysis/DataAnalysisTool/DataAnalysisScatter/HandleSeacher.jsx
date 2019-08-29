import React from 'react';
import PropTypes from 'prop-types';
import styles from './dataAnalysisStyle.scss';
import StationSelect from '../../../Common/StationSelect';
import { Button, DatePicker, Cascader, Icon, Select } from 'antd';
import moment from 'moment';

const { RangePicker } = DatePicker;
const { Option } = Select;
const options = [{
  value: '风速相关',
  pointsUnionName: '风速相关',
  isLeaf: false,
  key: 1,
},
{
  value: '功率相关',
  pointsUnionName: '功率相关',
  isLeaf: false,
  key: 2,
}, {
  value: '转速相关',
  pointsUnionName: '转速相关',
  isLeaf: false,
  key: 3,
},
{
  value: '振动相关',
  pointsUnionName: '振动相关',
  isLeaf: false,
  key: 4,
}, {
  value: '温度相关',
  pointsUnionName: '温度相关',
  isLeaf: false,
  key: 5,
}, {
  value: '震动相关',
  pointsUnionName: '震动相关',
  isLeaf: false,
  key: 6,
}, {
  value: '相控相关',
  pointsUnionName: '相控相关',
  isLeaf: false,
  key: 7,
}, {
  value: '其他',
  pointsUnionName: '其他',
  isLeaf: false,
  key: 8,
},
];

class HandleSeacher extends React.Component {
  static propTypes = {
    stationCode: PropTypes.number,
    stations: PropTypes.array,
    changeToolStore: PropTypes.func,
    getScatterName: PropTypes.func,
    getScatterOtherName: PropTypes.func,
    getxyLimitValue: PropTypes.func,
    getScatterData: PropTypes.func,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    getStationDevice: PropTypes.func,
    theme: PropTypes.string,
    scatterotherNames: PropTypes.array,
    deviceList: PropTypes.array,


  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      isSwap: false,
      options,
      scatterNameValue: [],
      showOther: false,
      xName: '',
      yName: '',
      xCode: '',
      yCode: '',
      saveStartTime: '',
      saveEndTime: '',
      xyValueLimit: {},
      disableDateFun: (current) => current > moment(),


    };
  }
  componentWillReceiveProps(nextProp) {
    const { scatterNames, getScatterData, stationCode, scatterNameTime, deviceList, startTime, endTime, getxyLimitValue, xyValueLimit } = nextProp;
    if (this.props.scatterNameTime !== scatterNameTime) {
      const { options } = this.state;
      const newscatterNames = this.formater(scatterNames);
      const arr = options.map(e => e.pointsUnionName);
      const option = newscatterNames.map((e, i) => {
        return {
          key: i,
          value: e.pointType,
          pointsUnionName: arr[i],
          isLeaf: false,
          pointNameList: e.pointNameList,
        };
      });
      const otherName = {
        value: '其他',
        pointsUnionName: '其他',
        isLeaf: false,
      };
      if (scatterNames[0] && deviceList.length) {
        const { pointNameList, pointType } = scatterNames[0];
        const firstData = pointNameList ? pointNameList[0] : [];
        const fristDevice = deviceList[0];
        const deviceFullCode = fristDevice.deviceFullCode;
        const { pointCodeNameX, pointCodeNameY, pointCodeX, pointCodeY } = firstData;
        this.setState({ options: [...option, otherName], scatterNameValue: [pointType, `${pointCodeX}_${pointCodeY}`] });
        getxyLimitValue({
          stationCode,
          startTime,
          endTime,
          xPointCode: pointCodeX,
          yPointCode: pointCodeY,
        });
        this.props.changeToolStore({ pointCodeNameX, pointCodeNameY, xPointCode: pointCodeX, yPointCode: pointCodeY });
        this.setState({
          xName: pointCodeNameX,
          yName: pointCodeNameY,
          xCode: pointCodeX,
          yCode: pointCodeY,
          saveStartTime: startTime,
          saveEndTime: endTime,
        });
        getScatterData({
          stationCode,
          deviceFullCode,
          startTime: startTime,
          endTime: endTime,
          xPointCode: pointCodeX,
          yPointCode: pointCodeY,
        });
      }


    }
    if (JSON.stringify(xyValueLimit) !== JSON.stringify(this.props.xyValueLimit)) {

      this.setState({
        xyValueLimit,
      });
    }

  }
  formater = (data) => {
    return data.map((e, i) => {
      const pointNameList = e.pointNameList.map((item, index) => ({
        key: index,
        ...item,
        value: `${item.pointCodeX}_${item.pointCodeY}`,
      }));
      return { key: i, ...e, pointNameList };
    }
    );
  }
  // getLimitValue = (value) => {
  //   const { getxyLimitValue, stationCode } = this.props;
  //   const { xCode, yCode, saveStartTime, saveEndTime } = this.state;
  //   getxyLimitValue({
  //     stationCode,
  //     startTime: saveStartTime,
  //     endTime: saveEndTime,
  //     xPointCode: xCode,
  //     yPointCode: yCode,
  //     ...value,
  //   });
  // }
  selectStationCode = (stationCodeArr) => {
    const { stationCode } = stationCodeArr[0];
    this.props.changeToolStore({
      stationCode,
      scatterData: {},
    });
    this.props.getStationDevice({ stationCode });
    this.props.getScatterName({ stationCode });
  }

  changeTime = (date, dateString) => {

    this.setState({
      saveStartTime: dateString[0],
      saveEndTime: dateString[1],
    });
    // const value = { startTime: dateString[0], endTime: dateString[1] };
    // this.getLimitValue(value);

  }
  onChangeContrast = (value, selectedOptions) => {//选择散点名称
    const { stationCode, getScatterOtherName } = this.props;
    this.setState({
      isSwap: false,
    });
    if (value[0] === '其他') {
      this.setState({
        showOther: true,
        scatterNameValue: ['其他'],
      });
      getScatterOtherName({
        stationCode,
      });
    } else {
      const selectedOption = selectedOptions[1] ? selectedOptions[1] : [];
      const { pointCodeNameX, pointCodeNameY } = selectedOption;
      const codeValue = value[value.length - 1];
      const valueArr = codeValue.split('_');
      const pointCodeX = valueArr[0];
      const pointCodeY = valueArr[1];
      this.setState({
        xName: pointCodeNameX,
        yName: pointCodeNameY,
        xCode: pointCodeX,
        yCode: pointCodeY,
        scatterNameValue: value,
        showOther: false,
      });
      // this.getLimitValue({ xPointCode: pointCodeX, yPointCode: pointCodeY });
    }
  }
  changeSwap = () => {//交换xy轴
    const { xCode, yCode, xName, yName } = this.state;
    this.setState({
      isSwap: !this.state.isSwap,
      xName: yName,
      yName: xName,
      xCode: yCode,
      yCode: xCode,
    });
    // const value = { xPointCode: yCode, yPointCode: xCode };
    // this.getLimitValue(value);

  }
  getScatterData = () => {//查询数据
    //请求数据
    const { getScatterData, changeToolStore, stationCode, deviceList, getxyLimitValue } = this.props;
    const { saveStartTime, saveEndTime, xCode, yCode, xName, yName, xyValueLimit } = this.state;
    changeToolStore({
      scatterData: {},
      pointCodeNameX: xName,
      pointCodeNameY: yName,
      xyValueLimit,
      deviceList: [],
    });
    getxyLimitValue({
      stationCode,
      startTime: saveStartTime,
      endTime: saveEndTime,
      xPointCode: xCode,
      yPointCode: yCode,
    });
    this.props.getStationDevice({ stationCode });
    setTimeout(() => {
      const fristDevice = deviceList[0];
      const deviceFullCode = fristDevice.deviceFullCode;
      getScatterData({
        stationCode,
        deviceFullCode,
        xPointCode: xCode,
        yPointCode: yCode,
        startTime: saveStartTime,
        endTime: saveEndTime,
      });
    }, 100);


  }
  changeXvalue = (value, option) => {//改变其他项中的x轴
    const { props: { children } } = option;
    this.setState({
      xCode: value,
      xName: children,
    });

    // this.getLimitValue({ xPointCode: value });
  }
  changeYvalue = (value, option) => {//改变其他项中的y轴
    const { props: { children } } = option;
    this.setState({
      yCode: value,
      yName: children,
    });

    // this.getLimitValue({ yPointCode: value });
  }


  onCalendarChange = (dates, dateStrings) => {
    if (dates.length === 1) {
      this.setState({ //  时间跨度不超过1月
        disableDateFun: (current) => {
          const maxTime = moment(dates[0]).add(31, 'days');
          const minTime = moment(dates[0]).subtract(31, 'days');
          return current > moment() || current > maxTime || current < minTime;
        },
      });
    } else {
      this.setState({
        disableDateFun: (current) => current > moment(),
      });
    }
  }

  downPic = () => {
    //下载照片
    this.props.changeToolStore({
      down: true,
    });
  }
  render() {
    const { stationCode, stations, scatterotherNames, theme, startTime, endTime } = this.props;

    const { isSwap, options, scatterNameValue, showOther, xName, yName, xyValueLimit, disableDateFun } = this.state;
    const { yMin, yMax, xMin, xMax } = xyValueLimit;
    const dateFormat = 'YYYY.MM.DD';
    const selectStation = stations.filter(e => (e.stationType === 0 && e.isConnected === 1));
    return (
      <div className={styles.headBox}>
        <div className={styles.headTop}>
          <label className={styles.nameStyle}>电站</label>
          <StationSelect
            onOK={this.selectStationCode}
            data={selectStation}
            value={stations.filter(e => e.stationCode === stationCode)}
          // theme={theme}
          />
          <label className={styles.nameStyle}>时间</label>
          <RangePicker
            defaultValue={[moment(startTime, dateFormat), moment(endTime, dateFormat)]}
            disabledDate={disableDateFun}
            onCalendarChange={this.onCalendarChange}
            format={dateFormat}
            onChange={this.changeTime}
            style={{ width: '240px' }}

          />

        </div>
        <div className={styles.headBottom}>
          <label className={styles.nameStyle}>散点</label>
          <Cascader
            placeholder=""
            options={options}
            value={scatterNameValue}
            fieldNames={{ label: 'pointsUnionName', value: 'value', children: 'pointNameList' }}
            onChange={this.onChangeContrast}
            style={showOther ? { width: '200px' } : { width: '400px' }}
          />
          {!showOther && <div className={styles.contrastValue}>
            <Button className={isSwap ? styles.swapStyle : styles.defaultStyle} >{xName ? xName : '--'}</Button>
            <Icon type="swap" className={isSwap ? styles.swapIcon : styles.nomalIcon} onClick={this.changeSwap} />
            <Button className={isSwap ? styles.swapStyle : styles.defaultStyle} >{yName ? yName : '--'}</Button>
          </div>}
          {showOther && <div className={styles.contrastValue}>
            <Select
              style={{ width: 160 }}
              onChange={this.changeXvalue}
              value={this.state.xCode}
            >
              {scatterotherNames.map((e, i) => (
                <Option key={e.devicePointCode} value={e.devicePointCode} title={e.devicePointName}>{e.devicePointName}</Option>
              ))}
            </Select>
            <Icon type="swap" className={isSwap ? styles.swapIcon : styles.nomalIcon} onClick={this.changeSwap} />
            <Select
              style={{ width: 160 }}
              onChange={this.changeYvalue}
              value={this.state.yCode}
            >
              {scatterotherNames.map((e, i) => (
                <Option key={e.devicePointCode} value={e.devicePointCode} title={e.devicePointName}>{e.devicePointName}</Option>
              ))}
            </Select>
          </div>}
          <Button className={styles.seachBtn} onClick={this.getScatterData}>查询</Button>
          <Button className={styles.seachBtn} onClick={this.downPic}>图片下载</Button>

        </div>
      </div>
    );
  }
}
export default (HandleSeacher)
  ;
