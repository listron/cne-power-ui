import React, { Component } from 'react';
import PropTypes from 'prop-types';
import QuotaList from './QuotaList';
// import FaultList from './FaultList';
// import LimitList from './LimitList';

class ListType extends Component {
  static propTypes = {
    tableType: PropTypes.string,
  }

  render(){
    const { tableType } = this.props;
    return (
      <div>
        {tableType === 'quotaList' && <QuotaList {...this.props} />}
        {/* {tableType === 'faultList' && <FaultList {...this.props} />}
        {tableType === 'limitList' && <LimitList {...this.props} />} */}
      </div>
    );
  }
}

export default ListType;
