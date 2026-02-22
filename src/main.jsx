import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import ReactGA from 'react-ga4';
import App from './App';
import './main.css';

ReactGA.initialize('G-QKMLV0NLZS');

function parseDeviceInfo() {
  const ua = navigator.userAgent;

  let deviceModel = 'Unknown';
  const androidMatch = ua.match(/;\s*([^;)]+)\s*Build\//);
  if (androidMatch) {
    deviceModel = androidMatch[1].trim();
  } else if (/iPhone/.test(ua)) {
    deviceModel = 'iPhone';
  } else if (/iPad/.test(ua)) {
    deviceModel = 'iPad';
  } else if (/Macintosh/.test(ua)) {
    deviceModel = 'Mac';
  } else if (/Windows/.test(ua)) {
    deviceModel = 'Windows PC';
  } else if (/Linux/.test(ua)) {
    deviceModel = 'Linux PC';
  }

  let osFull = 'Unknown';
  const iosMatch = ua.match(/OS (\d+[_.\d]+) like Mac/);
  const androidOsMatch = ua.match(/Android (\d+[.\d]*)/);
  const macMatch = ua.match(/Mac OS X (\d+[_.\d]+)/);
  const winMatch = ua.match(/Windows NT (\d+[.\d]*)/);
  const winVersions = { '10.0': '10/11', '6.3': '8.1', '6.2': '8', '6.1': '7' };
  if (iosMatch) {
    osFull = 'iOS ' + iosMatch[1].replace(/_/g, '.');
  } else if (androidOsMatch) {
    osFull = 'Android ' + androidOsMatch[1];
  } else if (macMatch) {
    osFull = 'macOS ' + macMatch[1].replace(/_/g, '.');
  } else if (winMatch) {
    osFull = 'Windows ' + (winVersions[winMatch[1]] || winMatch[1]);
  } else if (/Linux/.test(ua)) {
    osFull = 'Linux';
  }

  let browserFull = 'Unknown';
  const edgeMatch = ua.match(/Edg\/(\d+[.\d]*)/);
  const chromeMatch = ua.match(/Chrome\/(\d+[.\d]*)/);
  const firefoxMatch = ua.match(/Firefox\/(\d+[.\d]*)/);
  const safariMatch = ua.match(/Version\/(\d+[.\d]*).*Safari/);
  if (edgeMatch) {
    browserFull = 'Edge ' + edgeMatch[1].split('.')[0];
  } else if (safariMatch) {
    browserFull = 'Safari ' + safariMatch[1];
  } else if (chromeMatch) {
    browserFull = 'Chrome ' + chromeMatch[1].split('.')[0];
  } else if (firefoxMatch) {
    browserFull = 'Firefox ' + firefoxMatch[1].split('.')[0];
  }

  return { deviceModel, osFull, browserFull };
}

const { deviceModel, osFull, browserFull } = parseDeviceInfo();
ReactGA.gtag('set', 'user_properties', {
  device_model: deviceModel,
  os_full: osFull,
  browser_full: browserFull,
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
