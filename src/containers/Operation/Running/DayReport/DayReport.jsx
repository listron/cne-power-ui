import React, { Component } from 'react';
import { connect } from 'react-redux';
import TransitionContainer from '../../../../components/Common/TransitionContainer';
import PropTypes from 'prop-types';
import styles from './dayReport.scss';

class DayReport extends Component {
  static propTypes = {
    showPage: PropTypes.string,
  }
  constructor(props) {
    super(props);
    this.state = {
      showPage: 'list'
    }
  }

  componentDidMount(){

  }

  componentWillUnmount(){
    
  }

  onShowSideChange = ({ showSidePage }) => {
    this.setState({ showSidePage });
  }

  onToggleSide = () => {
    const { showPage } = this.props;
    this.setState({
      showSidePage: showPage
    });
  }

  render() {
    const { showPage } = this.state;
    return (
      <div className={styles.dayReport}>
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
