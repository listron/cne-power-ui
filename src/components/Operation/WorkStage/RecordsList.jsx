import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Icon, Button, Radio, Table } from 'antd';
import styles from './workPage.scss';
import { dataFormats } from '@utils/utilFunc';

class RecordsList extends PureComponent {

  static propTypes = {
    theme: PropTypes.string,
    stageLoading: PropTypes.bool,
    stageNumInfo: PropTypes.object,
    stageList: PropTypes.array,
    changeStore: PropTypes.func,
  };

  state = {
    recordFilterCode: 0,
    column: [
      {
        title: '工作类型',
        dataIndex: 'taskTypeName', // taskTypeCode	Int	工作类型编码 1 计划 2 缺陷 3 巡检 4 记事 taskTypeName	String	工作类型名字
        sorter: true,
        // className: styles.taskTypeName,
        // width: 'calc((100% - 385px) * 0.27)',
        render: (width) => (text) => (<div>{text}</div>),
      }, {
        title: '工作描述',
        dataIndex: 'taskDesc',
        className: styles.taskDesc,
        // width: 'calc((100% - 385px) * 0.41)',
        ellipsis: true,
        render: (width) => (text) => (<div>{text}</div>),
      }, {
        title: '电站',
        dataIndex: 'stationName',
        sorter: true,
        className: styles.stationName,
        // width: 'calc((100% - 385px) * 0.16)',
        render: (width) => (text) => (<div>{text}</div>),
      }, {
        title: '完成时间',
        dataIndex: 'completeTime', // 完成时间yyyy-MM-dd HH:mm:ss(Web)
        className: styles.completeTime,
        // width: '175px',
        render: (width) => (text) => (<div>{text}</div>),
      }, {
        title: '执行人',
        dataIndex: 'handleUser',
        className: styles.handleUser,
        // width: 'calc((100% - 385px) * 0.15)',
        render: (width) => (text) => (<div>{text}</div>),
      }, {
        title: '完成情况', // completeStatus	Int	完成情况  0未完成  1已完成
        dataIndex: 'completeStatus',
        className: styles.completeStatus,
        // width: '100px',
        render: (width) => (text) => (<div>{text}</div>),
      }, {
        title: '操作',
        dataIndex: 'handle',
        className: styles.handle,
        // width: '110px',
        render: (width) => (text) => (<div>{text}</div>),
      },
    ],
  }

  componentWillReceiveProps(nextProps){
    const { stageList } = nextProps;
    const preStageList = this.props.stageList;
    if (stageList.length > 0 && preStageList.length === 0) { // 第一次有数据后将计算宽度注入column
      const { column } = this.state;
      const tableWidth = this.recordsRef.offsetWidth;
      const columnWidthMap = {
        totalWidth: tableWidth,
        taskTypeName: (tableWidth - 385) * 0.27,
        taskDesc: (tableWidth - 385) * 0.41,
        stationName: (tableWidth - 385) * 0.16,
        completeTime: 175,
        handleUser: (tableWidth - 385) * 0.15,
        completeStatus: 100,
        handle: 110,
      };
      console.log(columnWidthMap);
      const newColumn = column.map(e => {
        const { dataIndex } = e;
        const eachWidth = columnWidthMap[dataIndex];
        return {
          ...e,
          width: eachWidth,
          render: e.render(eachWidth),
        };
      });
      console.log(newColumn)
      this.setState({ column: newColumn });
    }
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

  onAdd = () => { // 添加工作记事
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
      <div className={`${styles.recordsList} ${styles[theme]}`} ref={(ref) => { this.recordsRef = ref; }}>
        <div className={styles.recordFilter}>
          <span className={styles.todayWorkTitle}>今日工作</span>
          <span className={styles.filterParts}>
            <Button className={styles.addRecord} type="add" onClick={this.onAdd} >
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
        />
      </div>
    );
  }
}

export default RecordsList;
