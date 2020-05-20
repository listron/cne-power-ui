

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Select, Radio } from 'antd';
import styles from './alarmEvent.scss';
const Option = Select.Option;
import CneTable from '../../../Common/Power/CneTable/index';

const createSourceKey = (info = {}) => { // key 结构 测点三个要素拼接才能保证唯一;
  return `${info.devicePointType}_${info.devicePointStandardCode}_${info.devicePointIndex}`;
};

class SetPonitModal extends Component { //版本的设置
  static propTypes = {
    pointList: PropTypes.array,
    stationCodes: PropTypes.array,
    type: PropTypes.string,
    getPointList: PropTypes.func,
    closePointModal: PropTypes.func,
    setPointData: PropTypes.func,
    stationCode: PropTypes.number,
    pointListError: PropTypes.bool,
    deviceModeCode: PropTypes.number,
    deviceTypeCode: PropTypes.number,
  }

  constructor(props) {
    super();
    const { stationCode } = props;
    this.state = {
      selectedRows: [], // 选择测点
      pointType: '', //测点类型
      selectStationCode: stationCode,
      sortField: 'devicePointType',
      sortMethod: 'descend',
    };
  }

  cancelSetting = () => { //取消
    this.props.closePointModal(false);
  }

  confirmSetting = () => { //确定
    const { pointList } = this.props;
    const { selectedRows } = this.state;
    if (selectedRows.length > 0) {
      const selectKeys = selectedRows.map(e => createSourceKey(e));
      const confirmList = pointList.filter(e => selectKeys.includes(createSourceKey(e)));
      this.props.setPointData(confirmList);
    }
    this.cancelSetting();
  }

  onChangeStation = (value) => { // 切换电站
    const { deviceTypeCode, deviceModeCode } = this.props;
    this.props.getPointList({ // 初始请求
      'stationCode': value,
      'deviceTypeCode': deviceTypeCode, // 设备类型
      'deviceModeCode': deviceModeCode, // 型号
      'pageNum': 1,
      'pageSize': 100,
      'orderField': 'device_point_type', // 排序方式
      'orderType': 1, // 排序方式(0:正序,1:倒序)
      'devicePointStandardCode': '', // 测点编号
      'devicePointName': '', // 测点名称
    });
    this.setState({ selectedRows: [], selectStationCode: value });
  }

  getInitPointData = (pointList, pointType) => {
    const pointTypeArr = []; // 测点类型集合
    const pointTableSource = []; // 测点数据集合
    let filterType = pointType; // 测点类型筛选关键字;
    pointList.forEach((e, i) => {
      pointTypeArr.push(e.devicePointType);
      if (!pointType) { // 初始状态, 直接以第一个测点类型作为筛选依据
        filterType = pointTypeArr[0];
      }
      (e.devicePointType === filterType) && pointTableSource.push({
        ...e,
        key: createSourceKey(e),
      });
    });
    return { pointTypeArr: [...new Set(pointTypeArr)], pointTableSource, filterType };
  }

  changePointType = (e) => { // 改变测点类型
    this.setState({ pointType: e.target.value });
  }

  onSelectChange = (value, rows) => { // 改变状态
    this.setState({ selectedRows: rows });
  }

  tableChange = (pagination, filter, sorter) => { // 排序触发重新请求设备列表
    const { getPointList, deviceTypeCode, deviceModeCode } = this.props;
    const { field, order } = sorter;
    const { selectStationCode, sortField } = this.state;
    let orderField = sortField;
    if (field) {
      orderField = field;
    }
    getPointList({
      'stationCode': selectStationCode,
      'deviceTypeCode': deviceTypeCode, // 设备类型
      'deviceModeCode': deviceModeCode, // 型号
      'pageNum': 1,
      'pageSize': 100,
      'devicePointStandardCode': '', // 测点编号
      'devicePointName': '', // 测点名称
      orderField: orderField,
      orderType: order === 'descend' ? 1 : 0,
    });
    this.setState({
      sortField: orderField,
      sortMethod: order === 'descend' ? 'descend' : 'ascend',
    });
  }

  createPointColumn = (pointType) => {
    const initColumn = [
      {
        title: '测点编号',
        dataIndex: 'devicePointStandardCode',
        width: '14.5%',
        textAlign: 'left',
        render: (text, record) => (<div className={styles.descStyleText} title={text || '--'} >{text || '--'}</div>),
      }, {
        title: '测点描述',
        dataIndex: 'devicePointName',
        width: '14.5%',
        textAlign: 'left',
        render: (text, record) => (<div className={styles.descStyleText} title={text || '--'} >{text || '--'}</div>),
        sorter: true,
      }, {
        title: '第三方测点名称',
        dataIndex: 'devicePointCode',
        sorter: true,
        width: '14.5%',
        textAlign: 'left',
        render: (text, record) => (<div className={styles.descStyleText} title={text || '--'} >{text || '--'}</div>),
      }, {
        title: '英文名称',
        dataIndex: 'devicePointIecname',
        sorter: true,
        textAlign: 'left',
        width: '14.5%',
        render: (text, record) => (<div className={styles.descStyleText} title={text || '--'}>{text || '--'}</div>),
      },
      {
        title: '数据类型',
        dataIndex: 'devicePointDatatype',
        sorter: true,
        textAlign: 'left',
        width: '13%',
        render: (text) => text || '--',
      }, {
        title: '测点类型',
        dataIndex: 'devicePointType',
        sorter: true,
        textAlign: 'left',
        defaultSortOrder: 'descend',
        width: '13%',
        render: (text) => text || '--',
      },
    ];
    if (pointType === 'Warning') { // 单独的告警测点, 有 值码 列; 其余无值码列
      initColumn.splice(1, 0, {
        title: '值码',
        textAlign: 'left',
        dataIndex: 'devicePointIndex',
        width: '13%',
        render: (text, record) => (<div className={styles.descStyleText} title={text} >{text}</div>),
      });
    }
    return initColumn;
  }

  render() {
    const { stationCodes, pointList = [], type = 'add', stationCode, pointListError } = this.props;
    const { selectedRows, pointType, selectStationCode, sortField, sortMethod } = this.state;
    const pointListColumn = this.createPointColumn(pointType);
    const { pointTypeArr, pointTableSource, filterType } = this.getInitPointData(pointList, pointType);
    const rowSelection = {
      selectedRowKeys: selectedRows.map(e => e.key),
      onChange: this.onSelectChange,
      type: type === 'add' && 'checkbox' || 'radio', //checkbox radio
    };
    return (
      <Modal
        title={null}
        visible={true}
        onCancel={this.cancelSetting}
        wrapClassName={styles.pointModal}
        width={1300}
        footer={<div className={styles.footer}>
          <div onClick={this.cancelSetting} className={styles.cancel}>取 消</div>
          <Button onClick={this.confirmSetting} className={styles.confirm}>确定</Button>
        </div>}
      >
        <div className={styles.addPointWrap}>
          <div className={styles.title}>
            <div className={styles.select}>
              <div className={styles.stationName}> 电站选择 </div>
              <Select
                style={{ width: 202 }}
                placeholder="请选择"
                defaultValue={stationCode}
                value={selectStationCode}
                onChange={this.onChangeStation}>
                {stationCodes.map(e => {
                  return <Option value={e.stationCode} key={e.stationCode}>{e.stationName}</Option>;
                })}
              </Select>
              <div className={styles.pointName}> 测点类型 </div>
              <Radio.Group onChange={this.changePointType} value={filterType}>
                {pointTypeArr.map(e => {
                  return <Radio.Button value={e} key={e}>{e}</Radio.Button>;
                })}
              </Radio.Group>
            </div>
            <div> 合计: {pointTableSource.length}</div>
          </div>
          <CneTable
            rowSelection={rowSelection}
            onChange={this.tableChange}
            columns={pointListColumn}
            scroll={{ y: 470 }}
            dataSource={pointTableSource}
            className={styles.pointModalTable}
            pagination={false}
            sortField={sortField}
            sortMethod={sortMethod}
            pointListError={pointListError}
          // locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
          />
        </div>
      </Modal>
    );
  }
}

export default SetPonitModal;
