$(function () {
    let $loginButton = $('#loginButton');
    let $signUpButton = $('#signUpButton');
    let $loginForm = $('#loginForm');
    let $login = $('#login');
    let $registration = $('#registration');
    let $loginButtonInForm = $('.left-button-in-fadein-container');
    let $signUpButtonInForm = $('.right-button-in-fadein-container');
    let $overlay = $('#overlay');
    $loginButton.add($signUpButton).add($loginButtonInForm).add($signUpButtonInForm).on('click', function (e) {
        $overlay.addClass('overlay');
        if (e.target.id === $loginButton.attr('id') || e.target.id === $loginButtonInForm.attr('id')) {
            $loginButtonInForm.addClass('active');
            $login.addClass('activate');
            $signUpButtonInForm.removeClass('active');
            $registration.removeClass('activate');
        } else {
            $signUpButtonInForm.addClass('active');
            $registration.addClass('activate');
            $loginButtonInForm.removeClass('active');
            $login.removeClass('activate');
        }
        $loginForm.stop(true, true).fadeTo(700, 1);
        $loginForm.show();
    });
    $('body').on('mousedown touchstart', function (e) {
        let isNotLoginButton = e.target.id !== $loginButton.attr('id');
        let isNotSignUpButton = e.target.id !== $signUpButton.attr('id');
        let isNotLoginForm = e.target.id !== $loginForm.attr('id');
        let hasParentLoginForm = $(e.target).parents().is('#loginForm');
        if (isNotLoginButton && isNotLoginForm && !hasParentLoginForm && isNotSignUpButton) {
            $loginForm.stop(true, true).fadeTo(700, 0);
            $overlay.removeClass('overlay');
            $loginForm.hide();
        }
    });
});