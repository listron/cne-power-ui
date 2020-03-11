import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { Timeline } from 'antd';
import moment from 'moment';
import CneButton from '@components/Common/Power/CneButton';
import styles from './defectEvent.scss';
import DefectEventDetail from './DefectEventDetail.jsx';
import DefectEventEdit from './DefectEventEdit';





export default class DefectEvent extends Component {
  render() {
    const MockData = [
      {
        eventId: 89,
        diagWarningId: 1123,
        eventName: '测试1233',
        eventDesc: '描述描述描述么，太难了，怎么这么难啊，我想出去走走描述描述描述么，太难了',
        deviceFullcode: '305M201M2345',
        deviceName: '逆变器名字名字名字名字名字名字名逆变器',
        defectTypeCode: 1,
        defectTypeName: '设备缺陷',
        deviceTypeCode: 201,
        deviceTypeName: '集中式逆变器',
        defectLevel: 2,
        eventState: null,
        eventImgs: [
          {
            'imgId': 502516966064642,
            'url': 'http://10.10.15.51/group1/M00/00/19/CgoPM15iCFSAQ2VAAAEytHc7mBI486.jpg',
          },
          {
            'imgId': 502516966064643,
            'url': 'http://10.10.15.51/group1/M00/00/19/CgoPM15iCFqACv4NAADzweEeVsU851.jpg',
          },
          {
            'imgId': 5025169660646425,
            'url': 'http://10.10.15.51/group1/M00/00/19/CgoPM15iCFSAQ2VAAAEytHc7mBI486.jpg',
          },
          {
            'imgId': 5025169660646438,
            'url': 'http://10.10.15.51/group1/M00/00/19/CgoPM15iCFqACv4NAADzweEeVsU851.jpg',
          },
        ],
      },
      {
        eventId: 89,
        diagWarningId: 11233,
        eventName: '测试1233',
        eventDesc: '描述描述描述么，太难了，怎么这么难啊，我想出去走走描述描述描述么，太难了',
        deviceFullcode: '',
        deviceName: '',
        defectTypeCode: null,
        defectTypeName: '其他缺陷',
        deviceTypeCode: null,
        deviceTypeName: null,
        defectLevel: null,
        eventState: null,
        eventImgs: [],
      },
      // {
      //   eventId: null,
      //   diagWarningId: 1233,
      //   eventName: '测试1233',
      //   eventDesc: '描述描述描述么，太难了，怎么这么难啊，我想出去走走描述描述描述么，太难了描述描述描述么，太难了，怎么这么难啊，我想出去走走描述描述描述么，太难了描述描述描述么，太难了，怎么这么难啊，我想出去走走描述描述描述么，太难了描述描述描述么，太难了，怎么这么难啊，我想出去走走描述描述描述么，太难了描述描述描述么，太难了，怎么这么难啊，我想出去走走描述描述描述么，太难了',
      //   deviceFullcode: '305M201M2345',
      //   deviceName: '逆变器名字名字名字名字名字名字名',
      //   defectTypeCode: 1,
      //   defectTypeName: '设备缺陷',
      //   deviceTypeCode: 201,
      //   deviceTypeName: '集中式逆变器',
      //   defectLevel: 1,
      //   eventState: 1,
      //   eventImgs: [
      //     {
      //       'imgId': 502516966064642,
      //       'url': 'http://10.10.15.51/group1/M00/00/19/CgoPM15iCFSAQ2VAAAEytHc7mBI486.jpg',
      //     },
      //     {
      //       'imgId': 502516966064643,
      //       'url': 'http://10.10.15.51/group1/M00/00/19/CgoPM15iCFqACv4NAADzweEeVsU851.jpg',
      //     },
      //     {
      //       'imgId': 5025169660646425,
      //       'url': 'http://10.10.15.51/group1/M00/00/19/CgoPM15iCFSAQ2VAAAEytHc7mBI486.jpg',
      //     },
      //     {
      //       'imgId': 5025169660646438,
      //       'url': 'http://10.10.15.51/group1/M00/00/19/CgoPM15iCFqACv4NAADzweEeVsU851.jpg',
      //     },
      //   ],
      // },
      // {
      //   eventId: null,
      //   diagWarningId: 12323,
      //   eventName: '测试1233',
      //   eventDesc: '描述描述描述么，太难了，怎么这么难啊，我想出去走走描述描述描述么，太难了描述描述描述么，太难了，怎么这么难啊，我想出去走走描述描述描述么，太难了描述描述描述么，太难了，怎么这么难啊，我想出去走走描述描述描述么，太难了描述描述描述么，太难了，怎么这么难啊，我想出去走走描述描述描述么，太难了描述描述描述么，太难了，怎么这么难啊，我想出去走走描述描述描述么，太难了',
      //   deviceFullcode: '305M201M2345',
      //   deviceName: '逆变器名字名字名字名字名字名字名',
      //   defectTypeCode: 1,
      //   defectTypeName: '设备缺陷',
      //   deviceTypeCode: 201,
      //   deviceTypeName: '集中式逆变器',
      //   defectLevel: 2,
      //   eventState: 2,
      //   eventImgs: [],
      // },
      // {
      //   eventId: 345,
      //   diagWarningId: 122343,
      //   eventName: '测试1233',
      //   eventDesc: '描述描述描述么，太难了，怎么这么难啊，我想出去走走描述描述描述么，太难了描述描述描述么，太难了，怎么这么难啊，我想出去走走描述描述描述么，太难了描述描述描述么，太难了，怎么这么难啊，我想出去走走描述描述描述么，太难了描述描述描述么，太难了，怎么这么难啊，我想出去走走描述描述描述么，太难了描述描述描述么，太难了，怎么这么难啊，我想出去走走描述描述描述么，太难了',
      //   deviceFullcode: '305M201M2345',
      //   deviceName: '逆变器名字名字名字名字名字名字名',
      //   defectTypeCode: 1,
      //   defectTypeName: '设备缺陷',
      //   deviceTypeCode: 201,
      //   deviceTypeName: '集中式逆变器',
      //   defectLevel: 3,
      //   eventState: 3,
      //   eventImgs: [],
      // },
    ];
    return (
      <div className={styles.defectEventWrap}>
        <div className={styles.eventTitle}>
          <div><i className={'iconfont icon-quex'} /> <span>缺陷事件</span></div>
          <CneButton className={styles.addBtn} onClick={this.addHandleInfo}>
            <i className={`iconfont icon-newbuilt ${styles.addIcon}`} />
            <span className={styles.text}>添加缺陷</span>
          </CneButton>
        </div>
        {MockData.map(list => {
          return <DefectEventDetail defectMessage={list} key={list.diagWarningId} />;
        })}
        <DefectEventEdit {...this.props} />
      </div>
    );
  }
}
