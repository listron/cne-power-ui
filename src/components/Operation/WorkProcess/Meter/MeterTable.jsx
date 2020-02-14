import React from 'react';
import PropTypes from 'prop-types';
import { Radio } from 'antd';
import CommonPagination from '@components/Common/CommonPagination';
import CneTable from '@components/Common/Power/CneTable';
import styles from './meter.scss';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

export default class MeterTable extends React.Component {
  static propTypes = {
    params: PropTypes.object,
    history: PropTypes.object,
    stations: PropTypes.array,
    deviceTypes: PropTypes.array,
    total: PropTypes.number,
    theme: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      status: '',
    };
  }

  onChangeStatus = e => {
    this.setState({
      status: e.target.value,
    });
  };

  onPaginationChange = ({ currentPage, pageSize }) => {
    console.log(currentPage, pageSize);
  };

  tableChange = (pagination, filter, sorter) => { // 排序触发重新请求设备列表
  };

  onShowDetail = (record) => { // 展示详情
    const { type } = record;
    const { history } = this.props;
    const { pathname } = history.location;
    history.push(`${pathname}?page=meterDetail&meterId=${type}`);
  };

  render() {
    const { status } = this.state;
    const { params, pageSize = 10, pageNum = 1, total = 20, theme } = this.props;
    const pointListColumn = [
      {
        title: '电站名称',
        dataIndex: 'devicePointStandardCode',
        width: 214,
        className: styles.pointCodeStyle,
        render: (text, record) => (<div className={styles.stationCodeStyleText} title={text} >{text}</div>),
      }, {
        title: '结算月份',
        width: 180,
        align: 'center',
        dataIndex: 'devicePointName',
        className: styles.descStyle,
        render: (text, record) => (<div title={text} >{text}</div>),
        sorter: true,
      }, {
        title: '工单创建时间',
        width: 180,
        align: 'center',
        dataIndex: 'devicePointCode',
        sorter: true,
        className: styles.descStyle,
        render: (text, record) => (<div title={text} >{text}</div>),
      }, {
        title: '持续时间',
        width: 180,
        align: 'center',
        dataIndex: 'devicePointIecname',
        sorter: true,
        className: styles.descStyle,
        render: (text, record) => (<div title={text}>{text}</div>),
      },
      {
        title: '执行人',
        width: 210,
        dataIndex: 'devicePointDatatype',
        sorter: true,
        className: styles.descStyle,
        render: (text, record) => (<div className={styles.operatorStyleText} title={text}>{text}</div>),
      }, {
        title: '状态',
        width: 150,
        align: 'center',
        dataIndex: 'devicePointType',
        sorter: true,
        render: (text, record) => (<div title={text}>{text}</div>),
      }, {
        title: '操作',
        width: 98,
        align: 'center',
        dataIndex: 'type',
        render: (text, record) => {
          return <span title="查看" className={styles.iconLookBtn} onClick={() => { this.onShowDetail(record);}}><i className={'iconfont icon-look'} /></span>;
        },
      },
    ];
    const data = [{
      devicePointStandardCode: 1,
      devicePointName: 1,
      devicePointCode: 1,
      devicePointIecname: 1,
      devicePointDatatype: 1,
      devicePointType: 1,
      type: 1,
    }, {
      devicePointStandardCode: 1,
      devicePointName: 1,
      devicePointCode: 1,
      devicePointIecname: 1,
      devicePointDatatype: 1,
      devicePointType: 1,
      type: 1,
    }, {
      devicePointStandardCode: 1,
      devicePointName: 1,
      devicePointCode: 1,
      devicePointIecname: 1,
      devicePointDatatype: 1,
      devicePointType: 1,
      type: 1,
    }, {
      devicePointStandardCode: 1,
      devicePointName: 1,
      devicePointCode: 1,
      devicePointIecname: 1,
      devicePointDatatype: 1,
      devicePointType: 1,
      type: 1,
    }, {
      devicePointStandardCode: 1,
      devicePointName: 1,
      devicePointCode: 1,
      devicePointIecname: 1,
      devicePointDatatype: 1,
      devicePointType: 1,
      type: 1,
    }, {
      devicePointStandardCode: 1,
      devicePointName: 1,
      devicePointCode: 1,
      devicePointIecname: 1,
      devicePointDatatype: 1,
      devicePointType: 1,
      type: 1,
    }, {
      devicePointStandardCode: 1,
      devicePointName: 1,
      devicePointCode: 1,
      devicePointIecname: 1,
      devicePointDatatype: 1,
      devicePointType: 1,
      type: 1,
    }, {
      devicePointStandardCode: 1,
      devicePointName: 1,
      devicePointCode: 1,
      devicePointIecname: 1,
      devicePointDatatype: 1,
      devicePointType: 1,
      type: 1,
    }, {
      devicePointStandardCode: 1,
      devicePointName: 1,
      devicePointCode: 1,
      devicePointIecname: 1,
      devicePointDatatype: 1,
      devicePointType: 1,
      type: 1,
    }, {
      devicePointStandardCode: 1,
      devicePointName: 1,
      devicePointCode: 1,
      devicePointIecname: 1,
      devicePointDatatype: 1,
      devicePointType: 1,
      type: 1,
    }, {
      devicePointStandardCode: 1,
      devicePointName: 1,
      devicePointCode: 1,
      devicePointIecname: 1,
      devicePointDatatype: 1,
      devicePointType: 1,
      type: 1,
    }, {
      devicePointStandardCode: 1,
      devicePointName: 1,
      devicePointCode: 1,
      devicePointIecname: 1,
      devicePointDatatype: 1,
      devicePointType: 1,
      type: 1,
    }];
    return (
      <div className={styles.searchTable}>
        <div className={`${styles.searchStatus}`}>
          <RadioGroup onChange={this.onChangeStatus} defaultValue="" value={status}>
            <RadioButton value="">全部</RadioButton>
            <RadioButton value="0">{`待领取 ${1}`}</RadioButton>
            <RadioButton value="1">{`执行中 ${3}`}</RadioButton>
            <RadioButton value="2">{`待验收 ${4}`}</RadioButton>
            <RadioButton value="3">{`已结单 ${5}`}</RadioButton>
          </RadioGroup>
          <CommonPagination pageSize={pageSize} currentPage={pageNum} total={total} onPaginationChange={this.onPaginationChange} theme={theme} />
        </div>
        <CneTable
          onChange={this.tableChange}
          columns={pointListColumn}
          className={styles.tableStyles}
          dataSource={data}
          scroll={{ y: 462 }}
          pagination={false}
          locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png"  alt=""/> }}
        />
      </div>
    );
  }
}
