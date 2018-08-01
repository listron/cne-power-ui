import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './defectFilter.scss';
import ProvinceTab from './ProvinceTab';
import { Tabs } from 'antd';
const { TabPane } = Tabs;

class StationsFilter extends Component {
  static propTypes = {
    stationCodes: PropTypes.string,
    listQueryParams: PropTypes.object,
    stations: PropTypes.array,
    getDefectList: PropTypes.func,
  }

  constructor(props) {
    super(props);
    let activeKey = '0';
    let selectedStationArray = this.props.stationCodes.split(',').filter(e=>!!e).map(e=>+e)
    if( selectedStationArray.length > 0 ){//指定激活的tab页
      let initStationCode = selectedStationArray[0];
      let activeStation = this.props.stations.find(e=>e.stationCode === initStationCode)
      activeStation && (activeKey = `${activeStation.stationCode}`)
    }
    this.state = {
      activeKey
    };
  }

  selectProvince = (activeKey) => {
    let { getDefectList, listQueryParams } = this.props;
    if(activeKey === '0'){
      getDefectList({
        ...listQueryParams,
        stationCodes: ''
      })
    }
    this.setState({activeKey})
  }


  render() {
    const { stations, stationCodes, getDefectList, listQueryParams } = this.props;
    const { activeKey } = this.state;
    let stationGroup =  [];
    stations.forEach(e=>{//将stations拆分为以省份为组的对象数组；
      let getAccuacyProvice = false;
      stationGroup.length > 0 && stationGroup.forEach(m=>{
        if(m.provinceCode === e.provinceCode){
          getAccuacyProvice = true;
          m.childrenStations.push(e)
        }
      })
      if(!getAccuacyProvice){
        stationGroup.push({
          provinceCode : e.provinceCode,
          provinceName : e.provinceName,
          childrenStations: [e]
        })
      }
    })

    return (
      <div className={styles.stationsFilter}>
        <Tabs onChange={this.selectProvince} activeKey={activeKey} >
          <TabPane tab="不限" key="0">
            <span></span>
          </TabPane>
          {stationGroup.map(e=>(<ProvinceTab {...e} stationCodes={stationCodes} getDefectList={getDefectList} listQueryParams={listQueryParams} />))}
        </Tabs>
      </div>
    );
  }

}

export default StationsFilter;