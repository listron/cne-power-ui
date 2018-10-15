import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styles from './planSide.scss';
import {Table, Input, Button, DatePicker, Icon, Select, Form} from 'antd';

const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({form, index, ...props}) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    editing: false,
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({editing}, () => {
      if (editing) {
        this.input.focus();
      }
    });
  }

  handleClickOutside = (e) => {
    const {editing} = this.state;
    if (editing && this.cell !== e.target && !this.cell.contains(e.target)) {
      this.save();
    }
  }

  save = () => {
    const {record, handleSave} = this.props;
    this.form.validateFields((error, values) => {
      if (error) {
        return;
      }
      this.toggleEdit();
      handleSave({...record, ...values});
    });
  }

  render() {
    const {editing} = this.state;
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      ...restProps
    } = this.props;
    return (
      <td ref={node => (this.cell = node)} {...restProps}>
        {editable ? (
          <EditableContext.Consumer>
            {(form) => {
              this.form = form;
              return (
                editing ? (
                  <FormItem style={{margin: 0}}>
                    {form.getFieldDecorator(dataIndex, {
                      rules: [{
                        required: true,
                        message: `${title} is required.`,
                      }],
                      initialValue: record[dataIndex],
                    })(
                      <Input
                        ref={node => (this.input = node)}
                        onPressEnter={this.save}
                      />
                    )}
                  </FormItem>
                ) : (
                  <div
                    className="editable-cell-value-wrap"
                    style={{paddingRight: 24}}
                    onClick={this.toggleEdit}
                  >
                    {restProps.children}
                  </div>
                )
              );
            }}
          </EditableContext.Consumer>
        ) : restProps.children}
      </td>
    );
  }
}



class PlanAddTable extends React.Component {

  static propTypes = {
    showSidePage: PropTypes.string,
    addStationCodes: PropTypes.array,
    addPlanYear: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      AddPlandata:{}
    };
  }

  // 删除的时候
  handleDelete = (key) => {
    const AddPlandata = [...this.state.AddPlandata];
    this.setState({AddPlandata: AddPlandata.filter(item => item.key !== key)});
  };


  handleSave = (row) => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({dataSource: newData});
  }

  componentWillReceiveProps(nextProps) {
    this._dealTableData(nextProps.addStationCodes, nextProps.addPlanYear)
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
          render: text => {
            const textValue = text ? text : '--';
            return <Input defaultValue={textValue} disabled={false}/>
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
      },
      {
        title: '电站名称',
        dataIndex: 'stationName',
        key: 'stationName',
        // width:'100px',
        defaultSortOrder: 'descend',
      },
      {
        title: '装机容量(MW)',
        dataIndex: 'stationCapacity',
        width: '80px',
        key: 'stationCapacity',
      },
      {
        title: '年份',
        dataIndex: 'planYear',
        key: 'planYear',
        // width:'50px',
      },
      {
        title: '年计划发电量(万kWh)',
        dataIndex: 'planPower',
        key: 'planPower',
        width: '130px',
        render: text => {
          return text ? text : '--';
        }
      },
      {
        title: 'PR年计划',
        dataIndex: 'yearPR',
        key: 'yearPR',
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
          return (
            <a onClick={() => this.handleDelete(record.key)}>删除</a>
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
        }),
      };
    });
    return columnList
  };

  _dealTableData = (addStationCodes, addPlanYear) => { //将12个月的数据分开
    let TabelKey = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const addPlanStations=addStationCodes.map((list, index) => {
      const AddPlanstaion={};
      if (list.onGridTime) {
        //  有了并网时间
        AddPlanstaion.planPower = list.planPower;
        for (let i = 0; i < 12; i++) {
          AddPlanstaion[TabelKey[i]] = list.monthPlanPowers.planMonthGen[i]
        }
      }
      AddPlanstaion.region = list.regionName;  //区域
      AddPlanstaion.stationName = list.stationName; //电站名称
      AddPlanstaion.stationCapacity = list.stationCapacity; //装机容量
      AddPlanstaion.planYear=addPlanYear; //  年份
      return AddPlanstaion

      // // 计算年计划发电量
      // function sum(arr) {
      //   return arr.reduce(function (prev, curr, idx, arr) {
      //     return Number(prev) + Number(curr);
      //   });
      // }
      //
      // const planPower = sum(list.monthPlanPowers.planMonthGen);
      // list.key = index;
      // list.planYear = addPlanYear;
      // list.planPower = planPower;
    });

    this.setState({AddPlandata: addPlanStations})
    return addPlanStations
    // console.log(12323,addPlanStations)

  };

  render() {
    const {addStationCodes, addPlanYear} = this.props;
    const {AddPlandata}=this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    console.log(addStationCodes, addPlanYear);
    // this._dealTableData(addStationCodes,addPlanYear);
    return (
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        pagination={false}
        dataSource={AddPlandata}
        columns={this._createTableColumn()}
      />
    );
  }
}

export default PlanAddTable;
