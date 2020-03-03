
import React, { Component } from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';
import styles from './style.scss';
const { Search } = Input;

/**
 * 通用查询控件
 */
class CneInputSearch extends Component {
    static propTypes = {
        onSearch : PropTypes.func,
        onChange : PropTypes.func,
        placeholder : PropTypes.string,
        value: PropTypes.string,
        theme: PropTypes.string,
        className: PropTypes.string,
    }

    static defaultProps = {
        placeholder : '请输入查询字段',
        value: null,
        theme: '',
        className: '',
    }

    constructor(props) {
        super(props);

        const {value} = props;
        this.state = {
            displaySearchInput: false, //搜索框出现
            value: value,
        }
    }

    /** */
    enterSearch = () => {
        const { displaySearchInput } = this.state;
        if (!displaySearchInput) {
            this.setState({ displaySearchInput: true });
        }
    }

    /**
     * 查询
     */
    doSearch = (str) => {
        // console.log(str);
        const {onSearch} = this.props;
        if (onSearch && typeof onSearch === 'function') {
            onSearch(str);
        }
    }

    /**
     * 改变输入值
     */
    doChange = (e) => {
        // console.log(e);
        const {value} = e.target;
        // console.log(value);
        this.setState({value:value});
        const {onChange} = this.props;
        if (onChange && typeof onChange === 'function') {
            onChange(e);
        }
    }

    /**
     * close search
     */
    doCloseSearch = () => {
       this.setState({ displaySearchInput: false, value: '' });
    }


    render() {
        const {displaySearchInput, value} = this.state;
        const {placeholder, className} = this.props;

        return (
            <div className={`${styles.commonSearch} ${className}`}>
                <div className={`${styles.conditionSearch} ${!displaySearchInput && styles.closeConditionSearch}`} onMouseEnter={this.enterSearch}>
                    <Search
                        value= {value}
                        placeholder= {placeholder}
                        enterButton={<i className={'iconfont icon-search'} />}
                        onSearch={this.doSearch}
                        onChange={this.doChange}
                    />
                    <i className={`iconfont icon-wrong ${styles.closeSearch}`} onClick={this.doCloseSearch} />
                </div>
            </div>
      );
    }
}

export default CneInputSearch;