

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ListHandle from './ListHandle';
import styles from './list.scss';

class List extends Component {
  static propTypes = {
    
  }

  render(){
    return (
      <div className={styles.personnelMain}>
        <ListHandle {...this.props} />
      </div>
    );
  }
}

export default List;
