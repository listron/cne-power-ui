import React from "react";
import PropTypes from "prop-types";
import styles from "./deviceMode.scss";
import EditableCell from "./EditableCell";
import AssetNodeSelect from '../../../../Common/AssetNodeSelect';
import { Button, Table, Form, Input, Icon, Select } from 'antd';
import Pagination from '../../../../Common/CommonPagination';
import WarningTip from '../../../../Common/WarningTip';
const FormItem = Form.Item;
const { Option } = Select;
const EditableContext = React.createContext();
const EditableRow = ({ form, index, ...props }) => {
  return (<EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>)
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
    super(props, context)
    this.state = {
      showWarningTip: false,
      warningTipText: '',
      tableRecord: {},
      isSaveStyle: false,
      editingKey: '',
    }
  }
  componentDidMount() {
    //获取设备厂家列表供select选择厂家
   this.props.getDeviceFactorsList({
      orderField: '1',
      orderMethod: 'desc'
    })
    this.props.getDeviceModesList({
      orderField: '1',
      orderMethod: 'desc'
    })
  }
  onCancelWarningTip = () => {//信息提示栏隐藏
    this.setState({
      showWarningTip: false
    });
  }
  onConfirmWarningTip = () => {
    const { tableRecord } = this.state;
    const modeId = tableRecord.modeId;
    this.setState({
      showWarningTip: false,
    });
    this.props.deleteDeviceModes({ modeId });
  }

  onPaginationChange = ({ currentPage, pageSize }) => {
    this.changFilter({ pageNum: currentPage, pageSize })
  }
  isEditing = record => record.modeId === this.state.editingKey;
  cancel = () => {
    this.setState({ editingKey: '' });
  };
  save(form, modeId) {
    const { deviceModesList } = this.props;
    form.validateFields((error, row) => {
      row.manufactorId=row.manufactorName;
      if (error) {
        return;
      }
      if (!error) {
        this.props.editDeviceModes({ modeId,deviceModeName :row.deviceModeName, assetsId:row.assetsName.assetsIds.join(),manufactorId:row.manufactorName })
      };
     
      const newData = [...deviceModesList];
      const index = newData.findIndex(item => modeId === item.modeId);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        this.props.changeAssetConfigStore({ deviceModesList: newData })
        this.setState({ data: newData, editingKey: '' });
      } else {
        newData.push(row);
        this.props.changeAssetConfigStore({ deviceModesList: newData })
        this.setState({ data: newData, editingKey: '' });
      }
    });
  }
  edit(key) {
    this.setState({ editingKey: key });
  }
  deleteDeviceMode = (record) => {
    this.setState({
      showWarningTip: true,
      warningTipText: '确认删除?',
      tableRecord: record,
    })
  }
  changFilter = (value) => {
    const { getDeviceModesList, orderField, orderMethod, pageNum, pageSize, deviceModeName } = this.props;
    const params = { orderField, orderMethod, pageNum, pageSize, deviceModeName };
    getDeviceModesList({ ...params, ...value })
  }
  showEditTable = (record) => {
    const { isSaveStyle } = this.state;
    this.setState({ isSaveStyle: !isSaveStyle })
  }
  submitForm = (e) => {
    this.props.form.validateFieldsAndScroll(['deviceModeName','assetsId','manufactorId'],(err, values) => {
      if (!err) {
        this.props.addDeviceModes({ ...values,assetsId:values.assetsId.assetsIds.join() })
      }
    });
  }
  searchFactory = (value) => {
    this.changFilter({
      deviceModeName: value,
    })
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
    const orderCommand = order ? (sorter.order === 'ascend' ? 'asc' : 'desc') : '';
    this.changFilter({ orderField, orderCommand })
  }
  selectManufactor = (value, option) => {
  }
  changeSelctNode = (data) => {
    // this.props.getDeviceFactorsList({
    //   assetsId:data.assetsIds.join(),
    //   orderField: '1',
    //   orderMethod: 'desc'
    // })

  }
  queryDataType = (value) => {
    this.props.getAssetTree({ stationType: value })
  }
  render() {
    const { pageSize, pageNum, total, deviceFactorsList, deviceModesList,assetList, stationTypeCount } = this.props;
    console.log('deviceModesList: ', deviceModesList);
    const components = {
      body: {
        row: EditableFormRow,
        // cell: EditableCell,
        cell: (...rest) => {
          return (<EditableContext.Consumer>
            {form => {
              return <EditableCell form={form} devicefactorslist={deviceFactorsList} {...rest[0]} onChange={this.changeSelctNode} assetlist={assetList} stationtypecount={stationTypeCount} queryDataType={this.queryDataType} />
            }}
          </EditableContext.Consumer>)
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
        render: (text) => <span title={text}>{text}</span>
      }, {
        title: '设备型号',
        dataIndex: 'deviceModeName',
        sorter: true,
        editable: true,
        render: (text) => <span title={text}>{text}</span>
      },{
        title: '生产资产',
        dataIndex: 'assetsName',
        sorter: true,
        editable: true,
        render: (text) => <span title={text}>{text}</span>
      },  {
        title: '设备厂家',
        dataIndex: 'manufactorName',
        sorter: true,
        editable: true,
        render: (text) => <span title={text}>{text}</span>
      }, {
        title: '创建时间',
        dataIndex: 'createTime',
        sorter: true,
        render: (text) => <span title={text}>{text}</span>
      }, {
        title: '操作人',
        dataIndex: 'operateUser',
        sorter: true,
        render: (text) => <span title={text}>{text}</span>
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
                    <span style={{ marginRight: '4px' }} title="编辑" className={"iconfont icon-doned"} ></span></a>)
                }}
              </EditableContext.Consumer>)
              : <a disabled={editingKey !== ''} onClick={() => this.edit(record.modeId)} ><span style={{ marginRight: '4px' }} title="编辑" className={"iconfont icon-edit"}></span></a>
            }
            <span title="删除" className="iconfont icon-del" onClick={() => this.deleteDeviceMode(record)}></span>
          </div>)
        }
      },
    ].map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          type: col.dataIndex === 'deviceModeName' ? 'text' :(col.dataIndex === 'assetsName'?'modal':'select'),
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
                {getFieldDecorator('deviceModeName', {
                  rules: [{
                    required: true,
                    message: '请输入30字以内的设备厂家',
                    type: "string",
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
                  <AssetNodeSelect onChange={this.changeSelctNode} assetList={assetList} stationTypeCount={stationTypeCount} queryDataType={this.queryDataType}  />
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
    )
  }
}
export default Form.create()(DeviceMode)