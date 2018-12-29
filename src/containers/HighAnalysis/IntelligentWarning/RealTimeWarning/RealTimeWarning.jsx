

import React, { Component } from "react";
import { connect } from "react-redux";
import styles from './realTimeWarning'
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer';
class RealTimeWarning extends Component{
 static propTypes = {
   }
  constructor(props,context){
    super(props,context)
  }
    render(){
        const breadCrumbData = {
            breadData: [
              {
                name: '实时预警',
              }
            ],
          };
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