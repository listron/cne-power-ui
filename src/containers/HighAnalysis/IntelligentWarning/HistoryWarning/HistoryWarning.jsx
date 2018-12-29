import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./historyWarning";
class HistoryWarning extends Component{
 static propTypes = {
   }
  constructor(props,context){
    super(props,context)
  }
    render(){
        return(
            <div>
                历史告警
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
export default connect(mapStateToProps, mapDispatchToProps) (HistoryWarning)