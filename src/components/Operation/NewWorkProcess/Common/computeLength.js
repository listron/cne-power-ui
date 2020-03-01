/**
 　计算指定输入框中字符串的长度
 　@param eleInput 指定的输入框的内容, required
 　@param maxLength 期望的字符串最大长度, optional, 未指定时，默认取输入框的maxLength属性，未指定maxLength属性时，指定为100字符长度
 　@param nativeCharSize，一个汉字的长度，optional，因数据库编码不同，汉字所占用的长度也不同，比如UTF-8编码中，汉字占用3个字符的长度，而GBK编码中汉字则是2个字符的长度。未制定时，默认按2个字符长度计算
 @return number
 */
export const computeLength = (eleInputValue, maxLength = 99, nativeCharSize = 2) => {
  const nativeCharRegexp = /[\u4E00-\u9FFF]/;
  let char, length = 0;

  const string = (eleInputValue || '').split('');

  for (let i = 0, count = string.length; i < count; i++) {
    char = string[i];
    if (nativeCharRegexp.test(char)) {
      length += nativeCharSize;
    } else {
      length++;
    }
  }

  return length;
};
