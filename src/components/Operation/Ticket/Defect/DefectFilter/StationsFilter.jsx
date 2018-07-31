import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './defectFilter.scss';
import { Tabs, Checkbox } from 'antd';
const { TabPane } = Tabs;
const CheckboxGroup = Checkbox.Group;

class StationsFilter extends Component {
  static propTypes = {
    stationCodes: PropTypes.string,
    stations: PropTypes.array,
    changeDefectStore: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  selectProvince = (provinceName) => {
    this.props.changeDefectStore({provinceName})
  }

  render() {
    // stations = [{
    //   commissioningDate:"2012-04-15T00:00:00"
    //   enterpriseId:"1"
    //   isConnected:false
    //   isWork:true
    //   latitude:"42.269351000000"
    //   longitude:"121.361496000000"
    //   orderNO:21102
    //   provinceCode:11            //必传
    //   provinceName:"辽宁"        //必传
    //   ratio:"0.30"
    //   stationCode:35           //必传
    //   stationId:"07392334-41ee-46f3-9385-e0617bd79433"       //必传
    //   stationName:"阜西古力本皋"  //必传
    //   stationPower:"49.50" 
    //   stationType:10              //必传
    //   stationUnitCount:33
    //   subCompany:"辽宁分公司"
    //   timeZone:8
    //   version:4436
    //   weaId:null
    //   zoneCode:10
    //   zoneName:"辽宁"
    // },...]
    const { stations } = this.props;
    let stationGroup =  [];
    stations.forEach(e=>{//将stations拆分为以省份为组的对象数组；
      let getAccuacyProvice = false;
      stationGroup.length > 0 && stationGroup.forEach(m=>{
        if(m.provinceCode === e.provinceCode){
          getAccuacyProvice = true;
          m.stations.push(e)
        }
      })
      if(!getAccuacyProvice){
        stationGroup.push({
          provinceCode : e.provinceCode,
          provinceName : e.provinceName,
          stations: [e]
        })
      }
    })
    return (
      <div className={styles.stationsFilter}>
        <Tabs defaultActiveKey="1" onChange={this.selectProvince}>
          <TabPane tab="不限" key="1">
            <span></span>
          </TabPane>
          {/* {stationGroup.map(e=>{
            let stationOptions = [{label: e.provinceName,value: e.provinceName}].concat(e.stations.map(m=>({
              label: m.stationName,
              value: m.stationCode,
            })));
            <TabPane tab={e.provinceName} key={e.provinceCode}>
              {<CheckboxGroup options={plainOptions} value={this.state.checkedList} onChange={this.onStationCheck} />}
            </TabPane>
            }
          } */}
          <TabPane tab="Tab 2" key="2">Content of Tab Pane 2</TabPane>
          <TabPane tab="Tab 3" key="3">Content of Tab Pane 3</TabPane>
        </Tabs>
        <span onClick={()=>this.selectStations('2')} className={styles.all} >不限</span>
      </div>
    );
  }

}

export default StationsFilter;