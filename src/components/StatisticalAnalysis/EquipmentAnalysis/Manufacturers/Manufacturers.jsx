import React, { Component } from 'react';
import styles from './manufacturers.scss';
import PropTypes from 'prop-types';
import Search from './Search';
import Charts from './chart';

class Manufacturers extends Component {
  static propTypes = {
    resetStore: PropTypes.func,
    getChartsData: PropTypes.func,
    stationCode: PropTypes.array,
    deviceTypeNameLike: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    manufacturers: PropTypes.array,
    conversioneffList: PropTypes.array,
    faultNumList: PropTypes.array,
    faultHoursList: PropTypes.array,
    deviceCapacityList: PropTypes.array,
    selectOption: PropTypes.string,
    loading: PropTypes.bool,
    theme: PropTypes.string,
  }

  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    const { stationCode, deviceTypeNameLike, startDate, endDate, manufacturers } = this.props;
    const parms = { stationCode, deviceTypeNameLike, startDate, endDate, manufacturers };
    this.props.getChartsData(parms);
  }

  render() {
    const { conversioneffList, faultNumList, faultHoursList, deviceCapacityList, selectOption, loading, theme } = this.props;
    return (
      <div className={`${styles.manufacturers} ${styles[theme]}`}>
        <Search {...this.props} />
        <div className={styles.manuCont}>
          <Charts type={'conversioneff'} data={conversioneffList} selectOption={selectOption} loading={loading} theme={theme} />
          <Charts type={'faultHours'} data={faultHoursList} selectOption={selectOption} loading={loading} theme={theme} />
          <Charts type={'faultNum'} data={faultNumList} selectOption={selectOption} loading={loading} theme={theme} />
          <Charts type={'deviceCapacity'} data={deviceCapacityList} selectOption={selectOption} loading={loading} theme={theme} />
        </div>
      </div>
    );
  }
}

export default Manufacturers
  ;