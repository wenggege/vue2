import store from "@/store";
import Router from "@/router";
import axios from 'axios'
import { Message } from "element-ui";
import cookies from "vue-cookies";
import { checkDataType } from "@/utils";
import { modifyVars } from "less";

export const requestInceptor = async function (config = {}) {
  var token = await GetToken();
  // if (token) {
  //   Message.error("登录信息不存在")
  //   return;
  // }
  // var token="";
  const commonHeader = {
    Authorization: "Bearer " + token,
    token: token,
  };
  if (token) {
    // ...
    config.headers = {
      ...config.headers,
      ...commonHeader,
    };
  }

  return config;
};

export const requestErrorInceptor = function (error) {
  // 请求错误
  // 对请求错误做些什么
  console.log("请求发生错误");
  console.log(error);
  return Promise.reject(error);
};


async function GetToken() {

  //var token = cookies.get('token')
  var token =""
  var Identity = cookies.get('Identity')

  //Identity = "BEJxJ%2bosjcaFeMnrY1ZGnw%3d%3d"

  if (token) {
    return token;
  }
  var res = await axios.get("https://pjm-finance-api-test.porton.cn" + "/api/base/login", { params: { Identity: Identity } });
  if (res.data.Code == 200) {
    token = res.data.Data;
    cookies.set("token", res.data.Data)
  }
  return token;
}
