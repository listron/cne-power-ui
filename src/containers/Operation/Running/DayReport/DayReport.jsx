import React, { Component } from 'react';
import { connect } from 'react-redux';
import TransitionContainer from '../../../../components/Common/TransitionContainer';
import PropTypes from 'prop-types';

class DayReport extends Component {
  static propTypes = {

  }
  constructor(props) {
    super(props);
    this.state = {
      showSidePage: 'list'
    }
  }

  componentDidMount(){

  }

  componentWillUnmount(){
    
  }

  render() {
    return (
      <div>
        日报主页！！！
        <div>
          <TransitionContainer
            show={false}
            timeout={500}
            effect="side"
          >
            <div>这个！</div>
          </TransitionContainer>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
  
});

export default connect(mapStateToProps, mapDispatchToProps)(DayReport);
