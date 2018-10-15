import React, {Component} from 'react';
import {Table, Button, Select, Icon, Popover, Input, Form, message} from 'antd';
import CommonPagination from '../../../../Common/CommonPagination';
import PropTypes from 'prop-types';
import styles from './planMain.scss';
import {getMonth} from './plan';

const {Option} = Select;





const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({form, index, ...props}) => {
  return (<EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>)
};

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  getInput = (form) => {
    const {dataIndex, record} = this.props;
    if (dataIndex === 'yearPR') {
      return (<span> <Input onBlur={(e) => this.yearPRChange(e, form, dataIndex, record)}
                            defaultValue={record[dataIndex]}/>%</span>);
    }
    return <Input onChange={this.ValueChange} onBlur={(e) => this.valueChange(e, form, dataIndex, record)}/>;
  };

  yearPRChange = (e, form, dataIndex, record) => {//PR 数据修改
    const number = e.target.value;
    if (isNaN(number)) {
      message.warning('只可以填写数字,可精确到小数点后两位');

      form.setFieldsValue({
        [dataIndex]: '',
      });
      return false;
    }
  };

  valueChange = (e, form, dataIndex, record) => {//月份的修改，修改完毕之后年计划跟着变化
    const number = e.target.value;
    if (isNaN(number)) {
      message.warning('只可以填写数字,可精确到小数点后四位');
      form.setFieldsValue({
        [dataIndex]: '',
      });
      return false;
    } else {
      const index=getMonth(dataIndex)-1;
      record.monthPlanPowers.planMonthGen[index] = number;
      this.props.handlevaluechange(record,dataIndex,number)
    }
  };

  render() {
    const {
      editing,
      dataIndex,
      record,
      handlevaluechange,
      ...restProps
    } = this.props;

    return (
      <EditableContext.Consumer>
        {(form) => {
          const {getFieldDecorator} = form;
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{margin: 0}}>
                  {getFieldDecorator(dataIndex, {
                    rules: [{
                      required: false,
                      // message: `只可以填写数字,可精确到小数点后四位`,
                      // type:'number',
                    }],
                    initialValue: record[dataIndex],
                  })(this.getInput(form))}
                </FormItem>
              ) : restProps.children}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}


class PlanTable extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    changeDepartmentStore: PropTypes.func,
    planData:PropTypes.array,
    getPlanList: PropTypes.func,
    editPlanInfo: PropTypes.func,
    changePlanStore: PropTypes.func,

  }

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      editingKey: '',
      monthPowers:{},
    }
  }

  onPlanAdd = () => {//进入添加计划页
    this.props.changePlanStore({showPage: 'add'});
  }

  onPaginationChange = ({currentPage, pageSize}) => {//分页器
    this.props.getPlanList({
      year: this.props.planYear || new Date().getFullYear(), // 年份 默认是当前年
      stationCodes: this.props.stationCodes, // 电站编码
      sortField: this.props.sortField, // 1:区域 2：电站名称 3:装机容量 4:年份 5: 年计划发电量
      sortMethod: this.props.sort, //排序 => 'field,0/1'field代表排序字段，0升序,1降序
      pageNum: currentPage,
      pageSize
    })
  }

  getDefectSortField = (feild) => { // 根据排序
    var result = '';
    switch (feild) {
      case 'region':
        result = '1';
        break;
      case 'stationName':
        result = '2';
        break;
      case 'stationCapacity':
        result = '3';
        break;
      case 'planYear':
        result = '4';
        break;
      case 'planPower':
        result = '5';
        break;
    }
    return result;
  }

  tableChange = (pagination, filter, sorter) => {//计划排序 排序还有误
    // console.log("计划排序", pagination, filter, sorter);
    const sortField = this.getDefectSortField(sorter.field);
    const ascend = sorter.order === 'ascend' ? '0' : '1';
    this.props.getPlanList({
      year: this.props.planYear || new Date().getFullYear(), // 年份 默认是当前年
      stationCodes: this.props.stationCodes, // 电站编码
      sortField, // 1:区域 2：电站名称 3:装机容量 4:年份 5: 年计划发电量
      sortMethod: ascend, //排序 => 'field,0/1'field代表排序字段，0升序,1降序
      pageNum: this.props.pageNum,
      pageSize: this.props.pageSize
    })
  }


  // 是否可以编辑
  isEditing = (record) => {
    const currentYear=new Date().getFullYear();
    // console.log(123,currentYear-record.planYear>=0)
    if(currentYear-record.planYear>=0){
      return record.key === this.state.editingKey;
    }
  };

  // 编辑
  edit(key) {// 如果存在编辑，则不允许其他操作
    const {editingKey} = this.state;
    if (typeof editingKey === "string") {
      this.setState({editingKey: key});
    } else {
      return false
    }
  }

  // 点击保存之后处理的数据
  save(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.data];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });

        const newItemData = {...item, ...row};
        let monthPowers=this.state.monthPowers;
        let month=[];
        let monthPower=[];
        for(let key in monthPowers){
          month.push(getMonth(key));
          monthPower.push(monthPowers[key]);
        }
        const params = {
            year: newItemData.planYear,
            stationCodes: newItemData.stationCode,
            month: month,
            monthPower: monthPower,
            planPower: newItemData.planPower,
            yearPR:newItemData.yearPR,
          };
        month.length>0? this.props.editPlanInfo(params):'';
        this.setState({editingKey: '',monthPowers:{}});
      }
    });
  }


  componentWillReceiveProps(nextProps) {
    this._dealTableData(nextProps.planData)
  }

  _createTableColumn = () => {//生成表头
    const _this = this;

    function _MonthColumns() {
      let tabelKey = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      return tabelKey.map((item, index) => {
        return {
          title: index + 1 + '月',
          dataIndex: item,
          width: '40px',
          key: item,
          editable: true,
          render: (text, record, index) => {
            const textValue = text ? text : '--';
            const editable = _this.isEditing(record);
            return (
              <div>
                {
                  editable ? (
                      <Input defaultValue={textValue} disabled={false}/>) :
                    (<Input defaultValue={textValue} disabled={true}/>)
                }
              </div>
            )
          }
        }
      })
    };
    const MonthColumn = _MonthColumns();
    const columns = [
      {
        title: '区域',
        dataIndex: 'region',
        key: 'region',
        width: '50px',
        sorter: true,
      },
      {
        title: '电站名称',
        dataIndex: 'stationName',
        key: 'stationName',
        // width:'100px',
        defaultSortOrder: 'descend',
        sorter: true,
      },
      {
        title: '装机容量(MW)',
        dataIndex: 'stationCapacity',
        width: '80px',
        key: 'stationCapacity',
        sorter: true,
      },
      {
        title: '年份',
        dataIndex: 'planYear',
        key: 'planYear',
        // width:'50px',
        sorter: true,
      },
      {
        title: '年计划发电量(万kWh)',
        dataIndex: 'planPower',
        key: 'planPower',
        width: '130px',
        sorter: true,
      },
      {
        title: 'PR年计划',
        dataIndex: 'yearPR',
        key: 'yearPR',
        editable: true,
        render: text => {
          const textValue = text ? text : '--';
          return (<span><Input defaultValue={textValue} disabled={true}/>%</span>)
        }
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => {
          const editable = this.isEditing(record);
          return (
            <div>
              {editable ? (
                <span>
                  <EditableContext.Consumer>
                    {form => (
                      <a
                        href="javascript:;"
                        onClick={() => this.save(form, record.key)}
                        style={{marginRight: 8}}
                      >
                        保存
                      </a>
                    )}
                  </EditableContext.Consumer>
                </span>
              ) : (
                <a onClick={() => this.edit(record.key)}>编辑</a>
              )}
            </div>
          );
        },
      }];
    MonthColumn.unshift(5, 0);
    Array.prototype.splice.apply(columns, MonthColumn);
    const columnList = columns.map((col) => {
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
    return columnList
  };

  _dealTableData = (planData) => { //将12个月的数据分开
    let TabelKey = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    planData.map((list, index) => {
      for (let i = 0; i < 12; i++) {
        list[TabelKey[i]] = list.monthPlanPowers.planMonthGen[i]
      }
      function sum(arr) {
        return arr.reduce(function (prev, curr, idx, arr) {
          return Number(prev) + Number(curr);
        });
      }
      const planPower = sum(list.monthPlanPowers.planMonthGen);
      list.key = index;
      list.planPower = planPower;
    });
    this.setState({data: planData})
  };

  handlevaluechange = (row,month,value) => {
    let monthPowers=this.state.monthPowers;
    monthPowers[month]=value;
    this.setState({
      monthPowers:monthPowers
    });
    const newData = [...this.state.data];
    const index = newData.findIndex(item => row.key === item.key);
    if (index > -1) {
      const item = newData[index];
      newData.splice(index, 1, {
        ...item,
        ...row,
      });
    }
    this._dealTableData(newData)
  };


  render() {
    const {pageSize, pageNum, totalNum, loading, planData,} = this.props;
    const components = {
      body: {
        row: EditableFormRow,
        cell: (...rest) => {
          return <EditableCell {...rest[0]} handlevaluechange={this.handlevaluechange}/>
        },
      },
    };

    return (
      <div className={styles.planList}>
        <div className={styles.planListTop}>
          <Button className={styles.addplan} onClick={this.onPlanAdd}>
            <Icon type="plus"/>
            <span className={styles.text} >添加</span>
          </Button>
          <CommonPagination pageSize={pageSize} currentPage={pageNum} total={totalNum}
                            onPaginationChange={this.onPaginationChange}/>
        </div>
        <Table
          className={styles.tableList}
          loading={loading}
          pagination={false}
          components={components}
          dataSource={this.state.data}
          locale={{emptyText:<img width="223" height="164" src="/img/nodata.png" />}}
          columns={this._createTableColumn()}
        />
      </div>
    )
  }
}

export default PlanTable;
