import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DefectList from './DefectList';
import DefectDetail from './DefectDetail';
import DefectCreate from './DefectCreate';


class Defect extends Component {
  static propTypes = {
    showContainer: PropTypes.string,
    onChangeShowContainer: PropTypes.func,
  };
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div style={{display:"flex", flex: 1}}>
        {this.props.showContainer === 'detail' && (<DefectDetail />)}
        {this.props.showContainer === 'list' && (<DefectList />)}
        {this.props.showContainer === 'creatNew' && (<DefectCreate onChangeShowContainer={this.props.onChangeShowContainer} />)}
      </div>
    );
  }
}

export default Defect;