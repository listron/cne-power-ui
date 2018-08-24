import React from "react";
import PropTypes from "prop-types";
import { Checkbox, message, Tabs, Col, Row } from 'antd';


const plainOptions = ['Apple', 'Pear', 'Orange'];
const defaultCheckedList = ['Apple', 'Orange'];

class StationSelect extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      showFilter: '',
      key: '1',
      checkedList: defaultCheckedList,
      indeterminate: true,
      checkAll: false,
    }
  }
  onFilterShowChange = (filterText) => {
    const { showFilter } = this.state;
    if (showFilter === filterText) {
      this.setState({
        showFilter: ''
      })
    } else {
      this.setState({
        showFilter: filterText
      })
    }
  }
  onChange = (checkedList) => {
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && (checkedList.length < plainOptions.length),
      checkAll: checkedList.length === plainOptions.length,
    });
  }

  onCheckAllChange = (e) => {
    this.setState({
      checkedList: e.target.checked ? plainOptions : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  }


  handleButtonClick = (e) => {
    message.info('Click on left button.');
    console.log('click left button', e);
  }

  handleStationMenuClick = (e) => {
    message.info('Click on menu item.');
    console.log('click', e);
  }

  handleDayMenuClick = (e) => {
    message.info('Click on menu item.');
    console.log('click', e);
  }
  callback = (key) => {
    console.log(key);
  }


  render() {
    const TabPane = Tabs.TabPane;
    const CheckboxGroup = Checkbox.Group;
    return (
      <div style={{ background: '#f1f1f1' }}>

        <Tabs defaultActiveKey="1" onChange={this.callback}>
          <TabPane tab="不限" key="1">
            <div>
              <Row>
                <Col span={3}>
                  <Checkbox
                    indeterminate={this.state.indeterminate}
                    onChange={this.onCheckAllChange}
                    checked={this.state.checkAll}
                  >
                    Check all
                  </Checkbox></Col>
                <CheckboxGroup options={plainOptions} value={this.state.checkedList} onChange={this.onChange} />

              </Row>

            </div>
          </TabPane>
          <TabPane tab="山东" key="2">Content of Tab Pane 2</TabPane>
          <TabPane tab="山西" key="3">Content of Tab Pane 3</TabPane>
        </Tabs>
      </div>
    )
  }
}
export default (StationSelect)