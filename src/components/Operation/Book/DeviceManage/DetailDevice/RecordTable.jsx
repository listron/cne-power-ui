import React from "react";
import PropTypes from "prop-types";
import { Table, Radio } from 'antd';
import styles from '../deviceSide.scss';
import moment from 'moment';


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
    super(props, context)
  }
  changeTableData = (e) => {
    const { getDevicePartInfo, getDevicefixRecord, getDevicehistoryWarning, deviceFullcode, orderField,
      orderMethod, } = this.props;
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
        })
      }
      return e
    })
    return data
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
        render: (text) => <span title={text}>{text}</span>
      }, {
        title: '部件型号',
        dataIndex: 'partsModeName',
        render: (text) => <span title={text}>{text ? text : '--'}</span>
      }, {
        title: '厂家',
        dataIndex: 'manufactorName',
        render: (text) => <span title={text}>{text ? text : '--'}</span>
      }, {
        title: '制造商',
        dataIndex: 'madeName',
        render: (text) => <span title={text}>{text ? text : '--'}</span>
      }, {
        title: '供应商',
        dataIndex: 'supplierName',
        render: (text) => <span title={text}>{text ? text : '--'}</span>
      }
    ]
    const fixRecordColumns = [
      {
        title: '缺陷级别',
        dataIndex: 'defectLevel',
        render: (text, record, index) => {
          return text ? defactlevel[text - 1] : '--'
        },
      }, {
        title: '缺陷描述',
        dataIndex: 'defectDescribe',
        render: (text) => <span title={text}>{text ? text : '--'}</span>
      }, {
        title: '处理过程',
        dataIndex: 'defectSolveInfo',
        render: (text) => <span title={text}>{text ? text : '--'}</span>
      }, {
        title: '更换部件',
        dataIndex: 'replaceParts',
        render: (text) => <span title={text}>{text ? text : '--'}</span>
      }, {
        title: '资产编码',
        dataIndex: 'assetsCode',
        render: (text) => <span title={text}>{text}</span>
      }, {
        title: '发生时间',
        dataIndex: 'createTime',
        render: (text) => <span title={moment(moment(text)).format('YYYY-MM-DD HH:mm:ss')}>{moment(moment(text)).format('YYYY-MM-DD HH:mm:ss')}</span>
      }, {
        title: '完成时间',
        dataIndex: 'finishTime',
        render: (text) => <span title={moment(moment(text)).format('YYYY-MM-DD HH:mm:ss')}>{moment(moment(text)).format('YYYY-MM-DD HH:mm:ss')}</span>
      }
    ];
    const historyWarningColumns = [
      {
        title: '告警级别',
        dataIndex: 'warningLevel',
        render: (text, record, index) => {
          return text ? level[text - 1] : '--'
        },
      }, {
        title: '告警类型',
        dataIndex: 'warningConfigName',
        render: (text) => <span title={'事件告警'}>{text ? '事件告警' : '--'}</span>
      }, {
        title: '告警描述',
        dataIndex: 'warningCheckDesc',
        render: (text) => <span title={text}>{text ? text : '--'}</span>
      }, {
        title: '发生时间',
        dataIndex: 'timeOn',
        key: 'startTime',
        render: (text) => <span title={moment(moment(text)).format('YYYY-MM-DD HH:mm:ss')}>{moment(moment(text)).format('YYYY-MM-DD HH:mm:ss')}</span>
      }, {
        title: '完成时间',
        dataIndex: 'finishTime',

        render: (text) => <span title={moment(moment(text)).format('YYYY-MM-DD HH:mm:ss')}>{moment(moment(text)).format('YYYY-MM-DD HH:mm:ss')}</span>
      }, {
        title: '持续时间',
        dataIndex: 'durationTime',
        render: (text) => <span title={text}>{text ? text : '--'}</span>
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
        <Table
          loading={false}
          dataSource={tableFilter === 'part' ? partInfoDataFormate : tableFilter === 'record' ? fixRecordData : historyWarningData}
          columns={tableFilter === 'part' ? partColumns : tableFilter === 'record' ? fixRecordColumns : historyWarningColumns}
          pagination={false}
          childrenColumnName={['assetsData']}
          locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
        />

      </div>
    )
  }
}
export default (RecordTable)