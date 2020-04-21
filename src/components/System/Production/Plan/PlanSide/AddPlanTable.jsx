import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './planSide.scss';
import { Input, Form, Icon } from 'antd';
import EditableCell from './EditableCell';
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


class PlanAddTable extends Component {
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
      AddPlandata: [],
    };
  }

  componentWillMount() {
    const { addStationCodes, addPlanYear } = this.props;
    this._dealTableData(addStationCodes, addPlanYear);
  }

  componentWillReceiveProps(nextProps) {
    nextProps.save === 'true' ? this.props.addplansave(this.state.AddPlandata) : '';
    nextProps.prev === 'true' ? this.props.addValueChange(this.state.AddPlandata) : '';
  }

  handleDelete = (key) => { // 删除
    const AddPlandata = [...this.state.AddPlandata];
    this.setState({ AddPlandata: AddPlandata.filter(item => item.key !== key) });
  };

  _createTableColumn = () => { // 生成表头
    const { stationType } = this.props;
    function _MonthColumns() {
      const tabelKey = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      return tabelKey.map((item, index) => {
        return {
          title: index + 1 + '月',
          dataIndex: item,
          key: item,
          className: 'month',
          editable: true,
          width: '4.5%',
          textAlign: 'center',
        };
      });
    }
    const MonthColumn = _MonthColumns();
    const baseColumn = [
      {
        title: '区域',
        dataIndex: 'regionName',
        key: 'regionName',
        width: '4.5%',
        textAlign: 'left',
        render: text => <div className={styles.regionNameText} title={text || '--'}>{text || '--'}</div>,
      },
      {
        title: '电站名称',
        dataIndex: 'stationName',
        key: 'stationName',
        width: '8.5%',
        textAlign: 'left',
        render: (text, record) => {
          return <div title={text || '--'} className={styles.stationNameText} title={text || '--'}>{text || '--'}</div>;
        },
      },
      {
        title: () => <TableColumnTitle title="装机容量" unit="MW" />,
        dataIndex: 'stationCapacity',
        key: 'stationCapacity',
        width: '7.5%',
        textAlign: 'right',
        render: (text) => <div title={numWithComma(text)} className={styles.stationCapacityText}>{numWithComma(text)}</div>,
      },
      {
        title: '年份',
        dataIndex: 'planYear',
        key: 'planYear',
        width: '5%',
        textAlign: 'center',
      },
      {
        title: () => <TableColumnTitle title="年计划发电量" unit="万kWh" />,
        dataIndex: 'planPower',
        key: 'planPower',
        editable: true,
        width: '9%',
        textAlign: 'right',
        render: text => {
          const textValue = numWithComma(text);
          return <span className={text ? styles.save : ''}>{textValue}</span>;
        },
      },
      ...MonthColumn,
    ];
    const opearteColumn = {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      width: '5%',
      textAlign: 'center',
      render: (text, record) => {
        return (
          <span onClick={() => this.handleDelete(record.key)} className={styles.delete}>
            <Icon type="close-circle" theme="outlined" />
          </span>
        );
      },
    };

    const columns = stationType !== 0 && [
      ...baseColumn,
      {
        title: () => <TableColumnTitle title="PR年计划" unit="%" />,
        dataIndex: 'yearPR',
        key: 'yearPR',
        className: 'yearPR',
        editable: true,
        width: '6%',
        textAlign: 'center',
      },
      opearteColumn,
    ] || [...baseColumn, opearteColumn];

    const columnList = columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          dataIndex: col.dataIndex,
          editing: col.editable,
        }),
      };
    });
    return columnList;
  };


  _dealTableData = (addStationCodes, addPlanYear) => { //将12个月的数据分开
    const TabelKey = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
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
      AddPlanstaion.regionName = list.regionName; //区域
      AddPlanstaion.stationName = list.stationName; //电站名称
      AddPlanstaion.stationCapacity = list.stationCapacity; //装机容量
      AddPlanstaion.planYear = addPlanYear; //  年份
      AddPlanstaion.stationCode = list.stationCode; // 电站编码

      return AddPlanstaion;
    });

    this.setState({ AddPlandata: addPlanStations });
  };


  render() {
    const { AddPlandata } = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: (...rest) => {
          return (<EditableContext.Consumer>
            {form => {
              return <EditableCell form={form} {...rest[0]} valueChange={this.valueChange} />;
            }}
          </EditableContext.Consumer>);
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
      />
    );
  }
}

export default PlanAddTable;
