import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Radio, Table, Checkbox, Popconfirm } from 'antd';
import styles from './workPage.scss';
import moment from 'moment';
import { dataFormats, handleRights, handleRight } from '@utils/utilFunc';

class RecordsList extends PureComponent {

  static propTypes = {
    theme: PropTypes.string,
    stageLoading: PropTypes.bool,
    pageLoading: PropTypes.bool,
    stageNumInfo: PropTypes.object,
    stageList: PropTypes.array,
    changeStore: PropTypes.func,
    setPlanComplete: PropTypes.func,
    getPlanDetail: PropTypes.func,
    getRecordDetail: PropTypes.func,
    deletRecord: PropTypes.func,
  };

  state = {
    recordFilterCode: 0,
    column: [
      {
        title: '工作类型',
        dataIndex: 'taskTypeName', // taskTypeCode	Int	工作类型编码 1 计划 2 消缺 3 巡检 4 记事 taskTypeName	String	工作类型名字
        sorter: (a, b) => a.taskTypeCode - b.taskTypeCode,
        className: styles.taskTypeName,
        render: (text, record) => {
          const { taskTypeName, taskTypeCode, deviceTypeName, taskName } = record;
          // const taskTypes = ['--', '计划', '消缺', '巡检', '记事'];
          // 消缺 2=> 设备类型； 巡检 3=> 巡检名称； 计划 1=> 巡检计划； 记事 4=> 工作记事
          const recordKey = ['--', '巡检计划', deviceTypeName, taskName, '工作记事'];
          const recordText = recordKey[taskTypeCode] || '--';
          return ( // className={styles.taskTypeName}
            <div
              className={styles.taskTypeNameText}
              title={`【${taskTypeName || '--'}】${recordText}`}
            >
              <span className={styles.taskNameHighlight}>【{taskTypeName || '--'}】</span>
              {recordText}
            </div>
          );
        },
      }, {
        title: '工作描述',
        dataIndex: 'taskDesc',
        className: styles.taskDesc,
        render: (text = '', record) => {
          const { taskTypeCode, taskName, taskDesc } = record; // taskTypeCode === 3时候为巡检，工作描述展示巡检名称
          const recordKey = ['--', taskDesc, taskDesc, taskName, taskDesc];
          const recordText = recordKey[taskTypeCode] || '--';
          return (
            <div title={recordText} className={styles.taskDescText}>{recordText}</div>
          );
        },
      }, {
        title: '电站',
        dataIndex: 'stationName',
        sorter: (a, b) => a.stationName && a.stationName.localeCompare(b.stationName),
        className: styles.stationName,
        render: (text = '') => (<div title={text} className={styles.stationNameText}>{text}</div>),
      }, {
        title: '完成时间',
        dataIndex: 'completeTime',
        sorter: (a, b) => (moment(a) - moment(b)),
        width: 175,
        render: (text) => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--',
      }, {
        title: '执行人',
        dataIndex: 'handleUser',
        sorter: (a, b) => a.handleUser && a.handleUser.localeCompare(b.handleUser),
        className: styles.handleUser,
        render: (text = '') => (<div title={text} className={styles.handleUserText}>{text || '--'}</div>),
      }, {
        title: '完成情况', // completeStatus	Int	完成情况  0未完成  1已完成
        dataIndex: 'completeStatus',
        sorter: (a, b) => a.completeStatus - b.completeStatus,
        width: 110,
        render: (text = '') => ['未完成', '已完成'][text] || '--',
      }, {
        title: '操作',
        dataIndex: 'handle',
        width: 90,
        render: (text, record) => {
          const { taskTypeCode, completeStatus } = record;
          // 工作类型编码 1 计划 2 缺陷 3 巡检 4 记事 taskTypeName	String	工作类型名字
          // 所有都有详情, 计划 有完成(1)未完成(0)状态, 记事 有编辑删除功能;
          const [manageRight, addRecordRight] = handleRights(['operation_workStation_manage', 'operation_workStation_finish']);
          return (
            <span className={styles.handleRow}>
              <span className="iconfont icon-look" onClick={() => this.toDetail(record)} />
              {taskTypeCode === 1 && !!completeStatus && <span title="已标记完成">
                <Checkbox checked={true} />
              </span>}
              {addRecordRight && taskTypeCode === 1 && !completeStatus && <Popconfirm
                title="是否标记为已完成?"
                onConfirm={() => this.confirmComplete(record)}
                okText="确定"
                cancelText="取消"
                // disabled={completeStatus > 0}
              >
                <span title="标记为已完成">
                  <Checkbox checked={false} />
                </span>
              </Popconfirm>}
              {manageRight && taskTypeCode === 4 && <span
                title="编辑"
                className="iconfont icon-edit"
                onClick={() => this.toEdit(record)}
              />}
              {manageRight && taskTypeCode === 4 && <Popconfirm
                title="是否确认删除记事?"
                onConfirm={() => this.toRemove(record)}
                okText="确定"
                cancelText="取消"
              >
                <span title="删除" className="iconfont icon-del" />
              </Popconfirm> }
            </span>
          );
        },
      },
    ],
  }


  confirmComplete = ({ taskId }) => {
    this.props.setPlanComplete({ taskIds: [taskId] });
  }

  toDetail = ({ taskTypeCode, taskId }) => { // 详情
    if (taskTypeCode === 4 ) { // 记事 => 弹框展示记事详情
      return this.props.getRecordDetail({ noteId: taskId });
    }
    if (taskTypeCode === 1) { // 计划 => 弹框展示计划详情
      return this.props.getPlanDetail({ noteId: taskId });
    }
    if (taskTypeCode === 2) { // 消缺 => 新开页面且跳转至对应的界面
      return window.open(`#/operation/workProcess/view?page=defectDetail&defectId=${taskId}`);
    }
    // 巡检 新开页面且跳转至对应的界面
    return window.open(`#/operation/workProcess/view?page=inspectDeatail&inspectId=${taskId}`);
  }

  toEdit = ({ taskId }) => { // 请求详情并指定展示编辑弹框
    this.props.getRecordDetail({ noteId: taskId, modalKey: 'editRecord' });
  }

  toRemove = ({ taskId }) => { // 删除
    this.props.deletRecord({ noteId: taskId });
  }

  recordTypesInfo = [
    {
      key: 'allNum',
      text: '全部',
      recordFilterCode: 0,
    }, {
      key: 'planNum',
      text: '计划',
      recordFilterCode: 1,
    }, {
      key: 'defectNum',
      text: '消缺',
      recordFilterCode: 2,
    }, {
      key: 'inspectNum',
      recordFilterCode: 3,
      text: '巡检',
    }, {
      key: 'noteNum',
      recordFilterCode: 4,
      text: '记事',
    },
  ]

  onAddRecord = () => { // 添加工作记事
    this.props.changeStore({
      showModal: true, // 弹框
      modalKey: 'addRecord',
    });
  }

  recordTypeFilter = ({ target = {} }) => {
    const { value } = target;
    this.setState({ recordFilterCode: value });
  }

  render(){
    const { theme, stageNumInfo = {}, stageList = [], stageLoading, pageLoading } = this.props;
    const { column, recordFilterCode } = this.state;
    const recordSource = recordFilterCode === 0 ? stageList : stageList.filter( // 是否按照类型筛选查看
      e => e.taskTypeCode === recordFilterCode
    );
    const addRight = handleRight('workStation_add');
    return (
      <div className={`${styles.recordsList} ${styles[theme]}`}>
        <div className={styles.recordFilter} ref={(ref) => { this.recordsRef = ref; }}>
          <span className={styles.todayWorkTitle}>今日工作</span>
          <span className={styles.filterParts}>
            {addRight && <Button className={styles.addRecord} type="add" onClick={this.onAddRecord} >
              <i>+</i>
              <span className={styles.btnText}>添加工作记事</span>
            </Button>}
            <span className={styles.filterTips}>筛选查看</span>
            <span>
            <Radio.Group value={recordFilterCode} onChange={this.recordTypeFilter}>
              {this.recordTypesInfo.map(e => {
                const { key, text } = e;
                const tmpCode = e.recordFilterCode;
                return (
                  <Radio.Button
                    key={key}
                    value={tmpCode}
                    className={`${styles.filterTypeBtn} ${recordFilterCode === tmpCode ? styles.active : ''}`}
                  >
                    <span className={styles.filterTypeText}>{text}</span>
                    <span>{dataFormats(stageNumInfo[key])}</span>
                  </Radio.Button>
                );
              })}
            </Radio.Group>
            </span>
          </span>
        </div>
        <Table
          dataSource={recordSource}
          columns={column}
          pagination={false}
          loading={stageLoading && !pageLoading}
          scroll={{ y: 330 }}
          className={styles.recordTable}
        />
      </div>
    );
  }
}

export default RecordsList;
