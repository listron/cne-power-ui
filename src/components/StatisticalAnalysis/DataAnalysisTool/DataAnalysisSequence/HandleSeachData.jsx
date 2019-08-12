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
  value: '震动相关',
  pointsUnionName: '振动相关',
  isLeaf: false,
}, {
  value: '控制相关',
  pointsUnionName: '控制相关',
  isLeaf: false,
},
  // {
  //   value: '其他',
  //   pointsUnionName: '其他',
  //   isLeaf: false,
  // },
];

class HandleSeachData extends React.Component {
  static propTypes = {
    stationCode: PropTypes.number,
    stations: PropTypes.array,
    changeSquenceStore: PropTypes.func,
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

    };
  }
  componentWillReceiveProps(nextProp) {
    const { sequenceNames, getSequenceData, deviceList, sequenceNameTime } = nextProp;
    const defaultStartime = moment().month(moment().month() - 1).startOf('month');
    const defaultEndtime = moment().month(moment().month() - 1).endOf('month');
    // const preScatterName = this.props.sequenceNames;
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
        this.setState({ options: [...option, otherName], scatterNameValue: [pointType, `${pointCodeX}_${pointCodeY}`] });
        this.props.changeSquenceStore({ pointCodeNameX, pointCodeNameY, pointY1: pointCodeX, pointY2: pointCodeY });
        this.setState({
          xName: pointCodeNameX,
          yName: pointCodeNameY,
          xCode: pointCodeX,
          yCode: pointCodeY,
        });
        getSequenceData({
          deviceFullCode,
          startTime: defaultStartime,
          endTime: defaultEndtime,
          pointY1: pointCodeX,
          pointY2: pointCodeY,
          interval: 10,
        });
      }
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
    this.props.changeSquenceStore({
      stationCode,
    });
    this.props.getScatterName({ stationCode });
  }

  changeTime = (date, dateString) => {
    const { changeSquenceStore } = this.props;
    changeSquenceStore({
      startTime: dateString[0],
      endTime: dateString[1],
    });
  }
  onChangeContrast = (value, selectedOptions) => {
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
      const { pointCodeX, pointCodeY } = codeValue.split('_');
      this.props.changeSquenceStore({
        pointCodeNameX,
        pointCodeNameY,
        pointY1: pointCodeX,
        pointY2: pointCodeY,
      });
      this.setState({
        scatterNameValue: value,
        showOther: false,
      });
    }


  }
  changeSwap = () => {
    const { xCode, yCode, xName, yName } = this.state;
    this.setState({
      isSwap: !this.state.isSwap,
    });
    this.setState({
      xName: yName,
      yName: xName,
      xCode: yCode,
      yCode: xCode,
    });

  }
  getSequenceData = () => {
    //请求数据
    const { getSequenceData, changeSquenceStore, deviceList, startTime, endTime } = this.props;
    const { xCode, yCode, xName, yName } = this.state;
    const fristDevice = deviceList[0];
    const deviceFullCode = fristDevice.deviceFullCode;

    getSequenceData({
      deviceFullCode,
      pointY1: xCode,
      pointY2: yCode,
      startTime,
      endTime,
      interval: 10,
    });
    changeSquenceStore({
      pointCodeNameX: xName,
      pointCodeNameY: yName,
    });
  }
  changeXvalue = (value, option) => {
    const { props: { chidren } } = option;
    this.props.changeSquenceStore({
      pointCodeX: value,
      pointCodeNameX: chidren,
    });
  }
  changeYvalue = (value, option) => {
    const { props: { chidren } } = option;
    this.props.changeSquenceStore({
      pointCodeY: value,
      pointCodeNameY: chidren,
    });
  }
  render() {
    const { stationCode, stations, scatterotherNames, theme } = this.props;
    // console.log('scatterotherNames: ', scatterotherNames);
    const { isSwap, options, scatterNameValue, showOther, xName, yName } = this.state;
    const defaultStartime = moment().month(moment().month() - 1).startOf('month');
    const defaultEndtime = moment().month(moment().month() - 1).endOf('month');
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
            defaultValue={[moment(defaultStartime, dateFormat), moment(defaultEndtime, dateFormat)]}
            format={dateFormat}
            onChange={this.changeTime}
            style={{ width: '240px' }}

          />
          <label className={styles.nameStyle}>散点</label>
          <Cascader
            options={options}
            value={scatterNameValue}
            fieldNames={{ label: 'pointsUnionName', value: 'value', children: 'pointNameList' }}
            onChange={this.onChangeContrast}
            style={{ width: '400px' }}
          />
          {showOther && <div className={styles.contrastValue}>
            <Select
              style={{ width: 120 }}
              onChange={this.changeXvalue}
              value={this.props.pointCodeX}
            >
              {scatterotherNames.map((e, i) => (
                <Option key={e.devicePointCode} value={e.devicePointCode}>{e.devicePointName}</Option>
              ))}
            </Select>
            <Icon type="swap" className={isSwap ? styles.swapIcon : styles.nomalIcon} onClick={this.changeSwap} />
            <Select
              style={{ width: 120 }}
              onChange={this.changeYvalue}
              value={this.props.pointCodeY}
            >
              {scatterotherNames.map((e, i) => (
                <Option key={e.devicePointCode} value={e.devicePointCode}>{e.devicePointName}</Option>
              ))}
            </Select>
          </div>}
        </div>
        <div className={styles.headBottom}>

          {!showOther && <div className={styles.contrastValue}>
            <div className={styles.bottomLeft}>
              <span>{xName ? xName : '--'}</span>
              <InputNumber
                min={0}
                max={100}
                formatter={value => `最大值 ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                onChange={this.changeXmax}
              />
              <InputNumber

                min={0}
                max={100}
                formatter={value => `最小值 ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                onChange={this.changeXmin}
              />
            </div>
            <div className={styles.bottomLeft}>
              {/* <Icon type="swap" className={isSwap ? styles.swapIcon : styles.nomalIcon} onClick={this.changeSwap} /> */}
              <span className={styles.defaultStyle} >{yName ? yName : '--'}</span>
              <InputNumber
                min={0}
                max={100}
                formatter={value => `最大值 ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                onChange={this.changeYmax}
              />
              <InputNumber
                min={0}
                max={100}
                formatter={value => `最小值 ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                onChange={this.changeYmin}
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
