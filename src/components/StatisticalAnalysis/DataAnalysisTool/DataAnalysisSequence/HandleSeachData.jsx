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
  value: '风速相关',
  pointsUnionName: '风速相关',
  isLeaf: false,
},
{
  value: '功率相关',
  pointsUnionName: '功率相关',
  isLeaf: false,
}, {
  value: '转速相关',
  pointsUnionName: '转速相关',
  isLeaf: false,
},
{
  value: '振动相关',
  pointsUnionName: '振动相关',
  isLeaf: false,
}, {
  value: '温度相关',
  pointsUnionName: '温度相关',
  isLeaf: false,
}, {
  value: '震动相关',
  pointsUnionName: '震动相关',
  isLeaf: false,
}, {
  value: '相控相关',
  pointsUnionName: '相控相关',
  isLeaf: false,
}, {
  value: '其他',
  pointsUnionName: '其他',
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
    const { point1Max } = this.state;
    if (this.props.sequenceNameTime !== sequenceNameTime) {//格式化测点数据
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
      if (sequenceNames[0] && deviceList.length) {//获取测点数据并且取第一项
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
          interval: 60,
        });
      }
    }

    if (!point1Max && deviceList.length === sequenceData.length) {//当拿到所有图表数据，进行最大值最小值筛选
      console.log('!point1Max && deviceList.length === sequenceData.length: ', !point1Max && deviceList.length === sequenceData.length);
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
  formater = (data) => {//对测点数据进行处理
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
  clearoutLimit = () => {
    this.setState({
      point1Max: null,
      point1Min: null,
      point2Max: null,
      point2Min: null,
    });
  }
  selectStationCode = (stationCodeArr) => {//电站选择
    const { stationCode } = stationCodeArr[0];
    this.clearoutLimit();
    this.setState({
      showOther: false,
    });
    this.props.changeSquenceStore({
      stationCode,
      sequenceData: [],
      point1Max: null,
      point1Min: null,
      point2Max: null,
      point2Min: null,
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
    this.clearoutLimit();
  }
  //改测点
  onChangeContrast = (value, selectedOptions) => {
    const { stationCode } = this.props;
    if (value[0] === '其他') {
      this.setState({
        showOther: true,
        sequenceNameValue: ['其他'],
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
        sequenceNameValue: value,
        showOther: false,
      });
      this.clearoutLimit();
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
      interval: 60,
    });
  }
  //改变第一个y轴
  changeY1value = (value, option) => {
    const { props: { children } } = option;
    this.setState({
      xCode: value,
      xName: children,
    });
  }
  //改变第二个y轴
  changeY2value = (value, option) => {
    const { props: { children } } = option;
    this.setState({
      yCode: value,
      yName: children,
    });
  }

  //下载
  downPic = () => {
    this.props.changeSquenceStore({
      down: true,
    });
  }
  render() {
    const { stationCode, stations, sequenceotherNames, theme, startTime, endTime } = this.props;
    const { isSwap, options, sequenceNameValue, showOther, xName, yName, point1Max, point1Min, point2Max, point2Min } = this.state;
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
            format={dateFormat}
            onChange={this.changeTime}
            style={{ width: '240px' }}
          />
          <label className={styles.nameStyle}>测点</label>
          <Cascader
            options={options}
            value={sequenceNameValue}
            fieldNames={{ label: 'pointsUnionName', value: 'value', children: 'pointNameList' }}
            onChange={this.onChangeContrast}
            style={showOther ? { width: '200px' } : { width: '400px' }}
          />
          {showOther && <div className={styles.contrastValue}>
            <Select
              style={{ width: 160 }}
              onChange={this.changeY1value}
              value={this.state.xCode}
            >
              {sequenceotherNames.map((e, i) => (
                <Option key={e.devicePointCode} value={e.devicePointCode} title={e.devicePointName}>{e.devicePointName}</Option>
              ))}
            </Select>
            <Icon type="swap" className={isSwap ? styles.swapIcon : styles.nomalIcon} onClick={this.changeSwap} />
            <Select
              style={{ width: 160 }}
              onChange={this.changeY2value}
              value={this.state.yCode}
            >
              {sequenceotherNames.map((e, i) => (
                <Option key={e.devicePointCode} value={e.devicePointCode} title={e.devicePointName}>{e.devicePointName}</Option>
              ))}
            </Select>
          </div>}
        </div>
        <div className={styles.headBottom}>

          {<div className={styles.contrastValue}>
            <div className={styles.bottomLeft}>
              <span>{xName ? xName : '--'}</span>

              <InputNumber
                // min={0}
                // max={point1Max}
                value={point1Max}
                formatter={value => `最大值 ${value}`}
                parser={value => value.replace(/\D/g, '')}
                onChange={(value) => this.setState({ point1Max: value })}
              />

              <InputNumber
                // min={0}
                // max={point1Max}
                value={point1Min}
                formatter={value => `最小值 ${value}`}
                parser={value => value.replace(/\D/g, '')}
                onChange={(value) => this.setState({ point1Min: value })}
              />
            </div>
            <div className={styles.bottomLeft}>
              {/* <Icon type="swap" className={isSwap ? styles.swapIcon : styles.nomalIcon} onClick={this.changeSwap} /> */}
              <span className={styles.defaultStyle} >{yName ? yName : '--'}</span>
              <InputNumber
                //  min={0}
                //  max={point2Max}
                value={point2Max}
                formatter={value => `最大值 ${value}`}
                parser={value => value.replace(/\D/g, '')}
                onChange={(value) => this.setState({ point2Max: value })}
              />
              <InputNumber
                //  min={0}
                //  max={point2Max}
                value={point2Min}
                formatter={value => `最小值 ${value}`}
                parser={value => value.replace(/\D/g, '')}
                onChange={(value) => this.setState({ point2Min: value })}
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
