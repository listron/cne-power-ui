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
  componentDidMount(){
    const main = document.getElementById('main');
    if(main){
      main.addEventListener('scroll', this.onScroll)
    }
  }

  componentWillUnmount() {
    const main = document.getElementById('main');
    main && main.removeEventListener('scroll', this.onScroll);
  }

  onScroll = () => {
    const main = document.getElementById('main');
    const scrollTop = main.scrollTop;
    if(scrollTop > 0){
      this.setState({
        isScroll: true
      });
    }
  }

  render(){
    const { isScroll } = this.state;
    return (
      <div className={styles.appFloat} style={{height: this.state.isScroll ? 140 : 105}}>
        <div className={styles.floatItem}><Icon type="android-o" /></div>
        <div className={styles.floatItem}><Icon type="apple-o" /></div>
        <div className={styles.floatItem}><Icon type="wechat" /></div>
        {isScroll && <div className={styles.floatItem}><Icon type="up-circle-o" /></div>}
      </div>
    )
  }
}

export default FixedHelper;