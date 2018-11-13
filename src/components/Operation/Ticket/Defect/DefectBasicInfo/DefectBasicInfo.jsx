import React,{ Component } from 'react';
import PropTypes from 'prop-types';
import styles from './defectBasicInfo.scss';
import { getLevel } from '../../../../../constants/ticket';
import ImgUploader from '../../../../Common/Uploader/ImgUploader';

class DefectBasicInfo extends Component {
  static propTypes = {
    basicInfo: PropTypes.object,
    defectTypes: PropTypes.object,
  }

  constructor(props) {
    super(props);
  }

  renderBasic() {
    const info = this.props.basicInfo;
    const { defectTypes } = this.props;
    const defectTypeCode = info.get('defectTypeCode');
    let tmpGenTypes = [];
    let defectShowText = '';
    defectTypes.toJS().forEach(e=>e && e.list && e.list.length > 0 && tmpGenTypes.push(...e.list));
    tmpGenTypes.forEach(e=>{ // 解析展示的缺陷类型。
      const innerDefect = e.list || [];
      innerDefect.forEach(inner=>{
        `${inner.id}` === `${defectTypeCode}` && (defectShowText = `${e.name}/${inner.name}`);
      })
    });
    let images = info.get('photoAddress')?info.get('photoAddress').split(','): [];
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
        <div className={styles.basicItem}><div>缺陷类型</div><span>{defectShowText}</span></div>
        <div className={styles.basicItem}><div>缺陷级别</div><span>{getLevel(info.get('defectLevel').toString())}</span></div>
        <div className={styles.basicItem}><div>缺陷描述</div><span>{info.get('defectDescribe')}</span></div>
        <div className={styles.viewImg}>
          <ImgUploader editable={false} data={images.map(item => ({
              uid: item,
              rotate: 0,
              thumbUrl: `${item}?${Math.random()}`
            }))}
          />
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