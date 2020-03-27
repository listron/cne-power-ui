import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './planSide.scss';
import { Table, Input, Form, message, Icon } from 'antd';
import { getMonth } from "../plan";
import EditableCell from './EditableCell';
const FormItem = Form.Item;
const EditableContext = React.createContext();
import TableColumnTitle from '../../../../Common/TableColumnTitle';
import { numWithComma } from '../../../../../utils/utilFunc';
import CneTable from '@components/Common/Power/CneTable';

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);


class PlanAddTable extends React.Component {
  static propTypes = {
    showSidePage: PropTypes.string,
    addStationCodes: PropTypes.array,
    addPlanYear: PropTypes.string,
    save: PropTypes.string,
    prev: PropTypes.string,
    addValueChange: PropTypes.func,
    addplansave: PropTypes.func,
    stationType: PropTypes.number,
  };

  constructor(props) {
    super(props);
    this.state = {
      AddPlandata: []
    }
  }

  componentWillMount() {
    const { addStationCodes, addPlanYear } = this.props;
    this._dealTableData(addStationCodes, addPlanYear)
  }

  componentWillReceiveProps(nextProps) {
    nextProps.save === 'true' ? this.props.addplansave(this.state.AddPlandata) : '';
    nextProps.prev === 'true' ? this.props.addValueChange(this.state.AddPlandata) : '';
  }

  handleDelete = (key) => {   // 删除
    const AddPlandata = [...this.state.AddPlandata];
    this.setState({ AddPlandata: AddPlandata.filter(item => item.key !== key) });
  };

  _createTableColumn = () => {//生成表头
    const { stationType } = this.props;
    function _MonthColumns() {
      let tabelKey = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      return tabelKey.map((item, index) => {
        return {
          title: index + 1 + '月',
          dataIndex: item,
          width: '40px',
          key: item,
          className: 'month',
          editable: true,
          render: text => {
            return text ? text : '--';
          }
        }
      })
    }
    const MonthColumn = _MonthColumns();
    const PRColumn = stationType !== 0 ? {
      title: () => <TableColumnTitle title="PR年计划" unit="%" />,
      dataIndex: 'yearPR',
      key: 'yearPR',
      className: 'yearPR',
      editable: true,
    } : {};

    const columns = [
      {
        title: '区域',
        dataIndex: 'regionName',
        key: 'regionName',
        width: '50px',
        className: styles.regionName,
        render: text => {
          return text ? text : '--';
        }
      },
      {
        title: '电站名称',
        dataIndex: 'stationName',
        key: 'stationName',
        className: styles.stationName,
        defaultSortOrder: 'descend',
        render: text => {
          return text ? text : '--';
        }
      }, {
        title: () => <TableColumnTitle title="装机容量" unit="MW" />,
        dataIndex: 'stationCapacity',
        key: 'stationCapacity',
        className: styles.stationCapacity,
        render: text => {
          return text ? text : '--';
        }
      }, {
        title: '年份',
        dataIndex: 'planYear',
        key: 'planYear',
        className: styles.planYear,
        render: text => {
          return text ? text : '--';
        }
      }, {
        title: () => <TableColumnTitle title="年计划发电量" unit="万kWh" />,
        dataIndex: 'planPower',
        key: 'planPower',
        editable: true,
        className: styles.planPower,
        render: text => {
          const textValue = numWithComma(text);
          return <span className={text ? styles.save : ''}>{textValue}</span>
        }
      },
      ...MonthColumn,
      PRColumn,
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        className: styles.operation,
        render: (text, record) => {
          return (
            <span onClick={() => this.handleDelete(record.key)} className={styles.delete}><Icon type="close-circle"
              theme="outlined" /></span>
          );
        },
      }];
    const columnList = columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          dataIndex: col.dataIndex,
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
        const onGridYear = list.onGridTime.split('-')[0];
        const onGridMonth = list.onGridTime.split('-')[1];
        if (addPlanYear - onGridYear === 0) {
          AddPlanstaion.setGridTime = onGridMonth;
          for (let i = 0; i < Number(onGridMonth); i++) {
            AddPlanstaion[TabelKey[i]] = null;
          }
        }
      }
      AddPlanstaion.planPower = list.planPower;
      AddPlanstaion.key = index;
      AddPlanstaion.regionName = list.regionName;  //区域
      AddPlanstaion.stationName = list.stationName; //电站名称
      AddPlanstaion.stationCapacity = list.stationCapacity; //装机容量
      AddPlanstaion.planYear = addPlanYear; //  年份
      AddPlanstaion.stationCode = list.stationCode; // 电站编码

      return AddPlanstaion
    });

    this.setState({ AddPlandata: addPlanStations })
  };


  render() {
    const { AddPlandata } = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: (...rest) => {
          return (<EditableContext.Consumer>
            {form => {
              return <EditableCell form={form} {...rest[0]} valueChange={this.valueChange} />
            }}
          </EditableContext.Consumer>)
        },
      },
    };
    return (
      <CneTable
        components={components}
        rowClassName={() => 'editable-row'}
        pagination={false}
        dataSource={AddPlandata}
        columns={this._createTableColumn()}
        locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
      />
    );
  }
}

export default PlanAddTable;
