import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./historyWarning";
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer';
class HistoryWarning extends Component{
 static propTypes = {
   }
  constructor(props,context){
    super(props,context)
  }
    render(){
        const breadCrumbData = {
            breadData: [
              {
                name: '历史预警',
              }
            ],
          };
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