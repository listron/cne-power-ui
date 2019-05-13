import React from "react";
import PropTypes from "prop-types";
import styles from "./deviceFactory.scss";
import EditableCell from "./EditableCell";
import { Button, Table, Form, Input, Icon } from 'antd';
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

// class EditableCell extends React.Component {
//   getInput = () => {

//     return <Input />;
//   };

//   render() {
//     const {
//       editing,
//       dataIndex,
//       title,
//       // inputType,
//       record,
//       index,
//       ...restProps
//     } = this.props;
//     return (
//       <EditableContext.Consumer>
//         {(form) => {
//           const { getFieldDecorator } = form;
//           return (
//             <td {...restProps}>
//               {editing ? (
//                 <FormItem style={{ margin: 0 }}>
//                   {getFieldDecorator(dataIndex, {
//                     rules: [{
//                       required: true,
//                       message: `Please Input ${title}!`,
//                     }],
//                     initialValue: record[dataIndex],
//                   })(this.getInput())}
//                 </FormItem>
//               ) : restProps.children}
//             </td>
//           );
//         }}
//       </EditableContext.Consumer>
//     );
//   }
// }
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
    this.props.getDeviceFactorsList()
  }
  isEditing = record => record.manufactorId === this.state.editingKey;
  cancel = () => {
    this.setState({ editingKey: '' });
  };
  save(form, manufactorId) {
    console.log('form: ', form);

    console.log('manufactorId: ', manufactorId);
    const { deviceFactorsList } = this.props;
    console.log('deviceFactorsList: ', deviceFactorsList);
    form.validateFields((error, row) => {
      console.log('row: ', row);
      if (error) {
        return;
      }
      if (!error) {
        console.log(1111111111111);
        
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
      console.log('newData: ', newData);
      const index = newData.findIndex(item => manufactorId === item.manufactorId);
      console.log('index: ', index);
      if (index > -1) {
        const item = newData[index];
        console.log('item: ', item);
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        console.log('newData: ', newData);
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
    console.log('key: ', key);
    this.setState({ editingKey: key });
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
  deleteFactory = (record) => {
    this.setState({
      showWarningTip: true,
      warningTipText: '确认删除?',
      tableRecord: record,
    })
  }
  submitForm = (e) => {
    // this.props.form.validateFieldsAndScroll((err, values) => {
    //   if (!err) {
    //   console.log('发送请求，并且刷新别的数据')
    //   }
    // });
  }

  searchFactory = (value) => {
    console.log('value: ', value);
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
  // showEditTable = (record) => {
  //   const { isSaveStyle } = this.state;
  //   this.setState({
  //     isSaveStyle: !isSaveStyle
  //   })

  // }
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

    const { pageSize, pageNum, total, deviceFactorsList } = this.props;
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
                  console.log('form: ', form);
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
            {/* <Form className={styles.editPart}>
              <FormItem className={styles.formItemStyle} colon={false} label="添加设备厂家">
                {getFieldDecorator('addFactory', {
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
              <Button className={styles.addButton} onClick={this.submitForm}>添加</Button>
            </Form> */}
          </div>
          <div className={styles.rightSeach}>
            <Input.Search
              placeholder="不超过30字"
              allowClear
              onSearch={this.searchFactory}
            />
          </div>
        </div>
        <div className={styles.tableStyles}>
          <div className={styles.paginationStyle}>
            <Pagination pageSize={pageSize} currentPage={pageNum} onPaginationChange={this.onPaginationChange} total={total} />
          </div>
          <EditableContext.Provider value={this.props.form}>
            <Table
              loading={false}
              components={components}
              dataSource={deviceFactorsList}
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