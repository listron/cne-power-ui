import React, { Component } from 'react';
import styles from './pointManage.scss';
import { Table } from 'antd';
import PropTypes from 'prop-types';
import WarningTip from '../../../../components/Common/WarningTip';
import { handleRight } from '@utils/utilFunc';
import CneTable from '@components/Common/Power/CneTable';


class PointManageList extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    queryParams: PropTypes.object,
    pointList: PropTypes.array,
    getPointList: PropTypes.func,
    changePointManageStore: PropTypes.func,
    deletePoints: PropTypes.func,
    detailPoints: PropTypes.func,
    selectedRowKeys: PropTypes.array,
  }
  constructor(props) {
    super(props);
    this.state = {
      showWarningTip: false,
      warningTipText: '确定要删除选中的测点吗?',
      currentPoint: {},
    };
  }
  cancelWarningTip = () => {
    this.setState({
      showWarningTip: false,
    });
  }
  confirmWarningTip = () => {
    const { currentPoint } = this.state;
    this.setState({
      showWarningTip: false,
    });
    //发送删除测点请求
    // this.deletePointList();
    this.props.deletePoints({
      devicePointIds: [currentPoint.devicePointId],
    });

  }
  deletePoint = (record) => {
    this.setState({
      showWarningTip: true,
      currentPoint: record,
    });
  }

  showPointDetail = (record) => {
    //展示详情页
    this.props.changePointManageStore({
      showPage: 'detail',
    });
    this.props.detailPoints({
      devicePointId: record.devicePointId,
    });
  }
  showEditPage = (record) => {
    //展示编辑页
    this.props.changePointManageStore({
      showPage: 'edit',
    });
    this.props.detailPoints({
      devicePointId: record.devicePointId,
    });
    this.props.getStandardDesc({
      deviceTypeCode: record.deviceTypeCode,
    });
  }
  tableChange = (pagination, filter, sorter) => { // 排序触发重新请求设备列表
    const { getPointList, queryParams } = this.props;
    const { field, order } = sorter;
    getPointList({
      ...queryParams,
      orderField: field ? field : '',
      //sortField: field ? field === 'warningLevel' ? '1' : '2' : '',
      orderType: order ? (sorter.order === 'ascend' ? 0 : 1) : null,
    });
  }
  onSelectChange = (keys, record) => {
    this.props.changePointManageStore({
      selectedRowData: record,
      selectedRowKeys: keys,
    });
  };

  render() {
    const pointListColumn = [
      {
        title: '设备型号',
        dataIndex: 'deviceModeName',
        key: 'deviceModeName',
        ellipsis: true,
        // width:150,
        width:'14%',
        render: (text, record) => (<div className={styles.deviceModeName} title={text} >{text}</div>),
      },
      {
        title: '测点编号',
        dataIndex: 'devicePointStandardCode',
        key: 'devicePointStandardCode',
        render: (text, record) => (<div className={styles.pointCodeStyle} title={text} onClick={() => this.showPointDetail(record)} >{text}</div>),
        // width:100,
        width:'9%',
      }, {
        title: '测点描述',
        dataIndex: 'devicePointName',
        key: 'devicePointName',
        render: (text, record) => (<div className={styles.descStyle} title={text} >{text}</div>),
        sorter: true,
        // width:200,
        width:'19%',
      }, {
        title: '第三方测点名称',
        dataIndex: 'devicePointCode',
        key: 'devicePointCode',
        sorter: true,
        render: (text, record) => (<div className={styles.devicePointCode} title={text} >{text}</div>),
        // width:150,
        width:'14%',
      }, {
        title: '英文名称',
        dataIndex: 'devicePointIecname',
        key: 'devicePointIecname',
        sorter: true,
        render: (text, record) => (<div className={styles.devicePointIecname} title={text}>{text}</div>),
        // width:150,
        width:'14%',
      },
      // {
      //   title: '分组名称',
      //   dataIndex: 'groupName',
      //   key: 'groupName',
      // }, 
      {
        title: '数据类型',
        dataIndex: 'devicePointDatatype',
        key: 'devicePointDatatype',
        sorter: true,
        className: styles.deviceDataType,
        // width:100,
        width:'9%',
      }, {
        title: '测点类型',
        dataIndex: 'devicePointType',
        key: 'devicePointType',
        sorter: true,
        className: styles.devicePointType,
        // width:100,
        width:'9%',
      },
      // {
      //   title: '单位',
      //   dataIndex: 'devicePointUnit',
      //   key: 'devicePointUnit',
      // }, {
      //   title: '系数',
      //   dataIndex: 'devicePointIndex',
      //   key: 'devicePointIndex',
      // }, {
      //   title: '点小数位',
      //   dataIndex: 'devicePointDecimalplace',
      //   key: 'devicePointDecimalplace',
      // },
      // {
      //   title: '操作',
      //   key: 'caozuo',
      //   render: (text, record, index) => {
      //     return (
      //       <div>
      //         <span className={`${styles.editPoint}  iconfont icon-edit`} onClick={() => this.showEditPage(record)}></span>
      //         <span className={`${styles.editPoint}  iconfont icon-del`} onClick={() => this.deletePoint(record)}></span>
      //       </div>
      //     );
      //   },

      // },
    ];

    const pointOperation = handleRight('station_point_operate');
    const operationColumn = {
      title: '操作',
      key: 'caozuo',
      className:styles.operation,
      // width:120,
      width:'11%',
      render: (text, record, index) => {
        return (
          <div>
            <span className={`${styles.editPoint}  iconfont icon-edit`} onClick={() => this.showEditPage(record)}></span>
            <span className={`${styles.editPoint}  iconfont icon-del`} onClick={() => this.deletePoint(record)}></span>
          </div>
        );
      },
    };
    const { loading, pointList, selectedRowKeys } = this.props;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const { showWarningTip, warningTipText } = this.state;
    return (
      <div className={styles.pointManageList}>
        {showWarningTip && <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={warningTipText} />}
        <CneTable
          loading={loading}
          rowSelection={rowSelection}
          onChange={this.tableChange}
          columns={pointOperation ? pointListColumn.concat(operationColumn) : pointListColumn}
          dataSource={pointList.map((e, i) => ({ key: i, ...e }))}
          className={styles.tableStyles}
          pagination={false}
          locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
        />
      </div>
    );
  }
}

export default PointManageList;
