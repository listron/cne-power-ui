import React from 'react';
import PropTypes from 'prop-types';
import { Table, Radio } from 'antd';
import styles from '../deviceSide.scss';
import moment from 'moment';
import CneTbale from '../../../../Common/Power/CneTable';

class RecordTable extends React.Component {
  static propTypes = {
    totalNum: PropTypes.number,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    onShowSideChange: PropTypes.func,
    changeDeviceManageStore: PropTypes.func,
    getDevicePartInfo: PropTypes.func,
    getDevicefixRecord: PropTypes.func,
    changeTableFilter: PropTypes.func,
    getDevicehistoryWarning: PropTypes.func,
    deviceFullcode: PropTypes.string,
    orderMethod: PropTypes.string,
    orderField: PropTypes.string,
    tableFilter: PropTypes.string,
    historyWarningData: PropTypes.array,
    fixRecordData: PropTypes.array,
    partInfoData: PropTypes.array,
  }
  constructor(props, context) {
    super(props, context);
  }
  changeTableData = (e) => {
    const { getDevicePartInfo, getDevicefixRecord, getDevicehistoryWarning, deviceFullcode, orderField,
      orderMethod } = this.props;
    const value = e.target.value;
    this.props.changeTableFilter(value);
    value === 'part' ? getDevicePartInfo({ deviceFullcode }) :
      value === 'record' ? getDevicefixRecord({ deviceFullcode, orderMethod, orderField: '2' }) :
        getDevicehistoryWarning({ deviceFullcode, orderMethod, orderField: '2' });
  }

  formate = (data) => {
    data.forEach((e, i) => {
      e.key = e.assetsId;
      e.partsName = e.assetsName;
      if (e.assetsData && !e.partsData) {
        this.formate(e.assetsData);
      } else {
        e.assetsData = e.partsData;
        e.partsData && e.partsData.forEach((e, i) => {
          e.key = e.partsModeName;
        });
      }
      return e;
    });
    return data;
  }
  timeFormate = (text) => {
    return text ? <span title={moment(moment(text)).format('YYYY-MM-DD HH:mm:ss')}>{moment(moment(text)).format('YYYY-MM-DD HH:mm:ss')}</span> : '--';
  }



  render() {
    const { tableFilter, historyWarningData, fixRecordData, partInfoData } = this.props;
    const partInfoDataFormate = this.formate(partInfoData);

    const level = ['一级', '二级', '三级', '四级'];
    const defactlevel = ['A级', 'B级', 'C级', 'C级'];
    const partColumns = [
      {
        title: '部件名称',
        dataIndex: 'partsName',
        textAlign: 'left',
        width: '20%',
        render: (text) => <span title={text} className={styles.textOverFlow}>{text}</span>,
      }, {
        title: '部件型号',
        textAlign: 'left',
        dataIndex: 'partsModeName',
        width: '20%',
        render: (text) => <span title={text} className={styles.textOverFlow}>{text ? text : '--'}</span>,
      }, {
        title: '厂家',
        textAlign: 'left',
        dataIndex: 'manufactorName',
        width: '20%',
        render: (text) => <span title={text} className={styles.textOverFlow}>{text ? text : '--'}</span>,
      }, {
        title: '制造商',
        textAlign: 'left',
        dataIndex: 'madeName',
        width: '20%',
        render: (text) => <span title={text} className={styles.textOverFlow}>{text ? text : '--'}</span>,
      }, {
        title: '供应商',
        textAlign: 'left',
        dataIndex: 'supplierName',
        width: '20%',
        render: (text) => <span title={text} className={styles.textOverFlow}>{text ? text : '--'}</span>,
      },
    ];

    const fixRecordColumns = [
      {
        title: '缺陷级别',
        textAlign: 'center',
        dataIndex: 'defectLevel',
        width: '13%',
        render: (text, record, index) => {
          return text ? defactlevel[text - 1] : '--';
        },
      }, {
        title: '缺陷描述',
        textAlign: 'left',
        dataIndex: 'defectDescribe',
        width: '17%',
        render: (text) => <span title={text} className={styles.textOverFlow}>{text ? text : '--'}</span>,
      }, {
        title: '处理过程',
        textAlign: 'left',
        dataIndex: 'defectSolveInfo',
        width: '18%',
        render: (text) => <span title={text} className={styles.textOverFlow}>{text ? text : '--'}</span>,
      }, {
        title: '更换部件',
        textAlign: 'left',
        dataIndex: 'replaceParts',
        width: '13%',
        render: (text) => <span title={text} className={styles.textOverFlow}>{text ? text : '--'}</span>,
      }, {
        title: '资产编码',
        textAlign: 'left',
        dataIndex: 'assetsCode',
        width: '13%',
        render: (text) => <span title={text} className={styles.textOverFlow}>{text}</span>,
      }, {
        title: '发生时间',
        textAlign: 'center',
        dataIndex: 'createTime',
        width: '13%',
        render: (text) => this.timeFormate(text),
      }, {
        title: '完成时间',
        dataIndex: 'finishTime',
        textAlign: 'center',
        width: '13%',
        render: (text) => this.timeFormate(text),
      },
    ];

    const historyWarningColumns = [
      {
        title: '告警级别',
        dataIndex: 'warningLevel',
        textAlign: 'center',
        width: '15%',
        render: (text, record, index) => {
          return text ? level[text - 1] : '--';
        },
      }, {
        title: '告警类型',
        textAlign: 'left',
        dataIndex: 'warningConfigName',
        width: '20%',
        render: (text) => <span title={'事件告警'}>{text ? '事件告警' : '--'}</span>,
      }, {
        title: '告警描述',
        dataIndex: 'warningCheckDesc',
        textAlign: 'left',
        width: '20%',
        render: (text) => <span title={text} className={styles.textOverFlow}>{text ? text : '--'}</span>,
      }, {
        title: '发生时间',
        dataIndex: 'timeOn',
        key: 'startTime',
        textAlign: 'center',
        width: '15%',
        render: (text) => this.timeFormate(text),
      }, {
        title: '完成时间',
        dataIndex: 'finishTime',
        textAlign: 'center',
        width: '15%',
        render: (text) => this.timeFormate(text),
      }, {
        title: '持续时间',
        dataIndex: 'durationTime',
        textAlign: 'center',
        width: '15%',
        render: (text) => <span title={text}>{text ? text : '--'}</span>,
      },
    ];
    return (
      <div >
        <div className={styles.radioStyle}>
          <Radio.Group value={tableFilter} buttonStyle="solid" onChange={this.changeTableData}>
            <Radio.Button value="part">部件信息</Radio.Button>
            <Radio.Button value="record">检修记录</Radio.Button>
            <Radio.Button value="warning">历史告警</Radio.Button>
          </Radio.Group>
        </div>

        <CneTbale
          loading={false}
          dataSource={{ 'part': partInfoDataFormate, 'record': fixRecordData, 'warning': historyWarningData }[tableFilter]}
          columns={{ 'part': partColumns, 'record': fixRecordColumns, 'warning': historyWarningColumns }[tableFilter]}
          pagination={false}
          childrenColumnName={['assetsData']}
        />

      </div>
    );
  }
}
export default (RecordTable)
  ;
