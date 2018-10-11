import React from "react";
import styles from './targetTabs.scss';
import { Tabs } from 'antd';
import BarGraph from './CommonGraph/BarGraph/index.js';
import TargetStatisticPieGraph from './TargetStatisticPieGraph.jsx';
import StationStatisticList from './StationStatisticList.jsx';


class TargetTabs extends React.Component {
    constructor(props, context) {
        super(props, context)
    }
    render() {
        const TabPane = Tabs.TabPane;
        return (
            <div className={styles.targetTabs}>
            <Tabs
            defaultActiveKey="1"            
          >
            <TabPane tab="发电量" key="1">
            <div className={styles.tabContainer}>
            <div className={styles.dataGraph}>   
            <BarGraph />
            <TargetStatisticPieGraph />           
            </div>
            <StationStatisticList />
            </div>

            </TabPane>
            <TabPane tab="辐射总量" key="2">Content of tab 2</TabPane>
            <TabPane tab="等效利用小时数" key="3">Content of tab 3</TabPane>
            <TabPane tab="PR" key="4">Content of tab 4</TabPane>
            <TabPane tab="损失电量" key="5">Content of tab 5</TabPane>
            <TabPane tab="损失电量等效时" key="6">Content of tab 6</TabPane>
           
          </Tabs>



            </div>
        )
    }
}
export default (TargetTabs)