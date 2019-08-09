import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Progress } from 'antd';
import { dataFormats } from '../../../../../utils/utilFunc';
import styles from './inverter.scss';

const SubConfluenceList = ({ stationCode, theme = 'light' }) => {
  const subDeviceList = [
    {
      'alarmNum': 0,
      'deviceCapacity': 81.0000,
      'deviceCode': '380M202M6M2',
      'deviceFullcode': '380M202M6M2',
      'deviceId': 674087,
      'deviceModeCode': 6,
      'deviceName': 'HL01-02',
      'devicePower': 0.0000,
      'deviceStatus': 400,
      'deviceTypeCode': 202,
      'dispRateStatus': null,
      'dispersionRatio': '0.30',
      'electricity': 11.82,
      'isConnected': 1,
      'parentDeviceCode': 673994,
      'parentDeviceFullCode': null,
      'parentDeviceName': null,
      'stationCode': 380,
      'subInfo': [
        {
          'pointValue': '0.91',
          'pointName': 'GFZJ001',
          'pointStatus': '400',
        },
        {
          'pointValue': '0.69',
          'pointName': 'GFZJ002',
          'pointStatus': '500',
        },
        {
          'pointValue': '0.78',
          'pointName': 'GFZJ003',
          'pointStatus': '900',
        },
        {
          'pointValue': '0.7',
          'pointName': 'GFZJ004',
          'pointStatus': '801',
        },
        {
          'pointValue': '0.64',
          'pointName': 'GFZJ005',
          'pointStatus': '802',
        },
        {
          'pointValue': '0.68',
          'pointName': 'GFZJ006',
          'pointStatus': '803',
        },
        {
          'pointValue': '0.73',
          'pointName': 'GFZJ007',
          'pointStatus': '400',
        },
        {
          'pointValue': '0.74',
          'pointName': 'GFZJ008',
          'pointStatus': '400',
        },
        {
          'pointValue': '0.73',
          'pointName': 'GFZJ009',
          'pointStatus': '400',
        },
        {
          'pointValue': '0.71',
          'pointName': 'GFZJ010',
          'pointStatus': '400',
        },
        {
          'pointValue': '0.76',
          'pointName': 'GFZJ011',
          'pointStatus': '400',
        },
        {
          'pointValue': '0.79',
          'pointName': 'GFZJ012',
          'pointStatus': '400',
        },
        {
          'pointValue': '0.9',
          'pointName': 'GFZJ013',
          'pointStatus': '400',
        },
        {
          'pointValue': '1.02',
          'pointName': 'GFZJ014',
          'pointStatus': '400',
        },
        {
          'pointValue': '1.04',
          'pointName': 'GFZJ015',
          'pointStatus': '802',
        },
        {
          'pointValue': '0.0',
          'pointName': 'GFZJ016',
          'pointStatus': '900',
        },
      ],
      'temp': null,
      'voltage': 0.0,
    },
    {
      'alarmNum': 10,
      'deviceCapacity': 81.0000,
      'deviceCode': '380M202M6M2',
      'deviceFullcode': '380M202M6M2',
      'deviceId': 674087,
      'deviceModeCode': 6,
      'deviceName': 'HL01-02',
      'devicePower': 0.0000,
      'deviceStatus': 400,
      'deviceTypeCode': 202,
      'dispRateStatus': null,
      'dispersionRatio': '0.30',
      'electricity': 11.82,
      'isConnected': 1,
      'parentDeviceCode': 673994,
      'parentDeviceFullCode': null,
      'parentDeviceName': null,
      'stationCode': 380,
      'subInfo': [
        {
          'pointValue': '0.91',
          'pointName': 'GFZJ001',
          'pointStatus': '400',
        },
        {
          'pointValue': '0.69',
          'pointName': 'GFZJ002',
          'pointStatus': '500',
        },
        {
          'pointValue': '0.78',
          'pointName': 'GFZJ003',
          'pointStatus': '900',
        },
        {
          'pointValue': '0.7',
          'pointName': 'GFZJ004',
          'pointStatus': '801',
        },
        {
          'pointValue': '0.64',
          'pointName': 'GFZJ005',
          'pointStatus': '802',
        },
        {
          'pointValue': '0.68',
          'pointName': 'GFZJ006',
          'pointStatus': '803',
        },
        {
          'pointValue': '0.73',
          'pointName': 'GFZJ007',
          'pointStatus': '400',
        },
        {
          'pointValue': '0.74',
          'pointName': 'GFZJ008',
          'pointStatus': '400',
        },
        {
          'pointValue': '0.73',
          'pointName': 'GFZJ009',
          'pointStatus': '400',
        },
        {
          'pointValue': '0.71',
          'pointName': 'GFZJ010',
          'pointStatus': '400',
        },
        {
          'pointValue': '0.76',
          'pointName': 'GFZJ011',
          'pointStatus': '400',
        },
        {
          'pointValue': '0.79',
          'pointName': 'GFZJ012',
          'pointStatus': '400',
        },
        {
          'pointValue': '0.9',
          'pointName': 'GFZJ013',
          'pointStatus': '400',
        },
        {
          'pointValue': '1.02',
          'pointName': 'GFZJ014',
          'pointStatus': '400',
        },
        {
          'pointValue': '1.04',
          'pointName': 'GFZJ015',
          'pointStatus': '802',
        },
        {
          'pointValue': '0.0',
          'pointName': 'GFZJ016',
          'pointStatus': '900',
        },
      ],
      'temp': null,
      'voltage': 0.0,
    },
    {
      'alarmNum': 0,
      'deviceCapacity': 81.0000,
      'deviceCode': '380M202M6M2',
      'deviceFullcode': '380M202M6M2',
      'deviceId': 674087,
      'deviceModeCode': 6,
      'deviceName': 'HL01-02',
      'devicePower': 0.0000,
      'deviceStatus': 500,
      'deviceTypeCode': 202,
      'dispRateStatus': null,
      'dispersionRatio': '0.30',
      'electricity': 11.82,
      'isConnected': 1,
      'parentDeviceCode': 673994,
      'parentDeviceFullCode': null,
      'parentDeviceName': null,
      'stationCode': 380,
      'subInfo': [
        {
          'pointValue': '0.91',
          'pointName': 'GFZJ001',
          'pointStatus': '400',
        },
        {
          'pointValue': '0.69',
          'pointName': 'GFZJ002',
          'pointStatus': '500',
        },
        {
          'pointValue': '0.78',
          'pointName': 'GFZJ003',
          'pointStatus': '900',
        },
        {
          'pointValue': '0.7',
          'pointName': 'GFZJ004',
          'pointStatus': '801',
        },
        {
          'pointValue': '0.64',
          'pointName': 'GFZJ005',
          'pointStatus': '802',
        },
        {
          'pointValue': '0.68',
          'pointName': 'GFZJ006',
          'pointStatus': '803',
        },
        {
          'pointValue': '0.73',
          'pointName': 'GFZJ007',
          'pointStatus': '400',
        },
        {
          'pointValue': '0.74',
          'pointName': 'GFZJ008',
          'pointStatus': '400',
        },
        {
          'pointValue': '0.73',
          'pointName': 'GFZJ009',
          'pointStatus': '400',
        },
        {
          'pointValue': '0.71',
          'pointName': 'GFZJ010',
          'pointStatus': '400',
        },
        {
          'pointValue': '0.76',
          'pointName': 'GFZJ011',
          'pointStatus': '400',
        },
        {
          'pointValue': '0.79',
          'pointName': 'GFZJ012',
          'pointStatus': '400',
        },
        {
          'pointValue': '0.9',
          'pointName': 'GFZJ013',
          'pointStatus': '400',
        },
        {
          'pointValue': '1.02',
          'pointName': 'GFZJ014',
          'pointStatus': '400',
        },
        {
          'pointValue': '1.04',
          'pointName': 'GFZJ015',
          'pointStatus': '802',
        },
        {
          'pointValue': '0.0',
          'pointName': 'GFZJ016',
          'pointStatus': '900',
        },
      ],
      'temp': null,
      'voltage': 0.0,
    },
    {
      'alarmNum': 10,
      'deviceCapacity': 81.0000,
      'deviceCode': '380M202M6M2',
      'deviceFullcode': '380M202M6M2',
      'deviceId': 674087,
      'deviceModeCode': 6,
      'deviceName': 'HL01-02',
      'devicePower': 0.0000,
      'deviceStatus': 500,
      'deviceTypeCode': 202,
      'dispRateStatus': null,
      'dispersionRatio': '0.30',
      'electricity': 11.82,
      'isConnected': 1,
      'parentDeviceCode': 673994,
      'parentDeviceFullCode': null,
      'parentDeviceName': null,
      'stationCode': 380,
      'subInfo': [
        {
          'pointValue': '0.91',
          'pointName': 'GFZJ001',
          'pointStatus': '400',
        },
        {
          'pointValue': '0.69',
          'pointName': 'GFZJ002',
          'pointStatus': '500',
        },
        {
          'pointValue': '0.78',
          'pointName': 'GFZJ003',
          'pointStatus': '900',
        },
        {
          'pointValue': '0.7',
          'pointName': 'GFZJ004',
          'pointStatus': '801',
        },
        {
          'pointValue': '0.64',
          'pointName': 'GFZJ005',
          'pointStatus': '802',
        },
        {
          'pointValue': '0.68',
          'pointName': 'GFZJ006',
          'pointStatus': '803',
        },
        {
          'pointValue': '0.73',
          'pointName': 'GFZJ007',
          'pointStatus': '400',
        },
        {
          'pointValue': '0.74',
          'pointName': 'GFZJ008',
          'pointStatus': '400',
        },
        {
          'pointValue': '0.73',
          'pointName': 'GFZJ009',
          'pointStatus': '400',
        },
        {
          'pointValue': '0.71',
          'pointName': 'GFZJ010',
          'pointStatus': '400',
        },
        {
          'pointValue': '0.76',
          'pointName': 'GFZJ011',
          'pointStatus': '400',
        },
        {
          'pointValue': '0.79',
          'pointName': 'GFZJ012',
          'pointStatus': '400',
        },
        {
          'pointValue': '0.9',
          'pointName': 'GFZJ013',
          'pointStatus': '400',
        },
        {
          'pointValue': '1.02',
          'pointName': 'GFZJ014',
          'pointStatus': '400',
        },
        {
          'pointValue': '1.04',
          'pointName': 'GFZJ015',
          'pointStatus': '802',
        },
        {
          'pointValue': '0.0',
          'pointName': 'GFZJ016',
          'pointStatus': '900',
        },
      ],
      'temp': null,
      'voltage': 0.0,
    },
    {
      'alarmNum': 0,
      'deviceCapacity': 81.0000,
      'deviceCode': '380M202M6M2',
      'deviceFullcode': '380M202M6M2',
      'deviceId': 674087,
      'deviceModeCode': 6,
      'deviceName': 'HL01-02',
      'devicePower': 0.0000,
      'deviceStatus': 801,
      'deviceTypeCode': 202,
      'dispRateStatus': null,
      'dispersionRatio': '0.30',
      'electricity': 11.82,
      'isConnected': 1,
      'parentDeviceCode': 673994,
      'parentDeviceFullCode': null,
      'parentDeviceName': null,
      'stationCode': 380,
      'subInfo': [
        {
          'pointValue': '0.91',
          'pointName': 'GFZJ001',
          'pointStatus': '400',
        },
        {
          'pointValue': '0.69',
          'pointName': 'GFZJ002',
          'pointStatus': '500',
        },
        {
          'pointValue': '0.78',
          'pointName': 'GFZJ003',
          'pointStatus': '900',
        },
        {
          'pointValue': '0.7',
          'pointName': 'GFZJ004',
          'pointStatus': '801',
        },
        {
          'pointValue': '0.64',
          'pointName': 'GFZJ005',
          'pointStatus': '802',
        },
        {
          'pointValue': '0.68',
          'pointName': 'GFZJ006',
          'pointStatus': '803',
        },
        {
          'pointValue': '0.73',
          'pointName': 'GFZJ007',
          'pointStatus': '400',
        },
        {
          'pointValue': '0.74',
          'pointName': 'GFZJ008',
          'pointStatus': '400',
        },
        {
          'pointValue': '0.73',
          'pointName': 'GFZJ009',
          'pointStatus': '400',
        },
        {
          'pointValue': '0.71',
          'pointName': 'GFZJ010',
          'pointStatus': '400',
        },
        {
          'pointValue': '0.76',
          'pointName': 'GFZJ011',
          'pointStatus': '400',
        },
        {
          'pointValue': '0.79',
          'pointName': 'GFZJ012',
          'pointStatus': '400',
        },
        {
          'pointValue': '0.9',
          'pointName': 'GFZJ013',
          'pointStatus': '400',
        },
        {
          'pointValue': '1.02',
          'pointName': 'GFZJ014',
          'pointStatus': '400',
        },
        {
          'pointValue': '1.04',
          'pointName': 'GFZJ015',
          'pointStatus': '802',
        },
        {
          'pointValue': '0.0',
          'pointName': 'GFZJ016',
          'pointStatus': '900',
        },
      ],
      'temp': null,
      'voltage': 0.0,
    },
    {
      'alarmNum': 10,
      'deviceCapacity': 81.0000,
      'deviceCode': '380M202M6M2',
      'deviceFullcode': '380M202M6M2',
      'deviceId': 674087,
      'deviceModeCode': 6,
      'deviceName': 'HL01-02',
      'devicePower': 0.0000,
      'deviceStatus': 801,
      'deviceTypeCode': 202,
      'dispRateStatus': null,
      'dispersionRatio': '0.30',
      'electricity': 11.82,
      'isConnected': 1,
      'parentDeviceCode': 673994,
      'parentDeviceFullCode': null,
      'parentDeviceName': null,
      'stationCode': 380,
      'subInfo': [
        {
          'pointValue': '0.91',
          'pointName': 'GFZJ001',
          'pointStatus': '400',
        },
        {
          'pointValue': '0.69',
          'pointName': 'GFZJ002',
          'pointStatus': '500',
        },
        {
          'pointValue': '0.78',
          'pointName': 'GFZJ003',
          'pointStatus': '900',
        },
        {
          'pointValue': '0.7',
          'pointName': 'GFZJ004',
          'pointStatus': '801',
        },
        {
          'pointValue': '0.64',
          'pointName': 'GFZJ005',
          'pointStatus': '802',
        },
        {
          'pointValue': '0.68',
          'pointName': 'GFZJ006',
          'pointStatus': '803',
        },
        {
          'pointValue': '0.73',
          'pointName': 'GFZJ007',
          'pointStatus': '400',
        },
        {
          'pointValue': '0.74',
          'pointName': 'GFZJ008',
          'pointStatus': '400',
        },
        {
          'pointValue': '0.73',
          'pointName': 'GFZJ009',
          'pointStatus': '400',
        },
        {
          'pointValue': '0.71',
          'pointName': 'GFZJ010',
          'pointStatus': '400',
        },
        {
          'pointValue': '0.76',
          'pointName': 'GFZJ011',
          'pointStatus': '400',
        },
        {
          'pointValue': '0.79',
          'pointName': 'GFZJ012',
          'pointStatus': '400',
        },
        {
          'pointValue': '0.9',
          'pointName': 'GFZJ013',
          'pointStatus': '400',
        },
        {
          'pointValue': '1.02',
          'pointName': 'GFZJ014',
          'pointStatus': '400',
        },
        {
          'pointValue': '1.04',
          'pointName': 'GFZJ015',
          'pointStatus': '802',
        },
        {
          'pointValue': '0.0',
          'pointName': 'GFZJ016',
          'pointStatus': '900',
        },
      ],
      'temp': null,
      'voltage': 0.0,
    },
    {
      'alarmNum': 0,
      'deviceCapacity': 81.0000,
      'deviceCode': '380M202M6M2',
      'deviceFullcode': '380M202M6M2',
      'deviceId': 674087,
      'deviceModeCode': 6,
      'deviceName': 'HL01-02',
      'devicePower': 0.0000,
      'deviceStatus': 500,
      'deviceTypeCode': 202,
      'dispRateStatus': null,
      'dispersionRatio': '0.30',
      'electricity': 11.82,
      'isConnected': 1,
      'parentDeviceCode': 673994,
      'parentDeviceFullCode': null,
      'parentDeviceName': null,
      'stationCode': 380,
      'subInfo': [
        {
          'pointValue': '0.91',
          'pointName': 'GFZJ001',
          'pointStatus': '400',
        },
        {
          'pointValue': '0.69',
          'pointName': 'GFZJ002',
          'pointStatus': '500',
        },
        {
          'pointValue': '0.78',
          'pointName': 'GFZJ003',
          'pointStatus': '900',
        },
        {
          'pointValue': '0.7',
          'pointName': 'GFZJ004',
          'pointStatus': '801',
        },
        {
          'pointValue': '0.64',
          'pointName': 'GFZJ005',
          'pointStatus': '802',
        },
        {
          'pointValue': '0.68',
          'pointName': 'GFZJ006',
          'pointStatus': '803',
        },
        {
          'pointValue': '0.73',
          'pointName': 'GFZJ007',
          'pointStatus': '400',
        },
        {
          'pointValue': '0.74',
          'pointName': 'GFZJ008',
          'pointStatus': '400',
        },
        {
          'pointValue': '0.73',
          'pointName': 'GFZJ009',
          'pointStatus': '400',
        },
        {
          'pointValue': '0.71',
          'pointName': 'GFZJ010',
          'pointStatus': '400',
        },
        {
          'pointValue': '0.76',
          'pointName': 'GFZJ011',
          'pointStatus': '400',
        },
        {
          'pointValue': '0.79',
          'pointName': 'GFZJ012',
          'pointStatus': '400',
        },
        {
          'pointValue': '0.9',
          'pointName': 'GFZJ013',
          'pointStatus': '400',
        },
        {
          'pointValue': '1.02',
          'pointName': 'GFZJ014',
          'pointStatus': '400',
        },
        {
          'pointValue': '1.04',
          'pointName': 'GFZJ015',
          'pointStatus': '802',
        },
        {
          'pointValue': '0.0',
          'pointName': 'GFZJ016',
          'pointStatus': '900',
        },
      ],
      'temp': null,
      'voltage': 0.0,
    },
    {
      'alarmNum': 10,
      'deviceCapacity': 81.0000,
      'deviceCode': '380M202M6M2',
      'deviceFullcode': '380M202M6M2',
      'deviceId': 674087,
      'deviceModeCode': 6,
      'deviceName': 'HL01-02',
      'devicePower': 0.0000,
      'deviceStatus': 802,
      'deviceTypeCode': 202,
      'dispRateStatus': null,
      'dispersionRatio': '0.30',
      'electricity': 11.82,
      'isConnected': 1,
      'parentDeviceCode': 673994,
      'parentDeviceFullCode': null,
      'parentDeviceName': null,
      'stationCode': 380,
      'subInfo': [
        {
          'pointValue': '0.91',
          'pointName': 'GFZJ001',
          'pointStatus': '400',
        },
        {
          'pointValue': '0.69',
          'pointName': 'GFZJ002',
          'pointStatus': '500',
        },
        {
          'pointValue': '0.78',
          'pointName': 'GFZJ003',
          'pointStatus': '900',
        },
        {
          'pointValue': '0.7',
          'pointName': 'GFZJ004',
          'pointStatus': '801',
        },
        {
          'pointValue': '0.64',
          'pointName': 'GFZJ005',
          'pointStatus': '802',
        },
        {
          'pointValue': '0.68',
          'pointName': 'GFZJ006',
          'pointStatus': '803',
        },
        {
          'pointValue': '0.73',
          'pointName': 'GFZJ007',
          'pointStatus': '400',
        },
        {
          'pointValue': '0.74',
          'pointName': 'GFZJ008',
          'pointStatus': '400',
        },
        {
          'pointValue': '0.73',
          'pointName': 'GFZJ009',
          'pointStatus': '400',
        },
        {
          'pointValue': '0.71',
          'pointName': 'GFZJ010',
          'pointStatus': '400',
        },
        {
          'pointValue': '0.76',
          'pointName': 'GFZJ011',
          'pointStatus': '400',
        },
        {
          'pointValue': '0.79',
          'pointName': 'GFZJ012',
          'pointStatus': '400',
        },
        {
          'pointValue': '0.9',
          'pointName': 'GFZJ013',
          'pointStatus': '400',
        },
        {
          'pointValue': '1.02',
          'pointName': 'GFZJ014',
          'pointStatus': '400',
        },
        {
          'pointValue': '1.04',
          'pointName': 'GFZJ015',
          'pointStatus': '802',
        },
        {
          'pointValue': '0.0',
          'pointName': 'GFZJ016',
          'pointStatus': '900',
        },
      ],
      'temp': null,
      'voltage': 0.0,
    },
    {
      'alarmNum': 0,
      'deviceCapacity': 81.0000,
      'deviceCode': '380M202M6M2',
      'deviceFullcode': '380M202M6M2',
      'deviceId': 674087,
      'deviceModeCode': 6,
      'deviceName': 'HL01-02',
      'devicePower': 0.0000,
      'deviceStatus': 900,
      'deviceTypeCode': 202,
      'dispRateStatus': null,
      'dispersionRatio': '0.30',
      'electricity': 11.82,
      'isConnected': 1,
      'parentDeviceCode': 673994,
      'parentDeviceFullCode': null,
      'parentDeviceName': null,
      'stationCode': 380,
      'subInfo': [
        {
          'pointValue': '0.91',
          'pointName': 'GFZJ001',
          'pointStatus': '400',
        },
        {
          'pointValue': '0.69',
          'pointName': 'GFZJ002',
          'pointStatus': '500',
        },
        {
          'pointValue': '0.78',
          'pointName': 'GFZJ003',
          'pointStatus': '900',
        },
        {
          'pointValue': '0.7',
          'pointName': 'GFZJ004',
          'pointStatus': '801',
        },
        {
          'pointValue': '0.64',
          'pointName': 'GFZJ005',
          'pointStatus': '802',
        },
        {
          'pointValue': '0.68',
          'pointName': 'GFZJ006',
          'pointStatus': '803',
        },
        {
          'pointValue': '0.73',
          'pointName': 'GFZJ007',
          'pointStatus': '400',
        },
        {
          'pointValue': '0.74',
          'pointName': 'GFZJ008',
          'pointStatus': '400',
        },
        {
          'pointValue': '0.73',
          'pointName': 'GFZJ009',
          'pointStatus': '400',
        },
        {
          'pointValue': '0.71',
          'pointName': 'GFZJ010',
          'pointStatus': '400',
        },
        {
          'pointValue': '0.76',
          'pointName': 'GFZJ011',
          'pointStatus': '400',
        },
        {
          'pointValue': '0.79',
          'pointName': 'GFZJ012',
          'pointStatus': '400',
        },
        {
          'pointValue': '0.9',
          'pointName': 'GFZJ013',
          'pointStatus': '400',
        },
        {
          'pointValue': '1.02',
          'pointName': 'GFZJ014',
          'pointStatus': '400',
        },
        {
          'pointValue': '1.04',
          'pointName': 'GFZJ015',
          'pointStatus': '802',
        },
        {
          'pointValue': '0.0',
          'pointName': 'GFZJ016',
          'pointStatus': '900',
        },
      ],
      'temp': null,
      'voltage': 0.0,
    },
  ];
  const baseLinkPath = '/hidden/monitorDevice';
  const statusArr = { // 汇流箱状态
    400: { name: 'normal', text: '正常', color: '#199475' },
    801: { name: 'moreThanTen', text: '离散率>10%', color: '#f9b600' },
    802: { name: 'moreThanTwenty', text: '离散率>20%', color: '#e08031' },
    500: { name: 'noContact', text: '无通讯', color: '#666' },
    900: { name: 'noAccess', text: '未接入', color: '#999' },
  };

  const branchStatus = { // 支路电流状态
    light: {
      '500': { color: 'transparent', backgroundColor: '#f1f1f1' }, // 无通讯
      '900': { color: 'transparent', backgroundColor: '#f1f1f1' }, // 未接入
      '802': { color: '#fff', backgroundColor: '#3e97d1' }, // 偏大 - 蓝
      '400': { color: '#199475', backgroundColor: '#ceebe0' }, // 正常 - 绿
      '801': { color: '#fff', backgroundColor: '#f9b600' }, // 偏小 - 橙
      '803': { color: '#fff', backgroundColor: '#a42b2c' }, // 异常 - 红
    },
    dark: {
      '500': { color: 'transparent', backgroundColor: '#405080' }, // 无通讯
      '900': { color: 'transparent', backgroundColor: '#405080' }, // 未接入
      '802': { color: '#fff', backgroundColor: '#4d5fe2' }, // 偏大 - 蓝
      '400': { color: '#fff', backgroundColor: '#00baff' }, // 正常 - 绿
      '801': { color: '#fff', backgroundColor: '#f8b14e' }, // 偏小 - 橙
      '803': { color: '#fff', backgroundColor: '#fd6e8f' }, // 异常 - 红
    },
  };
  return (
    <div className={`${styles.subConfluence} ${styles[theme]}`}>
      {subDeviceList.map((item, i) => {
        const { alarmNum, deviceStatus } = item;
        const subInfo = item.subInfo || []; // 每个汇流箱下支路信息。
        const statusInfo = statusArr[deviceStatus] || {};
        const deviceCapacity = dataFormats(item.deviceCapacity, '--', 2);
        const devicePower = dataFormats(item.devicePower, '--', 2);
        const progressPercent = deviceCapacity && devicePower && devicePower / deviceCapacity * 100 || 0;
        return (
          <div key={i} className={`${styles.singledeviceItem} ${styles[statusInfo.name]} ${alarmNum && styles.alarm} `}>
            <Link to={`${baseLinkPath}/${stationCode}/${item.deviceTypeCode}/${item.deviceCode}`}>
              <div className={`${styles.statusBox}`} >
                <div className={styles.deviceItemIcon} >
                  {deviceStatus === 500 && <i className="iconfont icon-outage" ></i> || null}
                  <i className={`iconfont icon-hl ${styles.icon}`} ></i>
                  {(item.alarmNum && item.alarmNum > 0) && <i className="iconfont icon-alarm" ></i> || null}
                </div>
                <div className={styles.deviceItemR} >
                  <div className={styles.deviceBlockName}><span className={styles.deviceName} title={item.deviceName}>{item.deviceName}</span></div>
                  <Progress className={styles.powerProgress} strokeWidth={3} percent={progressPercent} showInfo={false} />
                  <div className={styles.deviceItemPower}>
                    <div className={styles.realDevicePower}>{devicePower} kW</div>
                    <div>{deviceCapacity} kW</div>
                  </div>
                </div>
              </div>
              <div className={styles.deviceBlockFooter} >
                <div>电压：{dataFormats(item.voltage, '--', 2)} V</div>
                <div>电流：{dataFormats(item.electricity, '--', 2)} A</div>
                <div className={styles.dispersionRatio}>离散率：{dataFormats(item.dispersionRatio, '--', 2)} %</div>
                <div>温度：{dataFormats(item.temp, '--', 2)} ℃</div>
              </div>
              {subInfo.length > 0 && <div className={styles.subBranch}>
                {subInfo.map((branch, innerIndex) => {
                  const { pointValue, pointStatus } = branch;
                  return (
                    <span
                      key={innerIndex}
                      className={styles.eachBranch}
                      style={branchStatus[theme][pointStatus]}
                    >{dataFormats(pointValue, '--', 2)}</span>
                  );
                })}
              </div>}
            </Link>
          </div>
        );
      })}
    </div>
  );
};

SubConfluenceList.propTypes = {
  subDeviceList: PropTypes.array,
  stationCode: PropTypes.string,
  theme: PropTypes.string,
};

export default SubConfluenceList;

