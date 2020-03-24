import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './index.scss';

/**
 */

export default class CustomTable extends PureComponent {

  static propTypes = {
    // theme: PropTypes.string,
  }

  render(){
    const { theme = 'light' } = this.props;
    return (
      <div>
        
      </div>
    );
  }
}
