import React from "react";
import { Provider } from "react-redux";
// renderRoutes 读取路由配置转化为 Route 标签
import { renderRoutes } from "react-router-config";
import { HashRouter } from "react-router-dom";
import routes from "./routes/index.js";
import { GlobalStyle } from "./style";
import { IconStyle } from "./assets/iconfont/iconfont";
import store from "./store/index";

function App() {
  return (
    <Provider store={store}>
      <HashRouter>
        <GlobalStyle></GlobalStyle>
        <IconStyle></IconStyle>
        {renderRoutes(routes)}
      </HashRouter>
    </Provider>
  );
}

export default App;
