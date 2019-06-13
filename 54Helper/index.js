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

	const SHOW_CLASS = 'c54dxs-show';
	const PINNED_CLASS = 'c54dxs-pinned';

	const STORE = {
		TOKEN: 'c54dxs.access_token', //令牌
		WIDTH: 'c54dxs.sidebar_width'
	};

	const DEFAULTS = {
		TOKEN: '6ae86c5ce7a5e2a133d4ddee62cb5347589dd1ce',
		WIDTH: 280
	};

	const EVENT = {
		TOGGLE: 'c54dxs:toggle',
		REQ_START: 'c54dxs:start',
		REQ_END: 'c54dxs:end',
		LAYOUT_CHANGE: 'c54dxs:layout',
		TOGGLE_PIN: 'c54dxs:pin',
		LOC_CHANGE: 'c54dxs:location'
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
				const msg = '54大学生无法保存其设置，如果此域的本地存储已满，请清理并重试。';
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

	/**
	 * 管理54大学生插件类
	 */
	class PluginManager {
		/**
		 * @constructor
		 */
		constructor() {
			this._plugins = [];
			this._forward({
				activate: null,
				applyOptions: (results) => results.some((shouldReload) => !!shouldReload)
			});
		}

		/**
		 * 注册插件类
		 * @param {!Plugin} pluginClass.
		 */
		register(plugin) {
			this._plugins.push(plugin);
		}

		/**
		 * 将指定的方法转发到每个插件
		 * @private {!Object<!String, !function(Array<*>): *} methods
		 * @return 与每个方法关联的收集器函数返回的值
		 */
		_forward(methods) {
			for(const method of Object.keys(methods)) {
				this[method] = async(...args) => {
					const promises = this._plugins.map((plugin) => plugin[method](...args));
					const results = await Promise.all(promises);
					const resultHandler = methods[method];

					if(!resultHandler) return results;
					else return resultHandler(results);
				};
			}
		}
	}

	/**
	 * Base plugin class.
	 */
	class Plugin {
		/**
		 * Activates the plugin.
		 * @param {!{
		 *   adapter: !Adapter,
		 *   $sidebar: !JQuery,
		 *   $toggler: !JQuery,
		 *   $views: !JQuery,
		 *   treeView: !TreeView,
		 *   optsView: !OptionsView,
		 *   errorView: !ErrorView,
		 * }}
		 * @return {!Promise<undefined>}
		 */
		async activate(opts) {
			return undefined;
		}

		/**
		 * Applies the option changes user has made.
		 * @param {!Object<!string, [(string|boolean), (string|boolean)]>} changes
		 * @return {!Promise<boolean>} iff the tree should be reloaded.
		 */
		async applyOptions(changes) {
			return false;
		}
	}

	window.pluginManager = new PluginManager();
	window.Plugin = Plugin;

	class C54dxsService {
		getAccessToken() {
			return window.store.get(window.STORE.TOKEN);
		}

		getInvalidTokenMessage({
			responseStatus,
			requestHeaders
		}) {
			return(
				'GitHub访问token无效' +
				'请转到 <a class="settings-btn" href="javascript:void(0)">设置</a> 并更新token'
			);
		}
	}

	window.c54dxs = new C54dxsService();

	/**
	 * 适配器基类
	 */
	class Adapter {
		constructor(deps, store) {
			deps.forEach((dep) => window[dep]());
			this._defaultBranch = {};
			this.store = store;
		}

		/**
		 * 从仓库加载代码树
		 * @param {Object} opts: {
		 *                  path: 加载树的起始路径,
		 *                  repo: 当前存储库,
		 *                  node (可选): 所选节点 (为null加载整个树),
		 *                  token (可选): 个人访问令牌
		 *                 }
		 * @param {Function} transform(item)
		 * @param {Function} cb(err: error, tree: Array[Array|item])
		 * @api protected
		 */
		_loadCodeTreeInternal(opts, transform, cb) {
			const folders = {
				'': []
			};
			const $dummyDiv = $('<div/>');
			const {
				path,
				repo,
				node
			} = opts;

			opts.encodedBranch = opts.encodedBranch || encodeURIComponent(decodeURIComponent(repo.branch));

			this._getTree(path, opts, (err, tree) => {
				if(err) return cb(err);

				this._getSubmodules(tree, opts, (err, submodules) => {
					if(err) return cb(err);

					submodules = submodules || {};

					const nextChunk = (iteration = 0) => {
						const CHUNK_SIZE = 300;

						for(let i = 0; i < CHUNK_SIZE; i++) {
							const item = tree[iteration * CHUNK_SIZE + i];

							// We're done
							if(item === undefined) {
								return cb(null, folders['']);
							}

							// Runs transform requested by subclass
							if(transform) {
								transform(item);
							}

							// If lazy load and has parent, prefix with parent path
							if(node && node.path) {
								item.path = node.path + '/' + item.path;
							}

							const path = item.path;
							const type = item.type;
							const index = path.lastIndexOf('/');
							const name = $dummyDiv.text(path.substring(index + 1)).html(); // Sanitizes, closes #9

							item.id = NODE_PREFIX + path;
							item.text = name;

							// Uses `type` as class name for tree node
							item.icon = type;

							if(type === 'blob') {
								if(this.store.get(STORE.ICONS)) {
									const className = FileIcons.getClassWithColor(name);
									item.icon += ' ' + (className || 'file-generic');
								} else {
									item.icon += ' file-generic';
								}
							}

							if(item.patch) {
								const {
									action,
									previous,
									filesChanged: files,
									additions,
									deletions
								} = item.patch;
								let patch = '';
								patch += action === 'added' ? '<span class="text-green">added</span>' : '';
								patch += action === 'renamed' ? `<span class="text-green" title="${previous}">renamed</span>` : '';
								patch += action === 'removed' ? `<span class="text-red" title="${previous}">removed</span>` : '';
								patch += files ?
									`<span class='octotree-patch-files'>${files} ${files === 1 ? 'file' : 'files'}</span>` :
									'';
								patch += additions !== 0 ? `<span class="text-green">+${additions}</span>` : '';
								patch += deletions !== 0 ? `<span class="text-red">-${deletions}</span>` : '';
								item.text += `<span class="octotree-patch">${patch}</span>`;
							}

							if(node) {
								folders[''].push(item);
							} else {
								folders[path.substring(0, index)].push(item);
							}

							if(type === 'tree' || type === 'blob') {
								if(type === 'tree') {
									if(node) item.children = true;
									else folders[item.path] = item.children = [];
								}

								// If item is part of a PR, jump to that file's diff
								if(item.patch && typeof item.patch.diffId === 'number') {
									const url = this._getPatchHref(repo, item.patch);
									item.a_attr = {
										href: url,
										'data-download-url': item.url,
										'data-download-filename': name
									};
								} else {
									// Encodes but retains the slashes, see #274
									const encodedPath = path
										.split('/')
										.map(encodeURIComponent)
										.join('/');
									const url = this._getItemHref(repo, type, encodedPath, opts.encodedBranch);
									item.a_attr = {
										href: url,
										'data-download-url': url,
										'data-download-filename': name
									};
								}
							} else if(type === 'commit') {
								let moduleUrl = submodules[item.path];

								if(moduleUrl) {
									// Fixes #105
									// Special handling for submodules hosted in GitHub
									if(~moduleUrl.indexOf('github.com')) {
										moduleUrl = moduleUrl
											.replace(/^git(:\/\/|@)/, window.location.protocol + '//')
											.replace('github.com:', 'github.com/')
											.replace(/.git$/, '');
										item.text =
											`<a href="${moduleUrl}" class="jstree-anchor">${name}</a>` +
											'<span>@ </span>' +
											`<a href="${moduleUrl}/tree/${item.sha}" class="jstree-anchor">${item.sha.substr(0, 7)}</a>`;
									}
									item.a_attr = {
										href: moduleUrl
									};
								}
							}
						}

						setTimeout(() => nextChunk(iteration + 1));
					};

					nextChunk();
				});
			});
		}

		/**
		 * 一般错误处理
		 * @api protected
		 */
		_handleError(settings, jqXHR, cb) {
			let error;
			let message;

			switch(jqXHR.status) {
				case 0:
					error = '连接错误';
					message = `无法连接到网站。如果您与此网站的网络连接正常，可能是API中断。请稍后再试。`;
					break;
				case 409:
					error = '空存储库';
					message = '此存储库为空。';
					break;
				case 401:
					error = '无效token';
					message = c54dxs.getInvalidTokenMessage({
						responseStatus: jqXHR.status,
						requestHeaders: settings.headers
					});
					break;
				case 404:
					error = '私有存储库';
					message =
						'访问私有存储库需要Github访问token。' +
						'请转到 <a class="settings-btn" href="javascript:void(0)">设置</a> 并输入token';
					break;
				case 403:
					if(jqXHR.getResponseHeader('X-RateLimit-Remaining') === '0') {
						// It's kinda specific for GitHub
						error = '超出API限制';
						message =
							'您已经超过了 <a href="https://developer.github.com/v3/#rate-limiting">GitHub API速率限制</a>. ' +
							'要继续使用octotree，需要提供一个github访问token。' +
							'请转到 <a class="settings-btn" href="javascript:void(0)">设置</a> 并输入token';
					} else {
						error = '禁止的';
						message =
							'访问私有存储库需要Github访问token。' +
							'请转到 <a class="settings-btn" href="javascript:void(0)">设置</a> 并输入token';
					}
					break;

					// Fallback message
				default:
					error = message = jqXHR.statusText;
					break;
			}
			cb({
				error: `Error: ${error}`,
				message: message,
				status: jqXHR.status
			});
		}

		/**
		 * 返回要添加到侧边栏的CSS类
		 * @api public
		 */
		getCssClass() {
			throw new Error('Not implemented');
		}

		/**
		 * 返回侧边栏可接受的最小宽度
		 * @api protected
		 */
		getMinWidth() {
			return 220;
		}

		/**
		 * 在侧边栏添加到DOM之后，inits的行为
		 * @api public
		 */
		init($sidebar) {
			$sidebar.resizable({
				handles: 'e',
				minWidth: this.getMinWidth()
			});
		}

		/**
		 * 返回适配器是否能够在单个请求中加载整个树。这通常由基础API决定。
		 * @api public
		 */
		canLoadEntireTree(opts) {
			return false;
		}

		/**
		 * 加载代码树。
		 * @api public
		 */
		loadCodeTree(opts, cb) {
			throw new Error('Not implemented');
		}

		/**
		 * 返回创建个人访问令牌的URL
		 * @api public
		 */
		getCreateTokenUrl() {
			throw new Error('Not implemented');
		}

		/**
		 * 根据边栏的可见性和宽度更新布局。
		 * @api public
		 */
		updateLayout(sidebarPinned, sidebarVisible, sidebarWidth) {
			throw new Error('Not implemented');
		}

		/**
		 * 返回当前路径的repo信息
		 * @api public
		 */
		getRepoFromPath(token, cb) {
			throw new Error('Not implemented');
		}

		/**
		 * 选择特定路径的文件
		 * @api public
		 */
		selectFile(path) {
			window.location.href = path;
		}

		/**
		 * 选择子模块
		 * @api public
		 */
		selectSubmodule(path) {
			window.location.href = path;
		}

		/**
		 * 在新选项卡中打开文件或子模块
		 * @api public
		 */
		openInNewTab(path) {
			window.open(path, '_blank').focus();
		}

		/**
		 * 下载一个文件
		 * @api public
		 */
		downloadFile(path, fileName) {
			const downloadUrl = path.replace(/\/blob\/|\/src\//, '/raw/');
			const link = document.createElement('a');

			link.setAttribute('href', downloadUrl);

			// GitHub将重定向到其他来源（主机）以下载文件。
			// 但是，新主机没有从GitHub添加到内容安全策略头中，
			// 因此浏览器不会保存文件，而是导航到该文件。使用 '_blank'作为不被导航的技巧，请参阅
			// https://www.html5rocks.com/en/tutorials/security/content-security-policy/
			link.setAttribute('target', '_blank');

			link.click();
		}

		/**
		 * 在路径处获取树
		 * @param {Object} opts - {token, repo}
		 * @api protected
		 */
		_getTree(path, opts, cb) {
			throw new Error('Not implemented');
		}

		/**
		 * 获取树中的子模块
		 * @param {Object} opts - {token, repo, encodedBranch}
		 * @api protected
		 */
		_getSubmodules(tree, opts, cb) {
			throw new Error('Not implemented');
		}

		/**
		 * Returns item's href value.
		 * @api protected
		 */
		_getItemHref(repo, type, encodedPath, encodedBranch) {
			return `/${repo.username}/${repo.reponame}/${type}/${encodedBranch}/${encodedPath}`;
		}
		/**
		 * Returns patch's href value.
		 * @api protected
		 */
		_getPatchHref(repo, patch) {
			return `/${repo.username}/${repo.reponame}/pull/${repo.pullNumber}/files#diff-${patch.diffId}`;
		}
	}

	loadExtension();

	async function loadExtension() {
		const $html = $('html');
		const $document = $(document);
		const $sidebar = $('.c54dxs-sidebar');
		const $toggler = $sidebar.find('.c54dxs-toggle');
		const $spinner = $sidebar.find('.c54dxs-spin');
		const $pinner = $sidebar.find('.c54dxs-pin');
		//		const adapter = new GitHub(store);

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
		 * 侧边栏显示隐藏的切换控制
		 * @param {Object} visibility
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
		 * 固定边栏按钮的切换处理
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
			//			adapter.updateLayout(isSidebarPinned(), isSidebarVisible(), width);
			if(save === true) {
				store.set(STORE.WIDTH, width);
			}
		}

		/**
		 * 控制边栏在浮动模式（即非固定）下的行为。
		 */
		function setupSidebarFloatingBehaviors() {
			const MOUSE_LEAVE_DELAY = 500;
			const KEY_PRESS_DELAY = 4000;
			let isMouseInSidebar = false;

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

		function onTogglerHovered() {
			toggleSidebar(true);
		}

		function onTogglerClicked(event) {
			event.stopPropagation();
			toggleSidebar(true);
		}

		/**
		 * 处理鼠标滑动到侧边栏开关处
		 * 
		 * @param {Object} enableHoverOpen
		 */
		function handleHoverOpenOption(enableHoverOpen) {
			// on添加事件、off移除事件
			if(enableHoverOpen) {
				$toggler.off('click', onTogglerClicked);
				$toggler.on('mouseenter', onTogglerHovered);
			} else {
				$toggler.off('mouseenter', onTogglerHovered);
				$toggler.on('click', onTogglerClicked);
			}
		}

		function isSidebarVisible() {
			return $html.hasClass(SHOW_CLASS);
		}

		function isSidebarPinned() {
			return $pinner.hasClass(PINNED_CLASS);
		}
	}
});