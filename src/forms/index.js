import t from 'tcomb-form-native/lib';
import stylesheet from 'tcomb-form-native/lib/stylesheets/bootstrap';

import textbox from 'src/forms/textbox';

// TODO Replace with react-native-paper components
const templates = {
  textbox,
  checkbox: require('tcomb-form-native/lib/templates/bootstrap/checkbox'),
  select: require('tcomb-form-native/lib/templates/bootstrap/select'),
  datepicker: require('tcomb-form-native/lib/templates/bootstrap/datepicker'),
  struct: require('tcomb-form-native/lib/templates/bootstrap/struct'),
  list: require('tcomb-form-native/lib/templates/bootstrap/list'),
};

// const stylesheet = {};

const i18n = {
  optional: ' (optional)',
  required: '',
};

t.form.Form.templates = templates;
t.form.Form.stylesheet = stylesheet;
t.form.Form.i18n = i18n;

t.form.Form.defaultProps = {
  templates: t.form.Form.templates,
  stylesheet: t.form.Form.stylesheet,
  i18n: t.form.Form.i18n,
};

module.exports = t;
