import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Form, Table} from 'antd';
import moment from 'moment';
import EditableCell from './EditableCell/EditableCell';

import styles from './warehouseGoodsTable.scss';
import WarningTip from '../../../../../Common/WarningTip';

const defaultTime = 'YYYY-MM-DD HH:mm:ss';
const EditableContext = React.createContext();
const EditableRow = ({ form, index, ...props }) => {
  return (<EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>);
};
const EditableFormRow = Form.create()(EditableRow);

const data = [];
for (let i = 0; i < 10; i++) {
  data.push({
    key: ['82'],
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
    author: '哈哈',
    createTime: '2018-08-08',
    modeId: i,
  });
}

class WarehouseGoodsTable extends Component {
  static propTypes = {
    resetStore: PropTypes.func,
    form: PropTypes.object,
    goodsData: PropTypes.object,
    getGoodsDelList: PropTypes.func,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    goodsName: PropTypes.string,
    goodsType: PropTypes.string,
    getGoodsUpdateList: PropTypes.func,
    getGoodsList: PropTypes.func,
    goodsListLoading: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      editingKey: '',
      showWarningTip: false,
      warningTipText: '',
      tableRecord: {},
    };
  }

  onCancelWarningTip = () => {
    this.setState({
      showWarningTip: false,
      warningTipText: '',
      tableRecord: {},
    });
  };

  onConfirmWarningTip = () => {
    const {
      tableRecord: {
        goodsId,
      },
    } = this.state;
    const {
      getGoodsDelList,
      pageNum,
      pageSize,
      goodsName,
      goodsType,
    } = this.props;
    // 参数
    const params = {
      goodsId,
      pageNum,
      pageSize,
      goodsName,
      goodsType,
      func: () => {
        this.setState({
          warningTipText: '',
          tableRecord: {},
        });
      },
    };
    this.setState({
      showWarningTip: false,
    }, () => {
      getGoodsDelList(params);
    });
  };

  tableChange = (pagination, filter, sorter) => {// 点击表头 排序
    const { field, order } = sorter;
    const {
      getGoodsList,
      goodsName,
      pageNum,
      pageSize,
      goodsType,
    } = this.props;
    // 根据字段匹配
    const fieldData = {
      goodsType: 'goods_type',
      createTime: 'create_time',
    };
    // 参数
    const params = {
      goodsName,
      pageNum,
      pageSize,
      goodsType,
      sortField: field ? fieldData[field] : '',
      sortMethod: order === 'ascend' ? (field ? 'asc' : '') : (field ? 'desc' : ''),
    };
    getGoodsList(params);
  };

  isEditing = record => record.goodsId === this.state.editingKey;

  // 保存
  save = (form, goodsId) => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const {
        getGoodsUpdateList,
        goodsName: searchName,
        pageNum,
        pageSize,
        goodsType,
      } = this.props;
      const { goodsName, goodsUnit } = fieldsValue;
      // 参数
      const params = {
        goodsId,
        goodsName,
        goodsUnit,
        pageNum,
        pageSize,
        searchName,
        goodsType,
        func: () => {
          this.setState({ editingKey: '' });
        },
      };
      getGoodsUpdateList(params);

    });
  };

  // 编辑
  edit = (key) => {
    this.setState({ editingKey: key });
  };

  // 删除
  deleteMode = (record) => {
    this.setState({
      showWarningTip: true,
      warningTipText: '确认删除?',
      tableRecord: record,
    });
  };

  render() {
    const {
      form,
      goodsData: {
        isAbleOper,
        pageData: {
          dataList,
        },
      },
      goodsListLoading,
    } = this.props;
    const {
      showWarningTip,
      warningTipText,
    } = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: (...rest) => {
          return (<EditableContext.Consumer>
            {form => {
              return <EditableCell form={form} {...rest[0]} />;
            }}
          </EditableContext.Consumer>);
        },
      },
    };
    const columnsEdit = [
      {
        title: '物品名称',
        dataIndex: 'goodsName',
        editable: true,
        render: (text) => <span title={text}>{text}</span>,
      }, {
        title: '计量单位',
        dataIndex: 'goodsUnit',
        editable: true,
        render: (text) => <span title={text}>{text}</span>,
      }, {
        title: '创建时间',
        dataIndex: 'createTime',
        render: (text) => <span title={moment(text).format(defaultTime)}>{moment(text).format(defaultTime)}</span>,
      }, {
        title: '操作人',
        dataIndex: 'user',
        render: (text) => <span title={text}>{text}</span>,
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
                        onClick={() => this.save(form, record.goodsId)}
                        style={{ marginRight: 8 }}>
                        <span style={{marginRight: '4px'}} title="编辑" className={'iconfont icon-doned'} />
                      </a>
                    );
                  }}
                </EditableContext.Consumer>)
                : <a disabled={editingKey !== ''} onClick={() => this.edit(record.goodsId)} ><span style={{ marginRight: '4px' }} title="编辑" className={'iconfont icon-edit'} /></a>
              }
              <span title="删除" style={{cursor: 'pointer'}} className="iconfont icon-del" onClick={() => this.deleteMode(record)} />
            </div>
          );
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
          type: col.dataIndex === 'goodsName' ? 'goodsName' : 'goodsUnit',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });

    const columnsUnEdit = [
      {
        title: '物品名称',
        dataIndex: 'goodsName',
        render: (text) => <span title={text}>{text}</span>,
      }, {
        title: '物品类型',
        dataIndex: 'goodsType',
        sorter: true,
        render: (text, record) => <span title={record.goodsTypeName}>{record.goodsTypeName}</span>,
      }, {
        title: '计量单位',
        dataIndex: 'goodsUnit',
        render: (text) => <span title={text}>{text}</span>,
      }, {
        title: '创建时间',
        dataIndex: 'createTime',
        render: (text) => <span title={moment(text).format(defaultTime)}>{moment(text).format(defaultTime)}</span>,
      }, {
        title: '操作人',
        dataIndex: 'user',
        render: (text) => <span title={text}>{text}</span>,
      }];
    return (
      <div className={styles.warehouseGoodsTable}>
        <EditableContext.Provider value={form}>
          <Table
            loading={goodsListLoading}
            dataSource={dataList}
            components={components}
            columns={isAbleOper === 0 ? columnsEdit : columnsUnEdit}
            pagination={false}
            onChange={this.tableChange}
            rowKey={(record) => record.goodsId || 'key'}
            locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
          />
        </EditableContext.Provider>
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

export default Form.create()(WarehouseGoodsTable);
