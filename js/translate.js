/* Kannada / English toggle powered by Google Translate */
(function () {
  var STORAGE_KEY = 'ibg_lang';

  function getStoredLang() {
    try {
      return localStorage.getItem(STORAGE_KEY) || 'en';
    } catch (e) {
      return 'en';
    }
  }

  function setLangCookie(lang) {
    var value = lang === 'en' ? '/en/en' : '/en/' + lang;
    document.cookie = 'googtrans=' + value + '; path=/';
    document.cookie = 'googtrans=' + value + '; path=/; domain=' + window.location.hostname;
  }

  /* Set the cookie immediately (before the Google Translate script runs)
     so the previously chosen language applies on this page load too. */
  setLangCookie(getStoredLang());

  window.googleTranslateElementInit = function () {
    new google.translate.TranslateElement(
      { pageLanguage: 'en', includedLanguages: 'en,kn', autoDisplay: false },
      'google_translate_element'
    );
  };

  function setActiveButtons(lang) {
    var btns = document.querySelectorAll('.lang-toggle__btn');
    for (var i = 0; i < btns.length; i++) {
      var isActive = btns[i].getAttribute('data-lang') === lang;
      btns[i].classList.toggle('is-active', isActive);
      btns[i].setAttribute('aria-pressed', isActive ? 'true' : 'false');
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    var current = getStoredLang();
    setActiveButtons(current);

    var btns = document.querySelectorAll('.lang-toggle__btn');
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function () {
        var lang = this.getAttribute('data-lang');
        if (lang === getStoredLang()) return;
        try {
          localStorage.setItem(STORAGE_KEY, lang);
        } catch (e) {}
        setLangCookie(lang);
        window.location.reload();
      });
    }
  });
})();
