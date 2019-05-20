import React, { Component } from "react";
import PropTypes from 'prop-types';
import {Form, Table} from 'antd';
import EditableCell from "./EditableCell/EditableCell";

import styles from "./warehouseGoodsTable.scss";

const EditableContext = React.createContext();
const EditableRow = ({ form, index, ...props }) => {
  return (<EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>)
};
const EditableFormRow = Form.create()(EditableRow);

const data = [];
for (let i = 0; i < 10; i++) {
  data.push({
    key: ["82"],
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
    author: "哈哈",
    createTime: "2018-08-08",
    modeId: i
  });
}

class WarehouseGoodsTable extends Component {
  static propTypes = {
    resetStore:PropTypes.func,
    form: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      editingKey: '',
    };
  }

  isEditing = record => record.modeId === this.state.editingKey;

  // 保存
  save = (form, modeId) => {};

  // 编辑
  edit = (key) => {
    this.setState({ editingKey: key });
  };

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const components = {
      body: {
        row: EditableFormRow,
        cell: (...rest) => {
          return (<EditableContext.Consumer>
            {form => {
              return <EditableCell form={form} data={data} {...rest[0]} />
            }}
          </EditableContext.Consumer>)
        },
      },
    };
    const columnsEdit = [
      {
        title: '物品名称',
        dataIndex: 'name',
        editable: true,
        width: 150,
        render: (text) => <span title={text}>{text}</span>
      }, {
        title: '计量单位',
        dataIndex: 'key',
        editable: true,
        width: 150,
        render: (text) => <span title={text}>{text}</span>
      }, {
        title: '创建时间',
        dataIndex: 'createTime',
        render: (text) => <span title={text}>{text}</span>
      }, {
        title: '操作人',
        dataIndex: 'author',
        render: (text) => <span title={text}>{text}</span>
      }, {
        title: '操作',
        render: (text, record) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(record);
          return (
            <div>
              {editable ?
                (<EditableContext.Consumer>
                  {form => {
                    return (
                      <a
                        onClick={() => this.save(form, record.modeId)}
                        style={{ marginRight: 8 }}>
                        <span style={{marginRight: '4px'}} title="编辑" className={"iconfont icon-doned"} />
                      </a>
                    )
                  }}
                </EditableContext.Consumer>)
                : <a disabled={editingKey !== ''} onClick={() => this.edit(record.modeId)} ><span style={{ marginRight: '4px' }} title="编辑" className={"iconfont icon-edit"} /></a>
              }
              <span title="删除" className="iconfont icon-del" onClick={() => this.deleteDeviceMode(record)} />
            </div>
          )
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
          type: col.dataIndex === 'name' ? 'text' : 'select',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });

    const columnsUnEdit = [
      {
        title: '物品名称',
        dataIndex: 'name',
        width: 150,
        render: (text) => <span title={text}>{text}</span>
      }, {
        title: '计量单位',
        dataIndex: 'key',
        width: 150,
        render: (text) => <span title={text}>{text}</span>
      }, {
        title: '创建时间',
        dataIndex: 'createTime',
        render: (text) => <span title={text}>{text}</span>
      }, {
        title: '操作人',
        dataIndex: 'author',
        render: (text) => <span title={text}>{text}</span>
      }];
    return (
      <div className={styles.warehouseGoodsTable}>
        <EditableContext.Provider value={form}>
          <Table
            loading={false}
            dataSource={data}
            components={components}
            columns={columnsEdit}
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

export default Form.create()(WarehouseGoodsTable);
