import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './workOrder.scss';
import { getLevel, getSource } from '../../../../constants/ticket';
import ImgUploader from '../../../Common/Uploader/ImgUploader';

class DefectBasicInfo extends Component {
  static propTypes = {
    basicInfo: PropTypes.object,
    defectTypes: PropTypes.object,
  }

  constructor(props) {
    super(props);
  }
  
  componentDidMount(){
    // console.log('info',this.props.basicInfo)
  }

  componentDidUpdate(prevProps){
    console.log(prevProps.basicInfo,this.props.basicInfo)
    const prevDefectId=prevProps.basicInfo.defectId || '';
    const defectId=this.props.basicInfo.defectId || '';
    if(defectId !== prevDefectId){
      console.log(3434343);
      const {defectTypeCode,defectDescribe,deviceTypeCode}=this.props.basicInfo;
    }
  }

  render() {
    const info = this.props.basicInfo;
    let images = info.photoAddress ? info.photoAddress.split(',') : [];
   
    return (
      <div className={styles.basicInfo}>
        <div className={styles.title}>
          <div className={styles.text}>
            基本信息
            <i className="iconfont icon-content" />
          </div>
          <div className={styles.warning}>
            {!(+info.isOverTime) && <div className={styles.overTime}>超时</div>}
            {!(+info.isCoordination) && <div className={styles.coordinate}>协调</div>}
          </div>
        </div>
        <div className={styles.basicContent}>
          <div className={styles.basicItem}>
            <div>电站名称</div>
            <span>{info.stationName}</span>
            <span>{info.stationType === '0' ? <i className="iconfont icon-windlogo" /> :
              <i className="iconfont icon-pvs" />}</span>
          </div>
          <div className={styles.basicItem}><div>设备类型</div><span>{info.deviceTypeName || '--'}</span></div>
          <div className={styles.basicItem}><div>设备名称</div><span>{info.deviceName || '--'}</span></div>
          <div className={styles.basicItem}>
            <div>缺陷类型</div><span>{`${info.defectParentTypeName}/${info.defectTypeName}` || '--'}</span>
          </div>
          <div className={styles.basicItem}><div>缺陷级别</div><span>{getLevel(`${info.defectLevel}`) || '--'}</span></div>
          <div className={styles.basicItem}><div>缺陷来源</div><span>{getSource(info.defectSource) || '--'}</span></div>
          <div className={styles.basicItem}><div>缺陷描述</div><span>{info.defectDescribe || '--'}</span></div>
          <div className={styles.viewImg}>
            <ImgUploader editable={false} data={images.map(item => ({
              uid: item,
              rotate: 0,
              thumbUrl: `${item}?${Math.random()}`
            }))}
            />
          </div>
        </div>
        {/* {this.renderBasic()} */}
      </div>
    );
  }
}

export default DefectBasicInfo;
