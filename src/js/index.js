require("../scss/index.scss");

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { IntlProvider, addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import { getCurrentLocale, getLocaleData } from 'grommet/utils/Locale';
import store from './store';
import Cabler from './components/Cabler';

const locale = getCurrentLocale();
addLocaleData(en);

let messages;
try {
  // rtl driven by hardcoding languages for now
  if ('he' === locale || 'ar' === locale.slice(0, 2)) {
    document.documentElement.classList.add("rtl");
  } else {
    document.documentElement.classList.remove("rtl");
  }
  messages = require('../messages/' + locale);
} catch (e) {
  messages = require('../messages/en-US');
}
const localeData = getLocaleData(messages, locale);

let element = document.getElementById('content');

ReactDOM.render((
  <Provider store={store}>
    <IntlProvider locale={localeData.locale} messages={localeData.messages}>
      <Cabler />
    </IntlProvider>
  </Provider>
), element);

document.body.classList.remove('loading');
