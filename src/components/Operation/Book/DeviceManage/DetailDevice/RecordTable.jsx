import React from "react";
import PropTypes from "prop-types";
import { Table, Radio } from 'antd';
import styles from '../deviceSide.scss';

class RecordTable extends React.Component {
  static propTypes = {
    totalNum: PropTypes.number,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    onShowSideChange: PropTypes.func,
    changeDeviceManageStore: PropTypes.func,
  }
  constructor(props, context) {
    super(props, context)
  }
  changeTableData = (e) => {
 
    const {getDevicePartInfo,getDevicefixRecord,getDevicehistoryWarning } = this.props;
    const value = e.target.value;
    this.props.changeTableFilter(value);
    value === 'part' ?getDevicePartInfo({}): value === 'record' ? getDevicefixRecord({}) : getDevicehistoryWarning({}) ;



  }
  render() {
    const { tableFilter,historyWarningData,fixRecordData,partInfoData } = this.props;
    console.log('tableFilter: ', tableFilter);

    const partColumns = [
      {
        title: '部件名称',
        dataIndex: 'assetsCode',
        render: (text) => <span title={text}>{text}</span>
      }, {
        title: '部件型号',
        dataIndex: 'assetsName',
        render: (text) => <span title={text}>{text}</span>
      }, {
        title: '厂家',
        dataIndex: 'assetsType',
        render: (text) => <span title={text}>{text}</span>
      }, {
        title: '制造商',
        dataIndex: 'assetsUnit',
        render: (text) => <span title={text}>{text}</span>
      }, {
        title: '供应商',
        dataIndex: 'createTime',
        render: (text) => <span title={text}>{text}</span>
      }
    ]
    const fixRecordColumns=[
      {
        title: '缺陷级别',
        dataIndex: 'assetsCode',
        render: (text) => <span title={text}>{text}</span>
      }, {
        title: '缺陷描述',
        dataIndex: 'assetsName',
        render: (text) => <span title={text}>{text}</span>
      }, {
        title: '处理过程',
        dataIndex: 'assetsType',
        render: (text) => <span title={text}>{text}</span>
      }, {
        title: '更换部件',
        dataIndex: 'assetsUnit',
        render: (text) => <span title={text}>{text}</span>
      }, {
        title: '资产编码',
        dataIndex: 'createTime',
        render: (text) => <span title={text}>{text}</span>
      },{
        title: '发生时间',
        dataIndex: 'begintime',
        render: (text) => <span title={text}>{text}</span>
      }, {
        title: '完成时间',
        dataIndex: 'endTime',
        render: (text) => <span title={text}>{text}</span>
      }
    ];
    const historyWarningColumns=[
      {
        title: '告警级别',
        dataIndex: 'warningLevel',
        render: (text) => <span title={text}>{text}</span>
      }, {
        title: '告警类型',
        dataIndex: 'warningConfigName',
        render: (text) => <span title={text}>{text}</span>
      }, {
        title: '告警描述',
        dataIndex: 'warningCheckDesc',
        render: (text) => <span title={text}>{text}</span>
      }, {
        title: '发生时间',
        dataIndex: 'timeOn',
        key:'startTime',
        render: (text) => <span title={text}>{text}</span>
      }, {
        title: '完成时间',
        dataIndex: 'timeOn',
        key:'endTime',
        render: (text) => <span title={text}>{text}</span>
      },{
        title: '持续时间',
        dataIndex: 'durationTime',
        render: (text) => <span title={text}>{text}</span>
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
          dataSource={tableFilter==='part'?partInfoData:tableFilter==='record'?fixRecordData:historyWarningData}
          columns={tableFilter==='part'?partColumns:tableFilter==='record'?fixRecordColumns:historyWarningColumns}
          pagination={false}
          childrenColumnName={['childrens']}
          locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
        />

      </div>
    )
  }
}
export default (RecordTable)