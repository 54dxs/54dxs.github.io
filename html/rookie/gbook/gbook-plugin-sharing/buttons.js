require(['gbook', 'jquery'], function(gbook, $) {
    function site(label, icon, link) {
        return {
            label: label,
            icon: 'fa fa-' + icon,
            onClick: function (e) {
                e.preventDefault();
                window.open(link);
            }
        };
    }

    var url = encodeURIComponent(location.href);
    var title = encodeURIComponent(document.title);

    var SITES = {
        qq: site('QQ', 'qq', 'http://connect.qq.com/widget/shareqq/index.html?url=' + url + '&title=' + title),
        qzone: site('QQ空间', 'star', 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=' + url + '&title=' + title),
        weibo: site('新浪微博', 'weibo', 'http://service.weibo.com/share/share.php?content=utf-8&url=' + url + '&title=' + title),
        douban: site('豆瓣', 'share', 'http://shuo.douban.com/!service/share?href=' + url + '&name=' + title),
        facebook: site('Facebook', 'facebook', 'http://www.facebook.com/sharer/sharer.php?s=100&p[url]=' + url),
        google: site('Google+', 'google-plus', 'https://plus.google.com/share?url=' + url),
        hatenaBookmark: site('はてなブックマーク', 'bold', 'http://b.hatena.ne.jp/entry/' + url),
        instapaper: site('instapaper', 'instapaper', 'http://www.instapaper.com/text?u=' + url),
        line: site('LINE', 'comment', 'http://line.me/R/msg/text/?' + title + ' ' + url),
        linkedin: site('Linkedin', 'linkedin', 'https://www.linkedin.com/shareArticle?mini=true&url=' + url),
        messenger: site('Facebook Messenger', 'commenting', 'fb-messenger://share?link=' + url),
        pocket: site('Pocket', 'get-pocket', 'https://getpocket.com/save?url=' + url + '&title=' + title),
        stumbleupon: site('StumbleUpon', 'stumbleupon', 'http://www.stumbleupon.com/submit?url=' + url + '&title=' + title),
        twitter: site('Twitter', 'twitter', 'https://twitter.com/intent/tweet?url=' + title + '&text=' + title),
        viber: site('Viber', 'volume-control-phone', 'viber://forward?text='+ url + ' ' + title),
        vk: site('VK', 'vk', 'http://vkontakte.ru/share.php?url=' + url),
        whatsapp: site('WhatsApp', 'whatsapp', 'whatsapp://send?text='+ url + ' ' + title),
    };

    gbook.events.bind('start', function(e, config) {
        var opts = config.sharing;

        // 创建下拉菜单
        var menu = $.map(opts.all, function(id) {
            var site = SITES[id];

            return {
                text: site.label,
                onClick: site.onClick
            };
        });

        // 使用下拉菜单创建主按钮
        if (menu.length > 0) {
            gbook.toolbar.createButton({
                icon: 'fa fa-share-alt',
                label: 'Share',
                position: 'right',
                dropdown: [menu]
            });
        }

        // 直接行动分享
        $.each(SITES, function(sideId, site) {
            if (!opts[sideId]) return;

            gbook.toolbar.createButton({
                icon: site.icon,
                label: site.text,
                position: 'right',
                onClick: site.onClick
            });
        });
    });
});
