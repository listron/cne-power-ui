import React, { Component } from 'react';
import { Table, Button, Icon, Input, Form, message, Upload } from 'antd';
import CommonPagination from '../../../../Common/CommonPagination';
import PropTypes from 'prop-types';
import styles from './planMain.scss';
import { getDefectSortField, getDefaultMonth } from '../plan';
import WarningTip from '../../../../Common/WarningTip';
import EditableCell from './EditableCell';
import moment from 'moment';
import TableColumnTitle from '../../../../Common/TableColumnTitle';
import { numWithComma } from '../../../../../utils/utilFunc';
import path from '../../../../../constants/path';
const { APIBasePath, originUri } = path.basePaths;
const { system } = path.APISubPaths;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => {
  return (<EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>);
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
    stationCodes: PropTypes.array,
    sortField: PropTypes.string,
    sort: PropTypes.string,
    totalNum: PropTypes.number,
    downloading: PropTypes.bool,
    downLoadFile: PropTypes.func,
    planYear: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      editingKey: '',
      monthPowers: {},
      warningTipText: '是否放弃当前修改',
      showWarningTip: false,
      currentClickKey: '',
      importLoading: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    this._dealTableData(nextProps.planData);
  }

  onPlanAdd = () => {//进入添加计划页
    this.props.changePlanStore({ showPage: 'add' });
  };

  onPaginationChange = ({ currentPage, pageSize }) => {//分页器
    this.getPlanList({ pageNum: currentPage, pageSize });
  };

  getPlanList = (value) => {
    const { planYear, stationCodes, sortField, sort, pageNum, pageSize } = this.props;
    this.props.getPlanList({ planYear, stationCodes, sortField, sort, pageNum, pageSize, ...value });
  }


  tableChange = (pagination, filter, sorter) => {//计划排序 排序还有误
    const sortField = getDefectSortField(sorter.field);
    const ascend = sorter.order === 'ascend' ? '0' : '1' || '';
    if (sortField === '4') {
      return false;
    }
    this.getPlanList({ sortField, sortMethod: ascend });
  };

  isEditing = (record) => { // 是否可以编辑(一个电站)
    const currentYear = moment().year();
    if (currentYear - record.planYear <= 0) {
      return record.key === this.state.editingKey;
    }
  };

  edit(key) { // 如果存在编辑，则不允许其他操作
    const { editingKey } = this.state;
    this.setState({ currentClickKey: key });
    if (typeof editingKey !== 'string') {
      if (key === editingKey) {
        this.setState({ editingKey: key, showWarningTip: false });
      } else {
        this.setState({
          showWarningTip: true,
        });
      }
    } else {
      this.setState({ editingKey: key });
    }
  }

  // 点击保存之后处理的数据
  save(form, key) {
    form.validateFields((error, row) => {
      if (!error) {
        const { data } = this.state;
        let saveData = data.find(station => station.key === key);
        saveData = { ...saveData, ...row };
        const newData = data;
        newData.splice(key, 1, saveData);
        const month = [];
        const planMonthGens = saveData.planMonthGens.filter((e, index) => {
          if (e !== 'null') {
            month.push(index + 1);
          }
          return e !== 'null';
        });
        message.config({ top: 400, duration: 2, maxCount: 1 });
        const saveOK = planMonthGens.some(e => e === '');
        saveOK && message.warning('请填写完整之后再保存');
        if (!saveOK) {
          this.setState({ editingKey: '' });
          const params = {
            year: saveData.planYear,
            stationCode: saveData.stationCode,
            month: month,
            monthPower: planMonthGens,
            planPower: saveData.planPower,
            yearPR: saveData.yearPR || null,
          };
          this.props.changePlanStore({ planData: newData });
          this.props.editPlanInfo(params);
        }
      }
    });
  }

  _createTableColumn = () => {//生成表头
    const _this = this;
    const tabelKey = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const MonthColumn = tabelKey.map((item, index) => {
      return {
        title: index + 1 + '月',
        dataIndex: item,
        width: '40px',
        key: item,
        editable: true,
        className: 'month',
        render: (text, record, index) => {
          const textValue = text ? text : '--';
          const editable = _this.isEditing(record);
          return (
            <div> <Input defaultValue={textValue} disabled={editable ? false : true} placeholder="--" />  </div>
          );
        },
      };
    });

    const columns = [
      {
        title: '区域',
        dataIndex: 'regionName',
        key: 'regionName',
        width: '50px',
        className: styles.regionName,
        sorter: true,
        render: text => {
          return text ? text : '--';
        },
      }, {
        title: '电站名称',
        dataIndex: 'stationName',
        key: 'stationName',
        className: styles.stationNameBox,
        defaultSortOrder: 'descend',
        sorter: true,
        render: (text, record) => {
          const textValue = text ? text : '--';
          return <div title={record.stationName} className={styles.stationName}>{textValue}</div>;
        },
      }, {
        title: () => <TableColumnTitle title="装机容量" unit="MW" />,
        dataIndex: 'stationCapacity',
        key: 'stationCapacity',
        sorter: true,
        className: styles.stationCapacity,
        render(text) { return numWithComma(text); },
      }, {
        title: '年份',
        dataIndex: 'planYear',
        key: 'planYear',
        sorter: false, // 暂时不排序了
        className: styles.planYear,
      }, {
        title: () => <TableColumnTitle title="年计划发电量" unit="万kWh" />,
        dataIndex: 'planPower',
        key: 'planPower',
        className: styles.planPower,
        sorter: true,
        onCell: record => {
          return ({
            record,
            dataIndex: 'planPower',
            editing: this.isEditing(record),
          });
        },
        render: (text, record) => {
          const textValue = numWithComma(text);
          return <div className={this.isEditing(record) ? styles.save : ''}>{textValue}</div>;
        },
      },
      ...MonthColumn,
      {
        title: () => <TableColumnTitle title="PR年计划" unit="%" />,
        dataIndex: 'yearPR',
        key: 'yearPR',
        editable: true,
        className: 'yearPR',
        render: text => {
          const textValue = text ? text : '--';
          return (<span><Input defaultValue={textValue} disabled={true} /></span>);
        },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        className: styles.operation,
        render: (text, record) => {
          const editable = this.isEditing(record);
          const canEdit = moment().year() - record.planYear > 0;
          return (
            <div>
              {editable ? (
                <span>
                  <EditableContext.Consumer>
                    {form => (
                      <a href="javascript:;" className={styles.save}
                        onClick={() => this.save(form, record.key)}
                        style={{ marginRight: 8 }}
                      >
                        保存
                      </a>
                    )}
                  </EditableContext.Consumer>
                </span>
              ) : (<a onClick={() => this.edit(record.key)} className={canEdit ? styles.noEdit : styles.edit}>编辑</a>)}
            </div>
          );
        },
      }];

    const columnList = columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => {
          return ({
            record,
            dataIndex: col.dataIndex,
            title: record[col.dataIndex],
            editing: this.isEditing(record),
          });
        },
      };
    });
    return columnList;
  };

  _dealTableData = (planData) => { //将12个月的数据分开
    if (planData.length < 0) {
      return false;
    }
    const initPlanData = planData.map((list, index) => {
      for (let i = 0; i < 12; i++) {
        list[getDefaultMonth(i + 1)] = (list.planMonthGens && list.planMonthGens[i] === 'null' ? '--' : list.planMonthGens[i]) || ' ';
      }
      if (list.onGridTime) {
        const planYear = list.planYear; // 生产计划的年份
        const onGridYear = list.onGridTime.split('-')[0];
        if (planYear - onGridYear === 0) {
          list.setGridTime = list.onGridTime.split('-')[1];
        }
      }
      list.key = index;
      return list;
    });
    this.setState({ data: initPlanData });
  };


  cancelWarningTip = () => {
    this.setState({
      showWarningTip: false,
    });
  };

  confirmWarningTip = () => {
    this.setState({ showWarningTip: false });
    const { currentClickKey } = this.state;
    this.setState({ editingKey: currentClickKey }, () => {
      this.edit(currentClickKey);
    });
  };


  beforeUpload = (file) => { // 上传前的校验
    const validType = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']; // 暂时不兼容xls : 'application/vnd.ms-excel'
    const validFile = validType.includes(file.type);
    if (!validFile) {
      message.error('只支持上传excel文件!');
    }
    return !!validFile;
  }

  render() {
    const { pageSize, pageNum, totalNum, loading, planYear } = this.props;
    const { showWarningTip, warningTipText, data } = this.state;
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
    const authData = localStorage.getItem('authData') || '';
    const uploadProps = {
      name: 'file',
      action: `${APIBasePath}${system.importPlan}`,
      headers: { 'Authorization': 'bearer ' + authData },
      beforeUpload: this.beforeUpload,
      data: { year: planYear },
      showUploadList: false,
      onChange: (info) => {
        if (info.file.status === 'uploading') {
          this.setState({ importLoading: true });
        }
        if (info.file.status === 'done') {
          if (info.file.response.code === '10000') {
            message.success(`${info.file.name} 导入完成`);
            this.getPlanList();
          } else {
            message.error(`${info.file.name} 导入失败，请重新导入.`);
          }
          this.setState({ importLoading: false });
        }
        if (info.file.status === 'error') {
          message.error(`${info.file.name} 导入失败，请重新导入.`);
          this.setState({ importLoading: false });
        }
      },
    };
    const downloadHref = `${originUri}/template/proplan.xlsx`;
    return (
      <div className={styles.planList}>
        {showWarningTip &&
          <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={warningTipText} />}
        <div className={styles.planListTop}>
          <div className={styles.buttons}>
            <Button className={styles.addplan} onClick={this.onPlanAdd}>
              <Icon type="plus" />
              <span className={styles.text}>添加</span>
            </Button>
            {/*
            <Upload {...uploadProps} className={styles.importUser}>
              <Button type={'default'} loading={this.state.importLoading} >批量导入</Button>
            </Upload>
            <Button href={downloadHref} download={downloadHref} target="_blank" >导入下载模版</Button>
            */}
          </div>
          <CommonPagination pageSize={pageSize} currentPage={pageNum} total={totalNum} onPaginationChange={this.onPaginationChange} />
        </div>
        <Table
          className={styles.tableList}
          loading={loading}
          pagination={false}
          components={components}
          dataSource={data}
          onChange={this.tableChange}
          locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
          columns={this._createTableColumn()}
        />
      </div>
    );
  }
}

export default PlanTable;
