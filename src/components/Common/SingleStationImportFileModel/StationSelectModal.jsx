import React, { Component } from 'react';
import {  Modal, Radio, Upload, Button, message  } from 'antd';
import ProvinceItem from './ProvinceItem';
import styles from './style.scss';
import PropTypes from 'prop-types';
import Cookie from 'js-cookie';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class StationSelectModal extends Component {
  static propTypes = {
    uploadPath: PropTypes.string, // 上传路径
    uploaderName: PropTypes.string, // 显示名称
    uploadExtraData: PropTypes.array, // upload额外参数
    uploadPath: PropTypes.string, // 上传路径
    disableStation: PropTypes.array, // 不可选电站code 数组
    data: PropTypes.array, // station信息集合
    hideStationModal: PropTypes.func, // 隐藏
  }

  constructor(props) {
    super(props);
    this.state = {
      selectedStation: {},
      filterStationType: 0,//选中电站类型
    }
  }

  onSelectStationType = (e) => {
    this.setState({
      filterStationType:e.target.value
    })
  }

  checkStation = (selectedStation) => {
    this.setState({
      selectedStation
    })
  }

  beforeUpload = (file) => { // 上传前的校验
    const validType = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']; // 暂时不兼容xls : 'application/vnd.ms-excel'
    const validFile = validType.includes(file.type);
    if (!validFile) {
      message.error('只支持上传excel文件!');
    }
    return !!validFile
  }

  excelInfoUpload = ({file, fileList}) => { // 
    if (file.status !== 'uploading') {
      console.log(file, fileList);
    }
    if (file.status === 'done') {
      message.success(`${file.name} 文件上传成功`);
      this.props.hideStationModal()
    } else if (file.status === 'error') {
      message.error(`${file.name} 文件上传失败!`);
    }
  }

  _filterStation = () => { // 双重遍历，依据省份对电站进行进一步分组。
    const { data, disableStation } = this.props;
    const { filterStationType, selectedStation } = this.state;
    const tmpStations = filterStationType === 2 ? data : data.filter(e=>(e.stationType === filterStationType)); // type 2全选。
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
      <ProvinceItem 
        selectedStation={selectedStation}
        disableStation={disableStation}
        key={e.provinceCode} 
        checkStation={this.checkStation} 
        provinceInfo={{...e}} 
      />
    ))
  }

  render() {
    const { hideStationModal, data, uploaderName, uploadPath, uploadExtraData } = this.props;
    const { filterStationType, selectedStation } = this.state;
    const tmpStationTypeArray = data.map(e=>e && e.stationType).filter(e=>(e || e === 0) );
    const stationTypeSet = new Set(tmpStationTypeArray);
    const stationTypeArray = Array.from(stationTypeSet);
    const showTypeSelectButton = stationTypeArray.length === 2;
    const authData = Cookie.get('authData') || null;
    const uploadExtraObject = {};
    uploadExtraData.forEach(e=>{
      uploadExtraObject[e] = selectedStation[e];
    })
    return (
      <Modal
        visible={true}
        onCancel={hideStationModal}
        title="请选择一个电站"
        width={625}
        wrapClassName={styles.uploadSingleStationModal}
        footer={<Upload
          action={uploadPath}
          className={styles.excelInfoUploader}
          headers={{'Authorization': 'bearer ' + JSON.parse(authData)}}
          beforeUpload={this.beforeUpload}
          onChange={this.excelInfoUpload}
          data={(file)=>({
            ...uploadExtraObject,
            file,
          })}
        >
          <Button>导入{uploaderName}</Button>
        </Upload>}
      >
        <div className={styles.stationModalContent}>
          <div className={styles.stationType}>
            {showTypeSelectButton && <RadioGroup onChange={this.onSelectStationType} value={filterStationType}>
              <RadioButton key={2} value={2} >全部</RadioButton>
              {stationTypeArray.map(e=>(<RadioButton key={e} value={e} >{e===0?'风电':'光伏'}</RadioButton>))}
            </RadioGroup>}
          </div>
          <div className={styles.provinceList}>
            {this._filterStation()} 
          </div> 
        </div>
      </Modal>
    )
    
  }
}
export default StationSelectModal;