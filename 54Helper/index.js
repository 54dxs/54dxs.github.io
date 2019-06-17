$(function() {
	$('#jstree').jstree({
		"core": {
			"animation": 0,
			"check_callback": true,
			"themes": {
				"stripes": true
			},
			'data': {
				'url': function(node) {
					return 'jstree.json';
				},
				'data': function(node) {
					return {
						'id': node.id
					};
				}
			}
		},
		"types": {
			"#": {
				"max_children": -1, // 最大直接子节点数
				"max_depth": -1, // 最大嵌套数
				"valid_children": ["root"]
			},
			"root": {
				"icon": "../static/img/icon19.png",
				"valid_children": ["default"]
			},
			"default": {
				"valid_children": ["default", "file"]
			},
			"file": {
				"icon": "glyphicon glyphicon-file",
				"valid_children": []
			}
		},
		"plugins": [
			// "checkbox",// 三态复选框
			"contextmenu", //右键菜单 
			"dnd", // 拖拽
			// "massload",// 此插件可以在单个请求中加载节点（与延迟加载一起使用）
			"search", //搜索
			// "sort",// 排序兄弟节点
			"state", //此插件将所有打开和选定的节点保存在用户的浏览器中，因此当返回到同一个树时，将恢复先前的状态。
			"types", //节点组添加预定义模式
			"unique", // 同级节点不可相同
			// "wholerow",// 使每个节点显示块级别，使选择更容易
			"changed",
			"conditionalselect"
		]
	});

	// jstree搜索
	var to = false;
	$('#jstree_search').keyup(function() {
		if(to) {
			clearTimeout(to);
		}
		to = setTimeout(function() {
			var v = $('#jstree_search').val();
			$('#jstree').jstree(true).search(v);
		}, 250);
	});

	// jstree节点点击事件处理
	$('#jstree').on("changed.jstree", function(e, data) {
		if(data.action !== "select_node") {
			// 节点选择事件触发(左键点击、右键点击)
			console.log("data.action: " + data.action);
			return;
		}
		if(!data.event) {
			// TODO 这里处理首次加载逻辑
			console.log("首次加载页面: " + data.node.text);

			let id = data.node.id;
			fetch(id + '/index.html').then(resp => {
				resp.text().then(html => {
					// 插入html
					$("#jstree_body").html(html);

					// 插入css
					let link = document.createElement('link');
					link.setAttribute('rel', 'stylesheet');
					link.setAttribute('href', id + '/index.css');
					document.head.appendChild(link);

					// 插入js
					let script = document.createElement('script');
					script.src = id + '/index.js';
					document.body.appendChild(script);
				}).catch(e => {
					console.log("error1: " + e);
				});
			}).catch(e => {
				console.log("error: " + e);
			});

			return;
		}
		if(!data.node) {
			console.log("data.node：" + data.node);
			return;
		}
		if(data.event.type !== "click") {
			console.log("data.event.type：" + data.event.type);
			return;
		}
		if(data.node.parent === "#") {
			//			alert("根节点：" + data.node.text);
		} else {
			let id = data.node.id;
			fetch(id + '/index.html').then(resp => {
				resp.text().then(html => {
					// 插入html
					$("#jstree_body").html(html);

					// 插入css
					let link = document.createElement('link');
					link.setAttribute('rel', 'stylesheet');
					link.setAttribute('href', id + '/index.css');
					document.head.appendChild(link);

					// 插入js
					let script = document.createElement('script');
					script.src = id + '/index.js';
					document.body.appendChild(script);
				});
			});

			//			alert("子节点：" + data.node.text);
		}
		console.log(data.selected);
	});

	// ---左侧导航-------------------------------------------------------------------------------------------------------------------

	const NODE_PREFIX = 'c54dxs';
	const ADDON_CLASS = 'c54dxs';
	const SHOW_CLASS = 'c54dxs-show'; // 侧边栏显示html类
	const PINNED_CLASS = 'c54dxs-pinned'; // 边栏设置按钮样式类（小书钉📌）

	const GH_CONTAINERS = '.c54dxs-body';
	const GH_HEADER = '.c54dxs-body';

	const STORE = {
		TOKEN: 'c54dxs.access_token',
		DARKMODE: 'c54dxs.dark_mode',
		THEME: 'c54dxs.theme',
		HOVEROPEN: 'c54dxs.hover_open',
		NONCODE: 'c54dxs.noncode_shown',
		PR: 'c54dxs.pr_shown',
		HOTKEYS: 'c54dxs.hotkeys',
		ICONS: 'c54dxs.icons',
		LOADALL: 'c54dxs.loadall',
		POPUP: 'c54dxs.popup_shown',
		WIDTH: 'c54dxs.sidebar_width',
		SHOWN: 'c54dxs.sidebar_shown',
		PINNED: 'c54dxs.sidebar_pinned',
		HUGE_REPOS: 'c54dxs.huge_repos'
	};

	const DEFAULTS = {
		TOKEN: '',
		DARKMODE: false,
		THEME: '', //主题
		HOVEROPEN: true,
		NONCODE: true,
		PR: true,
		LOADALL: true,
		HOTKEYS: '⌘+⇧+s, ⌃+⇧+s',
		ICONS: true,
		POPUP: false,
		WIDTH: 232,
		SHOWN: false,
		PINNED: false,
		HUGE_REPOS: {}
	};

	const EVENT = {
		TOGGLE: 'c54dxs:toggle',
		TOGGLE_PIN: 'c54dxs:pin',
		LOC_CHANGE: 'c54dxs:location',
		LAYOUT_CHANGE: 'c54dxs:layout',
		REQ_START: 'c54dxs:start',
		REQ_END: 'c54dxs:end',
		OPTS_CHANGE: 'c54dxs:change',
		VIEW_READY: 'c54dxs:ready',
		VIEW_CLOSE: 'c54dxs:close',
		VIEW_SHOW: 'c54dxs:show',
		FETCH_ERROR: 'c54dxs:error'
	};

	window.STORE = STORE;
	window.DEFAULTS = DEFAULTS;
	window.EVENT = EVENT;

	class Storage {
		static create(values, defaults) {
			const store = new Storage();
			for(const key of Object.keys(values)) {
				store.setIfNull(values[key], defaults[key]);
			}
			return store;
		}

		set(key, val, cb) {
			try {
				localStorage.setItem(key, JSON.stringify(val));
			} catch(e) {
				const msg =
					'54Helper无法保存其设置' +
					'如果此域的本地存储已满，请清理并重试。';
				console.error(msg, e);
			}
			if(cb) cb();
		}

		get(key, cb) {
			var val = parse(localStorage.getItem(key));
			if(cb) cb(val);
			else return val;

			function parse(val) {
				try {
					return JSON.parse(val);
				} catch(e) {
					return val;
				}
			}
		}

		setIfNull(key, val, cb) {
			this.get(key, (existingVal) => {
				this.set(key, existingVal == null ? val : existingVal, cb);
			});
		}
	}

	const store = Storage.create(STORE, DEFAULTS);
	window.store = store;

	loadExtension();
	async function loadExtension() {
		const $html = $('html');
		const $document = $(document);
		const $sidebar = $('.c54dxs-sidebar'); // 侧边栏容器
		const $toggler = $sidebar.find('.c54dxs-toggle'); //边栏显示隐藏控制按钮
		const $spinner = $sidebar.find('.c54dxs-spin');
		const $pinner = $sidebar.find('.c54dxs-pin'); // 边栏设置按钮(小书钉📌)

		$pinner.click(togglePin);
		setupSidebarFloatingBehaviors();

		// 监听浏览器窗口大小变化
		$(window).resize((event) => {
			if(event.target === window) layoutChanged();
		});

		// 给document注册事件
		$document
			.on(EVENT.REQ_START, () => $spinner.addClass('c54dxs-spin--loading'))
			.on(EVENT.REQ_END, () => $spinner.removeClass('c54dxs-spin--loading'))
			.on(EVENT.LAYOUT_CHANGE, layoutChanged)
			.on(EVENT.TOGGLE_PIN, layoutChanged);
		//			.on(EVENT.LOC_CHANGE, () => tryLoadRepo());

		// 侧边栏初始样式参数设置
		$sidebar
			//			.addClass(adapter.getCssClass())
			.width(Math.min(parseInt(store.get(STORE.WIDTH)), 1000))
			.resize(() => layoutChanged(true));
		//			.appendTo($('body'));
		//		adapter.init($sidebar);
		//		helpPopup.init();

		/**
		 * 侧边栏显示隐藏的切换控制（如果当前显示，调用后则隐藏。如果当前隐藏，调用后则显示）
		 * @param {Object} visibility true:;false:
		 */
		function toggleSidebar(visibility) {
			if(visibility !== undefined) {
				if(isSidebarVisible() === visibility) return;
				toggleSidebar();
			} else {
				$html.toggleClass(SHOW_CLASS);
				$document.trigger(EVENT.TOGGLE, isSidebarVisible());

				// 确保在侧边栏隐藏后显示时加载repo。
				// 请注意，tryloadrepo（）已经负责在没有任何更改的情况下不重新加载。
				if(isSidebarVisible()) {
					$toggler.show();
					//					tryLoadRepo();
				}
			}
			return visibility;
		}

		/**
		 * 固定边栏按钮（小书钉📌）的切换处理
		 * @param {Object} isPinned
		 */
		function togglePin(isPinned) {
			if(isPinned !== undefined) {
				if(isSidebarPinned() === isPinned) return;
				return togglePin();
			}

			$pinner.toggleClass(PINNED_CLASS);

			const sidebarPinned = isSidebarPinned();
			$pinner.find('.tooltipped').attr('aria-label', `${sidebarPinned ? '取消固定' : '固定'}边栏`);
			$document.trigger(EVENT.TOGGLE_PIN, sidebarPinned);
			store.set(STORE.PINNED, sidebarPinned);
			toggleSidebar(sidebarPinned);
			return sidebarPinned;
		}

		/**
		 * 侧边栏宽度改变处理
		 * @param {Object} save
		 */
		function layoutChanged(save = false) {
			const width = $sidebar.outerWidth();
			updateLayout(isSidebarPinned(), isSidebarVisible(), width);
			if(save === true) {
				store.set(STORE.WIDTH, width);
			}
		}

		/**
		 * 更新布局
		 * 
		 * @param {Object} sidebarPinned
		 * @param {Object} sidebarVisible
		 * @param {Object} sidebarWidth
		 */
		function updateLayout(sidebarPinned, sidebarVisible, sidebarWidth) {
			const SPACING = 10;
			const $header = $(GH_HEADER);
			const $containers = $(GH_CONTAINERS);
			const autoMarginLeft = ($(document).width() - $containers.width()) / 2;
			const shouldPushEverything = sidebarPinned && sidebarVisible;
			const smallScreen = autoMarginLeft <= sidebarWidth + SPACING;

			$('html').css('margin-left', shouldPushEverything && smallScreen ? sidebarWidth : '');
			$containers.css('margin-left', shouldPushEverything && smallScreen ? SPACING : '');

			if(shouldPushEverything && !smallScreen) {
				// 在大屏幕中覆盖重要的Github Header类
				$header.attr('style', `padding-left: ${sidebarWidth + SPACING}px !important`);
			} else {
				$header.removeAttr('style');
			}
		}

		/**
		 * 控制边栏在浮动模式（即非固定）下的行为。
		 */
		function setupSidebarFloatingBehaviors() {
			const MOUSE_LEAVE_DELAY = 500; //鼠标离开延迟
			const KEY_PRESS_DELAY = 4000; //按键\延时
			let isMouseInSidebar = false; //鼠标在侧边栏中

			handleHoverOpenOption(this.store.get(STORE.HOVEROPEN));

			// 如果在侧边栏外单击，则立即关闭。
			$document.on('click', () => {
				if(!isMouseInSidebar && !isSidebarPinned() && isSidebarVisible()) {
					toggleSidebar(false);
				}
			});

			$document.on('mouseover', () => {
				// 当鼠标移动到边栏外时，确保仅执行一次StartTimer。
				if(!timerId) {
					isMouseInSidebar = false;
					startTimer(MOUSE_LEAVE_DELAY);
				}
			});

			let timerId = null;

			const startTimer = (delay) => {
				if(!isMouseInSidebar && !isSidebarPinned()) {
					clearTimer();
					timerId = setTimeout(() => toggleSidebar(isSidebarPinned()), delay);
				}
			};
			const clearTimer = () => {
				if(timerId) {
					clearTimeout(timerId);
					timerId = null;
				}
			};

			$sidebar
				.on('keyup', () => startTimer(KEY_PRESS_DELAY))
				.on('mouseover', (event) => {
					// 防止mouseover传播到document
					event.stopPropagation();
				})
				.on('focusin mousemove', (event) => {
					// 悬停在切换开关上时不要做任何事情
					const isHoveringToggler = $toggler.is(event.target) || $toggler.has(event.target).length;

					if(isHoveringToggler) return;

					/**
					 * 单击侧边栏中的文件，然后向外移动时，
					 * 使用“focusin”而不是“mouseenter”来处理这种情况->侧边栏中触发了“mouseenter”，
					 * 清除计时器并保持侧边栏打开。
					 */
					isMouseInSidebar = true;
					clearTimer();

					if(event.type === 'mousemove' && !isSidebarVisible()) toggleSidebar(true);
				});
		}

		/**
		 * 侧边栏按钮鼠标响应事件
		 */
		function onTogglerHovered() {
			toggleSidebar(true);
		}

		/**
		 * 侧边栏控制按钮点击事件
		 * @param {Object} event
		 */
		function onTogglerClicked(event) {
			event.stopPropagation();
			toggleSidebar(true);
		}

		/**
		 * 处理鼠标滑动到侧边栏开关处
		 * 
		 * @param {Object} enableHoverOpen true:鼠标经过切换;false:鼠标点击切换
		 */
		function handleHoverOpenOption(enableHoverOpen) {
			// on添加事件、off移除事件
			if(enableHoverOpen) {
				$toggler.off('click', onTogglerClicked); // 移除点击事件
				$toggler.on('mouseenter', onTogglerHovered); //添加鼠标🖱进入事件
			} else {
				$toggler.off('mouseenter', onTogglerHovered);
				$toggler.on('click', onTogglerClicked);
			}
		}

		/**
		 * 侧边栏显示的还是隐藏的(html是否有样式SHOW_CLASS)
		 * true:有;false:没有
		 */
		function isSidebarVisible() {
			return $html.hasClass(SHOW_CLASS);
		}

		/**
		 * 侧边栏设置按钮（小书钉）是否有类PINNED_CLASS
		 * true:有;false:没有
		 */
		function isSidebarPinned() {
			return $pinner.hasClass(PINNED_CLASS);
		}
	}
});