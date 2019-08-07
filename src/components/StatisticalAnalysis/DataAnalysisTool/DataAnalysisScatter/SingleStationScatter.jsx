import React from 'react';
import PropTypes from 'prop-types';
import styles from './dataAnalysisStyle.scss';
import StationSelect from '../../../Common/StationSelect';
import ScatterContainer from './ScatterContainer';
import { Button, DatePicker, Cascader, Icon, Select } from 'antd';
import moment from 'moment';
import { downloadFile } from '../../../../utils/utilFunc';

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
}, {
  value: '其他',
  pointsUnionName: '其他',
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
      showOther: false,

    };
  }

  componentWillReceiveProps(nextProp) {
    const { scatterNames } = nextProp;
    const preScatterName = this.props.scatterNames;
    if (!preScatterName.length && scatterNames.length > 0) {
      const { options } = this.state;
      const newscatterNames = this.formater(scatterNames);
      const arr = options.map(e => e.pointsUnionName);
      const test = newscatterNames.map((e, i) => {
        return {
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
      const { pointNameList } = scatterNames[0];
      const { pointCodeNameX, pointCodeNameY, pointCodeX, pointCodeY } = pointNameList[0];
      this.setState({ options: [...test, otherName], scatterNameValue: [1, `${pointCodeX}_${pointCodeY}`] });
      this.props.changeToolStore({ pointCodeNameX, pointCodeNameY });
    }
  }
  componentWillUnmount() {
    this.props.resetStore();
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

  }
  changeTime = (date, dateString) => {
  }
  onChangeContrast = (value, selectedOptions) => {
    // console.log('selectedOptions: ', selectedOptions);
    const { stationCode } = this.props;
    const { pointCodeNameX, pointCodeNameY } = selectedOptions[1];
    // console.log('value: ', value);

    if (value[0] === '其他') {
      this.setState({
        showOther: true,
      });
      this.props.getScatterOtherName({
        stationCode,
      });
    }
    this.setState({
      scatterNameValue: value,
      showOther: false,
    });
    const codeValue = value[value.length - 1];
    const { pointCodeX, pointCodeY } = codeValue.split('_');
    this.props.changeToolStore({
      pointCodeX, pointCodeY, pointCodeNameX, pointCodeNameY,
    });

  }
  getScatterData = () => {
    //请求数据
    const { stationCode, pointCodeX, pointCodeY, startTime, endTime } = this.props;
    this.props.getScatterData({
      stationCode,
      pointCodeX,
      pointCodeY,
      startTime,
      endTime,
    });
  }

  downPic = () => {
    const { newSrcUrl } = this.props;
    newSrcUrl.forEach((e, i) => {
      downloadFile(e.title, e.src);
    });
    //下载照片
  }
  changeSwap = () => {
    const { changeToolStore, pointCodeNameX, pointCodeNameY } = this.props;
    this.setState({
      isSwap: !this.state.isSwap,
    });
    changeToolStore({
      pointCodeNameX: pointCodeNameY,
      pointCodeNameY: pointCodeNameX,
    });
  }
  render() {
    const { stationCode, stations, pointCodeNameX, pointCodeNameY, scatterotherNames, theme } = this.props;
    // console.log('scatterotherNames: ', scatterotherNames);
    const { isSwap, options, scatterNameValue, showOther } = this.state;
    const dateFormat = 'YYYY.MM.DD';
    const selectStation = stations.filter(e => e.stationType === 0);
    return (
      <div className={`${styles.singleStationBox} ${styles[theme]}`}>
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
              fieldNames={{ label: 'pointsUnionName', value: 'value', children: 'pointNameList' }}
              onChange={this.onChangeContrast}
              style={{ width: '400px' }}
            />
            {!showOther && <div className={styles.contrastValue}>
              <Button className={isSwap ? styles.swapStyle : styles.defaultStyle} onClick={this.getScatterData}>{pointCodeNameX}</Button>
              <Icon type="swap" className={isSwap ? styles.swapIcon : styles.nomalIcon} onClick={this.changeSwap} />
              <Button className={isSwap ? styles.swapStyle : styles.defaultStyle} onClick={this.downPic}>{pointCodeNameY}</Button>
            </div>}
            {showOther && <div className={styles.contrastValue}>
              <Select
                style={{ width: 120 }}
                onChange={this.changeXvalue}
              >
              </Select>
              <Icon type="swap" className={isSwap ? styles.swapIcon : styles.nomalIcon} onClick={this.changeSwap} />
              <Select
                style={{ width: 120 }}
                onChange={this.changeYvalue}
              >
                {scatterotherNames.map((e, i) => (
                  <Option value={e.devicePointCode}>{e.devicePointName}</Option>
                ))}
              </Select>
            </div>}
            <Button className={styles.seachBtn} onClick={this.getScatterData}>查询</Button>
            <Button className={styles.seachBtn} onClick={this.downPic}>图片下载</Button>

          </div>
        </div>
        <div className={styles.scatterBox}>
          <ScatterContainer {...this.props} />
        </div>

      </div>
    );
  }
}



export default (SingleStationScatter);
