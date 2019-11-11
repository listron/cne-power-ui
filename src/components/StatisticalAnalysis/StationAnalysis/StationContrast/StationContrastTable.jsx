import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Popover, Icon } from 'antd';
import styles from './stationContrast.scss';
import StationContrastDetail from './StationContrastDetail';
import { stationContrastDataInfo, stationContrastBaseName } from '../../../../constants/stationContrastBaseInfo';

class StationContrastTable extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    form: PropTypes.object,
    stations: PropTypes.array,
    toChangeStationContrastStore: PropTypes.func,
    getStationContrast: PropTypes.func,
    stationCode: PropTypes.array,
    dateType: PropTypes.string,
    year: PropTypes.array,
    getStationContrastDetail: PropTypes.func,
    month: PropTypes.number,
    stationContrastDetail: PropTypes.array,
    stationContrastList: PropTypes.array,
    theme: PropTypes.string,
  }
  constructor(props) {
    super(props);
    this.state = {
      clicked: false,
    };
  }

  onVisibleChange = (item) => {
    if (!item) {
      this.props.toChangeStationContrastStore({
        stationContrastDetail: [],
      });
      this.setState({
        clicked: false,
      });
    }
  }
  chartlegend = (e) => {
    e.preventDefault();
    e.stopPropagation();
  }
  closePop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.toChangeStationContrastStore({
      stationContrastDetail: [],
      column: '',
    });
    this.setState({
      clicked: false,
    });

  }
  showContrastDetail = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { stations, stationCode, dateType, year, month } = this.props;
    this.props.toChangeStationContrastStore({
      column: e.currentTarget.getAttribute('data-rowName'),
    });
    const column = e.currentTarget.getAttribute('data-datafieldname');

    dateType === 'day' ?
      this.props.getStationContrastDetail({
        stationCode,
        dateType,
        year,
        month,
        column,
      }) : this.props.getStationContrastDetail({
        stationCode,
        dateType,
        year,
        column,
      });
    this.setState({
      clicked: column,
    });
  }

  render() {
    const { stationContrastDetail, theme, stationContrastList } = this.props;
    const { clicked } = this.state;
    const content = (
      <div onClick={this.chartlegend}>
        <StationContrastDetail
          stationContrastDetail={stationContrastDetail}
          theme={theme}
          {...this.props}
        />
        <Icon type="close" className={styles.closeStyle} onClick={this.closePop} />
      </div>
    );

    return (
      <Row className={styles.stationContrastTable} >
        <Col span={4} className={styles.baseNameBox} >
          {stationContrastBaseName.map((e, i) => {
            return (<Row className={styles.baseName} key={i}>
              <Col className={styles.baseClassifyName} span={5}><span>{e.baseClassifyName}</span></Col>
              <Col className={styles.rowName} span={19}>
                {e.rowName.map((item, index) => {
                  if (item === '电站名称') {
                    return (<div className={styles.stationnameBg} key={index}>{item}</div>);
                  }
                  return (<div key={index}>{item}</div>);
                })}
              </Col>
            </Row>);
          })}
        </Col>
        {stationContrastList &&
          // {stationContrastList && stationContrastList.length === 2 &&
          (<Col className={styles.stationOne} span={20} >
            <div>
              {stationContrastList.map((e, i) => (<div key={i} className={`${styles.baseInfoBg} ${styles.stationnameBg}`} >{e.stationName || '--'}</div>))}
            </div>
            <div>
              {stationContrastList.map((e, i) => (<div key={i} className={styles.baseInfoBg} >{e.ongridTime || '--'}</div>))}
            </div>
            <div>
              {stationContrastList.map((e, i) => (<div key={i} className={styles.baseInfoBg} >{e.capacity || '--'}</div>))}
            </div>
            <div>
              {stationContrastList.map((e, i) => (<div key={i} className={styles.baseInfoBg} >{e.regionName || '--'}</div>))}
            </div>
            <div>
              {stationContrastList.map((e, i) => (<div key={i} className={styles.baseInfoBg} >{e.unitCount || '--'}</div>))}
            </div>
            <span ref="popover" />
            {Object.entries(stationContrastDataInfo).map((item, index) => {
              return (
                <div key={index} data-rowname={item[0]} data-datafieldname={item[1]} onClick={this.showContrastDetail} >
                  <Popover
                    content={content}
                    trigger="click"
                    getPopupContainer={() => this.refs.popover}
                    onVisibleChange={item => this.onVisibleChange(item)}
                    visible={clicked === item[0]}
                    className={styles.contrastDetailPopover}
                    placement="bottom"
                    overlayClassName={styles.contrastOverlayClassName} >
                    {stationContrastList.map((e, i) => (<div key={i} className={styles.stationContrastOne} >{e[item[0]] || '--'}</div>))}

                  </Popover>
                </div>
              );
            })}
          </Col>)
        }
      </Row>
    );
  }
}
export default StationContrastTable;
