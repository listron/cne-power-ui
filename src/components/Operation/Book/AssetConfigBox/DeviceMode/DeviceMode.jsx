import React from 'react';
import PropTypes from 'prop-types';
import styles from './deviceMode.scss';
import EditableCell from './EditableCell';
import AssetNodeSelect from '../../../../Common/AssetNodeSelect';
import { Button, Table, Form, Input, Icon, Select } from 'antd';
import Pagination from '../../../../Common/CommonPagination';
import WarningTip from '../../../../Common/WarningTip';
import moment from 'moment';

const FormItem = Form.Item;
const { Option } = Select;
const EditableContext = React.createContext();
const EditableRow = ({ form, index, ...props }) => {
  return (<EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>);
};
const EditableFormRow = Form.create()(EditableRow);
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
    total: PropTypes.number,
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
      editingKey: '',
      assetsIds: [],
      resetValue: false,
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
      total: 0,
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
  isEditing = record => record.modeId === this.state.editingKey;
  cancel = () => {
    this.setState({ editingKey: '' });
  };
  save(form, modeId) {
    const { deviceModesList, checkedAssetId, checkedManufactor } = this.props;
    form.validateFields((error, row) => {

      row.manufactorId = row.manufactorName;
      if (error) {
        return;
      }
      if (!error) {
        this.props.editDeviceModes({
          modeId,
          deviceModeName: row.deviceModeName,
          assetsId: checkedAssetId.join(),
          manufactorId: checkedManufactor,
        });
      }

      const newData = [...deviceModesList];

      const index = newData.findIndex(item => modeId === item.modeId);

      if (index > -1) {
        const item = newData[index];


        newData.splice(index, 1, {
          ...item,
        });

        // this.props.changeAssetConfigStore({ deviceModesList: newData })
        this.setState({ editingKey: '' });
      } else {
        newData.push(row);
        // this.props.changeAssetConfigStore({ deviceModesList: newData })
        this.setState({ editingKey: '' });
      }
    });
  }
  edit(record) {

    const modeId = record.modeId;

    this.setState({ editingKey: modeId });
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
  showEditTable = (record) => {
    const { isSaveStyle } = this.state;
    this.setState({ isSaveStyle: !isSaveStyle });
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
    const { field, order } = sorter;
    const sortInfo = {
      deviceModeCode: '1',
      deviceModeName: '2',
      manufactorName: '3',
      createTime: '4',
      operateUser: '5',
    };
    const orderField = sortInfo[field] ? sortInfo[field] : '';
    const orderMethod = order ? (sorter.order === 'ascend' ? 'asc' : 'desc') : '';
    this.changFilter({ orderField, orderMethod });
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
  changeNode = (data) => {

    // 
    const { getDeviceFactorsList } = this.props;
    getDeviceFactorsList({
      assetsId: data.assetsIds.join(),
      orderField: '1',
      orderMethod: 'desc',
    });
    this.props.changeAssetConfigStore({
      checkedName: data.checkedName,
      checkedAssetId: data.assetsIds,

    });





  }
  queryDataType = (value) => {
    this.props.getAssetTree({ stationType: value });
  }
  render() {
    const { pageSize, pageNum, total, deviceFactorsList, deviceModesList, assetList, stationTypeCount, stationType } = this.props;

    const components = {
      body: {
        row: EditableFormRow,
        // cell: EditableCell,
        cell: (...rest) => {
          return (<EditableContext.Consumer>
            {form => {
              return <EditableCell {...this.props} form={form} {...rest[0]} devicefactorslist={deviceFactorsList} changeNode={this.changeNode} assetlist={assetList} stationtypecount={stationTypeCount} querydatatype={this.queryDataType} />;
            }}
          </EditableContext.Consumer>);
        },
      },
    };
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { showWarningTip, warningTipText, isSaveStyle } = this.state;
    const columns = [
      {
        title: '编码',
        dataIndex: 'deviceModeCode',
        sorter: true,
        render: (text) => <span title={text}>{text}</span>,
      }, {
        title: '设备型号',
        dataIndex: 'deviceModeName',
        sorter: true,
        editable: true,
        render: (text) => <span title={text}>{text}</span>,
      }, {
        title: '电站类型',
        dataIndex: 'stationType',
        sorter: true,
        render: (text) => <span >{text === '0' ? '风电' : '光伏'}</span>,
      }, {
        title: '生产资产',
        dataIndex: 'assetsName',
        // sorter: true,
        editable: true,
        render: (text) => <span title={text ? text.replace(/,/g, '/') : ''}>{text ? text.replace(/,/g, '/') : '--'}</span>,
      }, {
        title: '设备厂家',
        dataIndex: 'manufactorName',
        sorter: true,
        editable: true,
        render: (text) => <span title={text}>{text}</span>,
      }, {
        title: '创建时间',
        dataIndex: 'createTime',
        sorter: true,
        render: (text) => <span title={text}>{moment(moment(text)).format('YYYY-MM-DD HH:mm:ss')}</span>,
      }, {
        title: '操作人',
        dataIndex: 'operateUser',
        sorter: true,
        render: (text) => <span title={text}>{text}</span>,
      }, {
        title: '操作',
        render: (text, record, index) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(record);
          return (<div>
            {editable ?
              (<EditableContext.Consumer>
                {form => {
                  return (<a
                    onClick={() => this.save(form, record.modeId)}
                    style={{ marginRight: 8 }}>
                    <span style={{ marginRight: '4px' }} title="编辑" className={'iconfont icon-doned'} ></span></a>);
                }}
              </EditableContext.Consumer>)
              : <a disabled={editingKey !== ''} onClick={() => this.edit(record)} ><span style={{ marginRight: '4px' }} title="编辑" className={'iconfont icon-edit'}></span></a>
            }
            <span title="删除" className="iconfont icon-del" onClick={() => this.deleteDeviceMode(record)}></span>
          </div>);
        },
      },
    ].map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          type: col.dataIndex === 'deviceModeName' ? 'text' : (col.dataIndex === 'assetsName' ? 'modal' : 'select'),
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });
    return (
      <div className={styles.deviceMode}>
        <div className={styles.title}>
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

        </div>
        <div className={styles.tableStyles}>
          <div className={styles.paginationStyle}>
            <div className={styles.rightSeach}>
              <Input.Search
                placeholder="请输入设备型号"
                allowClear
                onSearch={this.searchFactory}
              />
            </div>
            <Pagination pageSize={pageSize} currentPage={pageNum} onPaginationChange={this.onPaginationChange} total={total} />
          </div>
          <EditableContext.Provider value={this.props.form}>
            <Table
              loading={false}
              dataSource={deviceModesList}
              components={components}
              columns={columns}
              pagination={false}
              onChange={this.tableChange}
              locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
            />
          </EditableContext.Provider>
        </div>
        {showWarningTip && <WarningTip
          style={{ marginTop: '350px', width: '240px', height: '88px' }}
          onCancel={this.onCancelWarningTip}
          hiddenCancel={false}
          onOK={this.onConfirmWarningTip}
          value={warningTipText} />}
      </div>
    );
  }
}
export default Form.create()(DeviceMode);
