import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Icon, Button, Radio, Table, Checkbox, Popconfirm } from 'antd';
import styles from './workPage.scss';
import moment from 'moment';
import { dataFormats } from '@utils/utilFunc';

class RecordsList extends PureComponent {

  static propTypes = {
    theme: PropTypes.string,
    stageLoading: PropTypes.bool,
    stageNumInfo: PropTypes.object,
    stageList: PropTypes.array,
    changeStore: PropTypes.func,
    setRecordComplete: PropTypes.func,
  };

  state = {
    recordFilterCode: 0,
    column: [
      {
        title: '工作类型',
        dataIndex: 'taskTypeName', // taskTypeCode	Int	工作类型编码 1 计划 2 缺陷 3 巡检 4 记事 taskTypeName	String	工作类型名字
        sorter: true,
        className: styles.taskTypeName,
        render: (text, record) => {
          const { taskTypeCode } = record;
          const taskTypes = ['--', '计划', '缺陷', '巡检', '记事'];
          return ( // className={styles.taskTypeName}
            <div className={styles.taskTypeNameText} title={`【${taskTypes[taskTypeCode] || '--'}】${text}`}>
              <span className={styles.taskNameHighlight}>【{taskTypes[taskTypeCode] || '--'}】</span>
              {text}
            </div>
          );
        },
      }, {
        title: '工作描述',
        dataIndex: 'taskDesc',
        className: styles.taskDesc, //  className={styles.taskDesc}
        render: (text = '') => (<div title={text} className={styles.taskDescText}>{text}</div>),
      }, {
        title: '电站',
        dataIndex: 'stationName',
        sorter: true,
        className: styles.stationName, //  className={styles.stationName}
        render: (text = '') => (<div title={text} className={styles.stationNameText}>{text}</div>),
      }, {
        title: '完成时间',
        dataIndex: 'completeTime', // 完成时间yyyy-MM-dd HH:mm:ss(Web)
        className: styles.completeTime, //  className={styles.completeTime}
        render: (text) => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--',
      }, {
        title: '执行人',
        dataIndex: 'handleUser',
        className: styles.handleUser, //  className={styles.handleUser}
        render: (text = '') => (<div title={text} className={styles.handleUserText}>{text}</div>),
      }, {
        title: '完成情况', // completeStatus	Int	完成情况  0未完成  1已完成
        dataIndex: 'completeStatus',
        className: styles.completeStatus, //  className={styles.completeStatus}
        // render: (text = '') => (<div className={styles.completeStatusText}>{text}</div>),
        render: (text = '') => ['未完成', '已完成'][text] || '--',
      }, {
        title: '操作',
        dataIndex: 'handle',
        className: styles.handle, //  className={styles.handle}
        render: (text, record) => {
          const { taskTypeCode, completeStatus } = record;
          // 工作类型编码 1 计划 2 缺陷 3 巡检 4 记事 taskTypeName	String	工作类型名字
          // 所有都有详情, 巡检 有完成(1)未完成(0)状态, 记事 有编辑删除功能;
          return (
            <span className={styles.handleRow}>
              <span className="iconfont icon-look" onClick={() => this.toDetail(record)} />
              {taskTypeCode === 3 && <Popconfirm
                title="是否标记为已完成?"
                onConfirm={() => this.confirmComplete(record)}
                okText="确定"
                cancelText="取消"
                disabled={completeStatus > 0}
              >
                <Checkbox checked={!!completeStatus} />
              </Popconfirm>}
              {taskTypeCode === 4 && <span className="iconfont icon-edit" onClick={() => this.toEdit(record)} />}
              {taskTypeCode === 4 && <Popconfirm
                title="是否确认删除记事?"
                onConfirm={() => this.toRemove(record)}
                okText="确定"
                cancelText="取消"
              >
                <span className="iconfont icon-del" />
              </Popconfirm> }
            </span>
          );
        },
      },
    ],
  }

  confirmComplete = ({ taskId }) => {
    this.props.setRecordComplete({ taskIds: [taskId] });
  }

  toDetail = (record) => { // 详情 => 缺陷, 计划
    console.log(record);
  }

  toEdit = (record) => {
    console.log(record);
  }

  toRemove = (record) => {
    console.log(record);
  }

  // componentWillReceiveProps(nextProps){
  //   const { stageList } = nextProps;
  //   const preStageList = this.props.stageList;
  //   if (stageList.length > 0 && preStageList.length === 0) { // 第一次有数据后将计算宽度注入column
  //     const { column } = this.state;
  //     const tableWidth = this.recordsRef.offsetWidth - 6; // 预减去可能的滚动条宽度;
  //     const columnWidthMap = {
  //       totalWidth: tableWidth,
  //       taskTypeName: (tableWidth - 385) * 0.27,
  //       taskDesc: (tableWidth - 385) * 0.41,
  //       stationName: (tableWidth - 385) * 0.16,
  //       completeTime: 175,
  //       handleUser: (tableWidth - 385) * 0.15,
  //       completeStatus: 100,
  //       handle: 110,
  //     };
  //     const newColumn = column.map(e => {
  //       const { dataIndex } = e;
  //       const eachWidth = columnWidthMap[dataIndex];
  //       return {
  //         ...e,
  //         width: eachWidth,
  //         render: e.render(eachWidth - 32), // 2 * 16预留padding需要减去
  //       };
  //     });
  //     this.setState({ column: newColumn });
  //   }
  // }

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
    const { theme, stageNumInfo = {}, stageList = [], stageLoading } = this.props;
    const { column, recordFilterCode } = this.state;
    const recordSource = recordFilterCode === 0 ? stageList : stageList.filter( // 是否按照类型筛选查看
      e => e.taskTypeCode === recordFilterCode
    );
    return (
      <div className={`${styles.recordsList} ${styles[theme]}`}>
        <div className={styles.recordFilter} ref={(ref) => { this.recordsRef = ref; }}>
          <span className={styles.todayWorkTitle}>今日工作</span>
          <span className={styles.filterParts}>
            <Button className={styles.addRecord} type="add" onClick={this.onAddRecord} >
              <i>+</i>
              <span className={styles.btnText}>添加工作记事</span>
            </Button>
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
          loading={stageLoading}
          scroll={{ y: 330 }}
          className={styles.recordTable}
        />
      </div>
    );
  }
}

export default RecordsList;
