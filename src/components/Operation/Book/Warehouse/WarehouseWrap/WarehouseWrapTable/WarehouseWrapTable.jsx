import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Table } from 'antd';
import moment from 'moment';
import EditableCell from './EditableCell/EditableCell';
import { handleRight } from '@utils/utilFunc';
import styles from './warehouseWrapTable.scss';
import CneTable from '../../../../../Common/Power/CneTable';

const defaultTime = 'YYYY-MM-DD HH:mm:ss';
const EditableContext = React.createContext();
const EditableRow = ({ form, index, ...props }) => {
  return (<EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>);
};
const EditableFormRow = Form.create()(EditableRow);

class WarehouseWrapTable extends Component {
  static propTypes = {
    resetStore: PropTypes.func,
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
    sortField: PropTypes.string,
    sortMethod: PropTypes.string,
    getWarehouseList: PropTypes.func,
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
    this.setState({
      selectedRowKeys,
    }, () => {
      onSelectedRowKeys(selectedRowKeys);
    });
  };

  tableChange = (pagination, filter, sorter) => {// 点击表头 排序
    const { field, order } = sorter;
    const { sortField, sortMethod } = this.props;
    const {
      getWarehouseList,
      warehouseName,
      pageNum,
      pageSize,
    } = this.props;
    // 根据字段匹配
    const fieldData = {
      warehouseName: 'warehouse_name',
      createTime: 'create_time',
      user: 'username',
    };

    let newSortField = sortField, newSortMethod = 'asc';
    if (!field || fieldData[field] === sortField) {
      newSortMethod = sortMethod === 'asc' ? 'desc' : 'asc';
    } else {
      newSortField = fieldData[field];
    }

    // 参数
    const params = {
      warehouseName,
      pageNum,
      pageSize,
      sortField: newSortField,
      sortMethod: newSortMethod,
    };
    getWarehouseList(params);
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
        sortField,
        sortMethod,
      } = this.props;
      const { warehouseName, stationName } = fieldsValue;
      const stationCode = stationName.map(cur => {
        return cur.stationCode;
      });
      // 参数
      const params = {
        warehouseId,
        warehouseName,
        stationCodes: stationCode.join(','),
        pageNum,
        pageSize,
        searchName,
        sortField,
        sortMethod,
        func: () => {
          this.setState({ editingKey: '' });
        },
      };
      getWarehouseUpdateList(params);

    });
  };

  // 编辑
  edit = (key) => {
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
        dataList: data,
      },
      warehouseListLoading,
      sortField,
      sortMethod,
    } = this.props;
    const { selectedRowKeys } = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: (...rest) => {
          return (<EditableContext.Consumer>
            {form => {
              return <EditableCell form={form} data={data} stations={stations} {...rest[0]} />;
            }}
          </EditableContext.Consumer>);
        },
      },
    };
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const warehouseHandleRight = handleRight('book_operateWarehouse');
    const baseColumn = [
      {
        title: '仓库名称',
        dataIndex: 'warehouseName',
        sorter: true,
        editable: true,
        width: '24%',
        render: (text) => <div title={text} className={styles.warehouseName}>{text}</div>,
      }, {
        title: '电站名称',
        dataIndex: 'stationName',
        editable: true,
        width: '24%',
        render: (text) => <div className={styles.stationName} title={text}>{text}</div>,
      }, {
        title: '创建时间',
        dataIndex: 'createTime',
        sorter: true,
        width: '20%',
        textAlign: 'center',
        render: (text) => <div title={moment(text).format(defaultTime)}>{moment(text).format(defaultTime)}</div>,
      }, {
        title: '创建人',
        dataIndex: 'user',
        sorter: true,
        width: '20%',
        render: (text) => <div title={text} className={styles.user}>{text}</div>,
      },
    ];
    const totalColumns = warehouseHandleRight ? baseColumn.concat({
      title: '操作',
      width: '12%',
      render: (text, record) => {
        const { editingKey } = this.state;
        const editable = this.isEditing(record);
        return (
          <div className={styles.opearte}>
            {editable ?
              (<EditableContext.Consumer>
                {form => {
                  return <span title="保存" className={`iconfont icon-doned ${styles.save}`} onClick={() => this.save(form, record.warehouseId)} />;
                }}
              </EditableContext.Consumer>)
              : <span title="编辑" className={`iconfont icon-edit ${editingKey !== '' && styles.disabled || styles.edit}`} onClick={() => this.edit(record.warehouseId)} />
            }
            <span title="删除" className={`iconfont icon-del ${styles.del}`} onClick={() => this.deleteMode(record)} />
          </div>
        );
      },
    }) : baseColumn;
    const columns = totalColumns.map((col) => {
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
          <CneTable
            loading={warehouseListLoading}
            dataSource={data}
            components={components}
            columns={columns}
            rowSelection={rowSelection}
            pagination={false}
            rowKey={(record) => record.warehouseId || 'key'}
            onChange={this.tableChange}
            sortField={{ 'warehouse_name': 'warehouseName', 'create_time': 'createTime', 'username': 'user' }[sortField]}
            sortMethod={{ 'asc': 'ascend', 'desc': 'descend' }[sortMethod]}
          />
        </EditableContext.Provider>
      </div>
    );
  }
}

export default Form.create()(WarehouseWrapTable);
