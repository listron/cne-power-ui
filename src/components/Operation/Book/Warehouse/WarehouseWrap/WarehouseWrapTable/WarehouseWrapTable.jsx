import React, { Component } from "react";
import styles from "./warehouseWrapTable.scss";
import PropTypes from 'prop-types';
import {Form, Table} from "antd";
import EditableCell from "./EditableCell/EditableCell";

const EditableContext = React.createContext();
const EditableRow = ({ form, index, ...props }) => {
  return (<EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>)
};
const EditableFormRow = Form.create()(EditableRow);

const data = [];
for (let i = 0; i < 100; i++) {
  data.push({
    key: i.toString(),
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
}
class WarehouseWrapTable extends Component {
  static propTypes = {
    resetStore:PropTypes.func,
    form: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      editingKey: '',
    };
  }

  isEditing = record => record.modeId === this.state.editingKey;

  render() {
    const { form } = this.props;
    const components = {
      body: {
        row: EditableFormRow,
        cell: (...rest) => {
          return (<EditableContext.Consumer>
            {form => {
              return <EditableCell form={form} {...rest[0]} />
            }}
          </EditableContext.Consumer>)
        },
      },
    };
    const columns = [
      {
        title: '仓库名称',
        dataIndex: '仓库名称',
        sorter: true,
        editable: true,
        render: (text) => <span title={text}>{text}</span>
      }, {
        title: '电站名称',
        dataIndex: '电站名称',
        editable: true,
        render: (text) => <span title={text}>{text}</span>
      }, {
        title: '创建时间',
        dataIndex: 'createTime',
        sorter: true,
        render: (text) => <span title={text}>{text}</span>
      }, {
        title: '创建人',
        dataIndex: 'manufactorName',
        sorter: true,
        render: (text) => <span title={text}>{text}</span>
      }, {
        title: '操作人',
        dataIndex: 'operateUser',
        sorter: true,
        render: (text) => <span title={text}>{text}</span>
      }, {
        title: '操作',
        render: (text, record) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(record);
          return (<div>
            {editable ?
              (<EditableContext.Consumer>
                {form => {
                  return (<a
                    onClick={() => this.save(form, record.modeId)}
                    style={{ marginRight: 8 }}>
                    <span style={{marginRight: '4px'}} title="编辑" className={"iconfont icon-doned"} /></a>)
                }}
              </EditableContext.Consumer>)
              : <a disabled={editingKey !== ''} onClick={() => this.edit(record.modeId)} ><span style={{ marginRight: '4px' }} title="编辑" className={"iconfont icon-edit"} /></a>
            }
            <span title="删除" className="iconfont icon-del" onClick={() => this.deleteDeviceMode(record)} />
          </div>)
        }
      },
    ]
    return (
      <div className={styles.warehouseWrapTable}>
        <EditableContext.Provider value={form}>
          <Table
            loading={false}
            dataSource={data}
            components={components}
            columns={columns}
            pagination={false}
            rowKey={(record, index) => index || "key"}
            onChange={this.tableChange}
            locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
          />
        </EditableContext.Provider>
      </div>
    )
  }
}

export default Form.create()(WarehouseWrapTable);
