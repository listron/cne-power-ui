import React, { Component } from 'react';
// import InputLimit from '../../components/Common/InputLimit';
// import InspectDetail from '../Operation/Ticket/Inspect/InspectDetail';
import PropTypes from 'prop-types';
// import TimeLines from '../../components/Common/TimeLines';
class Pone extends Component {
  static propTypes = {
      placeHolder : PropTypes.string,
      size : PropTypes.number,
      value : PropTypes.string,
      status : PropTypes.number,
      processData : PropTypes.array,
  }

  constructor(props) {
    super(props);
    this.state = {
    };
    this.handleInput=this.handleInput.bind(this);
  }

  handleInput(value){
    this.setState({
      value: value,
    })
  }

  render() {
    return (
      
      <div style={{width:'80%',margin:'0 auto',}} >
        {/*<InputLimit placeHolder={this.state.placeHolder} width={this.state.width} handleInput={this.handleInput} size={this.state.size}  />
        <p>{this.state.value}</p>*/}
        {/* <TimeLines status={this.state.status} processData={this.state.processData} />  */}

      </div>
    );
  }
}

export default Pone;