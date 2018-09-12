import React, { Component } from 'react';
import { Icon, Modal, Radio  } from 'antd';
import ProvinceItem from './ProvinceItem';
import styles from './style.scss';
import PropTypes from 'prop-types';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class StationSelectModal extends Component {
  static propTypes = {
    stationModalShow: PropTypes.bool,
    data: PropTypes.array,
    multiple: PropTypes.bool,
    hideStationModal: PropTypes.func,
    showStationModal: PropTypes.func,
    handleOK: PropTypes.func
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

  onClearSelected = () => {
    this.setState({
      selectedStation:[]
    })
  }
  onDeleteOneStation = (stationInfor) => {
    const { selectedStation } = this.state;
    const tmpSelectedStation = selectedStation.filter(e=>e.stationCode !== stationInfor.stationCode);
    this.setState({
      selectedStation: tmpSelectedStation
    })
  }
  
  handleOK = () => {
    this.props.handleOK(this.state.selectedStation)
  }

  checkStation = (selectedStation) => {
    this.setState({
      selectedStation
    })
  }


  _filterStation = () => {
    const { data, multiple } = this.props;
    const { filterStationType, selectedStation } = this.state;
    const tmpStations = filterStationType === 0 ? data : data.filter(e=>(e.stationType === filterStationType));
    let filteredStation = [];
    tmpStations && tmpStations.length > 0 && tmpStations.forEach(e=>{
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
      <ProvinceItem key={e.provinceCode} multiple={multiple} checkStation={this.checkStation} provinceInfo={{...e}} selectedStation={selectedStation} />
    ))
  }
  _selectedStation = () => {
    const { selectedStation } = this.state;
    return (
      <div className={styles.selectedStationList}>
        <div className={styles.selectedStationTitle}>
          <span>已选电站{selectedStation.length}个</span>
          {selectedStation.length>0&&<span className={styles.clearAll} onClick={this.onClearSelected}>清空</span>} 
        </div>
        <div className={styles.innerStationList}>
          {selectedStation.map(e=>{
            return <div key={e.stationCode} className={styles.eachSelectedStation} > <span>{ e.stationName }</span> <Icon type="close" className={styles.deleteIcon} onClick={()=>this.onDeleteOneStation(e)} /> </div>
          })}
        </div>
      </div>
    )
  }




  render() {
    const { stationModalShow, hideStationModal, showStationModal, multiple } = this.props;
    const { filterStationType, stationType } = this.state;
    return (
      <div className={styles.stationSelectModal}>
        <i className="iconfont icon-filter" onClick={showStationModal} />
        <Modal
          visible={stationModalShow}
          onOk={this.handleOK}
          onCancel={hideStationModal}
          cancelText={'取消'}
          okText={'确定'}
          title="请选择"
          width={625}
          wrapClassName={styles.stationModal}
        >
          <div className={styles.stationStyleModal}>
            <div className={styles.stationType}>
              <RadioGroup onChange={this.onSelectStationType} value={filterStationType}>
                {stationType.map(e=>(<RadioButton key={e} value={e} >{e===0?'全部':e===10?'光伏':'风电'}</RadioButton>))}
              </RadioGroup>
            </div>
            <div className={styles.provinceList}>
              {this._filterStation()}
            </div>
            <div className={styles.selectStations}>
              {multiple && this._selectedStation()}
            </div>
          </div>
        </Modal>
      </div>
    )
    
  }
}
export default StationSelectModal;