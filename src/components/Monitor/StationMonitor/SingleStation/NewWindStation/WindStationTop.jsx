

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './windStation.scss';
import { Icon, Progress, Modal, Input, Drawer } from 'antd';
import moment from 'moment';
import ChangeStation from '../SingleStationCommon/ChangeStation';
import { Link } from 'react-router-dom';
import { monitordataFormat } from '../../../../../utils/utilFunc';
import { ValueFormat, DeviceValueFormat } from '../../../../Common/UtilComponent';


class WindStationTop extends Component {
  static propTypes = {
    match: PropTypes.object,
    singleStationData: PropTypes.object,
    stationList: PropTypes.array,
    weatherList: PropTypes.array,
    operatorList: PropTypes.array,

  }

  constructor(props) {
    super(props);
    this.state = {
      showStationList: false,
    }

  }

  componentDidMount() {
    const main = document.getElementById('main');
    main && main.addEventListener('click', this.hiddenStationList, true);
  }

  componentWillUnmount() {
    const main = document.getElementById('main');
    main && main.removeEventListener('click', this.hiddenStationList, true);
  }

  showStationList = () => {
    this.setState({
      showStationList: true,
    });
  }

  hideStationChange = () => {
    this.setState({
      showStationList: false,
    });
  }

  render() {
    const { singleStationData = {}, stationList,weatherList,operatorList } = this.props;
    const { showStationList } = this.state;
    const baseLinkPath = `/monitor/singleStation`;
    const pathAllStation = "/monitor/station";
    const currentStationName = singleStationData.stationName;
    const { stationStatus = {} } = singleStationData;
    const { stationStatusName, stationStatusTime } = stationStatus;
    /**  * 
     const weatherList = [
      {
        "id": "382047488395303",
        "stationCode": 74,
        "temperature": "11℃~21℃",
        "weather": "多云转雷阵雨",
        "weatherDate": "2019-04-15",
        "weatherId": "01,04",
        "weatherSummary": "雨",
        "wind": "东南风微风"
      },
      {
        "id": "382409893038119",
        "stationCode": 74,
        "temperature": "12℃~25℃",
        "weather": "多云转晴",
        "weatherDate": "2019-04-16",
        "weatherId": "01,00",
        "weatherSummary": "晴",
        "wind": "西南风微风"
      },
      {
        "id": "382772264126503",
        "stationCode": 74,
        "temperature": "15℃~27℃",
        "weather": "晴",
        "weatherDate": "2019-04-17",
        "weatherId": "00,00",
        "weatherSummary": "晴",
        "wind": "南风微风"
      },
      {
        "id": "383134651992103",
        "stationCode": 74,
        "temperature": "13℃~30℃",
        "weather": "多云",
        "weatherDate": "2019-04-18",
        "weatherId": "01,01",
        "weatherSummary": "其他",
        "wind": "南风3-5级"
      },
      {
        "id": "383497098762279",
        "stationCode": 74,
        "temperature": "11℃~21℃",
        "weather": "多云",
        "weatherDate": "2019-04-19",
        "weatherId": "01,01",
        "weatherSummary": "其他",
        "wind": "东风3-5级"
      },
      {
        "id": "383859444684839",
        "stationCode": 74,
        "temperature": "15℃~27℃",
        "weather": "晴",
        "weatherDate": "2019-04-20",
        "weatherId": "00,00",
        "weatherSummary": "晴",
        "wind": "南风微风"
      },
      {
        "id": "384221832550439",
        "stationCode": 74,
        "temperature": "15℃~27℃",
        "weather": "晴",
        "weatherDate": "2019-04-21",
        "weatherId": "00,00",
        "weatherSummary": "晴",
        "wind": "南风微风"
      }
    ]
    const operatorList = [
      {
        "roleDesc": "运维实施人员",
        "userStatus": 2,
        "roleId": "5",
        "userFullName": null,
        "roleName": "monitor_remove",
        "phoneNum": "18500505505",
        "userName": "#$@#@%@%@24#%#@#%",
        "userId": "352769139983872"
      },
      {
        "roleDesc": "运维实施人员",
        "userStatus": 1,
        "roleId": "5",
        "userFullName": "侯强",
        "roleName": "monitor_remove",
        "phoneNum": "15600297700",
        "userName": "houqiang",
        "userId": "324224850599938"
      }
    ] **/
    const todayWeather = weatherList.length > 0 && weatherList[0] || {}
    return (
      <div className={styles.stationTop} >
        {showStationList && <ChangeStation stations={stationList.filter(e => e.isConnected === 1)} stationName={singleStationData.stationName} baseLinkPath={baseLinkPath} hideStationChange={this.hideStationChange} />}
        <div className={styles.stationTitle}>
          <div className={styles.stationLeft} >
            <div onClick={this.showStationList} className={styles.stationToggle} id="stationToggle" >
              <Icon type="swap" />
              <h3>{currentStationName}-{singleStationData.provinceName}</h3>
            </div>
            <div>
              <span>电站状态：{stationStatusName}</span>
              {stationStatus.stationStatus === 500 && <span>时间:{stationStatusTime && moment(stationStatusTime).fromNow() || ''}</span>}
            </div>
          </div>
          <div className={styles.stationRight}>
            <div className={styles.operatorList}>
              <marquee className={styles.marquee} >
                {operatorList.map(item => {
                  return <span key={item.userId}>{item.roleDesc} {item.userFullName} {item.phoneNum}   </span>
                })}
              </marquee>
            </div>
            <div className={styles.weather}>天气:{todayWeather.weatherSummary} {todayWeather.temperature}</div>
            <Link to={pathAllStation}  >
              <Icon type="arrow-left" className={styles.backIcon} />
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

export default WindStationTop;
