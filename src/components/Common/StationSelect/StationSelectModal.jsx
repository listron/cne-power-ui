import React, { Component } from 'react';
import { Icon, Modal, Button, Radio, Checkbox  } from 'antd';
import StationItem from './StationItem';
import ProvinceItem from './ProvinceItem';
import styles from './style.scss';
import PropTypes from 'prop-types';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class StationSelectModal extends Component {
  static propTypes = {
    stationModalShow: PropTypes.bool,
    value: PropTypes.array,
    multiple: PropTypes.bool,
    selectStation: PropTypes.func,
    hideStationModal: PropTypes.func,
    showStationModal: PropTypes.func,
  }
  static defaultProps = {
    multiple: false,
  }
  constructor(props) {
    super(props);
    this.state = {
      filterStationType: 0,//选中电站类型
      stationType:[0,10,20],//0所有,20光伏，10光伏
      selectedStation:[], //暂存选中的电站数组
    }
  }

  onSelectStationType = (e) => {
    this.setState({
      filterStationType:e.target.value
    })
  }

  checkStation = ({ addStation, stationInfo }) => {
    let { selectedStation } = this.state;
    let newSelectedStation = [];
    if(addStation){
      newSelectedStation = [...selectedStation , stationInfo];
    }else{
      newSelectedStation = selectedStation.filter(e=>e.stationCode !== stationInfo.stationCode);
    }
    this.setState({
      selectedStation: newSelectedStation
    })
  }

  filterStation = () => {
    const { value } = this.props;
    const { filterStationType } = this.state;
    const tmpStations = filterStationType === 0 ? value : value.filter(e=>(e.stationType === filterStationType));
    let filteredStation = [];
    tmpStations.forEach(e=>{
      let findExactStation = false;
      filteredStation.forEach(m=>{
        if(m.provinceCode === e.provinceCode){
          findExactStation = true;
          m.stations.push(e);
        }
      })
      if(!findExactStation){
        filteredStation.push({
          provinceCode: e.provinceCode,
          provinceName: e.provinceName,
          stations:[e]
        })
      }
    })
    return filteredStation.map(e=>(
      <ProvinceItem key={e.provinceCode} checkStation={this.checkStation} provinceInfor={{...e}} />
    ))
  }

  render() {
    const { stationModalShow, hideStationModal, showStationModal } = this.props;
    const { filterStationType, stationType } = this.state;
    return (
      <div>
        <Icon type="filter" onClick={showStationModal} />
        <Modal
          visible={stationModalShow}
          onOk={this.onStationSelected}
          onCancel={hideStationModal}
          width={760}
        >
          <div className={styles.allStations}>
            <div className={styles.typeSelect}>
              <RadioGroup onChange={this.onSelectStationType} value={filterStationType}>
                {stationType.map(e=>(<RadioButton key={e} value={e}>{e===0?'全部':e===10?'光伏':'风电'}</RadioButton>))}
              </RadioGroup>
            </div>
            <div>
              {this.filterStation()}
            </div>
          </div>
        </Modal>
      </div>
    )
    
  }
}
export default StationSelectModal;