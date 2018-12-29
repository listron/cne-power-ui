

import React, { Component } from "react";
import { connect } from "react-redux";
import styles from './realTimeWarning'
class RealTimeWarning extends Component{
 static propTypes = {
   }
  constructor(props,context){
    super(props,context)
  }
    render(){
        return(
            <div>
                realTimeWarning
            </div>
        )
    }
}
const mapStateToProps = (state) => {
 return {
 }
 }
const mapDispatchToProps = (dispatch) => ({
})
export default connect(mapStateToProps, mapDispatchToProps) (RealTimeWarning)