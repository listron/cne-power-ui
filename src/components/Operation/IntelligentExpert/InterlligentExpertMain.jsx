import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Button, Select, Icon } from 'antd';
import styles from './intelligentExpert.scss';
import IntelligentSearch from './IntelligentSearch';
import IntelligentTable from './IntelligentTable';

class InterlligentExpertMain extends Component {
  static propTypes = {
    theme: PropTypes.string,
  }

  constructor(props) {
    super(props);

  }

  componentDidMount() {
    const { listParams, getIntelligentTable } = this.props;
    getIntelligentTable(listParams);
  }


  componentWillReceiveProps(nextProps) {
    const { getStationTypeDeviceTypes, stationType, listParams, getIntelligentTable } = nextProps;
    if (this.props.stationType !== nextProps.stationType) {

      getIntelligentTable({ ...listParams, type: stationType });
    }
  }



  render() {
    const { theme } = this.props;
    return (
      <div className={`${styles.intelligentMain} ${styles[theme]}`}>
        <IntelligentSearch {...this.props} />
        {/* <IntelligentTable {...this.props} /> */}
      </div>
    );
  }
}

export default InterlligentExpertMain;
