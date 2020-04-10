import React from 'react';
import PropTypes from 'prop-types';
import styles from './deviceFactory.scss';
import EditFactors from './EditFactors';
import { Button, Form, Input, message } from 'antd';
import AssetNodeSelect from '../../../../Common/AssetNodeSelect';
import Pagination from '../../../../Common/CommonPagination';
import WarningTip from '../../../../Common/WarningTip';
import moment from 'moment';
import CneTable from '@components/Common/Power/CneTable';
import { handleRight } from '@utils/utilFunc';


const FormItem = Form.Item;

class DeviceFactory extends React.Component {
  static propTypes = {
    changeAssetConfigStore: PropTypes.func,
    editDeviceFactors: PropTypes.func,
    getAssetTree: PropTypes.func,
    getDeviceFactorsList: PropTypes.func,
    deleteDeviceFactors: PropTypes.func,
    deviceFactorsList: PropTypes.array,
    pageSize: PropTypes.number,
    pageNum: PropTypes.number,
    orderField: PropTypes.string,
    orderMethod: PropTypes.string,
    manufactorName: PropTypes.string,
    total: PropTypes.number,
    addDeviceFactors: PropTypes.func,
    stationTypeCount: PropTypes.string,
    assetList: PropTypes.array,
    form: PropTypes.object,

  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      showWarningTip: false,
      warningTipText: '',
      tableRecord: {},
      isSaveStyle: false,
      editingKey: '',
      resetValue: false,
      showEditFactorModal: false,
    };
    this.tableSortMap = { // api存储字段 => 表格排序字段
      '1': 'manufactorCode',
      '2': 'manufactorName',
      '3': 'createTime',
      '4': 'operateUser',
    };
    this.sortMethodMap = {
      'desc': 'descend',
      'asc': 'ascend',
    };
  }
  componentDidMount() {
    const { getDeviceFactorsList, pageNum, pageSize } = this.props;
    getDeviceFactorsList({ orderField: '1', orderMethod: 'desc', pageNum: 1, pageSize: 10 });
  }
  componentWillUnmount() {
    this.props.changeAssetConfigStore({
      manufactorName: '', //设备厂家名称(模糊查询)
      orderField: '1', //排序字段（1：编码，2：设备厂家，3：创建时间，4：操作人）
      orderMethod: 'desc', //排序方式（“asc”：升序，”desc“:降序）
      pageNum: 1, //页码
      pageSize: 10, //每页记录数
      total: 0,
    });
  }
  onPaginationChange = ({ currentPage, pageSize }) => {
    this.changFilter({ pageNum: currentPage, pageSize });
  }
  onCancelWarningTip = () => {//信息提示栏隐藏
    this.setState({
      showWarningTip: false,
    });
  }
  onConfirmWarningTip = () => {
    const { tableRecord } = this.state;
    const manufactorId = tableRecord.manufactorId;
    this.setState({
      showWarningTip: false,
    });
    this.props.deleteDeviceFactors({ manufactorId });
  }


  save(form, manufactorId) {
    const { deviceFactorsList, editDeviceFactors } = this.props;
    form.validateFields((error, row) => {
      if (!error) {
        const { assetsNames } = row;
        const assetsIds = assetsNames.length ? assetsNames : assetsNames.assetsIds;
        editDeviceFactors({ manufactorId, assetsIds: assetsIds, manufactorName: row.manufactorName });
      }
    });
  }

  deleteFactory = (record) => {
    const { isBuild } = record;
    if (isBuild) {
      return message.warning('内置厂家不能删除');
    }
    this.setState({
      showWarningTip: true,
      warningTipText: '确认删除?',
      tableRecord: record,
    });


  }
  submitForm = (e) => {
    const { validateFieldsAndScroll, resetFields } = this.props.form;
    validateFieldsAndScroll(['manufactorName', 'assetsIds'], (err, values) => {
      if (!err) {
        this.props.addDeviceFactors({ manufactorName: values.manufactorName, assetsIds: values.assetsIds.assetsIds });
        this.setState({ resetValue: true });
        resetFields();
      }
    });
  }
  searchFactory = (value) => {
    this.changFilter({
      manufactorName: value,
    });
  }
  tableChange = (pagination, filters, sorter) => {
    const { orderField, orderMethod } = this.props;
    const { field } = sorter;
    const sortInfo = {
      manufactorCode: '1',
      manufactorName: '2',
      createTime: '3',
      operateUser: '4',
    };
    let newOrderField = orderField, newOrderMethod = 'desc';
    if (!field || (sortInfo[field] === newOrderField)) { // 点击的是正在排序的列
      newOrderMethod = orderMethod === 'desc' ? 'asc' : 'desc'; // 交换排序方式
    } else { // 切换列
      newOrderField = sortInfo[field];
    }
    this.changFilter({ orderField: newOrderField, orderMethod: newOrderMethod });
  }
  changFilter = (value) => {
    const { getDeviceFactorsList, orderField, orderMethod, pageNum, pageSize, manufactorName } = this.props;
    const params = { orderField, orderMethod, pageNum, pageSize, manufactorName };
    getDeviceFactorsList({ ...params, ...value });
  }

  queryDataType = (value) => {

    this.props.getAssetTree({ stationType: value });
  }
  editFactors = (record) => {
    this.setState({
      showEditFactorModal: true,
      tableRecord: record,
    });

  }
  cancleModal = () => {
    this.setState({
      showEditFactorModal: false,
    });
  }
  render() {
    const { pageSize, pageNum, total, deviceFactorsList, assetList, stationTypeCount, stationType, handleEnterprisecodes, orderField, orderMethod } = this.props;
    // console.log('handleEnterprisecodes: ', handleEnterprisecodes);
    const { getFieldDecorator } = this.props.form;
    const { showWarningTip, warningTipText, showEditFactorModal, tableRecord } = this.state;
    const manufactureRight = handleRight('book_operateManufacture');
    const basecolumns = [
      {
        title: '编码',
        width: '6%',
        textAlign: 'center',
        dataIndex: 'manufactorCode',
        sorter: true,
        render: (text) => <div title={text}>{text}</div>,
      }, {
        title: '设备厂家',
        width: '25%',
        textAlign: 'left',
        dataIndex: 'manufactorName',
        sorter: true,
        editable: true,
        render: (text) => <div className={styles.manufactorName} title={text}>{text}</div>,
      }, {
        title: '生产资产',
        width: '38%',
        dataIndex: 'assetsNames',
        textAlign: 'left',
        editable: true,
        render: (text) => <div className={styles.assetsStyle} title={text}>{text.join(',')}</div>,
      }, {
        title: '创建时间',
        width: '13%',
        textAlign: 'center',
        dataIndex: 'createTime',
        sorter: true,
        render: (text) => <div title={text}>{moment(moment(text)).format('YYYY-MM-DD HH:mm:ss')}</div>,
      }, {
        title: '操作人',
        width: '12%',
        dataIndex: 'operateUser',
        sorter: true,
        render: (text, record) => {
          return (<div className={styles.operateUser} title={text}>{text ? text : record.isBuild === 1 ? '系统' : '--'}</div>);
        },
      },
    ];
    const columns = manufactureRight ? basecolumns.concat({
      title: '操作',
      width: '6%',
      textAlign: 'center',
      render: (text, record) => {
        return (
          <div className={styles.editStyle}>
            <span style={{ marginRight: '4px' }} title="编辑" className={'iconfont icon-edit'} onClick={() => this.editFactors(record)} />
            {record.isBuild === 0 ? <span title="删除" className={'iconfont icon-del'} onClick={() => this.deleteFactory(record)} /> : ''}
          </div>
        );
      },
    }) : basecolumns;
    return (
      <div className={styles.deviceFactory}>
        {manufactureRight && <div className={styles.title}>
          <div className={styles.leftAdd}>
            <Form className={styles.editPart}>
              <FormItem className={styles.formItemStyle} colon={false} label="添加设备厂家">
                {getFieldDecorator('manufactorName', {
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
                {getFieldDecorator('assetsIds', {
                  rules: [{
                    required: true,
                    message: '请选择节点',
                  }],
                })(
                  <AssetNodeSelect onChange={this.changeSelctNode} stationType={stationType} assetList={assetList} stationTypeCount={stationTypeCount} queryDataType={this.queryDataType} multiple={true} resetValue={this.state.resetValue} handleEnterprisecodes={handleEnterprisecodes} />
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
                placeholder="请输入设备厂家名称"
                allowClear
                onSearch={this.searchFactory}
              />
            </div>
            <Pagination pageSize={pageSize} currentPage={pageNum} onPaginationChange={this.onPaginationChange} total={total} />
          </div>

          <CneTable
            loading={false}
            dataSource={deviceFactorsList.map((e, i) => {
              e.assetsNames = [];
              e.assetsIds = [];
              // e.isBuild = [];
              e.assetsDatas.forEach((item, index) => {
                e.assetsNames.push(item.assetsNames.replace(/,/g, '/'));
                e.assetsIds.push(item.assetsIds);
                // e.isBuild.push(item.isBuild);
              });
              return { ...e };
            })}
            sortField={this.tableSortMap[orderField]}
            sortMethod={this.sortMethodMap[orderMethod]}
            onChange={this.tableChange}
            columns={columns}
            pagination={false}
            locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
          />
        </div>
        {showWarningTip && <WarningTip
          style={{ marginTop: '350px', width: '240px', height: '88px' }}
          onCancel={this.onCancelWarningTip}
          hiddenCancel={false}
          onOK={this.onConfirmWarningTip}
          value={warningTipText} />}
        {showEditFactorModal && <EditFactors {...this.props} showModal={showEditFactorModal} cancleModal={this.cancleModal} queryDataType={this.queryDataType} tableRecord={tableRecord} />}
      </div>
    );
  }
}

export default Form.create()(DeviceFactory);
