import React from 'react';
import PropTypes from 'prop-types';
import styles from './inspectDetail.scss';

class InspectBaseInfo extends React.Component {
  static propTypes = {
    inspectDetail: PropTypes.object,
  }
  constructor(props, context) {
    super(props, context);
  }

  renderbaseInfo = (data) => {
    const { stationName, stationType, inspectName, createTime, deadLine, deviceTypeNames } = data;
    const baseInfo = [
      { name: '电站名称', value: `${stationName}`, icon: `${stationType}` },
      { name: '巡检名称', value: `${inspectName}` },
      { name: '巡检时间', value: `${createTime}至${deadLine}` },
      { name: '设备类型', value: `${deviceTypeNames}` },
    ];
    return baseInfo;
  }
  render() {
    const { inspectDetail } = this.props;

    const { isOverTime, inspectedItems, unInpsectedItems } = inspectDetail;

    const baseInfo = this.renderbaseInfo(inspectDetail);
    return (
      <div className={styles.basicInfo} >
        <div className={styles.title}>
          <div className={styles.text}>
            基本信息
            <i className="iconfont icon-content" />
          </div>
          <div className={styles.warning}>
            {isOverTime ? <div className={styles.overTime}>超时</div> : null}
          </div>
        </div>
        <div className={styles.basicContent}>
          {baseInfo.map((e, i) => (
            <div className={styles.basicItem} key={e.name}>
              <div className={styles.nameStyle}>{e.name}</div>
              <span>{e.value}</span>
              {e.icon ? <i className="iconfont icon-pvs" /> : e.icon === '0' ? <i className="iconfont icon-windlogo" /> : ''}
            </div>
          ))}
          <div className={styles.progressStyele}>
            <div className={styles.nameStyle}>巡检进度</div>
            <div className={styles.processContent}>
              <div className={styles.processDetail}>
                <div className={styles.overinspect}>
                  <span className={styles.totalNum}>已巡检</span>
                  {inspectedItems && inspectedItems.map((e, i) => (
                    <span className={i % 2 === 0 ? styles.bgStyle : styles.nobgStyle} key={e}>{e}</span>
                  ))}
                </div>
                <div className={styles.noinspect}>
                  <span className={styles.totalNum}>未巡检</span>
                  {unInpsectedItems && unInpsectedItems.map((e, i) => (
                    <span className={i % 2 === 0 ? styles.bgStyle : styles.nobgStyle} key={e}>{e}</span>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>


      </div>
    );
  }
}
export default (InspectBaseInfo);
/**
  {matrixes && matrixes.filter((e, i) => e.status === 0).map((item, index) => (
                    <span key={index}>{item.belongMatrix}</span>
                  ))}
                  {
                    deviceTypes && deviceTypes.filter(e => e.unknownNum === 0).map((item, index) => {
                      return item.devices.map((device, id) => (
                        <span key={`${index}-${id}`}>{item.deviceTypeName}-{device.deviceName}</span>
                      ));
                    })
                  }
 */
