import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DefectList from './DefectList/DefectList';
import DefectDetail from './DefectDetail/DefectDetail';
import DefectCreate from './DefectCreate/DefectCreate';


class Defect extends Component {
  static propTypes = {
    showContainer: PropTypes.string,
    showTab: PropTypes.string,
    onChangeShowContainer: PropTypes.func
  };
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidUpdate(nextProps) {
    return nextProps.showContainer !== this.props.showContainer;
  }

  render() {
    return (
      <div style={{display:"flex", flex: 1}}>
        {this.props.showContainer === 'detail' && (<DefectDetail onChangeShowContainer={this.props.onChangeShowContainer} />)}
        {this.props.showContainer === 'list' && (<DefectList showTab={this.props.showTab} onChangeShowContainer={this.props.onChangeShowContainer} />)}
        {this.props.showContainer === 'create' && (<DefectCreate onChangeShowContainer={this.props.onChangeShowContainer} />)}
      </div>
    );
  }
}

export default Defect;