import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './style.scss';

class DefectCreate extends Component {
  static propTypes = {
    onChangeShowContainer: PropTypes.func,
  };
  constructor(props) {
    super(props);
    this.onChangeShowContainer = this.onChangeShowContainer.bind(this);
  }  
  onChangeShowContainer(){
    this.props.onChangeShowContainer('list')
  }
  

  render() {   
    return (
      <div className={styles.defectCreate} >
        <h3><span>缺陷创建</span>    <span onClick={this.onChangeShowContainer }>关闭x</span></h3>
        
      </div>
    );
  }
}

export default DefectCreate;