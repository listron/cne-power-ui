import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './weatherStationConf.scss';
import { weatherStationAction } from './weatherStationReducer';
import Footer from '../../../../components/Common/Footer';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import PropTypes from 'prop-types';
import WeatherList from '../../../../components/System/Station/WeatherStationConf/WeatherList'
class WeatherStationConf extends Component {
    static propTypes = {
        resetStore: PropTypes.func,
    }
    constructor(props) {
        super(props);

    }

    componentWillUnmount() {
        this.props.resetStore()
    }


    render() {
        return (
            <div className={styles.weatherStation}>
                <CommonBreadcrumb breadData={[{ name: '气象站配置' }]} style={{ paddingLeft: '38px', backgroundColor: '#fff' }} />
                <WeatherList {...this.props} />
                <Footer />
            </div>
        );
    }
}
const mapStateToProps = (state) => ({
    ...state.system.weatherStationReducer.toJS(),
    stations: state.common.get('stations').toJS(),
});

const mapDispatchToProps = (dispatch) => ({
    changeWeatherStationStore: payload => dispatch({ type: weatherStationAction.changeWeatherStationStore, payload }),
    resetStore: () => dispatch({ type: weatherStationAction.resetStore }),
    getWeatherList: payload => dispatch({ type: weatherStationAction.getWeatherList, payload }),
    getEditWeather: payload => dispatch({ type: weatherStationAction.getEditWeather, payload }),
    getUpdateWeather: payload => dispatch({ type: weatherStationAction.getUpdateWeather, payload }),
    getWeatherStation: payload => dispatch({ type: weatherStationAction.getWeatherStation, payload }),
});



export default connect(mapStateToProps, mapDispatchToProps)(WeatherStationConf);
