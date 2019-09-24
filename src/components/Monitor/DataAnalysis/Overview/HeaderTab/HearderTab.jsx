import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import searchUtil from '@utils/searchUtil';
import styles from './header.scss';

class HearderTab extends Component{
  static propTypes = {
    tab: PropTypes.string,
    pages: PropTypes.array,
    history: PropTypes.object,
    changeOverviewStore: PropTypes.func,
  }

  tabNames = ['电站数据质量', '设备数据质量', '测点数据质量']
  tabs = ['station', 'device', 'point']

  tabChange = (value) => {
    const { tab, history } = this.props;
    if (value === tab) {
      return;
    }
    const { search } = history.location;
    this.props.changeOverviewStore({ tab: value });
    const newSearch = searchUtil(search).replace({tab: value}).stringify();
    history.push(`/monitor/data/overview?${newSearch}`);
  }

  closeTab = (value) => {
    const { tab, pages, history } = this.props;
    const { search } = history.location;
    const newPages = pages.filter(e => e !== value);
    const newTab = value === tab ? newPages[newPages.length - 1] : tab; // 关闭当前页, tab变化
    const clearData = {// 需要清空关闭页的相关数据
      device: {
        deviceParam: {},
        deviceCheckedList: [],
        devicesData: {}, // 各设备信息
        deviceTopData: {}, // 设备页顶部信息
        devicePointsList: [], // 设备页测点列表
        deviceUnix: null, // 电站页请求时间
      },
      point: {
        pointParam: {}, // stationCode, deviceTypeCode, deviceFullcode, dateType, date => 会转为字符串写入search的point
        pointsCheckedList: [], // 测点页选中的测点
        pointsData: [], // 各测点信息列表
        pointTopData: {}, // 测点页顶部信息
        pointConnectedDevices: [], // 测点页可用测点列表
        pointList: [], // 测点页测点列表
        deviceListUnix: null, // 测点页设备列表获取的时间
        pointUnix: null, // 电站页请求时间
      },
    };
    this.props.changeOverviewStore({
      tab: newTab,
      pages: newPages,
      ...clearData[value],
    });
    const newSearch = searchUtil(search).replace({
      tab: newTab,
      pages: newPages.join('_'),
    }).delete([value]).stringify();
    history.push(`/monitor/data/overview?${newSearch}`);
  }

  render(){
    const { tab, pages } = this.props;
    return(
      <div className={styles.tabs}>
        {this.tabs.map((e, i) => (
          <div
            key={e}
            className={styles.eachTab}
            style={{display: pages.includes(e) ? 'block' : 'none'}}
          >
            <span
              className={`${styles.button} ${tab === e ? styles.actievButton : ''}`}
              onClick={() => this.tabChange(e)}
            >{this.tabNames[i]}</span>
            {i > 0 && <Icon className={styles.close} type="close" onClick={() => this.closeTab(e)} />}
          </div>
        ))}
      </div>
    );
  }
}

export default HearderTab;
