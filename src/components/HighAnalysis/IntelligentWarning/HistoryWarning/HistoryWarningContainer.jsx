import React, { Component } from "react";
import styles from './historyWarning.scss';
class HistoryWarningContainer extends Component{
  static propTypes = {
  }
    constructor(props,context){
        super(props,context)
    }
    render(){
        return(
            <div className={styles.historyWarningContainer}>
                历史告警
            </div>
        )
    }
}
export default (HistoryWarningContainer)