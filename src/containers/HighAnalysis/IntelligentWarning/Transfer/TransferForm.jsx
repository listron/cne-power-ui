import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./transferForm";
class TransferForm extends Component{
 static propTypes = {
   }
  constructor(props,context){
    super(props,context)
  }
    render(){
        return(
            <div>
                已转工单
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
export default connect(mapStateToProps, mapDispatchToProps) (TransferForm)