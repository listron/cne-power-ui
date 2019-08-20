import React from 'react';
import PropTypes from 'prop-types';
import styles from './dataAnalysisStyle.scss';
import StationSelect from '../../../Common/StationSelect';
import { Button, DatePicker, Cascader, Icon, Select } from 'antd';
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
}, {
  value: '震动相关',
  pointsUnionName: '震动相关',
  isLeaf: false,
},
  // {
  //   value: '其他',
  //   pointsUnionName: '其他',
  //   isLeaf: false,
  // },
];

class HandleSeacher extends React.Component {
  static propTypes = {
    stationCode: PropTypes.number,
    stations: PropTypes.array,
    newSrcUrl: PropTypes.array,
    scatterNames: PropTypes.array,
    changeToolStore: PropTypes.func,
    getScatterName: PropTypes.func,
    getScatterOtherName: PropTypes.func,
    pointCodeNameX: PropTypes.string,
    pointCodeNameY: PropTypes.string,
    getScatterData: PropTypes.func,
    pointCodeX: PropTypes.string,
    pointCodeY: PropTypes.string,
    // startTime: PropTypes.string,
    // endTime: PropTypes.string,
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
    const { scatterNames, getScatterData, stationCode, scatterNameTime } = nextProp;
    const defaultStartime = moment().month(moment().month() - 1).startOf('month');
    const defaultEndtime = moment().month(moment().month() - 1).endOf('month');
    // const preScatterName = this.props.scatterNames;
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
        // value: '其他',
        // pointsUnionName: '其他',
        // isLeaf: false,
      };
      if (scatterNames[0]) {
        const { pointNameList, pointType } = scatterNames[0];
        const firstData = pointNameList ? pointNameList[0] : [];
        const { pointCodeNameX, pointCodeNameY, pointCodeX, pointCodeY } = firstData;
        this.setState({ options: [...option, otherName], scatterNameValue: [pointType, `${pointCodeX}_${pointCodeY}`] });
        this.props.changeToolStore({ pointCodeNameX, pointCodeNameY, xPointCode: pointCodeX, yPointCode: pointCodeY });
        this.setState({
          xName: pointCodeNameX,
          yName: pointCodeNameY,
          xCode: pointCodeX,
          yCode: pointCodeY,
        });
        getScatterData({
          stationCode,
          startTime: defaultStartime,
          endTime: defaultEndtime,
          xPointCode: pointCodeX,
          yPointCode: pointCodeY,
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
    this.props.changeToolStore({
      stationCode,
    });
    this.props.getScatterName({ stationCode });
  }

  changeTime = (date, dateString) => {
    const { changeToolStore } = this.props;
    changeToolStore({
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
      this.props.getScatterOtherName({
        stationCode,
      });
    } else {
      const { pointCodeNameX, pointCodeNameY } = selectedOptions[1];
      const codeValue = value[value.length - 1];
      const { pointCodeX, pointCodeY } = codeValue.split('_');
      this.props.changeToolStore({
        pointCodeNameX,
        pointCodeNameY,
        xPointCode: pointCodeX,
        yPointCode: pointCodeY,
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
  getScatterData = () => {
    //请求数据
    const { getScatterData, changeToolStore, stationCode, startTime, endTime } = this.props;
    const { xCode, yCode, xName, yName } = this.state;
    getScatterData({
      stationCode,
      xPointCode: xCode,
      yPointCode: yCode,
      startTime,
      endTime,
    });
    changeToolStore({
      pointCodeNameX: xName,
      pointCodeNameY: yName,
    });
  }
  changeXvalue = (value, option) => {
    const { props: { chidren } } = option;
    this.props.changeToolStore({
      pointCodeX: value,
      pointCodeNameX: chidren,
    });
  }
  changeYvalue = (value, option) => {
    const { props: { chidren } } = option;
    this.props.changeToolStore({
      pointCodeY: value,
      pointCodeNameY: chidren,
    });
  }

  downPic = () => {
    const { newSrcUrl, startTime, endTime, pointCodeNameX, pointCodeNameY } = this.props;
    newSrcUrl.forEach((e, i) => {
      downloadFile(`${e.title}_${pointCodeNameX}vs${pointCodeNameY}_`, e.src);
    });
    //下载照片
  }
  render() {
    const { stationCode, stations, pointCodeNameX, pointCodeNameY, scatterotherNames, theme } = this.props;
    const { isSwap, options, scatterNameValue, showOther, xName, yName } = this.state;
    const defaultStartime = moment().month(moment().month() - 1).startOf('month');
    const defaultEndtime = moment().month(moment().month() - 1).endOf('month');
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
            defaultValue={[moment(defaultStartime, dateFormat), moment(defaultEndtime, dateFormat)]}
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
            fieldNames={{ label: 'pointsUnionName', value: 'value', children: 'pointNameList' }}
            onChange={this.onChangeContrast}
            style={{ width: '400px' }}
          />
          {!showOther && <div className={styles.contrastValue}>
            <Button className={isSwap ? styles.swapStyle : styles.defaultStyle} >{xName}</Button>
            <Icon type="swap" className={isSwap ? styles.swapIcon : styles.nomalIcon} onClick={this.changeSwap} />
            <Button className={isSwap ? styles.swapStyle : styles.defaultStyle} >{yName}</Button>
          </div>}
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
          <Button className={styles.seachBtn} onClick={this.getScatterData}>查询</Button>
          <Button className={styles.seachBtn} onClick={this.downPic}>图片下载</Button>

        </div>
      </div>
    );
  }
}
export default (HandleSeacher)
  ;
