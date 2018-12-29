import React, { Component } from "react";
import styles from './historyWarning';
class HistoryWarningContainer extends Component{
  static propTypes = {
  }
    constructor(props,context){
        super(props,context)
    }
    render(){
        return(
            <div>
                我是历史告警容器
            </div>
        )
    }
}
export default (HistoryWarningContainer)