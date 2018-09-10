import React,{ Component } from 'react';
import PropTypes from 'prop-types';
import styles from './defectBasicInfo.scss';
import { getLevel } from '../../../../../constants/ticket';
import ImgUploader from '../../../../Common/Uploader/ImgUploader';

class DefectBasicInfo extends Component {
  static propTypes = {
    basicInfo: PropTypes.object
  }

  constructor(props) {
    super(props);
  }

  getImagesData() {
    if(this.props.basicInfo.get('photoAddress')) {
      let images = this.props.basicInfo.get('photoAddress').split(',');
      return images.map((item, index) => {
        return {
          uid: index,
          rotate: 0,
          thumbUrl: item
        }
      });
    } else {
      return [];
    } 
  }

  renderBasic() {
    let info = this.props.basicInfo;
    return (
      <div className={styles.basicContent}>
        <div className={styles.basicItem}>电站名称
          <span>{info.get('stationName')}</span>
          <span>{info.get('stationtype') === 0 ? <i className="iconfont icon-windlogo"/> :
           <i className="iconfont icon-pvs" />}</span>
        </div>
        <div className={styles.basicItem}>设备类型<span>{info.get('deviceTypeName')}</span></div>
        <div className={styles.basicItem}>设备名称<span>{info.get('deviceName')}</span></div>
        <div className={styles.basicItem}>缺陷类型<span>{info.get('defectTypeName')}</span></div>
        <div className={styles.basicItem}>缺陷级别<span>{getLevel(info.get('defectLevel').toString())}</span></div>
        <div className={styles.basicItem}>缺陷描述<span>{info.get('defectDescribe')}</span></div>
        <div className={styles.viewImg}>
          <ImgUploader editable={false} data={this.getImagesData()} />
        </div>
      </div>
    );
  }

  render() {   
    return (
      <div className={styles.basicInfo}>
        <div className={styles.title}>
          基本信息
          <i className="iconfont icon-content" />
        </div>
        {this.renderBasic()}
      </div>
    );
  }  
}

export default DefectBasicInfo;