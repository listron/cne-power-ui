
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './cleanoutRecordSide.scss';
import CleanoutRecordDetail from './CleanoutRecordDetail';

class CleanoutRecordSide extends Component {
  static propTypes = {
    showSidePage: PropTypes.string,
  }

  constructor(props){
    super(props);
    
  }
  
  onShowSideChange = ({showSidePage}) => {
    this.setState({ showSidePage });
  }

  onToggleSide = () => {
    const { showPage } = this.props;
    this.setState({
      showSidePage: showPage
    });
  }


  render(){
    const { showSidePage } = this.props;
    return (
      <div className={styles.cleanoutRecordSide}>
       抽屉详情页
       { showSidePage === 'detail' && <CleanoutRecordDetail {...this.props} /> }
       { showSidePage === 'planRecord' && <CleanoutRecordDetail {...this.props} /> }
   
      </div>
    )
  }
}

export default CleanoutRecordSide;
