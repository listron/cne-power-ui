const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;

export function isUrl(path) {
  return reg.test(path);
}
//设置cookie
export function setCookie(name,value)
{
  const Days = 30;
  const exp = new Date();
  exp.setTime(exp.getTime() + Days*24*60*60*1000);
  document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}

//获取cookie
export function getCookie(name)
{
  let arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
　return (arr=document.cookie.match(reg))?unescape(arr[2]):null;
}

//删除cookies
export function delCookie(name)
{
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(name);
    if(cval!==null)
        document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}

