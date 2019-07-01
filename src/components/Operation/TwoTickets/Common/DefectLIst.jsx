import React, { Component } from "react";
import PropTypes from "prop-types";
import styles from './workFlowSide.scss';
import FilterCondition from '../../../../Common/FilterCondition/FilterCondition';
import CommonPagination from '../../../../Common/CommonPagination';
import { getLevel, getStatus, getDefectSortField } from '../../../../../constants/ticket';
import { Table, Modal, Button } from 'antd';



class DefectList extends Component {
  static propTypes = {
    stations: PropTypes.array,
    form: PropTypes.object,
    onChange: PropTypes.func,
    selectedData: PropTypes.object,

  }


  constructor() {
    super()
    this.state = {
      defectVisible: false
    }
  }

  componentDidMount() {
    const { stationCode } = this.props;
  }

  componentWillReceiveProps(nextProps) {
    const { stationCode } = nextProps;
    if (stationCode && this.props.stationCode !== stationCode) {
      this.getDefectData({ stationCodes: [stationCode] })
    }
  }

  onPaginationChange = ({ currentPage, pageSize }) => { // 切换列表表头
    this.getDefectData({
      pageNum: currentPage,
      pageSize
    });
  }


  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRowKeys: [selectedRowKeys[selectedRowKeys.length - 1]],
      selectedData: selectedRows[selectedRows.length - 1],
    })
  }


  getDefectData = (value) => {  // 缺陷列表  什么鬼接口这么多无用的参数
    const { getDefectList, defeactData, stationCode } = this.props;
    const queryParma = {
      "stationType": "",
      "defectSource": [],
      "defectLevel": [],
      "deviceTypeCode": [],
      "defectTypeCode": [], // 无用的参数

      "createTimeStart": "",
      "createTimeEnd": "",
      "pageNum": 1,
      "pageSize": 10,
      "stationCodes": [stationCode],
      "sortField": "create_time",
      "sortMethod": "desc "
    }
    const queryList = {
      ...queryParma,
      ...value
    }

    getDefectList({ queryList, defeactData })

  }

  initColumn = () => { // 初始的列表头
    let columns = [{
      title: '缺陷级别',
      dataIndex: 'defectLevel',
      key: 'defectLevel',
      sorter: true,
      render: (value, record, index) => (<span>{getLevel(value)}</span>)
    }, {
      title: '电站名称',
      dataIndex: 'stationName',
      key: 'stationName',
      sorter: true,
    }, {
      title: '设备名称',
      dataIndex: 'deviceName',
      key: 'deviceName',
      sorter: true,
    }, {
      title: '缺陷类型',
      dataIndex: 'defectTypeName',
      key: 'defectTypeName',
      sorter: true,
    }, {
      title: '缺陷描述',
      dataIndex: 'defectDescribe',
      key: 'defectDescribe',
      render: (text, record) => {
        return <div className={styles.defectDesc} title={text}>{text}</div>
      }
    }, {
      title: '发生时间',
      dataIndex: 'startTime',
      key: 'startTime',
      sorter: true,
    }, {
      title: '完成时间',
      dataIndex: 'finishTime',
      key: 'finishTime',
      render: (text, record) => { return text ? text : '--' },
      sorter: true,
    }, {
      title: '状态',
      dataIndex: 'defectStatus',
      key: 'defectStatus',
      sorter: true,
      render: (value, record, index) => (
        <div className={styles.defectStatus}>
          <span>{getStatus(value)}</span>
          <div className={styles.warning}>
            {record.isOvertime === '0' ? <div className={styles.overTime}>超时</div> : null}
            {record.isCoordination === '0' ? <div className={styles.coordinate}>协调</div> : null}
          </div>
        </div>
      ),
    }];
    return columns;
  }

  tableChange = (pagination, filter, sorter) => { // 进行排序的时候
    const field = getDefectSortField(sorter.field);
    const order = sorter.order ? (sorter.order === 'ascend' ? 'asc' : 'desc ') : '';
    this.getDefectData({
      sortField: field,
      sortMethod: order,
    });
  }

  filterCondition = (value) => { // 时间筛选
    this.getDefectData(value);
  }

  handleOk = () => { // 确定
    const { selectedData } = this.state;
    this.setState({ defectVisible: false, })
    this.props.onChange({ ...selectedData })
  }

  handleCancel = () => { // 取消
    const { selectedData } = this.props;
    if (selectedData.defectId) {
      this.setState({
        selectedRowKeys: [selectedData.defectId],
        selectedData: selectedData
      })
    }
    this.setState({
      defectVisible: false,
    })

  }

  linkDefect = () => { // 关联工单
    this.setState({ defectVisible: true })
  }

  resetDefect = () => {  // 重新关联工单
    this.setState({
      selectedRowKeys: [],
      selectedData: {}
    })
    this.props.onChange({})
  }


  render() {
    const { selectedRowKeys, defectVisible } = this.state;
    const { defeactData, stationCode, selectedData = {} } = this.props;
    const { defectLoading, defectList = [], total, pageNum, pageSize } = defeactData;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };
    return (
      <div className={styles.defectList}>
        <div>
          <Button onClick={this.linkDefect} disabled={!stationCode}>选择</Button>
          {selectedData.defectId &&
            <div className={styles.defectDetail}>
              <div className={styles.top}> <span> 已关联工单</span>  <span onClick={this.resetDefect}>X</span></div>
              <div>
                <span className={styles.label}>电站名称 </span>
                <span className={styles.text}>{getLevel(selectedData.defectLevel)}</span>
              </div>
              <div>
                <span className={styles.label}>缺陷级别 </span>
                <span className={styles.text}> {selectedData.stationName}</span>
              </div>
              <div>
                <span className={styles.label}>设备名称 </span>
                <span className={styles.text}> {selectedData.deviceTypeName}</span>
              </div>
              <div>
                <span className={styles.label}>缺陷类型 </span>
                <span className={styles.text}> {selectedData.defectTypeName}</span>
              </div>
              <div>
                <span className={styles.label}>缺陷描述 </span>
                <span className={styles.text}> {selectedData.defectDescribe}</span>
              </div>
              <div>
                <span className={styles.label}>发生时间 </span>
                <span className={styles.text}>{selectedData.startTime}</span>
              </div>
              <div>
                <span className={styles.label}>完成时间 </span>
                <span className={styles.text}>{selectedData.finishTime}</span>
              </div>
              <div>
                <span className={styles.label}>状态 </span>
                <span className={styles.text}>{getStatus(selectedData.defectStatus)}</span>
              </div>
            </div>}
        </div>
        <div ref={'defectList'}></div>
        <Modal
          title="选择关联工单"
          visible={defectVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          getContainer={() => this.refs.defectList}
          width={1150}
          style={{ top: 30 }}
          mask={false}
        >
          <FilterCondition
            option={['time']}
            onChange={this.filterCondition}
          />
          <div className={styles.commonPagination}>
            <CommonPagination pageSize={pageSize} currentPage={pageNum} total={total}
              onPaginationChange={this.onPaginationChange} />
          </div>
          <Table
            rowSelection={rowSelection}
            dataSource={defectList.map((e, i) => ({ ...e, key: e.defectId }))}
            columns={this.initColumn()}
            pagination={false}
            loading={defectLoading}
            onChange={this.tableChange}
            locale={{ emptyText: <div className={styles.noData}><img src="/img/nodata.png" style={{ width: 223, height: 164 }} /></div> }}
          />
        </Modal>
      </div>

    )
  }
}


export default DefectList;