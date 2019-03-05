import React, { Component } from "react";
import PropTypes from "prop-types";
import styles from './allDeviceCurve.scss'
import { connect } from "react-redux";
import Header from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer';
class AllDeviceCurve extends Component{
 static propTypes = {
   }
  constructor(props,context){
    super(props,context)
  }
    render(){
        const breadCrumbData = {
            breadData: [
              {
                name: '功率曲线',
              }
            ],
          };
        return(
            <div className={styles.allDeviceCurve} >
            <Header {...breadCrumbData} style={{ marginLeft: '38px' }} />
            container
               
            <Footer />
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
export default connect(mapStateToProps, mapDispatchToProps) (AllDeviceCurve)