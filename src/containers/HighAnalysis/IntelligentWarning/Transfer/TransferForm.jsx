import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./transferForm";
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer';
class TransferForm extends Component{
 static propTypes = {
   }
  constructor(props,context){
    super(props,context)
  }
    render(){
        const breadCrumbData = {
            breadData: [
              {
                name: '已转工单',
              }
            ],
          };
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