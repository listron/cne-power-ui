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
    allowedActions: PropTypes.array,
  };

  state = {
    visible: false,
  }

  toAddUndoneDefect = () => { // 新建未解决消缺工单
    const { location, history } = this.props;
    const { pathname } = location;
    history.push(`${pathname}?page=defectDetail&isFinish=0`);
    this.setState({ visible: false });
  }

  toAddAlldoneDefect = () => { // 新建已解决消缺工单
    const { location, history } = this.props;
    const { pathname } = location;
    history.push(`${pathname}?page=defectDetail&isFinish=1`);
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

  exchangeActioncode = (allActions, code) => {
    const cur = allActions.filter(e => e.actionCode === code);
    return cur.length > 0 && !cur[0].isPermission || false;
  }

  render() {
    const { stateAndTotalList = [], listParams = {}, total, allowedActions = [] } = this.props;
    const { pageSize = 30, pageNum = 1, stateId } = listParams || {};
    // 为什么actionCode 一直在变化 k用户 11 12
    const undoneBtn = this.exchangeActioncode(allowedActions, '11'); // 未解决‘
    const alldoneBtn = this.exchangeActioncode(allowedActions, '12'); // 已解决‘
    return (
      <div className={styles.defectsHandler}>
        <div className={styles.leftHandler}>
          {(undoneBtn || alldoneBtn) &&
            <Dropdown
              overlayClassName={styles.addDropDown}
              trigger={['click']}
              visible={this.state.visible}
              overlay={<div className={styles.solveStatus}>
                {undoneBtn && <CneButton className={styles.undoneBtn} onClick={this.toAddUndoneDefect}>
                  <i className={`iconfont icon-undone ${styles.undoneIcon}`} />
                  <span className={styles.text}>未解决</span>
                </CneButton>
                }
                {alldoneBtn && <CneButton className={styles.alldoneBtn} onClick={this.toAddAlldoneDefect}>
                  <i className={`iconfont icon-alldone ${styles.alldoneIcon}`} />
                  <span className={styles.text}>已解决</span>
                </CneButton>}
              </div>}
              placement="bottomLeft"
              onVisibleChange={this.handleVisibleChange}
            >
              <CneButton className={styles.addBtn} onClick={this.toAddDefect}>
                <i className={`iconfont icon-newbuilt ${styles.addIcon}`} />
                <span className={styles.text}>新建</span>
              </CneButton>
            </Dropdown>
          }
          <RadioGroup onChange={this.onChangeStatus} value={stateId || 0}>
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
