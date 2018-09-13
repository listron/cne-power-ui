import React, { Component } from 'react';
import { Button } from 'antd';
import StationSelectModal from './StationSelectModal'
import styles from './style.scss';
import PropTypes from 'prop-types';
/*
  模态框弹出单电站选择，选择电站后，针对该电站导入file
  必须参数:
  1. 电站基本信息数组(data),包含信息如下：
    [{
      commissioningDate:"2012-04-15T00:00:00"
      enterpriseId:"1"
      isConnected:false
      isWork:true
      latitude:"42.269351000000"
      longitude:"121.361496000000"
      orderNO:21102
      provinceCode:11            //必传
      provinceName:"辽宁"        //必传
      ratio:"0.30"
      stationCode:35           //必传
      stationId:"07392334-41ee-46f3-9385-e0617bd79433"       //必传
      stationName:"阜西古力本皋"  //必传
      stationPower:"49.50" 
      stationType:10              //必传
      stationUnitCount:33
      subCompany:"辽宁分公司"
      timeZone:8
      version:4436
      weaId:null
      zoneCode:10
      zoneName:"辽宁"
    }]
  2. uploadPath='http://www.baidu.com' ; upload组件的上传的url地址
  3. uploaderName = '电站'; 上传组件名
  选填参数： 
  1. disableStation = [21,73,22,25];不可选电站编码数组，默认为[];所有电站均可点击 
  2. uploadExtraData = {name: '张三', stationCode: 12} 上传file中，额外需要传至url的其他信息, 默认为{};
*/

class SingleStationImportFileModel extends Component {
  static propTypes = {
    data: PropTypes.array,
    disableStation: PropTypes.array,
    uploadExtraData: PropTypes.object,
    uploadPath: PropTypes.string,
    uploaderName: PropTypes.string,
  }
  static defaultProps = {
    data: [],
    disableStation: [],
    uploadExtraData: {},
    uploadPath: '',
  }
  constructor(props) {
    super(props);
    this.state = {
      modalShow: false,
    }
  }
  
  showStationModal = () => {
    this.setState({
      modalShow: true,
    })
  }

  hideStationModal = () => {
    this.setState({
      modalShow: false,
    })
  }

  render() {
    const { data, uploaderName, uploadPath, disableStation, uploadExtraData  } = this.props;
    const { modalShow } = this.state;
    return (
      <span className={styles.singleStationImportFileModel}>
        <Button onClick={this.showStationModal} className={styles.addButton}>
          <span className={styles.plus}>+</span>
          <span className={styles.name}>{uploaderName}</span>
        </Button>
        {modalShow && <StationSelectModal 
          uploaderName={uploaderName}
          data={data}
          uploadPath={uploadPath}
          disableStation={disableStation}
          uploadExtraData={uploadExtraData}
          hideStationModal={this.hideStationModal} 
        />}
      </span>
    )
  }
}
export default SingleStationImportFileModel;