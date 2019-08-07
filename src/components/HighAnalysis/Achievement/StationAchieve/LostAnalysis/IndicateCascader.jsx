import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Cascader } from 'antd';

class IndicateCascader extends Component {

  static propTypes = {
    lostQuota: PropTypes.string,
    quotaInfo: PropTypes.array,
  }

  getQuota = (quotaInfo = [], lostQuota) => {
    let quotaResult = [];
    quotaInfo.find(e => {
      const { children = [], value } = e || {};
      return children.find(m => {
        const isThatQuota = m.value === lostQuota;
        if (isThatQuota) {
          quotaResult = [value, lostQuota];
        }
        return isThatQuota;
      });
    });
    return quotaResult;
  }

  onQuotaChange = (a, b, c) => {
    console.log(a, b, c)
  }

  render() {
    const { quotaInfo, lostQuota } = this.props;
    const quotaValue = this.getQuota( quotaInfo, lostQuota);
    return (
      <Cascader
        allowClear={false}
        style={{width: '150px'}}
        options={quotaInfo}
        onChange={this.onQuotaChange}
        value={(quotaInfo.length > 0 && quotaValue.length > 0) ? quotaValue : []}
      />
    );
  }
}

export default IndicateCascader;

