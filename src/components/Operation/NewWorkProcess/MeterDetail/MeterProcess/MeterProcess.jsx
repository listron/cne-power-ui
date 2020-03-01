import React from 'react';
import PropTypes from 'prop-types';
import { Timeline } from 'antd';
import moment from 'moment';
import { processIconFunc } from '../../Common/processIconCode';
import styles from './meterProcess.scss';
export default class MeterProcess extends React.Component {
  static propTypes = {
    processList: PropTypes.array,
  };

  timelineItem = () => {
    const { processList } = this.props;
    return processList && processList.map((cur, index) => {
      if(processList.length - 1!== index) {
        return (
          <Timeline.Item key={index.toString()} dot={<i className={processIconFunc(cur.icon)} style={Number(cur.colorCode) === 3002 ? {fontSize: '20px', color: '#df4b33'} : {fontSize: '20px'}} />}>
            <div className={styles.processItem}>
              <div className={styles.processItemBox}>
                <div className={Number(cur.colorCode) === 3002 ? styles.processErrorItemName : styles.processItemName}>{cur.nodeName}</div>
                <div className={styles.itemRight}>
                  <div className={styles.processItemDetail}>{cur.handleUser}</div>
                  <div className={styles.processItemTime}>{moment(cur.endTime).format('YYYY-MM-DD HH:mm')}</div>
                </div>
              </div>
              {cur.handleDesc && <div className={styles.processContentDetail} dangerouslySetInnerHTML={{__html: cur.handleDesc}} />}
              <div className={styles.processTriangle} />
            </div>
          </Timeline.Item>
        );
      }
      if(processList.length - 1 === index) {
        return (
          <Timeline.Item key={index.toString()} dot={<i className={processIconFunc(cur.icon)} style={{fontSize: '20px'}} />}>
            <div className={styles.singleInfo}>{cur.nodeName}</div>
          </Timeline.Item>
        );
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
            {this.timelineItem()}
          </Timeline>
        </div>
      </div>
    );
  }
}
