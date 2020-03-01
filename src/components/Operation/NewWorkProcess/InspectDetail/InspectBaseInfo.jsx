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
    const { stationName = '', stationType, inspectName = '', createTime = '', deadLine = '', deviceTypeNames = '--' } = data;
    const baseInfo = [
      { name: '电站名称', value: `${stationName}`, icon: `${stationType}` },
      { name: '巡检名称', value: `${inspectName}` },
      { name: '巡检时间', value: `${createTime}  ${deadLine ? '至' : ''}  ${deadLine}` },
      { name: '设备类型', value: `${deviceTypeNames}` },
    ];
    return baseInfo;
  }
  render() {
    const { inspectDetail } = this.props;
    const { isOverTime, inspectedItems, unInspectedItems } = inspectDetail;
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
              {+(e.icon) ? <i className="iconfont icon-pvs" /> : e.icon === '0' ? <i className="iconfont icon-windlogo" /> : ''}
            </div>
          ))}
          <div className={styles.progressStyele}>
            <div className={styles.nameStyle}>巡检进度</div>
            <div className={styles.box1}>
              <div className={(inspectedItems && inspectedItems.length > 18 || unInspectedItems && unInspectedItems.length > 18) ? styles.box3 : styles.box2}>
                <span className={styles.totalNum}>已巡检</span>
                <span className={styles.noinspect}>未巡检</span>
              </div>
              <div className={styles.processContent}>
                <div className={styles.processDetail}>
                  <div className={styles.overinspect}>
                    {inspectedItems && inspectedItems.map((e, i) => (
                      <div className={i % 2 === 0 ? styles.bgStyle : styles.nobgStyle} title={e} key={e}>{e}</div>
                    ))}
                  </div>
                  <div className={styles.noinspect}>
                    {unInspectedItems && unInspectedItems.map((e, i) => (
                      <div className={i % 2 === 0 ? styles.bgStyle : styles.nobgStyle} title={e} key={e}>{e}</div>
                    ))}
                  </div>
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
