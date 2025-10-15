// web/index.tsx

import { AppRegistry } from 'react-native';
// 注意这里的路径，是从 web/index.tsx 到根目录下的 App.web.tsx
import App from '../App'; 
import { name as appName } from '../app.json';

// 运行应用
AppRegistry.registerComponent(appName, () => App);
AppRegistry.runApplication(appName, {
  rootTag: document.getElementById('root'),
});
