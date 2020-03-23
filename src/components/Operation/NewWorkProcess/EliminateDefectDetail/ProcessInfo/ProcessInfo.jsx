import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Timeline } from 'antd';
import { processIconFunc } from '../../Common/processIconCode';
import moment from 'moment';
import styles from './process.scss';


export default class ProcessInfo extends Component {

  static propTypes = {
    processInfo: PropTypes.array,
  };

  // processInfo = [
  // 	{
  // 		'nodeName': '新建工单',
  // 		'handleUser': '运维管理员',
  // 		'handleDesc': null,
  // 		'icon': '30006',
  // 		'colorCode': '3001',
  // 		'endTime': '2020-03-03 15: 36: 28',
  // 	}, {
  // 		'nodeName': '领取工单',
  // 		'handleUser': '运维人员',
  // 		'handleDesc': null,
  // 		'icon': '30007',
  // 		'colorCode': '3001',
  // 		'endTime': '2020-03-03 15: 36: 46',
  // 	}, {
  // 		'nodeName': '添加执行人',
  // 		'handleUser': '运维人员',
  // 		'handleDesc': '<b>添加: </b><span>运维管理员</span>',
  // 		'icon': '30008',
  // 		'colorCode': '3001',
  // 		'endTime': '2020-03-03 16: 34: 13',
  // 	}, {
  // 		'nodeName': '提交验收',
  // 		'handleUser': '运维人员',
  // 		'handleDesc': null,
  // 		'icon': '30010',
  // 		'colorCode': '3001',
  // 		'endTime': '2020-03-03 16: 34: 50',
  // 	}, {
  // 		'nodeName': '验收通过',
  // 		'handleUser': '运维管理员',
  // 		'handleDesc': '<b>验收意见: </b><span>通过</span>',
  // 		'icon': '30011',
  // 		'colorCode': '3001',
  // 		'endTime': '2020-03-03 16: 36: 16',
  // 	}, {
  // 		'nodeName': '已结单',
  // 		'handleUser': null,
  // 		'handleDesc': null,
  // 		'icon': '30005',
  // 		'colorCode': '3003',
  // 		'endTime': null,
  // 	},
  // ]

  render() {
    const { processInfo } = this.props;
    return (
      <div className={styles.processInfo} >
        <div className={styles.processTitle}>流程信息</div>
        <div className={styles.processContent}>
          <Timeline>
            {processInfo.map((cur, index) => {
              const isLastProcess = processInfo.length - 1 === index;
              if (isLastProcess && cur.nodeName !== '已退回') {
                return (
                  <Timeline.Item
                    key={index.toString()}
                    dot={<i
                      className={processIconFunc(cur.icon)}
                      style={+cur.colorCode === 3002 ? { fontSize: '20px', color: '#df4b33' } : { fontSize: '20px' }}
                    />}>
                    <div className={styles.singleInfo} code={cur.colorCode}>{cur.nodeName}</div>
                  </Timeline.Item>
                );
              }
              return (
                <Timeline.Item
                  key={index.toString()}
                  dot={<i
                    className={processIconFunc(cur.icon)}
                    style={+cur.colorCode === 3002 ? { fontSize: '20px', color: '#df4b33' } : { fontSize: '20px' }}
                  />}
                >
                  <div className={styles.processItem}>
                    <div className={styles.processItemBox}>
                      <div
                        className={styles.processItemName}
                        code={cur.colorCode}
                      >{cur.nodeName}</div>
                      <div className={styles.itemRight}>
                        <div className={styles.processItemDetail}>{cur.handleUser}</div>
                        <div className={styles.processItemTime}>{cur.endTime && moment(cur.endTime).format('YYYY-MM-DD HH: mm')}</div>
                      </div>
                    </div>
                    {cur.handleDesc && <div
                      className={styles.processContentDetail}
                      dangerouslySetInnerHTML={{ __html: cur.handleDesc }}
                    />}
                    <div className={styles.processTriangle} />
                  </div>
                </Timeline.Item>
              );
            })}
          </Timeline>
        </div>
      </div>
    );
  }
}
