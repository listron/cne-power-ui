import React, { Component } from 'react';
import {  Modal, Radio, Upload, Button, message  } from 'antd';
import ProvinceItem from './ProvinceItem';
import styles from './style.scss';
import PropTypes from 'prop-types';
import Cookie from 'js-cookie';
import WarningTip from '../WarningTip';
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
    loadedCallback: PropTypes.func,
    upLoadOutExtraData: PropTypes.object,  //额外需要传的数据，从station 中获取不到
    hasExistedJudge:PropTypes.bool, //判断文件是否存在
  }

  constructor(props) {
    super(props);
    this.state = {
      uploading: false,
      selectedStation: {},
      filterStationType: 2,//选中电站类型 => 默认为全部
      fileList: [],
      showWarningTip:false,
      warningTipText:'已存在,是否继续导入',
      file:'',
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
    const { loadedCallback, hideStationModal,hasExistedJudge } = this.props;
    const { selectedStation } = this.state;
    this.setState({
      uploading: true,
      fileList,
    })
    if (file.status !== 'uploading') {
      console.log(file, fileList);
      this.setState({
        uploading: false,
        file,
      })
    }
    if (file.status === 'done' && file.response && file.response.code === '10000' ) {
      message.success(`${file.name} 文件上传成功`);
      this.setState({ fileList: [] });
      loadedCallback && loadedCallback({ file, selectedStation });
      hideStationModal()
    }
    if(hasExistedJudge && file.status === 'done'&& file.response && file.response.code === '10001'){
      this.setState({showWarningTip:true})
    }
    else if(file.status === 'done' && (!file.response || file.response.code !== '10000') ){
      message.error(`${file.name} 文件上传失败: ${file.response.message},请重试!`);
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

  cancelWarningTip=()=>{ // 已存在判断 取消按钮
    const { loadedCallback, hideStationModal } = this.props;
    const {file,selectedStation}=this.state;
    this.setState({showWarningTip:false})
    loadedCallback && loadedCallback({ file, selectedStation,WarningTipStatus:'cancel'});
    hideStationModal();
    
  }

  confirmWarningTip=()=>{ // 已存在判断  确定按钮
    const { loadedCallback, hideStationModal } = this.props;
    const {file,selectedStation}=this.state;
    this.setState({showWarningTip:false})
    loadedCallback && loadedCallback({ file, selectedStation,WarningTipStatus:'ok' });
    hideStationModal();
  }


  render() {
    const { hideStationModal, data, uploaderName, uploadPath, uploadExtraData,upLoadOutExtraData,hasExistedJudge } = this.props;
    const { filterStationType, selectedStation, fileList, uploading,showWarningTip,warningTipText } = this.state;
    const tmpStationTypeArray = data.map(e=>e && e.stationType).filter(e=>(e || e === 0) );
    const stationTypeSet = new Set(tmpStationTypeArray);
    const stationTypeArray = Array.from(stationTypeSet);
    const showTypeSelectButton = stationTypeArray.length === 2;
    const authData = localStorage.getItem('authData') || '';
    const uploadExtraObject = {};
    uploadExtraData.forEach(e=>{
      uploadExtraObject[e] = selectedStation[e];
    })   
    const uploadAvailable = selectedStation.stationCode;
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
          headers={{'Authorization': 'bearer ' + authData}}
          beforeUpload={this.beforeUpload}
          onChange={this.excelInfoUpload}
          showUploadList={false}
          fileList={fileList}
          data={(file)=>({
            ...uploadExtraObject,
            ...upLoadOutExtraData,
            file,
          })}
        >
          <Button disabled={!uploadAvailable} loading={uploading}>导入{uploaderName}</Button>
        </Upload>}
      >
       {hasExistedJudge && showWarningTip &&
          <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={warningTipText} />}
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