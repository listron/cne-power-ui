import React from "react";
import PropTypes from "prop-types";
import styles from './pvStation.scss';
import { Progress, message, Select } from "antd";
import { Link } from 'react-router-dom';
import { dataFormats, numWithComma } from '../../../../../utils/utilFunc';
import {divideFormarts,multiplyFormarts,powerPoint} from '../../PvCommon/PvDataformat';
import OutputTenMin from './OutputTenMin';
const Option = Select.Option;

class PvStationItem extends React.Component {
  static propTypes = {
    stationDataList: PropTypes.array,
    monitorPvUnit: PropTypes.object,
  }
  constructor(props, context) {
    super(props, context)
    this.state = {
      sortStatusName: 'equivalentHours',
      ascend: true,
      selectStation:null,
    }

  }

  showTip = (currentStatus) => {
    message.destroy();
    if (currentStatus === '900') {
      message.config({ top: 225, maxCount: 1, });
      message.warning('电站未接入,无法查看详情', 2);
    }
  }

  conditionChange = (value) => {
    console.log(value)
    this.setState({selectStation:value})
  }

  sortStatus = (value) => {
    const { sortStatusName, ascend } = this.state;
    let currentAscend = true;
    if (sortStatusName === value) {
      currentAscend = !ascend
    }
    this.setState({
      sortStatusName: value,
      ascend: currentAscend
    })
  }



  dealData = (stationDataList) => { // 处理数据
    const { sortStatusName, ascend } = this.state;
    const sortType = ascend ? -1 : 1;
    let filteredStation = [];
    if (stationDataList.length > 0) {
      const newStationsList = stationDataList.sort((a, b) => {
        return sortType * (a[sortStatusName] - b[sortStatusName]);
      });
      const temType = newStationsList.sort((a, b) => { return a['provinceName'].localeCompare(b['provinceName']) });
      temType.forEach(e => {
        let findExactStation = false;
        filteredStation.forEach(m => {
          if (m.regionName === e.provinceName) {
            findExactStation = true;
            m.stations.push(e);
          }
        })
        if (!findExactStation) {
          filteredStation.push({
            regionName: e.provinceName,
            stations: [e]
          })
        }
      });
    }
    return filteredStation
  }


  render() {
    const { stationDataList, monitorPvUnit } = this.props;
    const { powerUnit, realCapacityUnit, realTimePowerUnit } = monitorPvUnit;
    const { sortStatusName, ascend,selectStation } = this.state;
    const data = [
      {
        "utc": "2019-05-08T12:40:00Z",
        "stationPower": "0.0000",
        "stationType": "1",
        "instantaneous": "0.00"
      },
      {
        "utc": "2019-05-08T12:50:00Z",
        "stationPower": "0.0000",
        "stationType": "1",
        "instantaneous": "0.00"
      },
      {
        "utc": "2019-05-08T13:00:00Z",
        "stationPower": "0.0000",
        "stationType": "1",
        "instantaneous": "0.00"
      },
      {
        "utc": "2019-05-08T13:10:00Z",
        "stationPower": "0.0000",
        "stationType": "1",
        "instantaneous": "0.00"
      },
      {
        "utc": "2019-05-08T13:20:00Z",
        "stationPower": "0.0000",
        "stationType": "1",
        "instantaneous": "0.00"
      },
      {
        "utc": "2019-05-08T13:30:00Z",
        "stationPower": "0.0000",
        "stationType": "1",
        "instantaneous": "0.00"
      },
      {
        "utc": "2019-05-08T13:40:00Z",
        "stationPower": "0.0000",
        "stationType": "1",
        "instantaneous": "0.00"
      },
      {
        "utc": "2019-05-08T13:50:00Z",
        "stationPower": "0.0000",
        "stationType": "1",
        "instantaneous": "0.00"
      },
      {
        "utc": "2019-05-08T14:00:00Z",
        "stationPower": "0.0000",
        "stationType": "1",
        "instantaneous": "0.00"
      },
      {
        "utc": "2019-05-08T14:10:00Z",
        "stationPower": "0.0000",
        "stationType": "1",
        "instantaneous": "0.00"
      },
      {
        "utc": "2019-05-08T14:20:00Z",
        "stationPower": "0.0000",
        "stationType": "1",
        "instantaneous": "0.00"
      },
      {
        "utc": "2019-05-08T14:30:00Z",
        "stationPower": "0.0000",
        "stationType": "1",
        "instantaneous": "0.00"
      },
      {
        "utc": "2019-05-08T14:40:00Z",
        "stationPower": "0.0000",
        "stationType": "1",
        "instantaneous": "0.00"
      },
      {
        "utc": "2019-05-08T14:50:00Z",
        "stationPower": "0.0000",
        "stationType": "1",
        "instantaneous": "0.00"
      },
      {
        "utc": "2019-05-08T15:00:00Z",
        "stationPower": "0.0000",
        "stationType": "1",
        "instantaneous": "0.00"
      },
      {
        "utc": "2019-05-08T15:10:00Z",
        "stationPower": "0.0000",
        "stationType": "1",
        "instantaneous": "0.00"
      },
      {
        "utc": "2019-05-08T15:20:00Z",
        "stationPower": "0.0000",
        "stationType": "1",
        "instantaneous": "0.00"
      },
      {
        "utc": "2019-05-08T15:30:00Z",
        "stationPower": "0.0000",
        "stationType": "1",
        "instantaneous": "0.00"
      },
      {
        "utc": "2019-05-08T15:40:00Z",
        "stationPower": "0.0000",
        "stationType": "1",
        "instantaneous": "0.00"
      },
      {
        "utc": "2019-05-08T15:50:00Z",
        "stationPower": "0.0000",
        "stationType": "1",
        "instantaneous": "0.00"
      },
      {
        "utc": "2019-05-08T16:00:00Z",
        "stationPower": "0.0000",
        "stationType": "1",
        "instantaneous": "0.00"
      },
      {
        "utc": "2019-05-08T16:10:00Z",
        "stationPower": "0.0000",
        "stationType": "1",
        "instantaneous": "0.00"
      },
      {
        "utc": "2019-05-08T16:20:00Z",
        "stationPower": "0.0000",
        "stationType": "1",
        "instantaneous": "0.00"
      },
      {
        "utc": "2019-05-08T16:30:00Z",
        "stationPower": "0.0000",
        "stationType": "1",
        "instantaneous": "0.00"
      },
      {
        "utc": "2019-05-08T16:40:00Z",
        "stationPower": "0.0000",
        "stationType": "1",
        "instantaneous": "0.00"
      },
      {
        "utc": "2019-05-08T16:50:00Z",
        "stationPower": "0.0000",
        "stationType": "1",
        "instantaneous": "0.00"
      },
      {
        "utc": "2019-05-08T17:00:00Z",
        "stationPower": "0.0000",
        "stationType": "1",
        "instantaneous": "0.00"
      },
      {
        "utc": "2019-05-08T17:10:00Z",
        "stationPower": "0.0000",
        "stationType": "1",
        "instantaneous": "0.00"
      },
      {
        "utc": "2019-05-08T17:20:00Z",
        "stationPower": "0.0000",
        "stationType": "1",
        "instantaneous": "0.00"
      },
      {
        "utc": "2019-05-08T17:30:00Z",
        "stationPower": "0.0000",
        "stationType": "1",
        "instantaneous": "0.00"
      },
      {
        "utc": "2019-05-08T17:40:00Z",
        "stationPower": "0.0000",
        "stationType": "1",
        "instantaneous": "0.00"
      },
      {
        "utc": "2019-05-08T17:50:00Z",
        "stationPower": "0.0000",
        "stationType": "1",
        "instantaneous": "0.00"
      },
      {
        "utc": "2019-05-08T18:00:00Z",
        "stationPower": "0.0000",
        "stationType": "1",
        "instantaneous": "0.00"
      },
      {
        "utc": "2019-05-08T18:10:00Z",
        "stationPower": "0.0000",
        "stationType": "1",
        "instantaneous": "0.00"
      },
      {
        "utc": "2019-05-08T18:20:00Z",
        "stationPower": "0.0000",
        "stationType": "1",
        "instantaneous": "0.00"
      },
      {
        "utc": "2019-05-08T18:30:00Z",
        "stationPower": "0.0000",
        "stationType": "1",
        "instantaneous": "0.00"
      },
      {
        "utc": "2019-05-08T18:40:00Z",
        "stationPower": "0.0000",
        "stationType": "1",
        "instantaneous": "0.00"
      },
      {
        "utc": "2019-05-08T18:50:00Z",
        "stationPower": "0.0000",
        "stationType": "1",
        "instantaneous": "0.00"
      },
      {
        "utc": "2019-05-08T19:00:00Z",
        "stationPower": "0.0000",
        "stationType": "1",
        "instantaneous": "0.00"
      },
      {
        "utc": "2019-05-08T19:10:00Z",
        "stationPower": "0.0000",
        "stationType": "1",
        "instantaneous": "0.00"
      },
      {
        "utc": "2019-05-08T19:20:00Z",
        "stationPower": "0.0000",
        "stationType": "1",
        "instantaneous": "0.00"
      },
      {
        "utc": "2019-05-08T19:30:00Z",
        "stationPower": "0.0000",
        "stationType": "1",
        "instantaneous": "0.00"
      },
      {
        "utc": "2019-05-08T19:40:00Z",
        "stationPower": "0.0000",
        "stationType": "1",
        "instantaneous": "0.00"
      },
      {
        "utc": "2019-05-08T19:50:00Z",
        "stationPower": "0.0000",
        "stationType": "1",
        "instantaneous": "0.00"
      },
      {
        "utc": "2019-05-08T20:00:00Z",
        "stationPower": "0.0000",
        "stationType": "1",
        "instantaneous": "0.00"
      },
      {
        "utc": "2019-05-08T20:10:00Z",
        "stationPower": "0.0000",
        "stationType": "1",
        "instantaneous": "0.00"
      },
      {
        "utc": "2019-05-08T20:20:00Z",
        "stationPower": "0.0000",
        "stationType": "1",
        "instantaneous": "0.00"
      },
      {
        "utc": "2019-05-08T20:30:00Z",
        "stationPower": "0.0000",
        "stationType": "1",
        "instantaneous": "0.00"
      },
      {
        "utc": "2019-05-08T20:40:00Z",
        "stationPower": "0.0000",
        "stationType": "1",
        "instantaneous": "0.00"
      },
      {
        "utc": "2019-05-08T20:50:00Z",
        "stationPower": "0.0000",
        "stationType": "1",
        "instantaneous": "0.00"
      },
      {
        "utc": "2019-05-08T21:00:00Z",
        "stationPower": "0.0000",
        "stationType": "1",
        "instantaneous": "0.00"
      },
      {
        "utc": "2019-05-08T21:10:00Z",
        "stationPower": "0.0000",
        "stationType": "1",
        "instantaneous": "0.00"
      },
      {
        "utc": "2019-05-08T21:20:00Z",
        "stationPower": "0.0000",
        "stationType": "1",
        "instantaneous": "0.00"
      },
      {
        "utc": "2019-05-08T21:30:00Z",
        "stationPower": "0.0000",
        "stationType": "1",
        "instantaneous": "0.00"
      },
      {
        "utc": "2019-05-08T21:40:00Z",
        "stationPower": "0.0000",
        "stationType": "1",
        "instantaneous": "0.00"
      },
      {
        "utc": "2019-05-08T21:50:00Z",
        "stationPower": "0.0000",
        "stationType": "1",
        "instantaneous": "0.00"
      },
      {
        "utc": "2019-05-08T22:00:00Z",
        "stationPower": "0.0697",
        "stationType": "1",
        "instantaneous": "11.52"
      },
      {
        "utc": "2019-05-08T22:10:00Z",
        "stationPower": "0.0023",
        "stationType": "1",
        "instantaneous": "1.83"
      },
      {
        "utc": "2019-05-08T22:20:00Z",
        "stationPower": "0.0133",
        "stationType": "1",
        "instantaneous": "4.41"
      },
      {
        "utc": "2019-05-08T22:30:00Z",
        "stationPower": "0.0421",
        "stationType": "1",
        "instantaneous": "10.69"
      },
      {
        "utc": "2019-05-08T22:40:00Z",
        "stationPower": "0.1397",
        "stationType": "1",
        "instantaneous": "21.44"
      },
      {
        "utc": "2019-05-08T22:50:00Z",
        "stationPower": "0.2193",
        "stationType": "1",
        "instantaneous": "30.36"
      },
      {
        "utc": "2019-05-08T23:00:00Z",
        "stationPower": "0.6095",
        "stationType": "1",
        "instantaneous": "75.59"
      },
      {
        "utc": "2019-05-08T23:10:00Z",
        "stationPower": "0.4639",
        "stationType": "1",
        "instantaneous": "59.38"
      },
      {
        "utc": "2019-05-08T23:20:00Z",
        "stationPower": "0.6216",
        "stationType": "1",
        "instantaneous": "76.98"
      },
      {
        "utc": "2019-05-08T23:30:00Z",
        "stationPower": "0.7299",
        "stationType": "1",
        "instantaneous": "89.58"
      },
      {
        "utc": "2019-05-08T23:40:00Z",
        "stationPower": "0.7508",
        "stationType": "1",
        "instantaneous": "91.09"
      },
      {
        "utc": "2019-05-08T23:50:00Z",
        "stationPower": "0.7740",
        "stationType": "1",
        "instantaneous": "94.30"
      },
      {
        "utc": "2019-05-09T00:00:00Z",
        "stationPower": "1.3623",
        "stationType": "1",
        "instantaneous": "163.70"
      },
      {
        "utc": "2019-05-09T00:10:00Z",
        "stationPower": "0.9799",
        "stationType": "1",
        "instantaneous": "117.44"
      },
      {
        "utc": "2019-05-09T00:20:00Z",
        "stationPower": "1.0368",
        "stationType": "1",
        "instantaneous": "124.82"
      },
      {
        "utc": "2019-05-09T00:30:00Z",
        "stationPower": "1.4338",
        "stationType": "1",
        "instantaneous": "171.92"
      },
      {
        "utc": "2019-05-09T00:40:00Z",
        "stationPower": "1.8761",
        "stationType": "1",
        "instantaneous": "232.88"
      },
      {
        "utc": "2019-05-09T00:50:00Z",
        "stationPower": "1.9700",
        "stationType": "1",
        "instantaneous": "228.60"
      },
      {
        "utc": "2019-05-09T01:00:00Z",
        "stationPower": "2.6210",
        "stationType": "1",
        "instantaneous": "336.87"
      },
      {
        "utc": "2019-05-09T01:10:00Z",
        "stationPower": "2.9208",
        "stationType": "1",
        "instantaneous": "422.32"
      },
      {
        "utc": "2019-05-09T01:20:00Z",
        "stationPower": "2.3800",
        "stationType": "1",
        "instantaneous": "297.18"
      },
      {
        "utc": "2019-05-09T01:30:00Z",
        "stationPower": "2.8642",
        "stationType": "1",
        "instantaneous": "365.95"
      },
      {
        "utc": "2019-05-09T01:40:00Z",
        "stationPower": "2.4063",
        "stationType": "1",
        "instantaneous": "299.10"
      },
      {
        "utc": "2019-05-09T01:50:00Z",
        "stationPower": "3.3647",
        "stationType": "1",
        "instantaneous": "414.24"
      },
      {
        "utc": "2019-05-09T02:00:00Z",
        "stationPower": "3.4453",
        "stationType": "1",
        "instantaneous": "398.48"
      },
      {
        "utc": "2019-05-09T02:10:00Z",
        "stationPower": "2.4583",
        "stationType": "1",
        "instantaneous": "311.88"
      },
      {
        "utc": "2019-05-09T02:20:00Z",
        "stationPower": "3.3031",
        "stationType": "1",
        "instantaneous": "373.23"
      },
      {
        "utc": "2019-05-09T02:30:00Z",
        "stationPower": "4.3455",
        "stationType": "1",
        "instantaneous": "436.45"
      },
      {
        "utc": "2019-05-09T02:40:00Z",
        "stationPower": "4.0512",
        "stationType": "1",
        "instantaneous": "440.39"
      },
      {
        "utc": "2019-05-09T02:50:00Z",
        "stationPower": "3.3298",
        "stationType": "1",
        "instantaneous": "455.38"
      },
      {
        "utc": "2019-05-09T03:00:00Z",
        "stationPower": "2.4829",
        "stationType": "1",
        "instantaneous": "404.01"
      },
      {
        "utc": "2019-05-09T03:10:00Z",
        "stationPower": "3.8333",
        "stationType": "1",
        "instantaneous": "425.76"
      },
      {
        "utc": "2019-05-09T03:20:00Z",
        "stationPower": "1.2769",
        "stationType": "1",
        "instantaneous": "156.97"
      },
      {
        "utc": "2019-05-09T03:30:00Z",
        "stationPower": "0.6567",
        "stationType": "1",
        "instantaneous": "81.67"
      },
      {
        "utc": "2019-05-09T03:40:00Z",
        "stationPower": "0.8212",
        "stationType": "1",
        "instantaneous": "127.24"
      },
      {
        "utc": "2019-05-09T03:50:00Z",
        "stationPower": "2.4101",
        "stationType": "1",
        "instantaneous": "758.78"
      },
      {
        "utc": "2019-05-09T04:00:00Z",
        "stationPower": "2.4183",
        "stationType": "1",
        "instantaneous": "324.02"
      },
      {
        "utc": "2019-05-09T04:10:00Z",
        "stationPower": "3.9435",
        "stationType": "1",
        "instantaneous": "474.50"
      },
      {
        "utc": "2019-05-09T04:20:00Z",
        "stationPower": "2.6683",
        "stationType": "1",
        "instantaneous": "349.08"
      },
      {
        "utc": "2019-05-09T04:30:00Z",
        "stationPower": "1.4261",
        "stationType": "1",
        "instantaneous": "177.21"
      },
      {
        "utc": "2019-05-09T04:40:00Z",
        "stationPower": "2.1827",
        "stationType": "1",
        "instantaneous": "243.35"
      },
      {
        "utc": "2019-05-09T04:50:00Z",
        "stationPower": "1.8186",
        "stationType": "1",
        "instantaneous": "189.84"
      },
      {
        "utc": "2019-05-09T05:00:00Z",
        "stationPower": "1.8317",
        "stationType": "1",
        "instantaneous": "255.45"
      },
      {
        "utc": "2019-05-09T05:10:00Z",
        "stationPower": "1.1719",
        "stationType": "1",
        "instantaneous": "148.10"
      },
      {
        "utc": "2019-05-09T05:20:00Z",
        "stationPower": "1.8222",
        "stationType": "1",
        "instantaneous": "255.34"
      },
      {
        "utc": "2019-05-09T05:30:00Z",
        "stationPower": "2.5288",
        "stationType": "1",
        "instantaneous": "483.61"
      },
      {
        "utc": "2019-05-09T05:40:00Z",
        "stationPower": "1.9506",
        "stationType": "1",
        "instantaneous": "216.59"
      },
      {
        "utc": "2019-05-09T05:50:00Z",
        "stationPower": "2.5740",
        "stationType": "1",
        "instantaneous": "320.48"
      },
      {
        "utc": "2019-05-09T06:00:00Z",
        "stationPower": "0.7013",
        "stationType": "1",
        "instantaneous": "75.20"
      },
      {
        "utc": "2019-05-09T06:10:00Z",
        "stationPower": "0.9437",
        "stationType": "1",
        "instantaneous": "93.78"
      },
      {
        "utc": "2019-05-09T06:20:00Z",
        "stationPower": "0.4530",
        "stationType": "1",
        "instantaneous": "47.59"
      },
      {
        "utc": "2019-05-09T06:30:00Z",
        "stationPower": "0.3062",
        "stationType": "1",
        "instantaneous": "31.83"
      },
      {
        "utc": "2019-05-09T06:40:00Z",
        "stationPower": "0.2396",
        "stationType": "1",
        "instantaneous": "28.21"
      },
      {
        "utc": "2019-05-09T06:50:00Z",
        "stationPower": "0.1954",
        "stationType": "1",
        "instantaneous": "26.98"
      },
      {
        "utc": "2019-05-09T07:00:00Z",
        "stationPower": "0.4403",
        "stationType": "1",
        "instantaneous": "48.20"
      },
      {
        "utc": "2019-05-09T07:10:00Z",
        "stationPower": "0.7643",
        "stationType": "1",
        "instantaneous": "82.55"
      },
      {
        "utc": "2019-05-09T07:20:00Z",
        "stationPower": "0.6289",
        "stationType": "1",
        "instantaneous": "65.50"
      },
      {
        "utc": "2019-05-09T07:30:00Z",
        "stationPower": "0.4176",
        "stationType": "1",
        "instantaneous": "42.88"
      },
      {
        "utc": "2019-05-09T07:40:00Z",
        "stationPower": "0.2016",
        "stationType": "1",
        "instantaneous": "22.79"
      },
      {
        "utc": "2019-05-09T07:50:00Z",
        "stationPower": "0.1947",
        "stationType": "1",
        "instantaneous": "21.35"
      },
      {
        "utc": "2019-05-09T08:00:00Z",
        "stationPower": "0.2154",
        "stationType": "1",
        "instantaneous": "68.32"
      },
      {
        "utc": "2019-05-09T08:10:00Z",
        "stationPower": "0.0801",
        "stationType": "1",
        "instantaneous": "9.19"
      },
      {
        "utc": "2019-05-09T08:20:00Z",
        "stationPower": "0.0430",
        "stationType": "1",
        "instantaneous": "2.09"
      },
      {
        "utc": "2019-05-09T08:30:00Z",
        "stationPower": "0.0322",
        "stationType": "1",
        "instantaneous": "0.44"
      },
      {
        "utc": "2019-05-09T08:40:00Z",
        "stationPower": "0.1453",
        "stationType": "1",
        "instantaneous": "62.26"
      },
      {
        "utc": "2019-05-09T08:50:00Z",
        "stationPower": "0.8368",
        "stationType": "1",
        "instantaneous": "318.33"
      },
      {
        "utc": "2019-05-09T09:00:00Z",
        "stationPower": "1.7444",
        "stationType": "1",
        "instantaneous": "278.41"
      },
      {
        "utc": "2019-05-09T09:10:00Z",
        "stationPower": "1.0981",
        "stationType": "1",
        "instantaneous": "126.65"
      },
      {
        "utc": "2019-05-09T09:20:00Z",
        "stationPower": "1.3031",
        "stationType": "1",
        "instantaneous": "157.99"
      },
      {
        "utc": "2019-05-09T09:30:00Z",
        "stationPower": "1.4541",
        "stationType": "1",
        "instantaneous": "409.52"
      },
      {
        "utc": "2019-05-09T09:40:00Z",
        "stationPower": "2.2528",
        "stationType": "1",
        "instantaneous": "425.75"
      },
      {
        "utc": "2019-05-09T09:50:00Z",
        "stationPower": "2.4485",
        "stationType": "1",
        "instantaneous": "341.27"
      },
      {
        "utc": "2019-05-09T10:00:00Z",
        "stationPower": "1.1611",
        "stationType": "1",
        "instantaneous": "174.22"
      },
      {
        "utc": "2019-05-09T10:10:00Z",
        "stationPower": "1.6068",
        "stationType": "1",
        "instantaneous": "248.73"
      },
      {
        "utc": "2019-05-09T10:20:00Z",
        "stationPower": "0.9301",
        "stationType": "1",
        "instantaneous": "144.32"
      },
      {
        "utc": "2019-05-09T10:30:00Z",
        "stationPower": "0.6494",
        "stationType": "1",
        "instantaneous": "104.14"
      },
      {
        "utc": "2019-05-09T10:40:00Z",
        "stationPower": "0.7437",
        "stationType": "1",
        "instantaneous": "100.91"
      },
      {
        "utc": "2019-05-09T10:50:00Z",
        "stationPower": "0.2947",
        "stationType": "1",
        "instantaneous": "32.68"
      },
      {
        "utc": "2019-05-09T11:00:00Z",
        "stationPower": "0.1027",
        "stationType": "1",
        "instantaneous": "14.08"
      },
      {
        "utc": "2019-05-09T11:10:00Z",
        "stationPower": "0.2247",
        "stationType": "1",
        "instantaneous": "30.59"
      },
      {
        "utc": "2019-05-09T11:20:00Z",
        "stationPower": "0.1258",
        "stationType": "1",
        "instantaneous": "17.73"
      },
      {
        "utc": "2019-05-09T11:30:00Z",
        "stationPower": "0.0673",
        "stationType": "1",
        "instantaneous": "8.63"
      },
      {
        "utc": "2019-05-09T11:40:00Z",
        "stationPower": "0.0615",
        "stationType": "1",
        "instantaneous": "3.67"
      },
      {
        "utc": "2019-05-09T11:50:00Z",
        "stationPower": "0.0131",
        "stationType": "1",
        "instantaneous": "2.48"
      },
      {
        "utc": "2019-05-09T12:00:00Z",
        "stationPower": "0.0025",
        "stationType": "1",
        "instantaneous": "0.09"
      },
      {
        "utc": "2019-05-09T12:10:00Z",
        "stationPower": "0.0001",
        "stationType": "1",
        "instantaneous": "0.00"
      }
    ]
    const sortName = [
      { text: '默认排序', id: 'default' },
      { text: '等效时', id: 'equivalentHours' },
      { text: '告警事件', id: 'alarmNum' },
      { text: '低效逆变器', id: 'lowEfficiencyInverterNum' },
      { text: '零支路数', id: 'anomalousBranchNum' },
      { text: '日发电量', id: 'dayPower' },
      { text: '辐射强度', id: 'instantaneous' },
      { text: '实时功率', id: 'stationPower' },
    ];
    const getStatusName = {
      '400': 'normal',
      '500': 'interrupt',
      '900': 'notConnected',
    };
    const filterStationList=selectStation ? stationDataList.filter(e=>e.stationCode===selectStation):stationDataList
    const filteredStation = this.dealData(filterStationList);
    return (
      <div className={styles.stationCardContainer}>
        <div className={styles.filterCondition}>
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="请选择电站"
            optionFilterProp="children"
            onChange={this.conditionChange}
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {stationDataList.map(list => {
              return <Option key={list.stationCode} value={list.stationCode}>{list.stationName}</Option>
            })}
          </Select>
          <div className={styles.sortCondition}>
            {sortName.map(list => {
              return (<div onClick={() => { this.sortStatus(list.id) }} key={list.id} className={`${styles.sortStatus}
                ${sortStatusName === list.id && styles['activeSortStatus']}`}>
                {list.text}
                {sortStatusName === list.id && ascend && <i className="iconfont icon-upstream"></i>}
                {sortStatusName === list.id && !ascend && <i className="iconfont icon-downstream"></i>}
              </div>)
            })}
          </div>
        </div>
        <div className={styles.staionsListBox}>
          {stationDataList.length > 0 && filteredStation.map((list,key) => {
            const stationStatusList = list.stations.sort((a, b) => {
              return 900 - b.stationStatus.stationStatus === 0 ? -1 : 1
            })
            return (<div className={styles.regionList} key={key}>
              <div className={styles.regionName}>{list.regionName}</div>
              <div className={styles.staionsList}>
                {stationStatusList.map((item, index) => {
                  const stationStatus = item.stationStatus || {};
                  const currentStatus = stationStatus.stationStatus;
                  const stationPower = realTimePowerUnit === 'kW' ? item.stationPower : multiplyFormarts(item.stationPower, 1000);
                  const stationCapacity = realCapacityUnit === 'MW' ? item.stationCapacity : multiplyFormarts(item.stationCapacity, 1000);
                  const instantaneous = item.instantaneous;
                  const dayPower = divideFormarts(item.dayPower, powerUnit);
                  const equivalentHours = item.equivalentHours;

                  return (
                    <div className={`${styles[getStatusName[currentStatus]]} ${styles.staionCard}`} onClick={() => { this.showTip(currentStatus) }} key={item.stationCode} >
                      <Link to={`/monitor/singleStation/${item.stationCode}`}  className={styles.linkBox}>
                        <div className={styles.stationTop}>
                          <div className={styles.stationName} title={item.stationName}> {item.stationName}</div>
                          <div className={styles.staionCapacity}>
                            <div>
                              <span className={styles.changeNum}>
                                <i className={'iconfont icon-tranlist'}></i> {stationCapacity}</span> {realCapacityUnit}
                            </div>
                            <div className={styles.stationUnitCount}>
                              <span className={styles.changeNum}>{item.stationUnitCount}</span> 台
                            </div>
                            {currentStatus === '500' && <i className="iconfont icon-outage"></i>}
                          </div>
                        </div>
                        <div className={styles.staionCenter}>
                          <div className={styles.staionCenterLeft}>
                            <div className={styles.column}>
                              <span className={styles.dataName}> 实时功率</span>
                              <div> <span className={styles.changeNum}> {dataFormats(stationPower, '--', 2, true)}</span> {realTimePowerUnit} </div>
                            </div>
                            <div className={styles.column}>
                              <span className={styles.dataName}> 日累计辐射</span>
                              <div> <span className={styles.changeNum}> {dataFormats(instantaneous, '--', 2, true)}</span> W/m² </div>
                            </div>
                          </div>
                          <div className={styles.staionCenterRight}>
                            <div className={styles.column}>
                              <span className={styles.dataName}> 日发电量</span>
                              <div> <span className={styles.changeNum}> {powerPoint(dayPower)}</span> {powerUnit} </div>
                            </div>
                            <div className={styles.column}>
                              <span className={styles.dataName}> 日等效时</span>
                              <div> <span className={styles.changeNum}> {dataFormats(equivalentHours, '--', 2, true)}</span> h </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                      <div className={styles.chart}>
                        <OutputTenMin {...this.props}
                          yXaisName={'辐射(W/m²)'}
                          stationCode={item.stationCode}
                          yAxisUnit={realTimePowerUnit}
                          capabilityData={data} />
                      </div>
                      <Link  to={`/monitor/singleStation/${item.stationCode}`}  className={styles.linkBox}>
                        <div className={styles.bottom}>
                          <div className={styles.dataColumn}>
                            异常支路数  <span className={styles[`${item.anomalousBranchNum > 0 ? 'red' : 'grey'}`]}>{dataFormats(item.anomalousBranchNum, '--', 0)}</span>
                          </div>
                          <div className={styles.dataColumn}>
                            低效逆变器  <span className={styles[`${item.anomalousBranchNum > 0 ? 'red' : 'grey'}`]}>{dataFormats(item.lowEfficiencyInverterNum, '--', 0)}</span>
                          </div>
                          <object className={styles.dataColumn}>
                            <Link to={`/monitor/alarm/realtime?stationCode=${item.stationCode}`} key={item.stationCode}>
                              <div>
                                告警  <span className={styles[`${item.anomalousBranchNum > 0 ? 'red' : 'grey'}`]}>{dataFormats(item.alarmNum, '--', 0)}</span>
                              </div>
                            </Link>
                          </object>
                        </div>

                      </Link>
                    </div>
                  )
                })}
              </div>
            </div>)

          })}
        </div>
      </div>
    )
  }
}
export default (PvStationItem)
