import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './defect.scss';
import FilterConditions from '@components/Common/FilterConditions/FilterCondition';
import Search from 'antd/lib/input/Search';

class DefectSearch extends Component {
  static propTypes = {
    theme: PropTypes.string,
  };

  constructor(props, context) {
    super(props);
    this.state = {};
  }

  componentDidMount() {

  }

  render() {
    const { theme } = this.props;
    return (
      <div className={`${styles.seacrchCont} ${styles[theme]}`}>
        查询条件
      </div>
    );
  }
}

export default DefectSearch;
