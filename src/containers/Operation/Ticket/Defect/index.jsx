import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DefectList from './DefectList';
import DefectDetail from './DefectDetail';
import DefectCreateContainer from './DefectCreate/DefectCreateContainer';


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

  componentDidUpdate(nextProps) {
    return nextProps.showContainer !== this.props.showContainer;
  }

  render() {
    return (
      <div style={{display:"flex", flex: 1}}>
        {this.props.showContainer === 'detail' && (<DefectDetail />)}
        {this.props.showContainer === 'list' && (<DefectList />)}
        {this.props.showContainer === 'creatNew' && (<DefectCreateContainer onChangeShowContainer={this.props.onChangeShowContainer} />)}
      </div>
    );
  }
}

export default Defect;