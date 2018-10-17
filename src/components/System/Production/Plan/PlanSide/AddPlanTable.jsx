import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styles from './planSide.scss';
import {Table, Input, Form, message, Icon} from 'antd';
import {getMonth} from "../plan";

const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({form, index, ...props}) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  static propTypes = {
    dataIndex: PropTypes.string,
    record: PropTypes.object,
  };
  getInput = (form) => {
    const {dataIndex, record} = this.props;
    if (record.onGridTime) {
      if (getMonth(dataIndex) < Number(record.onGridTime)) {
        return <Input disabled={true} placeholder="--"/>
      } else {
        return <Input onBlur={(e) => this.valueChange(e, form, dataIndex, record)} placeholder="--"/>;
      }
    } else {
      return <Input onBlur={(e) => this.valueChange(e, form, dataIndex, record)} placeholder="--"/>;
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
      const index = getMonth(dataIndex) - 1;
      record.monthPower[index] = number;
      record[dataIndex] = number;

      function sum(arr) {
        return arr.reduce(function (prev, curr, idx, arr) {
          return Number(prev) + Number(curr);
        });
      }

      record.planPower = sum(record.monthPower);
      this.props.handlevaluechange(record)
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

class PlanAddTable extends React.Component {

  static propTypes = {
    showSidePage: PropTypes.string,
    addStationCodes: PropTypes.array,
    addPlanYear: PropTypes.string,
    save: PropTypes.string,
    addValueChange: PropTypes.func,
    addplansave: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      AddPlandata: []
    }
  }

  componentWillMount() {
    const {addStationCodes, addPlanYear} = this.props;
    this._dealTableData(addStationCodes, addPlanYear)
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.save === nextProps.save) {
      return false
    }
    nextProps.save === 'true' ? this.props.addplansave(this.state.AddPlandata) : '';
  }

  // 删除的时候
  handleDelete = (key) => {
    const AddPlandata = [...this.state.AddPlandata];
    this.setState({AddPlandata: AddPlandata.filter(item => item.key !== key)});
  };

  handlevaluechange = (row) => {
    const newData = [...this.state.AddPlandata];
    const index = newData.findIndex(item => row.key === item.key);
    if (index > -1) {
      const item = newData[index];
      newData.splice(index, 1, {
        ...item,
        ...row,
      });
    }
    this.setState({AddPlandata: newData});
    this.props.addValueChange("change"); // 数据是否修改
  };

  yearPRChange = (e, row) => {//PR 数据修改
    const number = e.target.value;
    if (isNaN(number)) {
      message.warning('只可以填写数字,可精确到小数点后两位');
      row.yearPR = "";
      return false;
    } else {
      row.yearPR = number;
    }
    this.handlevaluechange(row)
  };

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
          className:'month',
          editable: true,
          render: text => {
            return text ? text : '--';
          }
        }
      })
    };
    const MonthColumn = _MonthColumns();
    const columns = [
      {
        title: '区域',
        dataIndex: 'regionName',
        key: 'regionName',
        width: '50px',
        className:styles.regionName,
        render: text => {
          return text ? text : '--';
        }
      },
      {
        title: '电站名称',
        dataIndex: 'stationName',
        key: 'stationName',
        className:styles.stationName,
        defaultSortOrder: 'descend',
        render: text => {
          return text ? text : '--';
        }
      },
      {
        title: '装机容量(MW)',
        dataIndex: 'stationCapacity',
        key: 'stationCapacity',
        className:styles.stationCapacity,
        render: text => {
          return text ? text : '--';
        }
      },
      {
        title: '年份',
        dataIndex: 'planYear',
        key: 'planYear',
        className:styles.planYear,
        render: text => {
          return text ? text : '--';
        }
      },
      {
        title: '年计划发电量(万kWh)',
        dataIndex: 'planPower',
        key: 'planPower',
        className:styles.planPower,
        render: text => {
          var textValue=text ? Number(text).toFixed(4) : '--';
          return <span className={text ? styles.save:''}>{textValue}</span>
        }
      },
      {
        title: 'PR年计划',
        dataIndex: 'yearPR',
        key: 'yearPR',
        className:'yearPR',
        render: (text, record) => {
          return (<span><Input defaultValue={record.yearPR} onBlur={(e) => this.yearPRChange(e, record)} placeholder="--" />%</span>)
        }
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        className:styles.operation,
        render: (text, record) => {
          return (
            <span onClick={() => this.handleDelete(record.key)} className={styles.delete}><Icon type="close-circle" theme="outlined"/></span>
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
          editing: col.editable
        }),
      };
    });
    return columnList
  };


  _dealTableData = (addStationCodes, addPlanYear) => { //将12个月的数据分开
    let TabelKey = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const addPlanStations = addStationCodes.map((list, index) => {
      const AddPlanstaion = {};
      AddPlanstaion.monthPower = []; //1-12月每月的计划发电量
      if (list.onGridTime) {//  有了并网时间
        const onGridMonth = list.onGridTime.split('-')[1];
        AddPlanstaion.onGridTime = onGridMonth;
        AddPlanstaion.planPower = list.planPower;
        for (let i = 0; i < Number(onGridMonth); i++) {
          AddPlanstaion[TabelKey[i]] = null;
        }
        // AddPlanstaion.monthPower=list.planMonthGen;
        // AddPlanstaion.planPower = sum(list.planMonthGen);
      }
      AddPlanstaion.key = index;
      AddPlanstaion.regionName = list.regionName;  //区域
      AddPlanstaion.stationName = list.stationName; //电站名称
      AddPlanstaion.stationCapacity = list.stationCapacity; //装机容量
      AddPlanstaion.planYear = addPlanYear; //  年份
      AddPlanstaion.stationCode = list.stationCode; // 电站编码
      return AddPlanstaion
    });

    this.setState({AddPlandata: addPlanStations})
  };

  render() {
    const {AddPlandata} = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: (...rest) => {
          return <EditableCell {...rest[0]} handlevaluechange={this.handlevaluechange}/>
        },
      },
    };
    return (
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        pagination={false}
        dataSource={AddPlandata}
        columns={this._createTableColumn()}
        locale={{emptyText: <img width="223" height="164" src="/img/nodata.png"/>}}
      />
    );
  }
}

export default PlanAddTable;
