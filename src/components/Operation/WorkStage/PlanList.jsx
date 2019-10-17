import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Icon, Button, Radio, Table } from 'antd';
import styles from './workPage.scss';
import { dataFormats } from '@utils/utilFunc';

class PlanList extends PureComponent {

  static propTypes = {
    theme: PropTypes.string,

  };

  state = {

  }

  weekdays = ['周日', ]

  onAdd = () => {
    console.log('add plan');
  }

  render(){
    const {  } = this.props;
    const {  } = this.state;
    return (
      <div>
        <div>
          <Button className={styles.addPlan} type="add" onClick={this.onAdd} >
            <i>+</i>
            <span>添加工作记事</span>
          </Button>
          <span>
            <Icon type="left" />
            <span>2019年6月</span>
            <Icon type="right" />
          </span>
        </div>
        <div>
          <div>

          </div>
        </div>
      </div>
    );
  }
}

export default PlanList;
