import React, { Component } from 'react';
import SingleWindRose from './SingleWindRose.jsx';
import styles from './windRose.scss';

export default class WindRose extends Component{
  render(){
    return(
      <div className={styles.windRoseBox}>
        <div className={styles.chartsContainer}>
          {[1, 2, 3].map((cur, index) => {
            return (
              <div className={styles.chartStyle} key={index.toString()}>
                <div className={styles.windRoseChart} >
                  <SingleWindRose {...this.props} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
