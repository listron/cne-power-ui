// import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import styles from './defectFilter.scss';

// class StationTypeFilter extends Component {
//   static propTypes = {
//     stationType: PropTypes.string,
//     onChangeFilter: PropTypes.func,
//   }

//   constructor(props) {
//     super(props);
//   }

//   selectStationType = (stationType) => {
//     this.props.getDefectList({
//       ...this.props.listQueryParams,
//       stationType,
//     });
//   }

//   render() {
//     //	电站类型(0:风电，1光伏，2：全部)
//     const { stationType } = this.props;
//     return (
//       <div className={styles.alarmFilterItem}>
//         <span onClick={()=>this.selectStationType('2')} className={styles.all } >不限</span>
//         <span onClick={()=>this.selectStationType('1')} className={styles.pv} >光伏</span>
//         <span onClick={()=>this.selectStationType('0')} className={styles.wind} >风电</span>
//       </div>
//     );
//   }

// }

// export default StationTypeFilter;