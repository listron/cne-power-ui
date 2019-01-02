import React, { Component } from "react";
import styles from './realTimeWarning.scss';


class RealTimeWarningFilter extends Component{
 static propTypes = {
   }
    constructor(props,context){
        super(props,context)
    }
    render(){
        return(
            <div className={styles.realTimeWarningFilter}>
                我是筛选部分
            </div>
        )
    }
}
export default (RealTimeWarningFilter)