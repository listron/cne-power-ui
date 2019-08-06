import React from 'react';
import PropTypes from 'prop-types';
import styles from './dataAnalysisStyle.scss';
import StationSelect from '../../../Common/StationSelect';
import ScatterContainer from './ScatterContainer';
import { Button, DatePicker, Cascader, Icon } from 'antd';
import moment from 'moment';
import { downloadFile } from '../../../../utils/utilFunc';

const { RangePicker } = DatePicker;
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
      const { xPointName, yPointName, xPointCode, yPointCode } = pointNameList[0];
      this.setState({ options: [...test, otherName], scatterNameValue: [1, `${xPointCode}_${yPointCode}`] });
      this.props.changeToolStore({ xPointName, yPointName });
    }
  }
  componentWillUnmount() {
    this.props.resetStore();
  }
  formater = (data) => {
    return data.map((e, i) => {
      const pointNameList = e.pointNameList.map((item, index) => ({
        ...item, value: `${item.xPointCode}_${item.yPointCode}`,
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
  // base64Img2Blob = (code) => {
  //   if (code) {
  //     var parts = code.split(';base64,');
  //     console.log('parts: ', parts);
  //     var contentType = parts[0].split(':')[1];
  //     var raw = window.atob(parts[1]);
  //     var rawLength = raw.length;
  //     var uInt8Array = new Uint8Array(rawLength);
  //     for (var i = 0; i < rawLength; ++i) {
  //       uInt8Array[i] = raw.charCodeAt(i);
  //     }
  //     return new Blob([uInt8Array], { type: contentType });
  //   }
  //   return;
  // };
  // downloadFile = (fileName, content) => {
  //   //content：是传的base64编码
  //   var blob = this.base64Img2Blob(content); //new Blob([content]);
  //   var aLink = document.createElement('a');
  //   // var evt = document.createEvent('HTMLEvents');
  //   // evt.initEvent('click', false, false);//initEvent 不加后两个参数在FF下会报错, 感谢 Barret Lee 的反馈
  //   const evt = document.createEvent('HTMLEvents');
  //   evt.initEvent('click', true, true);
  //   aLink.download = fileName;
  //   aLink.href = URL.createObjectURL(blob);
  //   // aLink.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
  //   aLink.click();

  // };
  downPic = () => {
    const { newSrcUrl } = this.props;
    newSrcUrl.forEach((e, i) => {
      downloadFile(e.title, e.src);

    });
    //下载照片
  }
  changeSwap = () => {
    const { changeToolStore, xPointName, yPointName } = this.props;
    this.setState({
      isSwap: !this.state.isSwap,
    });
    changeToolStore({
      xPointName: yPointName,
      yPointName: xPointName,
    });
  }
  render() {
    const { stationCode, stations, xPointName, yPointName } = this.props;
    const { isSwap, options, scatterNameValue } = this.state;
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
              fieldNames={{ label: 'pointsUnionName', value: 'value', children: 'pointNameList' }}
              onChange={this.onChangeContrast}
              style={{ width: '400px' }}
            />
            <div className={styles.contrastValue}>
              <Button className={isSwap ? styles.swapStyle : styles.defaultStyle} onClick={this.getScatterData}>{xPointName}</Button>
              <Icon type="swap" className={isSwap ? styles.swapIcon : styles.nomalIcon} onClick={this.changeSwap} />
              <Button className={isSwap ? styles.swapStyle : styles.defaultStyle} onClick={this.downPic}>{yPointName}</Button>
            </div>
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
