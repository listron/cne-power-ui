import React, { Component } from "react";
import styles from './realTimeWarning';


class RealTimeWarningContainer extends Component{
 static propTypes = {
   }
    constructor(props,context){
        super(props,context)
    }
    render(){
        return(
            <div>
                实时预警
            </div>
        )
    }
}
export default (RealTimeWarningContainer)