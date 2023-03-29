require("@babel/register")({
    presets: ["@babel/preset-env", "@babel/preset-react"]
  });
  
  const React = require("react");
  const ReactDOMServer = require("react-dom/server");
  const App = require("./src/App").default;
  
  const html = ReactDOMServer.renderToString(React.createElement(App));
  
  console.log(html);
  