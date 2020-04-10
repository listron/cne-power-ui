import React from 'react';
import PropTypes from 'prop-types';
import styles from './deviceMode.scss';
import EditMode from './EditMode';
import AssetNodeSelect from '../../../../Common/AssetNodeSelect';
import { Button, Form, Input, Select } from 'antd';
import Pagination from '../../../../Common/CommonPagination';
import WarningTip from '../../../../Common/WarningTip';
import moment from 'moment';
import CneTable from '@components/Common/Power/CneTable';
import { handleRight } from '@utils/utilFunc';

const FormItem = Form.Item;
const { Option } = Select;
class DeviceMode extends React.Component {
  static propTypes = {
    changeAssetConfigStore: PropTypes.func,
    getDeviceFactorsList: PropTypes.func,
    addDeviceModes: PropTypes.func,
    getDeviceModesList: PropTypes.func,
    deleteDeviceModes: PropTypes.func,
    deviceModesList: PropTypes.array,
    pageSize: PropTypes.number,
    pageNum: PropTypes.number,
    modePageCount: PropTypes.number,
    orderField: PropTypes.string,
    orderMethod: PropTypes.string,
    deviceModeName: PropTypes.string,
    form: PropTypes.object,
    deviceFactorsList: PropTypes.array,
    stationTypeCount: PropTypes.string,
    assetList: PropTypes.array,
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      showWarningTip: false,
      warningTipText: '',
      tableRecord: {},
      isSaveStyle: false,
      assetsIds: [],
      resetValue: false,
      showEditModeModal: false,
    };
    this.tableSortMap = { // api存储字段 => 表格排序字段
      '1': 'deviceModeCode',
      '2': 'deviceModeName',
      '3': 'manufactorName',
      '4': 'createTime',
      '5': 'operateUser',
      '6': 'stationType',
    };
    this.sortMethodMap = {
      'desc': 'descend',
      'asc': 'ascend',
    };
  }
  componentDidMount() {
    //获取设备厂家列表供select选择厂家
    this.props.getDeviceFactorsList({
      orderField: '1',
      orderMethod: 'desc',
    });
    this.props.getDeviceModesList({
      orderField: '1',
      orderMethod: 'desc',
      pageSize: 10,
      pageNum: 1,
    });
  }
  componentWillUnmount() {
    this.props.changeAssetConfigStore({
      deviceModeName: '',
      orderField: '1', //排序字段（1：编码，2：设备厂家，3：创建时间，4：操作人）
      orderMethod: 'desc', //排序方式（“asc”：升序，”desc“:降序）
      pageNum: 1, //页码
      pageSize: 10, //每页记录数
      modePageCount: 0,
    });

  }
  onCancelWarningTip = () => {//信息提示栏隐藏
    this.setState({
      showWarningTip: false,
    });
  }
  onConfirmWarningTip = () => {
    const { tableRecord } = this.state;
    const modeId = tableRecord.modeId;
    this.setState({
      showWarningTip: false,
    });
    this.props.deleteDeviceModes({ modeId: `${modeId}` });
  }

  onPaginationChange = ({ currentPage, pageSize }) => {
    this.changFilter({ pageNum: currentPage, pageSize });
  }


  editMode(record) {
    this.setState({
      showEditModeModal: true,
      tableRecord: record,
    });
    this.props.getDeviceFactorsList({
      assetsId: record.assetsId,
      orderField: '1',
      orderMethod: 'desc',
    });
    this.props.changeAssetConfigStore({
      checkedName: record.assetsName ? record.assetsName.replace(/,/g, '/') : '',
      checkedAssetId: record.assetsId ? record.assetsId.split() : [],
      checkedManufactor: record.manufactorId ? record.manufactorId : '',
    });
  }
  deleteDeviceMode = (record) => {
    this.setState({
      showWarningTip: true,
      warningTipText: '确认删除?',
      tableRecord: record,
    });
  }
  changFilter = (value) => {
    const { getDeviceModesList, orderField, orderMethod, pageNum, pageSize, deviceModeName } = this.props;
    const params = { orderField, orderMethod, pageNum, pageSize, deviceModeName };
    getDeviceModesList({ ...params, ...value });
  }

  submitForm = (e) => {
    const { validateFieldsAndScroll, resetFields } = this.props.form;
    validateFieldsAndScroll(['addDeviceModeName', 'assetsId', 'manufactorId'], (err, values) => {
      if (!err) {
        this.props.addDeviceModes({
          manufactorId: values.manufactorId,
          deviceModeName: values.addDeviceModeName,
          assetsId: values.assetsId.assetsIds.join(),
        });
        //请求全部厂家
        this.props.getDeviceFactorsList({
          orderField: '1',
          orderMethod: 'desc',
        });
        this.setState({ assetsIds: [], resetValue: true });
        resetFields();
      }
    });
  }
  searchFactory = (value) => {
    this.changFilter({
      deviceModeName: value,
    });
  }
  tableChange = (pagination, filters, sorter) => {
    const { orderField, orderMethod } = this.props;
    const { field } = sorter;
    const sortInfo = {
      deviceModeCode: '1',
      deviceModeName: '2',
      manufactorName: '3',
      createTime: '4',
      operateUser: '5',
      stationType: '6',
    };
    let newOrderField = orderField, newOrderMethod = 'desc';
    if (!field || (sortInfo[field] === newOrderField)) { // 点击的是正在排序的列
      newOrderMethod = orderMethod === 'desc' ? 'asc' : 'desc'; // 交换排序方式
    } else { // 切换列
      newOrderField = sortInfo[field];
    }
    this.changFilter({ orderField: newOrderField, orderMethod: newOrderMethod });
  }
  selectManufactor = (value, option) => {
  }
  changeSelctNode = (data) => {
    this.setState({
      assetsIds: data.assetsIds,
    });
    this.props.getDeviceFactorsList({
      assetsId: data.assetsIds.join(),
      orderField: '1',
      orderMethod: 'desc',
    });
  }

  queryDataType = (value) => {
    this.props.getAssetTree({ stationType: value });
  }
  cancleModal = () => {
    this.setState({
      showEditModeModal: false,
    });
  }
  render() {
    const { pageSize, pageNum, modePageCount, deviceFactorsList, deviceModesList, assetList, stationTypeCount, stationType, orderField, orderMethod } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { showWarningTip, warningTipText, showEditModeModal, tableRecord } = this.state;
    const modeHandleRight = handleRight('book_operateMode');
    const baseColumn = [
      {
        title: '编码',
        width: '6%',
        dataIndex: 'deviceModeCode',
        textAlign: 'center',
        sorter: true,
        render: (text) => <div title={text}>{text}</div>,
      }, {
        title: '设备型号',
        width: '24%',
        textAlign: 'left',
        dataIndex: 'deviceModeName',
        sorter: true,
        editable: true,
        render: (text) => <div className={styles.deviceModeName} title={text}>{text}</div>,
      }, {
        title: '电站类型',
        width: '7%',
        textAlign: 'center',
        dataIndex: 'stationType',
        sorter: true,
        render: (text) => <div className={styles.stationType} >{text === '0' ? '风电' : '光伏'}</div>,
      }, {
        title: '生产资产',
        width: '15%',
        textAlign: 'left',
        dataIndex: 'assetsName',
        // sorter: true,
        editable: true,
        render: (text) => <div className={styles.assetsName} title={text ? text.replace(/,/g, '/') : ''}>{text ? text.replace(/,/g, '/') : '--'}</div>,
      }, {
        title: '设备厂家',
        width: '20%',
        textAlign: 'left',
        dataIndex: 'manufactorName',
        sorter: true,
        editable: true,
        render: (text) => <div className={styles.manufactorName} title={text}>{text}</div>,
      }, {
        title: '创建时间',
        width: '13%',
        textAlign: 'center',
        dataIndex: 'createTime',
        sorter: true,
        render: (text) => <div title={text}>{moment(moment(text)).format('YYYY-MM-DD HH:mm:ss')}</div>,
      }, {
        title: '操作人',
        width: '9%',
        textAlign: 'left',
        dataIndex: 'operateUser',
        sorter: true,
        render: (text) => <div className={styles.stationType} title={text}>{text ? text : '--'}</div>,
      },
    ];
    const columns = modeHandleRight ? baseColumn.concat({
      title: '操作',
      width: '6%',
      textAlign: 'center',
      render: (text, record, index) => {
        return (
          <div className={styles.editStyle}>
            <span style={{ marginRight: '4px' }} title="编辑" className={'iconfont icon-edit'} onClick={() => this.editMode(record)} />
            <span title="删除" className="iconfont icon-del" onClick={() => this.deleteDeviceMode(record)} />
          </div>
        );
      },
    }) : baseColumn;
    return (
      <div className={styles.deviceMode}>
        {modeHandleRight && <div className={styles.title}>
          <div className={styles.leftAdd}>
            <Form className={styles.editPart}>
              <FormItem className={styles.formItemStyle} colon={false} label="设备型号">
                {getFieldDecorator('addDeviceModeName', {
                  rules: [{
                    required: true,
                    message: '请输入30字以内的设备厂家',
                    type: 'string',
                    max: 30,
                  }],
                })(
                  <Input placeholder="不超过30字" />
                )}
              </FormItem>
              <FormItem className={styles.formItemStyle} colon={false} label="生产资产">
                {getFieldDecorator('assetsId', {
                  rules: [{
                    required: true,
                    message: '请选择节点',
                  }],
                })(
                  <AssetNodeSelect onChange={this.changeSelctNode} stationType={stationType} assetList={assetList} stationTypeCount={stationTypeCount} queryDataType={this.queryDataType} resetValue={this.state.resetValue} />
                )}
              </FormItem>
              <FormItem className={styles.formItemStyle} colon={false} label="所属厂家">
                {getFieldDecorator('manufactorId', {
                  rules: [{
                    required: true,
                    message: '请输入30字以内的设备厂家',
                  }],
                })(
                  <Select
                    onSelect={this.selectManufactor}
                    disabled={this.state.assetsIds.length === 0}
                    style={{ width: 194 }}
                    placeholder="请选择厂家" >
                    {deviceFactorsList.map(e => (<Option key={e.manufactorCode} value={e.manufactorId}>
                      {e.manufactorName}
                    </Option>))}
                  </Select>
                )}
              </FormItem>
              <Button className={styles.addButton} onClick={this.submitForm}>添加</Button>
            </Form>
          </div>

        </div>}
        <div className={styles.tableStyles}>
          <div className={styles.paginationStyle}>
            <div className={styles.rightSeach}>
              <Input.Search
                placeholder="请输入设备型号"
                allowClear
                onSearch={this.searchFactory}
              />
            </div>
            <Pagination pageSize={pageSize} currentPage={pageNum} onPaginationChange={this.onPaginationChange} total={modePageCount} />
          </div>
          <CneTable
            loading={false}
            dataSource={deviceModesList}
            columns={columns}
            pagination={false}
            rowKey={(record, index) => index || 'key'}
            sortField={this.tableSortMap[orderField]}
            sortMethod={this.sortMethodMap[orderMethod]}
            onChange={this.tableChange}
            locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
          />
        </div>
        {showWarningTip && <WarningTip
          style={{ marginTop: '350px', width: '240px', height: '88px' }}
          onCancel={this.onCancelWarningTip}
          hiddenCancel={false}
          onOK={this.onConfirmWarningTip}
          value={warningTipText} />}
        {showEditModeModal && <EditMode {...this.props} showModal={showEditModeModal} cancleModal={this.cancleModal} queryDataType={this.queryDataType} tableRecord={tableRecord} />}
      </div>
    );
  }
}
export default Form.create()(DeviceMode);
