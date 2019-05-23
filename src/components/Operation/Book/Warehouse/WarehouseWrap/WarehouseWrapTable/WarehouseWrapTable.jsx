import React, { Component } from "react";
import PropTypes from 'prop-types';
import {Form, Table} from "antd";
import moment from "moment";
import EditableCell from "./EditableCell/EditableCell";

import styles from "./warehouseWrapTable.scss";

const defaultTime = "YYYY-MM-DD HH:mm:ss";
const EditableContext = React.createContext();
const EditableRow = ({ form, index, ...props }) => {
  return (<EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>)
};
const EditableFormRow = Form.create()(EditableRow);

class WarehouseWrapTable extends Component {
  static propTypes = {
    resetStore:PropTypes.func,
    form: PropTypes.object,
    stations: PropTypes.object,
    warehouseData: PropTypes.object,
    getWarehouseDelList: PropTypes.func,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    warehouseName: PropTypes.string,
    onSelectedRowKeys: PropTypes.func,
    onDeleteMode: PropTypes.func,
    getWarehouseUpdateList: PropTypes.func,
    warehouseListLoading: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      editingKey: '',
      selectedRowKeys: [],
    };
  }

  // 批量选中
  onSelectChange = selectedRowKeys => {
    const { onSelectedRowKeys } = this.props;
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({
      selectedRowKeys
    }, () => {
      onSelectedRowKeys(selectedRowKeys);
    });
  };

  // 当前的warehouseId
  isEditing = record => record.warehouseId === this.state.editingKey;

  // 保存
  save = (form, warehouseId) => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const {
        getWarehouseUpdateList,
        warehouseName: searchName,
        pageNum,
        pageSize,
      } = this.props;
      const { warehouseName, stationName } = fieldsValue;
      const stationCode = stationName.map(cur => {
        return cur.stationCode;
      });
      // 参数
      const params = {
        warehouseId,
        warehouseName,
        stationCodes: stationCode.join(","),
        pageNum,
        pageSize,
        searchName,
        func: () => {
          this.setState({ editingKey: "" });
        }
      };
      getWarehouseUpdateList(params);

    });
  };

  // 编辑
  edit = (key) => {
    console.log(key, "key");
    this.setState({ editingKey: key });
  };

  // 删除
  deleteMode = (record) => {
    const { onDeleteMode } = this.props;
    const params = {
      showWarningTip: true,
      warningTipText: '确认删除?',
      tableRecord: record,
    };
    onDeleteMode(params);
  };

  render() {
    const {
      form,
      stations,
      warehouseData: {
        dataList : data
      },
      warehouseListLoading
    } = this.props;
    const { selectedRowKeys } = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: (...rest) => {
          return (<EditableContext.Consumer>
            {form => {
              return <EditableCell form={form} data={data} stations={stations} {...rest[0]} />
            }}
          </EditableContext.Consumer>)
        },
      },
    };
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const columns = [
      {
        title: '仓库名称',
        dataIndex: 'warehouseName',
        sorter: true,
        editable: true,
        width: 200,
        render: (text) => <span title={text}>{text}</span>
      }, {
        title: '电站名称',
        dataIndex: 'stationName',
        editable: true,
        width: 200,
        render: (text) => <span title={text}>{text}</span>
      }, {
        title: '创建时间',
        dataIndex: 'createTime',
        sorter: true,
        render: (text) => <span title={moment(text).format(defaultTime)}>{moment(text).format(defaultTime)}</span>
      }, {
        title: '创建人',
        dataIndex: 'user',
        sorter: true,
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
                        onClick={() => this.save(form, record.warehouseId)}
                        style={{ marginRight: 8 }}>
                        <span style={{marginRight: '4px'}} title="保存" className={"iconfont icon-doned"} />
                      </a>
                    )
                  }}
                </EditableContext.Consumer>)
                : <a disabled={editingKey !== ''} onClick={() => this.edit(record.warehouseId)} ><span style={{ marginRight: '4px' }} title="编辑" className={"iconfont icon-edit"} /></a>
              }
              <span style={{cursor: "pointer"}} title="删除" className="iconfont icon-del" onClick={() => this.deleteMode(record)} />
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
          type: col.dataIndex === 'warehouseName' ? 'text' : 'select',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });
    return (
      <div className={styles.warehouseWrapTable}>
        <EditableContext.Provider value={form}>
          <Table
            loading={warehouseListLoading}
            dataSource={data}
            components={components}
            columns={columns}
            rowSelection={rowSelection}
            pagination={false}
            rowKey={(record) => record.warehouseId || "key"}
            onChange={this.tableChange}
            locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
          />
        </EditableContext.Provider>
      </div>
    )
  }
}

export default Form.create()(WarehouseWrapTable);
