import moment from "moment";

/**
 * 处理时间格式
 * 返回字符串
 * @params {array} arr
 * @return string
 */
export function dateArrFormat  (arr) {
  // 把同年同月的的日期分类
  const initDate = Array.from(arr.reduce((map, date) => {
    let key = date.slice(0, date.lastIndexOf('-'));
    if (!map.has(key)) {
      map.set(key, [date]);
    } else {
      map.get(key).push(date);
    }
    return map;
  }, new Map()).values());
  let lastArr = []; //保存在数组里
  //遍历新的数组，因为这里会把相同的年月放在一个数组里
  initDate && initDate.map(cur => {
    let str = ""; //保存当前拼接的字符串
    cur.map((item, index) => {
      const monthKey = moment(item).format('YYYY/MM');
      const tmpDay = moment(item).format('DD');
      if (index === 0) {
        // 第一个显示完整的日期
        str += `${monthKey}/${tmpDay}`;
      }
      if (index !== 0) {
        // 后面的日期（天）
        str += `、${tmpDay}`;
      }
    });
    lastArr.push(str);
  });
  return lastArr.join("；");
}
