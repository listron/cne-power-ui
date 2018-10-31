import React, {Component} from 'react';
import {Table, Button, Select, Icon, Popover, Input, Form, message} from 'antd';
import CommonPagination from '../../../../Common/CommonPagination';
import PropTypes from 'prop-types';
import styles from './planMain.scss';
import {getMonth, getDefectSortField, getDefaultMonth} from '../plan';
import WarningTip from '../../../../Common/WarningTip';
import EditableCell from './EditableCell';

const {Option} = Select;
const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({form, index, ...props}) => {
  return (<EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>)
};
const EditableFormRow = Form.create()(EditableRow);

class PlanTable extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    changeDepartmentStore: PropTypes.func,
    planData: PropTypes.array,
    getPlanList: PropTypes.func,
    editPlanInfo: PropTypes.func,
    changePlanStore: PropTypes.func,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    stationCodes: PropTypes.number,
    sortField:PropTypes.string,
    sort:PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      editingKey: '',
      monthPowers: {},
      warningTipText: '是否放弃当前修改',
      showWarningTip: false,
      currentClickKey: ''
    };
  }

  componentWillReceiveProps(nextProps) {
    this._dealTableData(nextProps.planData)
  }

  onPlanAdd = () => {//进入添加计划页
    this.props.changePlanStore({showPage: 'add'});
  };

  onPaginationChange = ({currentPage, pageSize}) => {//分页器
    this.props.getPlanList({
      year: this.props.planYear, // 年份 默认是当前年
      stationCodes: this.props.stationCodes, // 电站编码
      sortField: this.props.sortField, // 1:区域 2：电站名称 3:装机容量 4:年份 5: 年计划发电量
      sortMethod: this.props.sort, //排序 => 'field,0/1'field代表排序字段，0升序,1降序
      pageNum: currentPage,
      pageSize
    })
  };


  tableChange = (pagination, filter, sorter) => {//计划排序 排序还有误
    const sortField = getDefectSortField(sorter.field);
    const ascend = sorter.order === 'ascend' ? '0' : '1' || '';
    // console.log("计划排序", pagination, sortField, ascend);
    if(sortField==='4'){
      return false
    }else{
      this.props.getPlanList({
        year: this.props.planYear, // 年份 默认是当前年
        stationCodes: this.props.stationCodes, // 电站编码
        sortField, // 1:区域 2：电站名称 3:装机容量 4:年份 5: 年计划发电量
        sortMethod: ascend, //排序 => 'field,0/1'field代表排序字段，0升序,1降序
        pageNum: this.props.pageNum,
        pageSize: this.props.pageSize
      })
    }
  };
  
  isEditing = (record) => { // 是否可以编辑
    const currentYear = new Date().getFullYear();
    if (currentYear - record.planYear <= 0) {
      return record.key === this.state.editingKey;
    }
  };

  // 编辑
  edit(key) { // 如果存在编辑，则不允许其他操作
    const {editingKey} = this.state;
    this.setState({currentClickKey: key});
    if (typeof editingKey !== "string") {
      if (key === editingKey) {
        this.setState({editingKey: key, showWarningTip: false});
      } else {
        this.setState({
          showWarningTip: true,
        });
      }
    } else {
      this.setState({editingKey: key});
    }
  }

  // 点击保存之后处理的数据
  save(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const { data } = this.state;
      //1. const newData = data.map(station => {
      //   if(station.key === key){
      //     return { ...station, ...row }
      //   }else{
      //     return station
      //   }
      // })

      //2. let saveData = data.find(station => station.key === key)
      // saveData = { ...saveData, ...row };
      
      const newData = [...this.state.data];
      const index = newData.find(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });

        const newItemData = {...item, ...row};
        let monthPowers = this.state.monthPowers;
        let month = [];
        let monthPower = [];

        for (let key in monthPowers) {
          month.push(getMonth(key));
          monthPower.push(monthPowers[key]);
        }
        const params = {
          year: newItemData.planYear,
          stationCode: newItemData.stationCode,
          month: month,
          monthPower: monthPower,
          planPower: newItemData.planPower,
          yearPR: newItemData.yearPR,
        };
        this.props.editPlanInfo(params);
        this.setState({editingKey: '', monthPowers: {}});
      }
    });
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
          className: "month",
          render: (text, record, index) => {
            const textValue = text ? text : '--';
            const editable = _this.isEditing(record);
            return (
              <div>
                {
                  editable ? (
                      <Input defaultValue={textValue} disabled={false} placeholder="--" />) :
                    (<Input defaultValue={textValue} disabled={true} placeholder="--" />)
                }
              </div>
            )
          }
        }
      })
    }
    const MonthColumn = _MonthColumns();
    const columns = [
      {
        title: '区域',
        dataIndex: 'regionName',
        key: 'regionName',
        width: '50px',
        className: styles.regionName,
        sorter: true,
        render: text => {
          return text ? text : '--'
        }
      },
      {
        title: '电站名称',
        dataIndex: 'stationName',
        key: 'stationName',
        className: styles.stationNameBox,
        defaultSortOrder: 'descend',
        sorter: true,
        render: (text, record) => {
          const textValue = text ? text : '--';
          return <div title={record.stationName} className={styles.stationName}>{textValue}</div>
        }
      },
      {
        title: '装机容量(MW)',
        dataIndex: 'stationCapacity',
        // width: '80px',
        key: 'stationCapacity',
        sorter: true,
        className: styles.stationCapacity,
      },
      {
        title: '年份',
        dataIndex: 'planYear',
        key: 'planYear',
        sorter: false, // 暂时不排序了
        className: styles.planYear
      },
      {
        title: '年计划发电量(万kWh)',
        dataIndex: 'planPower',
        key: 'planPower',
        className: styles.planPower,
        sorter: true,
        onCell: record =>{
          return ({
            record,
            dataIndex: 'planPower',
            title: '年计划发电量(万kWh)',
            editing: this.isEditing(record),
          })
        },
        render: (text, record) => {
          const textValue = text ? text : '--';
          return <div className={this.isEditing(record) ? styles.save : ""}>{textValue}</div>
        }
      },
      {
        title: 'PR年计划',
        dataIndex: 'yearPR',
        key: 'yearPR',
        editable: true,
        className: "yearPR",
        render: text => {
          const textValue = text ? text : '--';
          return (<span><Input defaultValue={textValue} disabled={true}/>%</span>)
        }
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        className: styles.operation,
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
                        className={styles.save}
                        onClick={() => this.save(form, record.key)}
                        style={{marginRight: 8}}
                      >
                        保存
                      </a>
                    )}
                  </EditableContext.Consumer>
                </span>
              ) : (
                <a onClick={() => this.edit(record.key)} className={styles.edit}>编辑</a>
              )}
            </div>
          );
        },
      }];
    MonthColumn.unshift(5, 0);
    Array.prototype.splice.apply(columns, MonthColumn);
    let columnList = columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record =>{
          return ({
            record,
            dataIndex: col.dataIndex,
            title: record[col.dataIndex],
            editing: this.isEditing(record),
          })
        }
      };
    });
    return columnList;
  };

  _dealTableData = (planData) => { //将12个月的数据分开
    if (planData.length < 0) {
      return false
    }
    let initPlanData = planData.map((list, index) => {
      for (let i = 0; i < 12; i++) {
        list[getDefaultMonth(i + 1)] = (list.planMonthGens && list.planMonthGens[i] === "null" ? "--" : list.planMonthGens[i]) || " "
      }
      if (list.onGridTime) {
        const planYear = list.planYear;  // 生产计划的年份
        const onGridYear = list.onGridTime.split('-')[0];
        if (planYear - onGridYear === 0) {
          list.setGridTime = list.onGridTime.split('-')[1];
        }
      }
      list.key = index;
      return list;
    });
    this.setState({data: initPlanData})
  };

  // handlevaluechange = (row, month, value, type) => {
  //   if (type === 'month') {
  //     let initMonthValue = this.state.monthPowers;
  //     initMonthValue[month] = value;
  //     this.setState({
  //       monthPowers: initMonthValue
  //     });
  //   }
  //   const newData = [...this.state.data];
  //   const index = newData.findIndex(item => row.key === item.key);
  //   if (index > -1) {
  //     const item = newData[index];
  //     newData.splice(index, 1, {
  //       ...item,
  //       ...row,
  //     });
  //   }
  //   this.setState({data: newData})
  // };

  cancelWarningTip = () => {
    this.setState({
      showWarningTip: false,
    })
  };

  confirmWarningTip = () => {
    this.setState({showWarningTip: false});
    const {currentClickKey} = this.state;
    this.setState({editingKey: currentClickKey}, () => {
      this.edit(currentClickKey);
    });
  };

  render() {
    const {pageSize, pageNum, totalNum, loading, planData,} = this.props;
    const {showWarningTip, warningTipText} = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: (...rest) => {
          return (<EditableContext.Consumer>
            {form => {
              return <EditableCell form={form} {...rest[0]} handlevaluechange={this.handlevaluechange}/>
            }}
          </EditableContext.Consumer>)
        },
      },
    };
    return (
      <div className={styles.planList}>
        {showWarningTip &&
        <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={warningTipText}/>}
        <div className={styles.planListTop}>
          <Button className={styles.addplan} onClick={this.onPlanAdd}>
            <Icon type="plus"/>
            <span className={styles.text}>添加</span>
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
          onChange={this.tableChange}
          locale={{emptyText: <img width="223" height="164" src="/img/nodata.png"/>}}
          columns={this._createTableColumn()}
        />
      </div>
    )
  }
}

export default PlanTable;
