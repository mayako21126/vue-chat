/**
 * Created by mayako on 2017/6/6.
 */
var testSwitch = true;
var baseURL = function(){
  return (testSwitch==true)?'http://47.92.106.252/':'/';
};
var auth=function(x){
  console.log(x)
  if(x.body.errorCode=='1'){
    return true;
  }else{
    console.log(x.body.errorCode)
    return false;
  }
}
export default {
  apis:baseURL(),
  auth:auth
}
