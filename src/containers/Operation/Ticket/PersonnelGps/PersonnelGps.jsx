import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styles from './personnel.scss';
import GpsMap from './GpsMap.jsx';
import {personnelGpsAction} from './personnelGpsAction.js';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer';
class PersonnelGps extends Component {
  static propTypes = { 
    getPersonnelGpsData: PropTypes.func,
    personnelGpsData: PropTypes.array,
  }
  constructor(props) {
    super(props);
  }

  componentDidMount() {
   this.props.getPersonnelGpsData()
  }

  render() {
    const{personnelGpsData}=this.props;
    let data = [];
    personnelGpsData.forEach((item, index) => {   
      data.push({
        name: item.username,
        value: [item.longitude, item.latitude],
      
        symbol: 'image:///img/position.png',
      })
    })
  
    const breadCrumbData = {
      breadData: [
        {
          name: '工单列表',
        }
      ],
    };
    return (
      <div className={styles.ticketBox}>
        <CommonBreadcrumb  {...breadCrumbData} style={{ marginLeft: '38px' }} />
        <div className={styles.ticket}>
          <div className={styles.inspectCreate}>
            <div className={styles.createTop}>
              <span className={styles.text}>员工定位</span>
             
            </div>
            <div className={styles.createContent}>
              <GpsMap testId={'personnelGps'} personnelGpsData={data} />
            </div>
          </div>
          <Footer />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
...state.operation.personnelGps.toJS()
})
const mapDispatchToProps = (dispatch) => ({
  getPersonnelGpsData: payload => dispatch({ type: personnelGpsAction.getPersonnelGpsData, payload }),
})
export default connect(mapStateToProps, mapDispatchToProps)(PersonnelGps);