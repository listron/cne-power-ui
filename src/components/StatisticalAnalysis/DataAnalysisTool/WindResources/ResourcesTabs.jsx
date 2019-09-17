import React, { Component } from 'react';
import Frequency from './Frequency';
import { Tabs } from 'antd';
import styles from './resources.scss';

const { TabPane } = Tabs;

class ResourcesTabs extends Component{
  render(){
    return(
      <div className={styles.resourcesTabs}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="风速&风能频率图" key="1">
            <Frequency {...this.props} />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
export default ResourcesTabs;
