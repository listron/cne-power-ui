import React, { Component } from 'react';
import DefectCreateForm from './DefectCreateForm';
import PropTypes from 'prop-types';
import styles from './style.scss';

class DefectCreateMain extends Component {
  static propTypes = {
    stations: PropTypes.array,
  };
  constructor(props) {
    super(props);
  }  

  render() {   
    return (
      <div className={styles.defectCreate}>
        form表单区域，，，，，，
        <DefectCreateForm />
      </div>
    );
  }
}

export default DefectCreateMain;