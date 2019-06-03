import React from "react";
import PropTypes from "prop-types";
import { Button, Table, Form, Input, Icon } from 'antd';

const FormItem = Form.Item;
const EditableContext = React.createContext();

class EditableCell extends React.Component{
    constructor(props,context){
        super(props,context)
    }
    getInput = () => {
      return <Input onChange={this.testValue} />;
    };
    testValue=(e)=>{
      console.log('e',e.target.value);

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
      // const { getFieldDecorator, getFieldValue } = this.props.form;
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
export default  (EditableCell)