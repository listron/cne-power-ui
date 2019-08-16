import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Cascader } from 'antd';

class IndicateCascader extends Component {

  static propTypes = {
    selectedQuota: PropTypes.object,
    quotaInfo: PropTypes.array,
    onChange: PropTypes.func,
  }

  getQuota = (quotaInfo = [], selectedQuota) => {
    let quotaResult = [], resultInfo = {};
    const quataValue = selectedQuota && selectedQuota.value;
    quotaInfo.find(e => {
      const { children = [], value } = e || {};
      if (value === quataValue && children.length === 0) {
        quotaResult = [value];
        resultInfo = { ...e };
        return true;
      }
      return children.find(m => {
        const isThatQuota = m.value === quataValue;
        if (isThatQuota) {
          quotaResult = [value, quataValue];
          resultInfo = { ...m };
        }
        return isThatQuota;
      });
    });
    return { quotaResult, resultInfo };
  }

  onQuotaChange = (codes, fullInfo) => {
    console.log(codes, fullInfo)
    this.props.onChange(codes, fullInfo);
  }

  render() {
    const { quotaInfo, selectedQuota } = this.props;
    const { quotaResult } = this.getQuota( quotaInfo, selectedQuota);
    return (
      <Cascader
        allowClear={false}
        placeholder="请选择"
        style={{width: '150px'}}
        options={quotaInfo}
        onChange={this.onQuotaChange}
        value={(quotaInfo.length > 0 && quotaResult.length > 0) ? quotaResult : []}
      />
    );
  }
}

export default IndicateCascader;

