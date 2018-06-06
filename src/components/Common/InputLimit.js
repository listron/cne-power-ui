import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input,Form } from 'antd';
const { TextArea } = Input;
const FormItem = Form.Item;

class InputLimit extends Component{
    static propTypes = {
        label : PropTypes.string,
        form : PropTypes.object,
        size : PropTypes.number,
        handleInput: PropTypes.func,
    }

    constructor(props){
        super(props);
        this.state={
            current : 0,
            value: '',
        }
        this.checkWord=this.checkWord.bind(this);
    }

    checkWord(rule, value, callback) {
        this.setState({
            current : value.length,
        })
    }

    render(){
        const {
            getFieldDecorator
        } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: {
                span: 24
                },
                sm: {
                span: 3
                },
            },
            wrapperCol: {
                xs: {
                span: 24
                },
                sm: {
                span: 16
                },
            },
        };
        return (
            <FormItem 
                {...formItemLayout} 
                label={this.props.label} 
            >
                {getFieldDecorator('checkArea',{
                    rules:[{
                        required:false,  message:'请输入处理过程'
                    },{
                        validator: this.checkWord
                    }]
                })(
                    <TextArea  placeholder="请描述，不超过80个汉字" onChange={this.props.handleInput} maxLength={this.props.size}   style={{ height:'100px' }} />
                    
                )}
                <span style={{ position:'absolute',left:'-50px',bottom:'-10px'}}>({this.state.current}/{this.props.size})</span>
            </FormItem>
        )
    }
}

export default Form.create()(InputLimit);

