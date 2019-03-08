import React, {Component} from 'react';
import {Button} from 'antd';
import styles from './scatterDiagram.scss';

class ScatterDiagramHandle extends Component{
  render(){
    return(
      <div className={styles.scatterDiagramHandle}>
        <div className={styles.rightHandle}>
          <Button 
          className={styles.exportInfo} 
          // onClick={this.downloadAlarmExcel}
          >
          查询
          </Button>
          <Button 
          // disabled={alarmList.length === 0} 
          className={styles.clearAlarm}
          // onClick={this.deleteAlarmList}
          >
          导出
          </Button>
        </div>
      </div>
    )
  }
}

export default ScatterDiagramHandle;