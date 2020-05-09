import React from 'react';
import PropTypes from 'prop-types';
import styles from './inspect.scss';
import { Table, Select, Tooltip, Radio } from 'antd';
import CommonPagination from '../../../Common/CommonPagination/index';
import WarningTip from '../../../Common/WarningTip/index';
import { handleRight } from '@utils/utilFunc';
import CneTable from '../../../Common/Power/CneTable';
import CneButton from '../../../Common/Power/CneButton/';
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
class InspectTable extends React.Component {
  static propTypes = {
    getInspectList: PropTypes.func,
    setInspectCheck: PropTypes.func,
    changeStore: PropTypes.func,
    total: PropTypes.number,
    theme: PropTypes.string,
    tableLoading: PropTypes.bool,
    params: PropTypes.object,
    inspectStatusStatistics: PropTypes.object,
    selectedRowKeys: PropTypes.array,
    inspectList: PropTypes.array,
    location: PropTypes.object,
    history: PropTypes.object,
  }
  constructor(props, context) {
    super(props, context);
    this.state = {

      currentSelectedStatus: 5,
      showWarningTip: false,
      warningTipText: '确认全部验收吗?',
    };
  }
  onHandle = (value) => {
    if (value === 'check') {
      this.setState({
        showWarningTip: true,
      });
    }
  }
  cancelWarningTip = () => {
    this.setState({
      showWarningTip: false,
    });
  }
  confirmWarningTip = () => {
    const { params } = this.props;
    this.setState({
      showWarningTip: false,
    });

    this.props.setInspectCheck({
      inspectId: this.props.selectedRowKeys.join(','),
      params,
    });

  }
  onChangeTab = (e) => {
    this.getListData({
      status: e.target.value,
      pageNum: 1,
      pageSize: 10,
    });
    this.props.changeStore({ selectedRowKeys: [] });
  }

  onPaginationChange = ({ currentPage, pageSize }) => {
    this.getListData({
      pageSize,
      pageNum: currentPage,
    });
  }

  onChangeTable = (pagination, filter, sorter) => { // 表格排序&&表格重新请求数据
    const { params } = this.props;
    const { order, field } = sorter;
    const { sort } = params;
    const [sortField, sortMethod] = sort.split(',');
    const orderFile = {
      inspectName: '0',
      stationName: '1',
      startTime: '2',
      checkTime: '6',
      inspectStatus: '4',
    };
    let newSortField = sortField, newSortMethod = 0;
    if (!field || orderFile[field] === newSortField) {
      newSortMethod = `${sortMethod}` === '1' ? 0 : 1;
    } else {
      newSortField = orderFile[field];
    }
    this.getListData({ sort: `${newSortField},${newSortMethod}` });
  }


  onSelectChange = (selectedRowKeys, selectedRows) => {
    const inspectArr = selectedRows.map(e => (e.inspectStatus));
    const filterStatus = new Set(inspectArr);//当且仅当只有一种待验收的状态时，方可验收
    if (filterStatus.size === 1 && filterStatus.has('3')) {
      this.setState({
        currentSelectedStatus: '3',
      });
    } else {
      this.setState({
        currentSelectedStatus: false,
      });
    }
    this.props.changeStore({ selectedRowKeys });
  }
  cancelRowSelect = () => {
    this.props.changeStore({
      selectedRowKeys: [],
    });
  }
  getListData = (value) => {
    const { getInspectList, params } = this.props;

    getInspectList({
      ...params,
      ...value,
    });
  }
  onShowDetail = (inspectId) => {
    const { location, history } = this.props;
    const { pathname } = location;
    history.push(`${pathname}?page=inspectDeatail&inspectId=${inspectId}`);
  }

  render() {
    const { selectedRowKeys = [], params = {}, total, tableLoading, theme, inspectList, inspectStatusStatistics } = this.props;
    const { pageSize = 10, pageNum = 1, status, sort } = params;
    const { executeNum, checkNum } = inspectStatusStatistics;
    const { currentSelectedStatus, showWarningTip, warningTipText } = this.state;
    const curInspectStatus = { '0': '待提交', '1': '待审核', '2': '执行中', '3': '待验收', '4': '已完成' };
    const unselected = selectedRowKeys.length === 0;
    const checkInspectRight = handleRight('workExamine_inspection_check');
    const [sortField, sortMethod] = sort.split(',');


    const columns = [{
      title: '巡检名称',
      dataIndex: 'inspectName',
      sorter: true,
      textAlign: 'left',
      width: '12%',
      className: styles.inspectName,
      render: (text, record) => {
        return <div className={styles.nameWidth} title={text}>{text}</div>;
      },
    }, {
      title: '电站名称',
      dataIndex: 'stationName',
      sorter: true,
      textAlign: 'left',
      width: '12%',
      className: styles.inspectName,
      render: (text, record) => {
        return <div className={styles.nameWidth} title={text}>{text}</div>;
      },
    }, {
      title: '工单描述',
      dataIndex: 'deviceTypeName',
      textAlign: 'left',
      width: '22%',
      className: styles.desc,
      render: (text, record) => {
        return <div className={styles.inspectDesc} title={text}>{text}</div>;
      },
    }, {
      title: '缺陷数目',
      dataIndex: 'defectNum',
      textAlign: 'right',
      width: '7%',
      render: (text, record) => {
        return <div className={styles.defectNum} title={text}>{text}</div>;
      },
    }, {
      title: '发生时间',
      dataIndex: 'startTime',
      sorter: true,
      width: '13%',
      textAlign: 'center',
      render: (text, record) => {
        return <div className={styles.textWidth} title={text}>{text}</div>;
      },
    }, {
      title: '完成时间',
      dataIndex: 'checkTime',
      width: '13%',
      textAlign: 'center',
      render: (text, record) => {
        return <div className={styles.textWidth} title={text}>{text ? text : '--'}</div>;
      },
      sorter: true,
    }, {
      title: '状态',
      dataIndex: 'inspectStatus',
      sorter: true,
      width: '10%',
      textAlign: 'left',
      render: (value, record, index) => (
        <div className={styles.inspectStatus} >
          <span>{curInspectStatus[value]}</span>
          <div className={styles.warning} >
            {record.isOvertime === '0' ? <div className={styles.overTime}>超时</div> : null}
          </div>
        </div>
      ),
    }, {
      title: '查看',
      width: '6%',
      textAlign: 'center',
      render: (text, record) => <i className={`iconfont icon-look ${styles.lookStyle}`} onClick={() => { this.onShowDetail(record.inspectId); }} />,
    }];
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <div className={`${styles.inspectTable} ${styles[theme]}`}>
        {showWarningTip && <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={warningTipText} />}
        <div className={`${styles.statusGroup}`}>
          <div className={styles.text}><span>状</span><span>态</span></div>
          <RadioGroup onChange={this.onChangeTab} value={status}>
            <RadioButton value="5">全部</RadioButton>
            <RadioButton value="2">{`执行中  ${(executeNum || executeNum === 0) ? executeNum : ''}`}</RadioButton>
            <RadioButton value="3">{`待验收  ${(checkNum || checkNum === 0) ? checkNum : ''}`}</RadioButton>
            <RadioButton value="4">{'已完成'}</RadioButton>
          </RadioGroup>
        </div>
        <span ref={'wrap'} />
        <div className={styles.action}>
          <div className={styles.buttonArea}>
            {checkInspectRight && <Select
              onChange={this.onHandle}
              value="操作"
              placeholder="操作"
              getPopupContainer={() => this.refs.wrap}
              dropdownMatchSelectWidth={false}
              dropdownClassName={styles.handleDropdown}>
              <Option value="check" disabled={unselected || currentSelectedStatus !== '3'}>
                <i className="iconfont icon-done"></i>验收</Option>
            </Select>}
            {checkInspectRight && <Tooltip overlayStyle={{ width: 220, maxWidth: 220, fontSize: '12px' }} placement="top" title="请选择同一状态下的列表项，进行操作">
              <i className="iconfont icon-help" />
            </Tooltip>}
          </div>
          <CommonPagination total={total} pageSize={pageSize} currentPage={pageNum} onPaginationChange={this.onPaginationChange} theme={theme} />
        </div>
        <CneTable
          rowKey={(record) => { return record.inspectId; }}
          dataSource={inspectList}
          columns={columns}
          rowSelection={rowSelection}
          onChange={this.onChangeTable}
          loading={tableLoading}
          // scroll={{ y: 450, scrollToFirstRowOnChange: true }}
          pagination={false}
          sortMethod={['ascend', 'descend'][sortMethod]}
          sortField={['inspectName', 'stationName', 'startTime', '', 'inspectStatus', '', 'checkTime'][sortField]}
        />
        {inspectList.length > 0 && <div className={styles.tableFooter}>
          <span className={styles.info}>当前选中<span className={styles.totalNum}>{selectedRowKeys.length}</span>项</span>
          {selectedRowKeys.length > 0 && <span className={styles.cancel} onClick={this.cancelRowSelect}>取消选中</span>}
        </div>}
      </div>
    );
  }
}
export default (InspectTable);
