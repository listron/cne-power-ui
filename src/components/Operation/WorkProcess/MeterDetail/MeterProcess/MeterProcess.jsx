import React from 'react';
import PropTypes from 'prop-types';
import { Timeline } from 'antd';
import styles from './meterProcess.scss';
const data = [{
  type: 1,
  detail: null,
}, {
  type: 2,
  detail: null,
}, {
  type: 1,
  detail: '<b>添加：</b><span>张佳、王汽车、赵明灯、李幺鸡王汽车、赵明灯、李幺鸡</span>',
}, {
  type: 1,
  detail: null,
}, {
  type: 2,
  detail: null,
}, {
  type: 1,
  detail: '<b>添加：</b><span>张佳、王汽车、赵明灯、李幺鸡王汽车、赵明灯、李幺鸡</span>',
}, {
  type: 2,
  detail: null,
}, {
  type: 1,
  detail: '<b>添加：</b><span>张佳、王汽车、赵明灯、李幺鸡王汽车、赵明灯、李幺鸡</span>',
}, {
  type: 2,
  detail: null,
}, {
  type: 1,
  detail: null,
}];
export default class MeterProcess extends React.Component {
  static propTypes = {
    meterDetail: PropTypes.object,
  };

  timelineItem = (data) => {
    return data && data.map((cur, index) => {
      if(cur.type === 1) {
        return (
          <Timeline.Item>
            <div className={styles.processItem}>
              <div className={styles.processItemBox}>
                <div className={styles.processItemName}>创建工单</div>
                <div className={styles.itemRight}>
                  <div className={styles.processItemDetail}>计划下发</div>
                  <div className={styles.processItemTime}>2019-11-15 16:10</div>
                </div>
              </div>
              {cur.detail && <div className={styles.processContentDetail} dangerouslySetInnerHTML={{__html: cur.detail}} />}
              <div className={styles.processTriangle} />
            </div>
          </Timeline.Item>
        );
      }
      if(cur.type === 2) {
        return <Timeline.Item><div className={styles.singleInfo}>执行中</div></Timeline.Item>;
      }
    });
  };

  render() {
    return (
      <div className={styles.meterProcess} >
        <div className={styles.processTitleBox}>
          <div className={styles.processBanner}>
            流程信息
          </div>
        </div>
        <div className={styles.processContent}>
          <Timeline>
            {this.timelineItem(data)}
          </Timeline>
        </div>
      </div>
    );
  }
}
