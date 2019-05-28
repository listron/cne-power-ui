import React from "react";
import PropTypes from "prop-types";
import styles from "./deviceFactory.scss";
import EditableCell from "./EditableCell";
import { Button, Table, Form, Input, Icon } from 'antd';
import AssetNodeSelect from '../../../../Common/AssetNodeSelect';
import Pagination from '../../../../Common/CommonPagination';
import WarningTip from '../../../../Common/WarningTip';


const FormItem = Form.Item;
const EditableContext = React.createContext();
const EditableRow = ({ form, index, ...props }) => {
  return (<EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>)
};
const EditableFormRow = Form.create()(EditableRow);
class DeviceFactory extends React.Component {
  static propTypes = {
    changeAssetConfigStore: PropTypes.func,
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
    this.props.getDeviceFactorsList({ orderField: '1', orderMethod: 'desc' })
  }
  onPaginationChange = ({ currentPage, pageSize }) => {
    this.changFilter({ pageNum: currentPage, pageSize })
  }
  onCancelWarningTip = () => {//信息提示栏隐藏
    this.setState({
      showWarningTip: false
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
  isEditing = record => record.manufactorId === this.state.editingKey;
  cancel = () => {
    this.setState({ editingKey: '' });
  };
  save(form, manufactorId) {
    const { deviceFactorsList } = this.props;
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      if (!error) {
        this.props.editDeviceFactors({ manufactorId, ...row })
      };
      // const deviceFactorsList = [
      //   {
      //     manufactorCode: '1',
      //     manufactorName: 'test',
      //     createTime: '1:00',
      //     operateUser: 'name1',
      //     manufactorId: '1',
      //   }, {
      //     manufactorCode: '2',
      //     manufactorName: 'test2',
      //     createTime: '2:00',
      //     operateUser: 'name2',
      //     manufactorId: '2',
      //   }];
      const newData = [...deviceFactorsList];
      const index = newData.findIndex(item => manufactorId === item.manufactorId);
      if (index > -1) {
        const item = newData[index];

        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        this.props.changeAssetConfigStore({ deviceFactorsList: newData })
        this.setState({ data: newData, editingKey: '' });
      } else {
        newData.push(row);
        this.props.changeAssetConfigStore({ deviceFactorsList: newData })
        this.setState({ data: newData, editingKey: '' });
      }
    });
  }
  edit(key) {
    this.setState({ editingKey: key });
  }
  deleteFactory = (record) => {
    this.setState({
      showWarningTip: true,
      warningTipText: '确认删除?',
      tableRecord: record,
    })
  }
  submitForm = (e) => {
    this.props.form.validateFieldsAndScroll(['manufactorName', 'assetsIds'], (err, values) => {
      if (!err) {
        this.props.addDeviceFactors({ manufactorName: values.manufactorName, assetsIds: values.assetsIds.assetsIds })
      }
    });
  }
  searchFactory = (value) => {
    this.changFilter({
      manufactorName: value,
    })
  }
  tableChange = (pagination, filters, sorter) => {
    const { field, order } = sorter;
    const sortInfo = {
      manufactorCode: '1',
      manufactorName: '2',
      createTime: '3',
      operateUser: '4',
    };
    const orderField = sortInfo[field] ? sortInfo[field] : '';
    const orderCommand = order ? (sorter.order === 'ascend' ? 'asc' : 'desc') : '';
    this.changFilter({ orderField, orderCommand })
  }
  changFilter = (value) => {
    const { getDeviceFactorsList, orderField, orderMethod, pageNum, pageSize, manufactorName } = this.props;
    const params = { orderField, orderMethod, pageNum, pageSize, manufactorName };
    getDeviceFactorsList({ ...params, ...value })
  }
  changeSelctNode = (data) => {
    console.log('data: ', data);

  }
  queryDataType = (value) => {
    this.props.getAssetTree({ stationType: value })
  }
  render() {
    const components = {
      body: {
        row: EditableFormRow,
        // cell: EditableCell,
        cell: (...rest) => {
          return (<EditableContext.Consumer>
            {form => {

              return <EditableCell form={form} {...rest[0]} />
            }}
          </EditableContext.Consumer>)
        },
      },
    };
    const { pageSize, pageNum, total, deviceFactorsList, assetList, stationTypeCount } = this.props;
    console.log('deviceFactorsList: ', deviceFactorsList);
    // const deviceFactorsList = [
    //   {
    //     manufactorCode: '1',
    //     manufactorName: 'test',
    //     createTime: '1:00',
    //     operateUser: 'name1',
    //     manufactorId: '1',
    //   }, ];
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { showWarningTip, warningTipText, isSaveStyle } = this.state;
    const columns = [
      {
        title: '编码',
        dataIndex: 'manufactorCode',
        sorter: true,
        render: (text) => <span title={text}>{text}</span>
      }, {
        title: '设备厂家',
        dataIndex: 'manufactorName',
        sorter: true,
        editable: true,
        render: (text) => <span title={text}>{text}</span>
      }, {
        title: '生产资产',
        dataIndex: 'assetsNames',
        sorter: true,
        editable: true,
        render: (text) => <span title={text}>{text}</span>
      },{
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
                    onClick={() => this.save(form, record.manufactorId)}
                    style={{ marginRight: 8 }}>
                    <span style={{ marginRight: '4px' }} title="编辑" className={"iconfont icon-doned"} ></span></a>)
                }}
              </EditableContext.Consumer>)
              : <a disabled={editingKey !== ''} onClick={() => this.edit(record.manufactorId)} ><span style={{ marginRight: '4px' }} title="编辑" className={"iconfont icon-edit"}></span></a>
            }
            <span title="删除" className="iconfont icon-del" onClick={() => this.deleteFactory(record)}></span>
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
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });
    return (
      <div className={styles.deviceFactory}>
        <div className={styles.title}>
          <div className={styles.leftAdd}>

            <Form className={styles.editPart}>
              <FormItem className={styles.formItemStyle} colon={false} label="添加设备厂家">
                {getFieldDecorator('manufactorName', {
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
              <FormItem className={styles.formItemStyle} colon={false} label="添加设备厂家">
                {getFieldDecorator('assetsIds', {
                  rules: [{
                    required: true,
                    message: '请选择节点',
                  }],
                })(
                  <AssetNodeSelect onChange={this.changeSelctNode} assetList={assetList} stationTypeCount={stationTypeCount} queryDataType={this.queryDataType} multiple={true} />
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
                placeholder="请输入设备厂家名称"
                allowClear
                onSearch={this.searchFactory}
              />
            </div>

            <Pagination pageSize={pageSize} currentPage={pageNum} onPaginationChange={this.onPaginationChange} total={total} />
          </div>
          <EditableContext.Provider value={this.props.form}>
            <Table
              loading={false}
              components={components}
              dataSource={deviceFactorsList.map((e,i)=>{
                e.assetsDatas.forEach((item,i)=>{
                  e.assetsNames=item.assetsNames;
                  e.assetsIds=item.assetsIds;
                  e.isBuild=item.isBuild;
                })
                return {...e}
              })}
              columns={columns}
              pagination={false}
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

export default Form.create()(DeviceFactory)