import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styles from './scatterDiagram.scss';
import { Tabs } from 'antd';

const TabPane = Tabs.TabPane;

class ScatterDiagramDataType extends Component{
  static propTypes = {
    changeScatterDiagramStore: PropTypes.func,
    scatterDiagramType: PropTypes.string,
    pageSize: PropTypes.number,
    pageNum: PropTypes.number,
    changeScatterDiagramStore: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      key: 'chart',
    }
  }

  
  onChangeTab = (key) => { // 切换chart和list页面
    const { changeScatterDiagramStore } = this.props;
      changeScatterDiagramStore({
        scatterDiagramType: key
      });
    this.setState({ key });
  }

  
  render(){
    const { key } = this.state;
    return(
      <div className={styles.scatterDiagramDataType}>
        <div className={styles.tabIcon}>
          <Tabs animated={false} tabBarGutter={0} className={styles.tabContainer} activeKey={key} onChange={this.onChangeTab}>
            <TabPane tab={<i className="iconfont icon-drawing"></i>} key="chart"></TabPane>
            <TabPane tab={<i className="iconfont icon-table"></i>} key="list"></TabPane>
          </Tabs>
        </div>
      </div>
      )
    }
  }
  
  export default ScatterDiagramDataType;