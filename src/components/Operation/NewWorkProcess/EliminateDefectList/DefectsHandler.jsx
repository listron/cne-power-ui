import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CneButton from '@components/Common/Power/CneButton';
import CommonPagination from '@components/Common/CommonPagination';
import { Radio, Dropdown } from 'antd';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
import styles from './listPage.scss';

export default class DefectsHandler extends Component {

  static propTypes = {
    listParams: PropTypes.object,
    stateAndTotalList: PropTypes.array,
    total: PropTypes.number,
    getDefectList: PropTypes.func,
  };

  state = {
    visible: false,
  }

  toAddUndoneDefect = () => { // 新建未解决消缺工单
    console.log('新建未解决消缺工单');
    this.setState({ visible: false });
  }

  toAddAlldoneDefect = () => { // 新建已解决消缺工单
    console.log('新建已解决消缺工单');
    this.setState({ visible: false });
  }

  handleVisibleChange = visible => {
    this.setState({ visible });
  };

  onChangeStatus = ({ target }) => { // 全部时候, 需转为null;
    const { listParams } = this.props;
    this.props.getDefectList({
      ...listParams,
      stateId: target.value === 0 ? null : target.value,
    });
  }

  onPaginationChange = ({ currentPage, pageSize }) => { // 翻页
    const { listParams } = this.props;
    this.props.getDefectList({
      ...listParams,
      pageSize,
      pageNum: currentPage,
    });
  }

  render() {
    const { stateAndTotalList = [], listParams = {}, total } = this.props;
    const { pageSize = 30, pageNum = 1, stateId } = listParams || {};
    return (
      <div className={styles.defectsHandler}>
        <div className={styles.leftHandler}>
          <Dropdown
            overlayClassName={styles.addDropDown}
            trigger={['click']}
            visible={this.state.visible}
            overlay={<div className={styles.solveStatus}>
              <CneButton className={styles.undoneBtn} onClick={this.toAddUndoneDefect}>
                <i className={`iconfont icon-undone ${styles.undoneIcon}`} />
                <span className={styles.text}>未解决</span>
              </CneButton>
              <CneButton className={styles.alldoneBtn} onClick={this.toAddAlldoneDefect}>
                <i className={`iconfont icon-alldone ${styles.alldoneIcon}`} />
                <span className={styles.text}>已解决</span>
              </CneButton>
            </div>}
            placement="bottomLeft"
            onVisibleChange={this.handleVisibleChange}
          >
            <CneButton className={styles.addBtn} onClick={this.toAddDefect}>
              <i className={`iconfont icon-newbuilt ${styles.addIcon}`} />
              <span className={styles.text}>新建</span>
            </CneButton>
          </Dropdown>
          <RadioGroup onChange={this.onChangeStatus} value={stateId || 0 }>
            <RadioButton value={0}>全部</RadioButton>
            {stateAndTotalList.map(e => (
              <RadioButton
                key={e.stateId}
                value={e.stateId}
              >{`${e.stateName} ${e.total}`}</RadioButton>
            ))}
          </RadioGroup>
        </div>
        <CommonPagination
          pageSize={pageSize}
          currentPage={pageNum}
          total={total}
          onPaginationChange={this.onPaginationChange}
        />
      </div>
    );
  }
}
