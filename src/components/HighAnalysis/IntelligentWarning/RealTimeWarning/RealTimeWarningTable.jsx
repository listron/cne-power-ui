import React, { Component } from "react";
import styles from './realTimeWarning.scss';


class RealTimeWarningTable extends Component{
 static propTypes = {
   }
    constructor(props,context){
        super(props,context)
    }
    render(){
        return(
            <div className={styles.realTimeWarningTable}>
                我是table
            </div>
        )
    }
}
export default (RealTimeWarningTable)