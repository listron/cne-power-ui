import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styles from './personnel.scss';
import GpsMap from './GpsMap.jsx';
import { personnelGpsAction } from './personnelGpsAction.js';
import CommonBreadcrumb from '../../../components/Common/CommonBreadcrumb';
import Footer from '../../../components/Common/Footer';
class PersonnelGps extends Component {
  static propTypes = {
    getPersonnelGpsData: PropTypes.func,
    personnelGpsData: PropTypes.array,
    theme: PropTypes.string,
  }
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getPersonnelGpsData();
    this.stationInterval = setInterval(() => this.props.getPersonnelGpsData(), 180000);
  }

  componentWillUnmount() {
    if (this.stationInterval) {
      clearInterval(this.stationInterval);
    }
  }

  render() {
    const { personnelGpsData, theme } = this.props;
    const data = [];
    personnelGpsData.forEach((item, index) => {
      data.push({
        name: item.userFullname || item.username,
        value: [item.longitude, item.latitude],
        symbol: 'image:///img/position.png',
      });
    });
    return (
      <div className={`${styles.ticketBox} ${styles[theme]}`}>
        <div className={styles.ticket}>
          <div className={styles.inspectCreate}>
            <div className={styles.createTop}>
              <span className={styles.text}>员工定位</span>

            </div>
            <div className={styles.createContent}>
              <GpsMap testId={'personnelGps'} personnelGpsData={data} theme={theme}/>
            </div>
          </div>
          <Footer theme={theme} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.operation.personnelGps.toJS(),
  theme: state.common.get('theme'),
});
const mapDispatchToProps = (dispatch) => ({
  getPersonnelGpsData: payload => dispatch({ type: personnelGpsAction.getPersonnelGpsData, payload }),
});
export default connect(mapStateToProps, mapDispatchToProps)(PersonnelGps);
