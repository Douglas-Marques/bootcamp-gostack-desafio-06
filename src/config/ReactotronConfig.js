import Reactotron from 'reactotron-react-native';
// import { NativeModules } from 'react-native';

// grabs the ip address
// const host = NativeModules.SourceCode.scriptURL.split('://')[1].split(':')[0];

const reactotron = Reactotron.configure({ host: '192.168.0.108' })
  .useReactNative()
  .connect();

console.tron = reactotron;

reactotron.clear();

export default reactotron;
