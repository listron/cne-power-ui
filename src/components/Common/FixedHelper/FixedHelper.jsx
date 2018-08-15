import React, { Component } from 'react';
import styles from './fixedHelper.scss';
import { Icon } from 'antd';

class FixedHelper extends Component {
  constructor(props){
    super(props);
    this.state = {
      isScroll: false,
    }
  }
  // componentDidMount(){
  //   if (this.refs.main) {
  //     this.refs.main.addEventListener('scroll', this.onScroll);
  //   }
  // }

  // componentWillUnmount() {
  //   if(this.refs.main) {
  //     this.refs.main.removeEventListener('scroll', this.onScroll);
  //   }
  // }

  // onScroll = () => {
  //   let isScroll = this.refs.main.scrollTop > 0;
  //   this.setState({
  //     isScroll
  //   });
  // }

  render(){
    return (
      <div className={styles.appFloat} style={{height: this.state.isScroll ? 140 : 105}}>
        <div className={styles.floatItem}><Icon type="android-o" /></div>
        <div className={styles.floatItem}><Icon type="apple-o" /></div>
        <div className={styles.floatItem}><Icon type="wechat" /></div>
        {this.state.isScroll && 
        <div className={styles.floatItem}><Icon type="up-circle-o" /></div>}
      </div>
    )
  }
}

export default FixedHelper;