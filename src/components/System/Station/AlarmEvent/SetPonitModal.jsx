

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Select, Radio } from 'antd';
import styles from './alarmEvent.scss';
const Option = Select.Option;
import CneTable from '../../../Common/Power/CneTable/index';

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
      selectedRowKeys: [], // 选择测点
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
    const { selectedRowKeys } = this.state;
    if (selectedRowKeys.length > 0) {
      const confirmList = pointList.filter(e => selectedRowKeys.includes(e.devicePointId));
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
    this.setState({ selectedRowKeys: [], selectStationCode: value });
  }

  getPointType = (pointList) => {
    return [...new Set(pointList.map(e => e.devicePointType))];
  }

  changePointType = (e) => { // 改变测点类型
    this.setState({ pointType: e.target.value });
  }

  onSelectChange = (value) => { // 改变状态
    this.setState({ selectedRowKeys: value });
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

  render() {
    const { stationCodes, pointList = [], type = 'add', stationCode, pointListError } = this.props;
    const { selectedRowKeys, pointType, selectStationCode, sortField, sortMethod } = this.state;
    const pointListColumn = [
      {
        title: '测点编号',
        dataIndex: 'devicePointStandardCode',
        className: styles.pointCodeStyle,
        render: (text, record) => (<div className={styles.pointCodeStyleText} title={text} >{text}</div>),
      }, {
        title: '测点描述',
        dataIndex: 'devicePointName',
        className: styles.descStyle,
        render: (text, record) => (<div className={styles.descStyleText} title={text} >{text}</div>),
        sorter: true,
      }, {
        title: '第三方测点名称',
        dataIndex: 'devicePointCode',
        sorter: true,
        className: styles.descStyle,
        render: (text, record) => (<div className={styles.descStyleText} title={text} >{text}</div>),
      }, {
        title: '英文名称',
        dataIndex: 'devicePointIecname',
        sorter: true,
        className: styles.descStyle,
        render: (text, record) => (<div className={styles.descStyleText} title={text}>{text}</div>),
      },
      {
        title: '数据类型',
        dataIndex: 'devicePointDatatype',
        sorter: true,
        className: styles.descStyle,
        render: (text, record) => (<div className={styles.descStyleText} title={text}>{text}</div>),
      }, {
        title: '测点类型',
        dataIndex: 'devicePointType',
        sorter: true,
        defaultSortOrder: 'descend',
        render: (text, record) => (<div title={text}>{text}</div>),
      },
    ];
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      type: type === 'add' && 'checkbox' || 'radio', //checkbox radio
    };
    const pointTypeArr = this.getPointType(pointList);
    const initpointType = pointType && pointList.filter(e => e.devicePointType === pointType) || pointList;
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
              <Radio.Group onChange={this.changePointType} defaultValue="">
                <Radio.Button value="">全部</Radio.Button>
                {pointTypeArr.map(e => {
                  return <Radio.Button value={e} key={e}>{e}</Radio.Button>;
                })}
              </Radio.Group>
            </div>
            <div> 合计: {initpointType.length}</div>
          </div>
          <CneTable
            rowSelection={rowSelection}
            onChange={this.tableChange}
            columns={pointListColumn}
            scroll={{ y: 470 }}
            dataSource={initpointType.map((e, i) => ({ key: e.devicePointId, ...e }))}
            className={styles.tableStyles}
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
