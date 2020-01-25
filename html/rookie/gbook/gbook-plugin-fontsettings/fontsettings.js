require(['gbook', 'jquery'], function(gbook, $) {
    // 配置
    var MAX_SIZE       = 4,
        MIN_SIZE       = 0,
        BUTTON_ID;

    // 当前字体设置状态
    var fontState;

    // 默认主题
    var THEMES = [
        {
            config: 'white',
            text: 'White',
            id: 0
        },
        {
            config: 'sepia',
            text: 'Sepia',
            id: 1
        },
        {
            config: 'night',
            text: 'Night',
            id: 2
        }
    ];

    // 默认字体系列
    var FAMILIES = [
        {
            config: 'serif',
            text: 'Serif',
            id: 0
        },
        {
            config: 'sans',
            text: 'Sans',
            id: 1
        }
    ];

    // 获取主题的配置信息
    function getThemes() {
        return THEMES;
    }

    // 设置主题的配置信息
    function setThemes(themes) {
        THEMES = themes;
        updateButtons();
    }

    // 获取字体配置信息
    function getFamilies() {
        return FAMILIES;
    }

    // 设置字体配置信息
    function setFamilies(families) {
        FAMILIES = families;
        updateButtons();
    }

    // 保存当前字体设置
    function saveFontSettings() {
        gbook.storage.set('fontState', fontState);
        update();
    }

    // 放大页面字体大小
    function enlargeFontSize(e) {
        e.preventDefault();
        if (fontState.size >= MAX_SIZE) return;

        fontState.size++;
        saveFontSettings();
    }

    // 缩小页面字体大小
    function reduceFontSize(e) {
        e.preventDefault();
        if (fontState.size <= MIN_SIZE) return;

        fontState.size--;
        saveFontSettings();
    }

    // 修改字体
    function changeFontFamily(configName, e) {
        if (e && e instanceof Event) {
            e.preventDefault();
        }

        var familyId = getFontFamilyId(configName);
        fontState.family = familyId;
        saveFontSettings();
    }

    // 更改颜色主题的类型
    function changeColorTheme(configName, e) {
        if (e && e instanceof Event) {
            e.preventDefault();
        }

        var $book = gbook.state.$book;

        // 删除当前应用的颜色主题
        if (fontState.theme !== 0)
            $book.removeClass('color-theme-'+fontState.theme);

        // 设置新颜色主题
        var themeId = getThemeId(configName);
        fontState.theme = themeId;
        if (fontState.theme !== 0)
            $book.addClass('color-theme-'+fontState.theme);

        saveFontSettings();
    }

    // 返回字体系列配置键的正确id
	// 默认为第一个字体系列
    function getFontFamilyId(configName) {
        // 搜索插件配置的字体系列
        var configFamily = $.grep(FAMILIES, function(family) {
            return family.config == configName;
        })[0];
        // 回退到默认字体系列
        return (!!configFamily)? configFamily.id : 0;
    }

    // 返回主题配置键的正确id
    // 默认为第一个主题
    function getThemeId(configName) {
        // 搜索插件配置的主题
        var configTheme = $.grep(THEMES, function(theme) {
            return theme.config == configName;
        })[0];
        // 回退到默认主题
        return (!!configTheme)? configTheme.id : 0;
    }

    function update() {
        var $book = gbook.state.$book;

        $('.font-settings .font-family-list li').removeClass('active');
        $('.font-settings .font-family-list li:nth-child('+(fontState.family+1)+')').addClass('active');

        $book[0].className = $book[0].className.replace(/\bfont-\S+/g, '');
        $book.addClass('font-size-'+fontState.size);
        $book.addClass('font-family-'+fontState.family);

        if(fontState.theme !== 0) {
            $book[0].className = $book[0].className.replace(/\bcolor-theme-\S+/g, '');
            $book.addClass('color-theme-'+fontState.theme);
        }
    }

    function init(config) {
        // 搜索插件配置的字体系列
        var configFamily = getFontFamilyId(config.family),
            configTheme = getThemeId(config.theme);

        // 实例化字体状态对象
        fontState = gbook.storage.get('fontState', {
            size:   config.size || 2,
            family: configFamily,
            theme:  configTheme
        });

        update();
    }

    function updateButtons() {
        // 删除现有的FunSt设置按钮
        if (!!BUTTON_ID) {
            gbook.toolbar.removeButton(BUTTON_ID);
        }

        // 在工具栏中创建按钮
        BUTTON_ID = gbook.toolbar.createButton({
            icon: 'fa fa-font',
            label: 'Font Settings',
            className: 'font-settings',
            dropdown: [
                [
                    {
                        text: 'A',
                        className: 'font-reduce',
                        onClick: reduceFontSize
                    },
                    {
                        text: 'A',
                        className: 'font-enlarge',
                        onClick: enlargeFontSize
                    }
                ],
                $.map(FAMILIES, function(family) {
                    family.onClick = function(e) {
                        return changeFontFamily(family.config, e);
                    };

                    return family;
                }),
                $.map(THEMES, function(theme) {
                    theme.onClick = function(e) {
                        return changeColorTheme(theme.config, e);
                    };

                    return theme;
                })
            ]
        });
    }

    // 启动时初始化配置
    gbook.events.bind('start', function(e, config) {
        var opts = config.fontsettings;

        // 开始时生成按钮
        updateButtons();

        // 初始化当前设置
        init(opts);
    });

    // 导出 API
    gbook.fontsettings = {
        enlargeFontSize: enlargeFontSize,
        reduceFontSize:  reduceFontSize,
        setTheme:        changeColorTheme,
        setFamily:       changeFontFamily,
        getThemes:       getThemes,
        setThemes:       setThemes,
        getFamilies:     getFamilies,
        setFamilies:     setFamilies
    };
});


