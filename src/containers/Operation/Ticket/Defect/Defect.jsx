import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DefectList from './DefectList/DefectList';
import DefectDetail from './DefectDetail/DefectDetail';
import DefectCreate from './DefectCreate/DefectCreate';


class Defect extends Component {
  static propTypes = {
    showContainer: PropTypes.string,
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
        {this.props.showContainer === 'detail' && (<DefectDetail />)}
        {this.props.showContainer === 'list' && (<DefectList />)}
        {this.props.showContainer === 'create' && (<DefectCreate />)}
      </div>
    );
  }
}

export default Defect;