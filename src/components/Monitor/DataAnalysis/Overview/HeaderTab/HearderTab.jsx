import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import searchUtil from '@utils/searchUtil';
import styles from './header.scss';

class HearderTab extends Component{
  static propTypes = {
    tab: PropTypes.string,
    pages: PropTypes.array,
    history: PropTypes.object,
    changeOverviewStore: PropTypes.func,
  }

  tabNames = ['电站数据质量', '设备数据质量', '测点数据质量']
  tabs = ['station', 'device', 'point']

  tabChange = (value) => {
    const { tab, history } = this.props;
    if (value === tab) {
      return;
    }
    const { search } = history.location;
    this.props.changeOverviewStore({ tab: value });
    const newSearch = searchUtil(search).replace({tab: value}).stringify();
    history.push(`/monitor/data/overview?${newSearch}`);
  }

  closeTab = (value) => {
    const { tab, pages, history } = this.props;
    const { search } = history.location;
    const newPages = pages.filter(e => e !== value);
    const newTab = value === tab ? newPages[newPages.length - 1] : tab; // 关闭当前页, tab变化
    this.props.changeOverviewStore({
      tab: newTab,
      pages: newPages,
    });
    const newSearch = searchUtil(search).replace({
      tab: newTab,
      pages: newPages,
    }).stringify();
    history.push(`/monitor/data/overview?${newSearch}`);
  }

  render(){
    const { tab, pages } = this.props;
    return(
      <div className={styles.tabs}>
        {this.tabs.map((e, i) => (
          <div
            key={e}
            className={styles.eachTab}
            style={{display: pages.includes(e) ? 'block' : 'none'}}
          >
            <span
              className={`${styles.button} ${tab === e ? styles.actievButton : ''}`}
              onClick={() => this.tabChange(e)}
            >{this.tabNames[i]}</span>
            {i > 0 && <Icon className={styles.close} type="close" onClick={() => this.closeTab(e)} />}
          </div>
        ))}
      </div>
    );
  }
}

export default HearderTab;
