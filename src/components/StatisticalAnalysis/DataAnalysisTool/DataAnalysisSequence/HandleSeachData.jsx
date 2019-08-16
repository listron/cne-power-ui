import React from 'react';
import PropTypes from 'prop-types';
import styles from './sequenceStyles.scss';
import StationSelect from '../../../Common/StationSelect';
import { Button, DatePicker, Cascader, Icon, Select, InputNumber } from 'antd';
import { downloadFile } from '../../../../utils/utilFunc';
import moment from 'moment';

const { RangePicker } = DatePicker;
const { Option } = Select;
const options = [{
  value: '温度相关',
  pointsUnionName: '温度相关',
  isLeaf: false,
},
{
  value: '振动相关',
  pointsUnionName: '振动相关',
  isLeaf: false,
}, {
  value: '控制相关',
  pointsUnionName: '控制相关',
  isLeaf: false,
},
{
  value: 'xx相关',
  pointsUnionName: 'xx相关',
  isLeaf: false,
},
];

class HandleSeachData extends React.Component {
  static propTypes = {
    stationCode: PropTypes.number,
    stations: PropTypes.array,
    changeSquenceStore: PropTypes.func,
    getScatterName: PropTypes.func,
    getSequenceOtherName: PropTypes.func,
    sequenceotherNames: PropTypes.array,
    getSequenceData: PropTypes.func,
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      isSwap: false,
      options,
      sequenceNameValue: [],
      showOther: false,
      xName: '',
      yName: '',
      xCode: '',
      yCode: '',
      saveStartTime: '',
      saveEndTime: '',
      point1Max: null,
      point1Min: null,
      point2Max: null,
      point2Min: null,

    };
  }
  componentWillReceiveProps(nextProp) {
    const { sequenceNames, getSequenceData, deviceList, sequenceNameTime, startTime, endTime, sequenceData } = nextProp;
    console.log('startTime: ', startTime);
    const { point1Max } = this.state;
    console.log('sequenceData: ', sequenceData);
    if (this.props.sequenceNameTime !== sequenceNameTime) {
      const { options } = this.state;
      const newscatterNames = this.formater(sequenceNames);
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
      if (sequenceNames[0] && deviceList.length) {
        const { pointNameList, pointType } = sequenceNames[0];
        const fristDevice = deviceList[0];
        const deviceFullCode = fristDevice.deviceFullCode;
        const firstData = pointNameList ? pointNameList[0] : [];
        const { pointCodeNameX, pointCodeNameY, pointCodeX, pointCodeY } = firstData;
        this.setState({ options: [...option, otherName], sequenceNameValue: [pointType, `${pointCodeX}_${pointCodeY}`] });
        this.props.changeSquenceStore({ pointCodeNameX, pointCodeNameY, pointY1: pointCodeX, pointY2: pointCodeY });
        this.setState({
          xName: pointCodeNameX,
          yName: pointCodeNameY,
          xCode: pointCodeX,
          yCode: pointCodeY,
          saveStartTime: startTime,
          saveEndTime: endTime,

        });
        getSequenceData({
          deviceFullCode,
          startTime: startTime,
          endTime: endTime,
          pointY1: pointCodeX,
          pointY2: pointCodeY,
          interval: 10,
        });
      }
    }
    if (!point1Max && deviceList.length === sequenceData.length) {
      const y1Max = sequenceData.map((e, i) => (e.point1Max ? e.point1Max : 0));
      const y1Min = sequenceData.map((e, i) => (e.point1Min ? e.point1Min : 0));
      const y2Max = sequenceData.map((e, i) => (e.point2Max ? e.point2Max : 0));
      const y2Min = sequenceData.map((e, i) => (e.point2Min ? e.point2Min : 0));
      this.setState({
        point1Max: Math.ceil(Math.max(...y1Max)),
        point1Min: Math.floor(Math.min(...y1Min)),
        point2Max: Math.ceil(Math.max(...y2Max)),
        point2Min: Math.floor(Math.min(...y2Min)),
      });
      this.props.changeSquenceStore({
        point1Max: Math.ceil(Math.max(...y1Max)),
        point1Min: Math.floor(Math.min(...y1Min)),
        point2Max: Math.ceil(Math.max(...y2Max)),
        point2Min: Math.floor(Math.min(...y2Min)),
      });


    }
  }
  formater = (data) => {
    return data.map((e, i) => {
      const pointNameList = e.pointNameList.map((item, index) => ({
        ...item, value: `${item.pointCodeX}_${item.pointCodeY}`,
      }));
      return { ...e, pointNameList };
    }
    );
  }
  selectStationCode = (stationCodeArr) => {
    const { stationCode } = stationCodeArr[0];
    //暂存电站code
    this.props.changeSquenceStore({
      stationCode,
      sequenceData: [],
    });
    this.props.getStationDevice({ stationCode });
    this.props.getSequenceName({ stationCode });

  }
  //改时间
  changeTime = (date, dateString) => {
    //暂存时间
    this.setState({
      saveStartTime: dateString[0],
      saveEndTime: dateString[1],
    });
  }
  //改测点
  onChangeContrast = (value, selectedOptions) => {
    console.log('selectedOptions: ', selectedOptions);
    console.log('value: ', value);
    const { stationCode } = this.props;
    if (value[0] === '其他') {
      this.setState({
        showOther: true,
      });
      this.props.getSequenceOtherName({
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
      });
      this.setState({
        sequenceNameValue: value,
        showOther: false,
      });
    }
  }
  //交换左右y轴
  changeSwap = () => {
    const { xCode, yCode, xName, yName } = this.state;
    this.setState({
      isSwap: !this.state.isSwap,
      xName: yName,
      yName: xName,
      xCode: yCode,
      yCode: xCode,
    });

  }
  //查询图表数据
  getSequenceData = () => {
    //请求数据
    const { getSequenceData, changeSquenceStore, deviceList } = this.props;
    const { saveStartTime, saveEndTime, xCode, yCode, xName, yName, point1Max, point1Min, point2Max, point2Min } = this.state;
    changeSquenceStore({
      sequenceData: [],
      pointCodeNameX: xName,
      pointCodeNameY: yName,
      point1Max,
      point1Min,
      point2Max,
      point2Min,
    });
    const fristDevice = deviceList[0];
    const deviceFullCode = fristDevice.deviceFullCode;
    getSequenceData({
      deviceFullCode,
      pointY1: xCode,
      pointY2: yCode,
      startTime: saveStartTime,
      endTime: saveEndTime,
      interval: 10,
    });
  }
  //改变第一个y轴
  changeY1value = (value, option) => {
    const { props: { chidren } } = option;
    this.props.changeSquenceStore({
      pointCodeX: value,
      pointCodeNameX: chidren,
    });
  }
  //改变第二个y轴
  changeY2value = (value, option) => {
    const { props: { chidren } } = option;
    this.props.changeSquenceStore({
      pointCodeY: value,
      pointCodeNameY: chidren,
    });
  }
  //改变最大值
  changeY1max = (value) => {
    console.log('value: ', value);
    this.setState({
      point1Max: value,
    });
  }
  changeY1min = (value) => {
    this.setState({
      point1Min: value,
    });
  }
  changeY2max = (value) => {
    this.setState({
      point2Max: value,
    });
  }

  changeY2min = (value) => {
    this.setState({
      point2Min: value,
    });
  }
  //下载
  downPic = () => {
    this.props.changeSquenceStore({
      down: true,
    });

  }
  render() {
    const { stationCode, stations, sequenceotherNames, theme, newSrcUrl, startTime, endTime } = this.props;
    const { isSwap, options, sequenceNameValue, showOther, xName, yName, point1Max, point1Min, point2Max, point2Min } = this.state;
    console.log(' point1Max, point1Min, point2Max, point2Min: ', point1Max, point1Min, point2Max, point2Min);

    const dateFormat = 'YYYY.MM.DD';
    const selectStation = stations.filter(e => e.stationType === 0);
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
            format={dateFormat}
            onChange={this.changeTime}
            style={{ width: '240px' }}
          />
          <label className={styles.nameStyle}>散点</label>
          <Cascader
            options={options}
            value={sequenceNameValue}
            fieldNames={{ label: 'pointsUnionName', value: 'value', children: 'pointNameList' }}
            onChange={this.onChangeContrast}
            style={{ width: '400px' }}
          />
          {showOther && <div className={styles.contrastValue}>
            <Select
              style={{ width: 120 }}
              onChange={this.changeY1value}
              value={this.props.pointCodeX}
            >
              {sequenceotherNames.map((e, i) => (
                <Option key={e.devicePointCode} value={e.devicePointCode}>{e.devicePointName}</Option>
              ))}
            </Select>
            <Icon type="swap" className={isSwap ? styles.swapIcon : styles.nomalIcon} onClick={this.changeSwap} />
            <Select
              style={{ width: 120 }}
              onChange={this.changeY2value}
              value={this.props.pointCodeY}
            >
              {sequenceotherNames.map((e, i) => (
                <Option key={e.devicePointCode} value={e.devicePointCode}>{e.devicePointName}</Option>
              ))}
            </Select>
          </div>}
        </div>
        <div className={styles.headBottom}>

          {<div className={styles.contrastValue}>
            <div className={styles.bottomLeft}>
              <span>{xName ? xName : '--'}</span>

              <InputNumber
                min={0}
                max={point1Max}
                value={point1Max}
                formatter={value => `最大值 ${value}`}
                parser={value => value.replace(/\D/g, '')}
                onChange={this.changeY1max}
              />

              <InputNumber
                value={point1Min}
                min={0}
                max={point1Max}
                formatter={value => `最小值 ${value}`}
                parser={value => value.replace(/\D/g, '')}
                onChange={this.changeY1min}
              />
            </div>
            <div className={styles.bottomLeft}>
              {/* <Icon type="swap" className={isSwap ? styles.swapIcon : styles.nomalIcon} onClick={this.changeSwap} /> */}
              <span className={styles.defaultStyle} >{yName ? yName : '--'}</span>
              <InputNumber
                value={point2Max}
                min={0}
                max={point2Max}
                formatter={value => `最大值 ${value}`}
                parser={value => value.replace(/\D/g, '')}
                onChange={this.changeY2max}
              />
              <InputNumber
                value={point2Min}
                min={0}
                max={point2Max}
                formatter={value => `最小值 ${value}`}
                parser={value => value.replace(/\D/g, '')}
                onChange={this.changeY2min}
              />
              <Button className={styles.seachBtn} onClick={this.getSequenceData}>查询</Button>
            </div>
          </div>}
          <Button className={styles.seachBtn} onClick={this.downPic}>图片下载</Button>
        </div>

      </div>
    );
  }
}
export default (HandleSeachData)
  ;
