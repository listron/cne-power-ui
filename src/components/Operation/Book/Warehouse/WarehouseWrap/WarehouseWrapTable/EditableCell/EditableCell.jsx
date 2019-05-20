import React from "react";
import { Form, Input, Select } from 'antd';
import PropTypes from "prop-types";

const FormItem = Form.Item;
const { Option } = Select;
const EditableContext = React.createContext();

class EditableCell extends React.Component {
  static propTypes = {
    deviceFactorsList: PropTypes.array,
    inputType: PropTypes.string
  };
  getInput = () => {
    const { deviceFactorsList, inputType } = this.props;
    if (inputType === 'text') {
      return <Input onChange={this.testValue} />
    }
    return (
      <Select
        onSelect={this.selectManufactor}
        style={{ width: 194 }}
        placeholder="请选择厂家" >
        {deviceFactorsList.map(e => (<Option key={e.manufactorCode} value={e.manufactorId}>
          {e.manufactorName}
        </Option>))}
      </Select>);
  };
  testValue = (e) => {
    console.log('设备型号的编辑', e.target.value);

  }
  selectManufactor=(value)=>{
    console.log('value: ', value);

  }
  render() {

    const {
      editing,
      dataIndex,
      title,
      // inputType,
      record,
      index,
      form,
      ...restProps
    } = this.props;
    const { getFieldDecorator } = form;
    return (
      <EditableContext.Consumer>
        {(form) => {
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    rules: [{
                      required: true,
                      message: `请输入 ${title}!`,
                    }],
                    initialValue: record[dataIndex],
                  })(this.getInput())}
                </FormItem>
              ) : restProps.children}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}
export default (EditableCell)
