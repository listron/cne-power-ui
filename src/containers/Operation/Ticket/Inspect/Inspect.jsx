import React, { Component } from 'react';
import PropTypes from 'prop-types';
import InspectList from './InspectList/InspectList';
import InspectDetail from './InspectDetail/InspectDetail';

class Inspect extends Component {
  static propTypes = {
    showContainer: PropTypes.string,
    onChangeShowContainer: PropTypes.string,
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
        {this.props.showContainer === 'detail' && (<InspectDetail  onChangeShowContainer={this.props.onChangeShowContainer} />)}
        {this.props.showContainer === 'list' && (<InspectList  onChangeShowContainer={this.props.onChangeShowContainer} />)}
      </div>
    );
  }
}

export default Inspect;