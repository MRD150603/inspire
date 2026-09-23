/* English / Kannada translation via Google Translate's native widget.
   Google persists the chosen language across pages itself via its own
   "googtrans" cookie.

   layout: SIMPLE gives the classic "G  Select Language ▾" pill look (Google
   logo, blue link text, separator, arrow) — style.css only boxes it in a
   white pill and otherwise leaves Google's own markup/colors alone so this
   native look comes through unmodified.

   Only ONE widget instance is created: Google's script only ever populates
   the first container passed to `new TranslateElement(...)` on a page — a
   second instance for a separate mobile container silently no-ops and
   stays empty. So instead of two instances, the single widget node is
   relocated between a desktop slot (inside the navbar) and a mobile slot
   (a fixed pill outside <header>) as the viewport crosses the 900px
   breakpoint — see placeWidget() below. */
(function () {
  window.googleTranslateElementInit = function () {
    if (document.getElementById('google_translate_element')) {
      new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,kn',
        autoDisplay: false,
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE
      }, 'google_translate_element');
    }
  };

  function initSlots() {
    var widget = document.getElementById('google_translate_element');
    var mobileSlot = document.getElementById('translateMobileSlot');
    if (!widget || !mobileSlot) return;
    var desktopParent = widget.parentNode;
    var desktopNextSibling = widget.nextSibling;

    function placeWidget(isMobile) {
      if (isMobile) {
        if (widget.parentNode !== mobileSlot) mobileSlot.appendChild(widget);
        widget.classList.remove('nav__translate--desktop');
        widget.classList.add('nav__translate--mobile');
      } else {
        if (widget.parentNode !== desktopParent) desktopParent.insertBefore(widget, desktopNextSibling);
        widget.classList.remove('nav__translate--mobile');
        widget.classList.add('nav__translate--desktop');
      }
    }

    var mq = window.matchMedia('(max-width:900px)');
    placeWidget(mq.matches);
    mq.addEventListener('change', function (e) { placeWidget(e.matches); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSlots);
  } else {
    initSlots();
  }
})();
