import React, { Component } from 'react';
import DefectCreateForm from './DefectCreateForm';
import styles from './newDefect.scss';

class DefectCreate extends Component {
  constructor(props) {
    super(props);
  }  

  render() { 
    return (
      <div className={styles.defectCreate}>
        <DefectCreateForm {...this.props} />
      </div>
    );
  }
}

export default DefectCreate;