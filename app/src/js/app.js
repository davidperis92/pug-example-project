(function ($) {
  'use strict';

  window.models = window.models || {};
  window.minTablet = 768;
  window.mobileWidth = 1199;

  window.isPhoneScreen = () => $(window).width() < window.minTablet;


  $(window).ready(function() {
    window.initHeader();

    $('.selectpicker').selectpicker();
  });


})(jQuery);
