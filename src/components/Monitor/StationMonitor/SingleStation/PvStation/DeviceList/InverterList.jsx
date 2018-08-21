

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './deviceList.scss';
import { Tabs, Switch, Radio  } from 'antd';

const TabPane = Tabs.TabPane;
class InverterList extends Component {
  static propTypes = {
    inverterList: PropTypes.object,
  }

  constructor(props){
    super(props);
  }
  operations = () => {
    return (<div className={styles.inverterStatus} >
      <Switch defaultChecked onChange={this.onChange} />告警
      <Radio.Group defaultValue="a" buttonStyle="solid">
        <Radio.Button value="a">全部</Radio.Button>
        <Radio.Button value="b">正常</Radio.Button>
        <Radio.Button value="c">类别</Radio.Button>
        <Radio.Button value="d">Chengdu</Radio.Button>
      </Radio.Group>
    </div>)
  }
  render(){
    const { inverterList } = this.props;
    console.log(inverterList);
    const operations = (<div className={styles.inverterRight} >
    <Switch defaultChecked onChange={this.onChange} />告警
    <Radio.Group defaultValue="a" buttonStyle="solid" className={styles.inverterStatus} >
      <Radio.Button value="a">全部</Radio.Button>
      <Radio.Button value="b">正常</Radio.Button>
      <Radio.Button value="c">故障</Radio.Button>
      <Radio.Button value="d">停机</Radio.Button>
      <Radio.Button value="d">无通讯</Radio.Button>
    </Radio.Group>
  </div>);
    return (
      <div className={styles.inverterList} >
        <Tabs defaultActiveKey="1" className={styles.inverterTab} tabBarExtraContent={operations}>
          <TabPane tab={<span><i className="iconfont icon-grid" ></i></span>} key="1">
            {inverterList && inverterList.map(e=>{
              return (<div>

              </div>);
            })}
          </TabPane>
          <TabPane tab={<span><i className="iconfont icon-table" ></i></span>} key="2">
            Tab 2
          </TabPane>
        </Tabs>
        
      </div>
    )
  }
}

export default InverterList;
