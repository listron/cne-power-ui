
import request from '@utils/request';
import path from '@path';
const { basePaths, commonPaths } = path;
const { APIBasePath } = basePaths;


export async function getDevices(payload){ // 获取所有设备列表
  const url = `${APIBasePath}${commonPaths.getDevices}`;
  let devices = [];
  try {
    const response = await request.get(url, { params: payload });
    if (response.code === '10000') {
      devices = response.data || [];
    }
  } catch(error) {
    console.log(error);
  }
  return devices;
}

export async function getPartition(payload){ // 获取分区信息
  const url = `${APIBasePath}${commonPaths.getPartitions}`;
  let partitions = [];
  try {
    const response = await request.get(url, { params: payload });
    if (response.code === '10000') {
      const data = response.data || {};
      partitions = data.partitions || [];
    }
  } catch(error) {
    console.log(error);
  }
  return partitions;
}

export async function getMatrixDevices(payload){ // 直接获取 所有设备 + 分区
  const getMatrixUrl = `${APIBasePath}${commonPaths.getPartitions}`;
  const getDevicesUrl = `${APIBasePath}${commonPaths.getDevices}`;
  let filterDevices = [], devices = [], partitions = [];
  try {
    const { stationCode, deviceTypeCode } = payload;
    const response = await request.get(getMatrixUrl, {
      params: { stationCode, deviceTypeCode },
    }); // 所有分区信息
    if (response.code === '10000') {
      const partitionInfo = response.data || {};
      const devicesResponse = await request.get(getDevicesUrl, { params: payload });
      devices = devicesResponse.data || [];
      filterDevices = devices;
      if (partitionInfo.partitions && response.data.partitions[0]) { // 有分区, 默认第一个.
        partitions = partitionInfo.partitions || [];
        const partitionCode = response.data.partitions[0].deviceCode; // 第一分区code
        const filterDeviceResponse = await request.get(getDevicesUrl, {
            params: { stationCode, deviceTypeCode, partitionCode },
        });
        filterDevices = filterDeviceResponse.data || [];
      }
    }
  } catch(error) {
    console.log(error);
  }
  return { filterDevices, devices, partitions };
}
