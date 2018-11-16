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
      nextValue: null,
    }
  }

  componentDidMount(){
    
  }

  componentWillReceiveProps(nextProps){
    // {src: '/img/ico_wind.png', value: 5.84, unit: 'm/s', name: '风资源'},
    const { detail } = nextProps;
    const curDetail = this.props.detail;
    if(detail.value !== detail.curValue){
      console.log(detail);
      console.log(curDetail);
    }
  }

  render(){
    const { detail } = this.props;
    const { currentValue, nextValue } = this.state;
    const imgSrc = detail.src;
    return (
      <div className={styles.resource}>
        {imgSrc && <img src={imgSrc}  />}
        <div className={styles.resourceDetail}>
          <div>
            <span className={styles.value}>
              {(currentValue || currentValue === 0) && <span>{currentValue}</span>}
              <span>{nextValue}</span>
            </span>
            <span className={styles.unit}>{detail.unit}</span>
          </div>
          <div className={styles.name}>{detail.name}</div>
        </div>
      </div>
    )
  }
}

export default MapResourceData;
