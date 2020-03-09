import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ContentLayout from '@components/Common/ContentLayout';
import styles from './overview.scss';
import searchUtil from '@utils/searchUtil';
import DefectList from '../NewDefectList/DefectList';
import InspectList from '../NewInspectList/InspectList';
import MeterList from '../NewMeterList/MeterList';
import DefectDetail from '../NewDefectDetail/DefectDetail';
import InspectDetail from '../NewInspectDetail/InspectDetail';
import MeterDetail from '../NewMeterDetail/MeterDetail';


/**
 *  params  url
 *   page=list&tab=defect&tab=meter 列表缺陷页面 teb inspect 巡检页面 meter 抄表列表页面
 *   page=defectDetail&defectId=123 缺陷详情页面 缺陷ID
 *   page=inspectDetail&inspectId=123 巡检详情页面 巡检ID
 *   page=meterDetail&meterId=123 抄表详情页面 抄表ID
 */
class Overview extends Component {

  static propTypes = {
    theme: PropTypes.string,
    location: PropTypes.object,
    history: PropTypes.object,
  };

  constructor() {
    super();
    this.state = {
      tab: 'meter',
      page: 'list',
    };
  }

  componentDidMount() { // page list 列表页 defectDetail 缺陷详情 inspectDetail 巡检详情 defectId 缺陷ID inspectId 巡检ID
    const { history } = this.props;
    const { search, pathname } = history.location;
    const { page = 'list', tab = 'meter' } = searchUtil(search).parse(); //默认为缺陷列表页
    this.setState({ page, tab });

  }

  componentWillReceiveProps(nextProps) {
    const { history } = nextProps;
    const { search, pathname } = history.location;
    const { page = 'list', tab = 'meter' } = searchUtil(search).parse(); //默认为缺陷列表页
    this.setState({ page, tab });
  }

  shouldComponentUpdate(nextProps) {
    const { location, history } = nextProps;
    const preLocation = this.props.location;
    const { pathname, search } = preLocation;
    const preSearch = preLocation.search;
    if (!location.search && preSearch) { // 点击目录菜单 => 页面维持不改, 路径维持不变。
      history.push(`${pathname}${search}`);
      return false;
    }
    return true;
  }


  queryTargetData = (value) => { //  切换tab
    const { location, history } = this.props;
    const { pathname } = location;
    history.push(`${pathname}?page=list&tab=${value}`);
  }


  render() {
    const { theme = 'light' } = this.props;
    const { tab, page } = this.state;
    return (
      <ContentLayout
        theme={theme}
        contentClassName={`${styles.overview} ${styles[theme]}`}
      >
        <div className={styles.container}>
          {page === 'list' &&
            <div className={styles.list}>
              <div className={styles.tabTitle}>
                {/*<p className={`${tab === 'defect' && styles.activeKey} `} onClick={() => { this.queryTargetData('defect'); }}>消缺</p>*/}
                {/*<p className={`${tab === 'inspect' && styles.activeKey} `} onClick={() => { this.queryTargetData('inspect'); }}>巡检</p>*/}
                <p className={`${tab === 'meter' && styles.activeKey} `} onClick={() => { this.queryTargetData('meter'); }}>抄表</p>
              </div>
              {tab === 'defect' && <DefectList {...this.props} />}
              {tab === 'inspect' && <InspectList {...this.props} />}
              {tab === 'meter' && <MeterList {...this.props} />}
            </div>}
          {page === 'defectDetail' && <DefectDetail {...this.props} />}
          {page === 'inspectDeatail' && <InspectDetail {...this.props} />}
          {page === 'meterDetail' && <MeterDetail {...this.props} />}
        </div>
      </ContentLayout>
    );
  }
}



export default Overview;
