import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./historyWarning.scss";
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer';
import HistoryWarningContainer from '../../../../components/HighAnalysis/IntelligentWarning/HistoryWarning/HistoryWarningContainer';

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
          <div className={styles.history}>
          <CommonBreadcrumb  {...breadCrumbData} style={{ marginLeft: '38px' }} />
          <div className={styles.historyWarningBox}>
          <HistoryWarningContainer />
          </div>        
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
export default connect(mapStateToProps, mapDispatchToProps) (HistoryWarning)