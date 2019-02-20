import React, { Component } from "react";
import { Tabs,Input,DatePicker,Card,Table,Popover,Radio  } from 'antd';
import styles from "./ScoreAnalysis.scss";
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';

const { MonthPicker } = DatePicker;
const TabPane = Tabs.TabPane;

const renderContent = (value, row, index) => {
  const obj = {
    children: value,
    props: {},
  };
  if (index === 4) {
    obj.props.colSpan = 0;
  }
  return obj;
};

const dataSource = [{
  key: '1',
  classification: '发电水平',
  target: '发电量完成率',
  judgementStandard:'95%~100%',
  completionStatus:'123%',
  evaluate:'优秀',
}, {
  key: '2',
  classification: '发电水平',
  target: '发电量完成率',
  judgementStandard:'95%~100%',
  completionStatus:'123%',
  evaluate:'优秀',
}, {
  key: '3',
  classification: '发电水平',
  target: '发电量完成率',
  judgementStandard:'95%~100%',
  completionStatus:'123%',
  evaluate:'优秀',
}, {
  key: '4',
  classification: '运维管理',
  target: '发电量完成率',
  judgementStandard:'95%~100%',
  completionStatus:'123%',
  evaluate:'优秀',
}, {
  key: '5',
  classification: '运维管理',
  target: '发电量完成率',
  judgementStandard:'95%~100%',
  completionStatus:'123%',
  evaluate:'优秀',
}, {
  key: '6',
  classification: '运维管理',
  target: '发电量完成率',
  judgementStandard:'95%~100%',
  completionStatus:'123%',
  evaluate:'优秀',
}];

const columns = [{
  title: '分类',
  dataIndex: 'classification',
  key: 'classification',
  render: (value, row, index) => {
    const obj = {
      children: value,
      props: {},
    };
    console.log(index,value);
    
    if (index === 0 || index === 3) {
      obj.props.rowSpan = 3;
    }
    if (index === 1 || index === 2 || index === 4 || index === 5) {
      obj.props.rowSpan = 0;
    }
    return obj;
  },
}, {
  title: '指标',
  dataIndex: 'target',
  key: 'target',
}, {
  title: '判断标准',
  dataIndex: 'judgementStandard',
  key: 'judgementStandard',
}, {
  title: '完成情况',
  dataIndex: 'completionStatus',
  key: 'completionStatus',
}, {
  title: '评价',
  dataIndex: 'evaluate',
  key: 'evaluate',
}];

const content = (
  <div className={styles.scoreTable}>
    <div className={styles.text}>
      <p className={styles.stationScore}>xxx电站总分：88分 良好</p>
      <p className={styles.scoreTime}>评分时间；2019年1月1日~2019年1月2日</p>
    </div>
    <Table dataSource={dataSource} columns={columns} pagination={false} bordered />
  </div>
);

class ScoreAnalysis extends Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      <div className={styles.stationScore}>
        <CommonBreadcrumb  breadData={ [{name: '电站评分',}]} style={{marginLeft: '38px', background: '#fff' }} />
        <div className={styles.scoreContainer}>
          <div className={styles.scoreMain}>
            <div className={styles.stationTab}>
              <Tabs type="card">
                <TabPane tab="风电" key="0"></TabPane>
                <TabPane tab="光伏" key="1"></TabPane>
              </Tabs> 
            </div>
            <div className={styles.scoreCon}>
              <div className={styles.stationTypeTab}>
                <Radio.Group defaultValue="a" buttonStyle="solid">
                  <Radio.Button value="a">全部</Radio.Button>
                  <Radio.Button value="b">集中式光伏电站</Radio.Button>
                  <Radio.Button value="c">分布式光伏电站</Radio.Button>
                </Radio.Group>
              </div>
              <div className={styles.scoreMiddle}>
                <div className={styles.scoreFilter}>
                  <div className={styles.stationFilter}>
                    <span className={styles.text}>电站筛选</span>
                    <Input placeholder="请输入关键字快速查询" />
                  </div>
                  <div className={styles.timeSelect}>
                    <span className={styles.text}>统计时间选择</span>
                    <MonthPicker />
                  </div>
                </div>
                <div className={styles.scoreTranslate}>
                  <div className={styles.scoreTranslateBtn}>排序</div>
                </div>
              </div>
              <div className={styles.stationCardContainer}>
                <Popover content={content} trigger="hover">
                    <div className={styles.stationCard}>
                      <Card
                        title="电站名称"
                        style={{ marginTop:8 }}
                      >
                        <div className={styles.scoreCircleCon}>
                          <div className={styles.evaluate}>
                            <p className={styles.num}>88.88</p>
                            <p className={styles.text}>良好</p>
                          </div>
                        </div>
                        <div className={styles.scoreCardBottom}>
                          <p className={styles.installedCapacity}>装机容量 11MW</p>
                          <p className={styles.equivalent}>发电等效时 22h</p>
                        </div>
                      </Card>
                    </div>
                </Popover>
                <Popover content={content} trigger="hover">
                    <div className={styles.stationCard}>
                      <Card
                        title="电站名称"
                        style={{ marginTop:8 }}
                      >
                        <div className={styles.scoreCircleCon}>
                          <div className={styles.evaluate}>
                            <p className={styles.num}>88.88</p>
                            <p className={styles.text}>良好</p>
                          </div>
                        </div>
                        <div className={styles.scoreCardBottom}>
                          <p className={styles.installedCapacity}>装机容量 11MW</p>
                          <p className={styles.equivalent}>发电等效时 22h</p>
                        </div>
                      </Card>
                    </div>
                </Popover>
                <Popover content={content} trigger="hover">
                    <div className={styles.stationCard}>
                      <Card
                        title="电站名称"
                        style={{ marginTop:8 }}
                      >
                        <div className={styles.scoreCircleCon}>
                          <div className={styles.evaluate}>
                            <p className={styles.num}>88.88</p>
                            <p className={styles.text}>良好</p>
                          </div>
                        </div>
                        <div className={styles.scoreCardBottom}>
                          <p className={styles.installedCapacity}>装机容量 11MW</p>
                          <p className={styles.equivalent}>发电等效时 22h</p>
                        </div>
                      </Card>
                    </div>
                </Popover>
                <Popover content={content} trigger="hover">
                    <div className={styles.stationCard}>
                      <Card
                        title="电站名称"
                        style={{ marginTop:8 }}
                      >
                        <div className={styles.scoreCircleCon}>
                          <div className={styles.evaluate}>
                            <p className={styles.num}>88.88</p>
                            <p className={styles.text}>良好</p>
                          </div>
                        </div>
                        <div className={styles.scoreCardBottom}>
                          <p className={styles.installedCapacity}>装机容量 11MW</p>
                          <p className={styles.equivalent}>发电等效时 22h</p>
                        </div>
                      </Card>
                    </div>
                </Popover>
                <Popover content={content} trigger="hover">
                    <div className={styles.stationCard}>
                      <Card
                        title="电站名称"
                        style={{ marginTop:8 }}
                      >
                        <div className={styles.scoreCircleCon}>
                          <div className={styles.evaluate}>
                            <p className={styles.num}>88.88</p>
                            <p className={styles.text}>良好</p>
                          </div>
                        </div>
                        <div className={styles.scoreCardBottom}>
                          <p className={styles.installedCapacity}>装机容量 11MW</p>
                          <p className={styles.equivalent}>发电等效时 22h</p>
                        </div>
                      </Card>
                    </div>
                </Popover>
                <Popover content={content} trigger="hover">
                    <div className={styles.stationCard}>
                      <Card
                        title="电站名称"
                        style={{ marginTop:8 }}
                      >
                        <div className={styles.scoreCircleCon}>
                          <div className={styles.evaluate}>
                            <p className={styles.num}>88.88</p>
                            <p className={styles.text}>良好</p>
                          </div>
                        </div>
                        <div className={styles.scoreCardBottom}>
                          <p className={styles.installedCapacity}>装机容量 11MW</p>
                          <p className={styles.equivalent}>发电等效时 22h</p>
                        </div>
                      </Card>
                    </div>
                </Popover>
                <Popover content={content} trigger="hover">
                    <div className={styles.stationCard}>
                      <Card
                        title="电站名称"
                        style={{ marginTop:8 }}
                      >
                        <div className={styles.scoreCircleCon}>
                          <div className={styles.evaluate}>
                            <p className={styles.num}>88.88</p>
                            <p className={styles.text}>良好</p>
                          </div>
                        </div>
                        <div className={styles.scoreCardBottom}>
                          <p className={styles.installedCapacity}>装机容量 11MW</p>
                          <p className={styles.equivalent}>发电等效时 22h</p>
                        </div>
                      </Card>
                    </div>
                </Popover>
              </div>
            </div>
          </div>
        </div>
      </div>
      )
    }
  }
  
  export default ScoreAnalysis;