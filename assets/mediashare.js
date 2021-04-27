document.addEventListener('DOMContentLoaded', function () {
    window.fbAsyncInit = function () {
        FB.init({
            appId: '2084227675196220',
            autoLogAppEvents: true,
            xfbml: true,
            version: 'v10.0'
        });
    };
    document.getElementById('fb_share_btn').onclick = function () {
        FB.ui({
            display: 'popup',
            method: 'share',
            href: 'https://jonas-alcantara.github.io/wheretrivia/',
        }, function (response) { });
    }
});