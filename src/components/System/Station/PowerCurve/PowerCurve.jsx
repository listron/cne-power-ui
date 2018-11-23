import React, { Component } from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import styles from './powerCurve.scss'
import StationSelect from '../../../Common/StationSelect';

const Option = Select.Option;
class PowerCurve extends Component {
  static propTypes = {
    changePlanStore: PropTypes.func,
    planData: PropTypes.array,
  }

  constructor(props) {
    super(props);
    this.state = {
      selectStation: []
    }
  }

  stationSelected = (rest) => {
    console.log('123', rest[0].stationCode)
    this.props.getDeviceModel({
      stationCode: rest[0].stationCode,
      deviceTypeCode: '101',
    });
    this.setState({
      selectStation:rest[0]
    })

  }
  deviceTypeCodeChange=(e)=>{
    console.log(e)
  }

  render() {
    const { stations,deviceModels } = this.props;
    console.log('this.props', this.props)
    const { selectStation } = this.state;
    return (
      <div className={styles.PowerCurve}>
        <div className={styles.contentMain}>
          <div className={styles.selectSearth}>
            <span>条件查询</span>
            <StationSelect
              data={stations.length > 0 && stations.filter(e => e.stationType === 0) || []}
              holderText={"电站名称"}
              value={[selectStation]}
              onChange={this.stationSelected}
              className={styles.stationSelect}
            />
            <Select 
             style={{ width: 198 }} 
             onChange={this.deviceTypeCodeChange} 
             disabled={deviceModels.length>0 ?false:true} placeholder={'风机型号'} 
             className={styles.deviceModeName} 
            //  value={this.state.selectModle} 
            >
              { deviceModels.length>0 && deviceModels.map(e=>{
                return <Option value={e.deviceModeName} key={e.deviceModeName}>{e.deviceModeName}</Option>
              }) }
            </Select>

          </div>

        </div>
      </div>

    )
  }
}

export default PowerCurve;
