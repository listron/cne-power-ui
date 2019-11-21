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
    const { stationContrastDetail, theme, stationContrastList, loading } = this.props;
    // console.log('loading---table: ', loading);
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
      <div className={styles.stationContrastTable} >
        <div className={styles.baseNameBox} >
          {stationContrastBaseName.map((e, i) => {
            return (<div className={styles.baseName} key={i}>
              <div className={styles.baseClassifyName} ><span>{e.baseClassifyName}</span></div>
              <div className={styles.rowName} >
                {e.rowName.map((item, index) => {
                  if (item === '电站名称') {
                    return (<div className={styles.stationnameBg} key={index}>{item}</div>);
                  }
                  return (<div key={index}>{item}</div>);
                })}
              </div>
            </div>);
          })}
        </div>
        <div className={styles.limitWidth}>
          {stationContrastList &&
            // {stationContrastList && stationContrastList.length === 2 &&
            (<div className={styles.stationOne} >
              <div className={styles.test}>
                {stationContrastList.map((e, i) => (<div key={i} title={e.stationName} className={`${styles.baseInfoBg} ${styles.stationnameBg}`} >{e.stationName || '--'}</div>))}
              </div>
              <div className={styles.test}>
                {stationContrastList.map((e, i) => (<div key={i} title={e.ongridTime} className={styles.baseInfoBg} >{e.ongridTime || '--'}</div>))}
              </div>
              <div className={styles.test}>
                {stationContrastList.map((e, i) => (<div key={i} title={e.capacity} className={styles.baseInfoBg} >{(e.capacity ? (+e.capacity).toFixed(2) : '--') || '--'}</div>))}
              </div>
              <div className={styles.test}>
                {stationContrastList.map((e, i) => (<div key={i} title={e.regionName} className={styles.baseInfoBg} >{e.regionName || '--'}</div>))}
              </div>
              <div className={styles.test}>
                {stationContrastList.map((e, i) => (<div key={i} title={e.unitCount} className={styles.baseInfoBg} >{e.unitCount || '--'}</div>))}
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
                      {stationContrastList.map((e, i) => (<div key={i} title={e[item[0]]} className={styles.stationContrastOne} >{e[item[0]] || '--'}</div>))}

                    </Popover>
                  </div>
                );
              })}
            </div>)
          }
        </div>
      </div>
    );
  }
}
export default StationContrastTable;
