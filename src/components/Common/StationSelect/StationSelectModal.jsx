import React, { Component } from 'react';
import { Icon, Modal, Button, Radio } from 'antd';
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
    }
  }

  onSelectStationType = (e) => {
    this.setState({
      filterStationType:e.target.value
    })
  }

  filterStation = () => {
    const { value } = this.props;
    const { filterStationType } = this.state;
    const tmpStations = filterStationType === 0 ? value : value.filter(e=>(e.stationType === filterStationType))
    let filteredStation = [];
    tmpStations.forEach(e=>{
      let findExactStation = false;
      filteredStation.forEach(m=>{
        if(m.provinceCode === e.provinceCode){
          findExactStation = true
          m.stations.push(e)
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
    filteredStation.map(e=>(
      <div>
        <h3>{e.provinceName}</h3>
        {e.stations.map(m=>(<Button>{m.stationName}</Button>))}
      </div>
    ))
    return filteredStation
  }

  render() {
    const { stationModalShow, hideStationModal, showStationModal, value } = this.props;
    const { filterStationType, stationType } = this.state;
    const filteredStation = filterStationType === 0 ? value : value.filter(e=>(e.stationType === filterStationType))

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
              {filteredStation.map(e=>(<Button key={e.stationCode}>{e.stationName}</Button>))}
            </div>
          </div>
        </Modal>
      </div>
    )
    
  }
}
export default StationSelectModal;