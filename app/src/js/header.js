(function ($) {
  'use strict';

  window.initHeader = function () {

    const
      $toggle = $('#headerMenuToggle'),
      $menu = $('#headerMenu'),
      _collapsedClass = 'is-collapsed';


    $toggle.on('click', function () {
      const isCollapsed = $(this).hasClass(_collapsedClass);
      $toggle.add($menu).toggleClass(_collapsedClass, !isCollapsed);
    });

  };

})(jQuery);
