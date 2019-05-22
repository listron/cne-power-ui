import React from "react";
import { Form, Input } from 'antd';
import PropTypes from "prop-types";

const FormItem = Form.Item;
const EditableContext = React.createContext();

class EditableCell extends React.Component {
  static propTypes = {
    type: PropTypes.string,
    form: PropTypes.object,
    record: PropTypes.object,
    dataIndex: PropTypes.string,
    editing: PropTypes.bool,
    title: PropTypes.string,
  };

  getInput = () => {
    return (
      <Input />
    );
  };

  render() {

    const {
      editing,
      dataIndex,
      title,
      record,
      form,
      ...restProps
    } = this.props;
    const { getFieldDecorator } = form;
    return (
      <EditableContext.Consumer>
        {() => {
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    rules: [{
                      required: true,
                      message: `请输入${title}!`,
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
