import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './defect.scss';
import Search from 'antd/lib/input/Search';

class DefectTabelList extends Component {
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
      <div className={`${styles.tabelList} ${styles[theme]}`}>
        列表页
      </div>
    );
  }
}

export default DefectTabelList;
