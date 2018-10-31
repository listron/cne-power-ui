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
    const info = this.props.basicInfo;
    return (
      <div className={styles.basicContent}>
        <div className={styles.basicItem}>
          <div>电站名称</div>
          <span>{info.get('stationName')}</span>
          <span>{info.get('stationType') === '0' ? <i className="iconfont icon-windlogo" /> :
           <i className="iconfont icon-pvs" />}</span>
        </div>
        <div className={styles.basicItem}><div>设备类型</div><span>{info.get('deviceTypeName')}</span></div>
        <div className={styles.basicItem}><div>设备名称</div><span>{info.get('deviceName')}</span></div>
        <div className={styles.basicItem}><div>缺陷类型</div><span>{info.get('defectTypeName')}</span></div>
        <div className={styles.basicItem}><div>缺陷级别</div><span>{getLevel(info.get('defectLevel').toString())}</span></div>
        <div className={styles.basicItem}><div>缺陷描述</div><span>{info.get('defectDescribe')}</span></div>
        <div className={styles.viewImg}>
          <ImgUploader editable={false} data={this.getImagesData()} />
        </div>
      </div>
    );
  }

  render() {
    const info = this.props.basicInfo;  
    return (
      <div className={styles.basicInfo}>
        <div className={styles.title}>
          <div className={styles.text}>
            基本信息
            <i className="iconfont icon-content" />
          </div>
          <div className={styles.warning}>
            {info.get('isOverTime') === '0'? <div className={styles.overTime}>超时</div> : null}
            {info.get('isCoordination') === '0'? <div className={styles.coordinate}>协调</div> : null}
          </div>
        </div>
        {this.renderBasic()}
      </div>
    );
  }  
}

export default DefectBasicInfo;