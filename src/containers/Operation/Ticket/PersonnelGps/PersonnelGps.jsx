import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Icon } from 'antd';
import styles from './personnel.scss';
import WarningTip from '../../../../components/Common/WarningTip';
import GpsMap from './GpsMap.jsx';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer';
class PersonnelGps extends Component {
  static propTypes = {
    deviceTypeItems: PropTypes.object,
    onChangeShowContainer: PropTypes.func,
    createInspect: PropTypes.func,
    stations: PropTypes.object,
    getStations: PropTypes.func,
    showContainer: PropTypes.string,
    changeInspectStore: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      showWarningTip: false,
    }
  }

  componentDidMount() {
  }

  onCloseInspectCreate = () => {
    this.setState({
      showWarningTip: true,
      warningTipText: '退出后信息无法保存!'
    });
  }

  onCancelWarningTip = () => {
    this.setState({
      showWarningTip: false,
    });
  }

  onConfirmWarningTip = () => {
    this.setState({
      showWarningTip: false,
    });
    this.props.onChangeShowContainer({ container: 'detail' });
  }

  render() {
    const { showWarningTip, warningTipText } = this.state;
    const breadCrumbData = {
      breadData: [
        {
          name: '工单列表',
        }
      ],
    };
    return (
      <div className={styles.ticketBox}>
        <CommonBreadcrumb  {...breadCrumbData} style={{ marginLeft: '38px' }} />
        <div className={styles.ticket}>
          <div className={styles.inspectCreate}>
            {showWarningTip && <WarningTip style={{ marginTop: '250px', width: '210px', height: '88px' }} onCancel={this.onCancelWarningTip} onOK={this.onConfirmWarningTip} value={warningTipText} />}
            <div className={styles.createTop}>
              <span className={styles.text}>员工定位</span>
              <Icon type="arrow-left" className={styles.backIcon} onClick={this.onCloseInspectCreate} />
            </div>
            <div className={styles.createContent}>
              <GpsMap testId={'personnelGps'} stationDataList={[]} />
            </div>
          </div>
          <Footer />
        </div>
      </div>


    );
  }

}

const mapStateToProps = (state) => ({

})
const mapDispatchToProps = (dispatch) => ({

})
export default connect(mapStateToProps, mapDispatchToProps)(PersonnelGps);