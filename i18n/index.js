const I18N = (() => {
  const STORAGE_KEY = 'cafe_origen_language';
  const messages = globalThis.I18N_MESSAGES;
  const dataNames = globalThis.I18N_DATA_NAMES;

  let language = localStorage.getItem(STORAGE_KEY);
  if (!messages[language]) language = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';

  function t(key, variables = {}) {
    const template = messages[language][key] ?? messages.en[key] ?? key;
    return template.replace(/\{(\w+)\}/g, (_, name) => variables[name] ?? '');
  }

  function data(type, value) {
    return language === 'zh-CN' ? (dataNames[type]?.[value] ?? value) : value;
  }

  function list(type, value) {
    return value.split(',').map(item => data(type, item.trim())).join(language === 'zh-CN' ? '、' : ', ');
  }

  function apply() {
    document.documentElement.lang = language;
    document.title = t('app.title');
    document.querySelectorAll('[data-i18n]').forEach(element => {
      element.textContent = t(element.dataset.i18n);
    });
    const select = document.getElementById('languageSelect');
    if (select) select.value = language;
  }

  function setLanguage(nextLanguage) {
    if (!messages[nextLanguage] || nextLanguage === language) return;
    language = nextLanguage;
    localStorage.setItem(STORAGE_KEY, language);
    apply();
    document.dispatchEvent(new CustomEvent('languagechange'));
  }

  return { t, data, list, apply, setLanguage, getLanguage: () => language };
})();
