import React,{ Component } from 'react';
import styles from './style.scss';

class Footer extends Component {
  static propTypes = {
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.state = {
    };  
  }


  render() {
    return (
      <div className={styles.footer}>
        <span className={styles.footerText}>京ICP备12030847号-2 © 2017-2018 北京动力协合科技有限公司</span>
      </div>
    );
  }
}

export default Footer;