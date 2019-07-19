import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './homepageParts.scss';

class MapResourceData extends Component{
  static propTypes = {
    detail: PropTypes.object,
  }

  constructor(props){
    super(props);
    this.state = {
      currentValue: '--',
      nextValue: '--',
      showNextValue: false,
      valueScroll: 0,
    };
  }

  componentWillReceiveProps(nextProps){
    const { detail } = nextProps;
    const { currentValue } = this.state;
    if(detail.value !== currentValue){
      this.setState({
        showNextValue: true,
        nextValue: detail.value,
        valueScroll: 28,
      });
      this.clocker = setTimeout(()=>this.resetValue(detail.value), 500);
    }
  }

  componentWillUnmount(){
    this.clocker && clearTimeout(this.clocker);
  }

  resetValue = (currentValue) => {
    this.setState({
      showNextValue: false,
      currentValue,
      valueScroll: 0,
    });
  }

  render(){
    const { detail } = this.props;
    const { currentValue, nextValue, showNextValue, valueScroll } = this.state;
    const imgSrc = detail.src;
    return (
      <div className={styles.resource}>
        {imgSrc && <img src={imgSrc} />}
        <div className={styles.resourceDetail}>
          <div className={styles.detailTop}>
            <div className={styles.value}>
              <div
                className={styles.animationBox}
                style={{
                  transform: `translateY(${valueScroll*(-1)}px)`,
                  transitionDuration: `${showNextValue?'0.5s':'0s'}`,
                }}
              >
                <span className={styles.topValue}>{currentValue}</span>
                {showNextValue && <span className={styles.bottomValue}>{nextValue}</span>}
              </div>
            </div>
            <span className={styles.unit}>{detail.unit}</span>
          </div>
          <div className={styles.name}>{detail.name}</div>
        </div>
      </div>
    );
  }
}

export default MapResourceData;
