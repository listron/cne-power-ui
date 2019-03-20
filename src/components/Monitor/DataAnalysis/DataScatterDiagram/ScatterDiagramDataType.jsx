import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styles from './scatterDiagram.scss';
import { Icon } from 'antd';

class ScatterDiagramDataType extends Component{
  static propTypes = {
    changeScatterDiagramStore: PropTypes.func,
    scatterDiagramType: PropTypes.string,
  }

  selectScatterDiagramType = (scatterDiagramType) => {
    const { changeScatterDiagramStore } = this.props;
    changeScatterDiagramStore({ scatterDiagramType })
  }

  showChart = () => {
    this.selectScatterDiagramType('chart');
  }

  showList = () => {
    this.selectScatterDiagramType('list');
  }

  render(){
    const { scatterDiagramType } = this.props;
    return(
      <div className={styles.scatterDiagramDataType}>
        <div className={styles.tabIcon}>
          <Icon onClick={this.showChart} type="bar-chart" className={scatterDiagramType === 'chart'? styles.active : styles.normal} />
          <Icon onClick={this.showList} type="bars" className={scatterDiagramType === 'list'? styles.active : styles.normal} />
        </div>
      </div>
      )
    }
  }
  
  export default ScatterDiagramDataType;