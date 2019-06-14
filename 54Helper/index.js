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
	const SHOW_CLASS = 'c54dxs-show';
	const PINNED_CLASS = 'c54dxs-pinned';

	const STORE = {
		TOKEN: 'c54dxs.access_token', //令牌
		NONCODE: 'c54dxs.noncode_shown', // 非代码页是否显示
		WIDTH: 'c54dxs.sidebar_width',
		ICONS: 'c54dxs.icons',
		HUGE_REPOS: 'c54dxs.huge_repos'
	};

	const DEFAULTS = {
		TOKEN: '6ae86c5ce7a5e2a133d4ddee62cb5347589dd1ce',
		NONCODE: true,
		WIDTH: 280,
		ICONS: true,
		HUGE_REPOS: {}
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

	class PjaxAdapter extends Adapter {
		constructor(store) {
			super(['jquery.pjax.js'], store);
			$(document)
				.on('pjax:start', () => $(document).trigger(EVENT.REQ_START))
				.on('pjax:end', () => $(document).trigger(EVENT.REQ_END))
				.on('pjax:timeout', (e) => e.preventDefault());
		}

		// @override
		// @param {Object} opts - {pjaxContainer: 指定的PJAX容器}
		// @api public
		init($sidebar, opts) {
			super.init($sidebar);

			opts = opts || {};
			const pjaxContainer = opts.pjaxContainer;

			// MutationObserver接口提供了监视对DOM树所做更改的能力。
			if(!window.MutationObserver) return;

			// 一些主机使用pjax切换页面。
			// 此观察器检测PJAX容器是否已用新内容和触发器布局进行了更新。
			const pageChangeObserver = new window.MutationObserver(() => {
				// 触发位置更改，不能只是重新布局，
				// 因为Octotree可能需要隐藏/显示，具体取决于当前页面是否是代码页。
				return $(document).trigger(EVENT.LOC_CHANGE);
			});

			if(pjaxContainer) {
				pageChangeObserver.observe(pjaxContainer, {
					childList: true
				});
			} else {
				// 如果DOM已更改，则返回
				let firstLoad = true,
					href,
					hash;

				function detectLocChange() {
					if(location.href !== href || location.hash !== hash) {
						href = location.href;
						hash = location.hash;

						// 如果这是第一次调用它，则无需通知更改，
						// 因为octotree在加载选项后进行自己的初始化。
						if(firstLoad) {
							firstLoad = false;
						} else {
							setTimeout(() => {
								$(document).trigger(EVENT.LOC_CHANGE);
							}, 300); // 等一下PJAX DOM更改
						}
					}
					setTimeout(detectLocChange, 200);
				}

				detectLocChange();
			}
		}

		// @override
		// @param {Object} opts - {$pjax_container: jQuery object}
		// @api public
		selectFile(path, opts) {
			opts = opts || {};

			// 如果已选择文件，则不执行任何操作
			if(location.pathname === path) return;

			// 如果我们在同一个页面上，只是导航到另一个锚
			// 不用费心用pjax获取页面
			const pathWithoutAnchor = path.replace(/#.*$/, '');
			const isSamePage = location.pathname === pathWithoutAnchor;
			const pjaxContainerSel = opts.pjaxContainerSel;
			const loadWithPjax = $(pjaxContainerSel).length && !isSamePage;

			if(loadWithPjax) {
				this._patchPjax();
				$.pjax({
					// 根据跨域内容设置，pjax需要完整的路径才能使用firefox
					url: location.protocol + '//' + location.host + path,
					container: pjaxContainerSel,
					timeout: 0 // 全局超时似乎不起作用，请改用此方法
				});
			} else {
				super.selectFile(path);
			}
		}

		_patchPjax() {
			// pjax插件($.pjax)与octotree(文档就绪事件)同时加载，
			// 我们不知道何时完全加载了$.pjax，因此我们将在运行时进行一次修补。
			if(!!this._$pjaxPatched) return;

			/**
			 * 此时，当用户在Github Code页面上时，Github有时会在文件列表中单击文件时刷新页面。 
			 * 在内部，Github使用pjax（一个jQuery插件 -  defunkt / jquery-pjax）
			 * 来获取正在选择的文件内容，并且Github的服务器渲染有一个更改，导致刷新问题。 
			 * 这也影响Octotree，当用户在Octotree的侧边栏中选择文件时，Github页面会刷新。
			 * 由于此代码，刷新发生了这个代码
			 * https://github.com/defunkt/jquery-pjax/blob/c9acf5e7e9e16fdd34cb2de882d627f97364a952/jquery.pjax.js#L272。 
			 * 在等待Github解决错误的刷新时，下面的代码是一个黑客修复，当在侧边栏中选择一个文件时，
			 * Octotree不会触发刷新（但如果在Github文件视图中选择了文件，Github仍会刷新）
			 */
			$.pjax.defaults.version = function() {
				// 禁用检查布局版本以防止在PJAX库中刷新
				return null;
			};

			this._$pjaxPatched = true;
		}
	}

	const GH_RESERVED_USER_NAMES = [
		'settings',
		'orgs',
		'organizations',
		'site',
		'blog',
		'about',
		'explore',
		'styleguide',
		'showcases',
		'trending',
		'stars',
		'dashboard',
		'notifications',
		'search',
		'developer',
		'account',
		'pulls',
		'issues',
		'features',
		'contact',
		'security',
		'join',
		'login',
		'watching',
		'new',
		'integrations',
		'gist',
		'business',
		'mirrors',
		'open-source',
		'personal',
		'pricing',
		'sessions'
	];
	const GH_RESERVED_REPO_NAMES = ['followers', 'following', 'repositories'];
	const GH_404_SEL = '#parallax_wrapper';

	// 当在repo路径（如https://github.com/jquery/jquery）加载github页面时，
	// html树具有<main id=“js repo pjax container”>以包含服务器呈现的响应pjax的html。
	// 但是，如果在特定文件（例如https://github.com/jquery/jquery/blob/master/.editorconfig）
	// 加载github页面，则该<main>元素没有“id”属性。因此，下面的选择器使用多个路径，但只指向同一个<main>元素
	const GH_PJAX_CONTAINER_SEL = '#js-repo-pjax-container, div[itemtype="http://schema.org/SoftwareSourceCode"] main, [data-pjax-container]';

	const GH_CONTAINERS = '.container, .container-lg, .container-responsive';
	const GH_HEADER = '.js-header-wrapper > header';
	const GH_RAW_CONTENT = 'body > pre';
	const GH_MAX_HUGE_REPOS_SIZE = 50;

	class GitHub extends PjaxAdapter {
		constructor(store) {
			super(store);
		}

		// @override
		init($sidebar) {
			const pjaxContainer = $(GH_PJAX_CONTAINER_SEL)[0];
			super.init($sidebar, {
				pjaxContainer: pjaxContainer
			});

			// 通过检测页面布局何时更新来修复＃151。
			// 在这种情况下，split-diff页面具有更宽的布局，因此需要重新计算边距。
			// 请注意，由于URL更改无法执行此操作，因为通过pjax的新DOM可能尚未就绪。
			const diffModeObserver = new window.MutationObserver((mutations) => {
				mutations.forEach((mutation) => {
					if(~mutation.oldValue.indexOf('split-diff') || ~mutation.target.className.indexOf('split-diff')) {
						return $(document).trigger(EVENT.LAYOUT_CHANGE);
					}
				});
			});

			diffModeObserver.observe(document.body, {
				attributes: true,
				attributeFilter: ['class'],
				attributeOldValue: true
			});
		}

		// @override
		getCssClass() {
			return 'c54dxs-github-sidebar';
		}

		// @override
		canLoadEntireTree(repo) {
			const key = `${repo.username}/${repo.reponame}`;
			const hugeRepos = this.store.get(STORE.HUGE_REPOS);
			if(hugeRepos[key]) {
				// 更新repo的最后加载时间
				hugeRepos[key] = new Date().getTime();
				this.store.set(STORE.HUGE_REPOS, hugeRepos);
			}
			return !hugeRepos[key];
		}

		// @override
		getCreateTokenUrl() {
			return(
				`${location.protocol}//${location.host}/settings/tokens/new?` +
				'scopes=repo&description=54Helper%20browser%20extension'
			);
		}

		// @override
		updateLayout(sidebarPinned, sidebarVisible, sidebarWidth) {
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

		// @override
		getRepoFromPath(currentRepo, token, cb) {
			// 404 页, 跳转
			if($(GH_404_SEL).length) {
				return cb();
			}

			// 跳转至 raw 页
			if($(GH_RAW_CONTENT).length) {
				return cb();
			}

			// (username)/(reponame)[/(type)][/(typeId)]
			const match = window.location.pathname.match(/([^\/]+)\/([^\/]+)(?:\/([^\/]+))?(?:\/([^\/]+))?/);
			if(!match) {
				return cb();
			}

			const username = match[1];
			const reponame = match[2];
			const type = match[3];
			const typeId = match[4];

			// 不是一个库，跳转
			if(~GH_RESERVED_USER_NAMES.indexOf(username) || ~GH_RESERVED_REPO_NAMES.indexOf(reponame)) {
				return cb();
			}

			// 检查是否应在非代码页中显示
			const isPR = type === 'pull';
			const isCodePage = !type || isPR || ['tree', 'blob', 'commit'].indexOf(type) >= 0;
			const showInNonCodePage = this.store.get(STORE.NONCODE);
			if(!showInNonCodePage && !isCodePage) {
				return cb();
			}

			// 通过检查URL或DOM获取分支，非常脆弱，因此提供多个回退。
			// TODO 如果有更强大的方法来做这件事会很棒
			/**
			 * Github根据分支名称的长度在下面的结构中呈现分支名称
			 *
			 * 选项1：当长度足够短时
			 * <summary title="Switch branches or tags">
			 *   <span class="css-truncate-target">feature/1/2/3</span>
			 * </summary>
			 *
			 * 选项2：长度太长时
			 * <summary title="feature/1/2/3/4/5/6/7/8">
			 *   <span class="css-truncate-target">feature/1/2/3...</span>
			 * </summary>
			 */
			const branchDropdownMenuSummary = $('.branch-select-menu summary');
			const branchNameInTitle = branchDropdownMenuSummary.attr('title');
			const branchNameInSpan = branchDropdownMenuSummary.find('span').text();
			const branchFromSummary =
				branchNameInTitle && branchNameInTitle.toLowerCase().startsWith('switch branches') ?
				branchNameInSpan :
				branchNameInTitle;

			const branch =
				// 当代码页在特定提交中列出树时，选择提交ID作为分支名称
				(type === 'commit' && typeId) ||
				// 从DOM中选择提交ID或分支名称
				branchFromSummary ||
				($('.overall-summary .numbers-summary .commits a').attr('href') || '').replace(
					`/${username}/${reponame}/commits/`,
					''
				) ||
				// 拉取请求页
				($('.commit-ref.base-ref').attr('title') || ':').match(/:(.*)/)[1] ||
				// 重复使用上一个选定分支（如果存在）
				(currentRepo.username === username && currentRepo.reponame === reponame && currentRepo.branch) ||
				// 从缓存获取默认分支
				this._defaultBranch[username + '/' + reponame];

			const showOnlyChangedInPR = this.store.get(STORE.PR);
			const pullNumber = isPR && showOnlyChangedInPR ? typeId : null;
			const repo = {
				username,
				reponame,
				branch,
				pullNumber
			};
			if(repo.branch) {
				cb(null, repo);
			} else {
				// 仍然没有运气，真正得到默认分支
				this._get(null, {
					repo,
					token
				}, (err, data) => {
					if(err) return cb(err);
					repo.branch = this._defaultBranch[username + '/' + reponame] = data.default_branch || 'master';
					cb(null, repo);
				});
			}
		}

		// @override
		selectFile(path) {
			super.selectFile(path, {
				pjaxContainerSel: GH_PJAX_CONTAINER_SEL
			});
		}

		// @override
		loadCodeTree(opts, cb) {
			opts.encodedBranch = encodeURIComponent(decodeURIComponent(opts.repo.branch));
			opts.path = (opts.node && (opts.node.sha || opts.encodedBranch)) || opts.encodedBranch + '?recursive=1';
			this._loadCodeTreeInternal(opts, null, cb);
		}

		// @override
		_getTree(path, opts, cb) {
			if(opts.repo.pullNumber) {
				this._getPatch(opts, cb);
			} else {
				this._get(`/git/trees/${path}`, opts, (err, res) => {
					if(err) cb(err);
					else cb(null, res.tree);
				});
			}
		}

		/**
		 * 获取在Pull Request中修补的文件
		 * 返回的diff映射包含已更改的文件以及已更改文件的父项
		 * 这允许仅对包含具有差异的文件的文件夹过滤树
		 * @param {Object} opts: {
		 *                  path: 加载树的起始路径,
		 *                  repo: 当前的存储库,
		 *                  node (可选): 所选节点（null以加载整个树）,
		 *                  token (可选): 个人访问令牌
		 *                 }
		 * @param {Function} cb(err: error, diffMap: Object)
		 */
		_getPatch(opts, cb) {
			const {
				pullNumber
			} = opts.repo;

			this._get(`/pulls/${pullNumber}/files?per_page=300`, opts, (err, res) => {
				if(err) cb(err);
				else {
					const diffMap = {};

					res.forEach((file, index) => {
						// 记录文件补丁信息
						diffMap[file.filename] = {
							type: 'blob',
							diffId: index,
							action: file.status,
							additions: file.additions,
							blob_url: file.blob_url,
							deletions: file.deletions,
							filename: file.filename,
							path: file.path,
							sha: file.sha
						};

						// 记录祖先文件夹
						const folderPath = file.filename
							.split('/')
							.slice(0, -1)
							.join('/');
						const split = folderPath.split('/');

						// 祖先文件夹的聚合元数据
						split.reduce((path, curr) => {
							if(path.length) path = `${path}/${curr}`;
							else path = `${curr}`;

							if(diffMap[path] == null) {
								diffMap[path] = {
									type: 'tree',
									filename: path,
									filesChanged: 1,
									additions: file.additions,
									deletions: file.deletions
								};
							} else {
								diffMap[path].additions += file.additions;
								diffMap[path].deletions += file.deletions;
								diffMap[path].filesChanged++;
							}
							return path;
						}, '');
					});

					// 转换为模拟来自`tree`的响应
					const tree = Object.keys(diffMap).map((fileName) => {
						const patch = diffMap[fileName];
						return {
							patch,
							path: fileName,
							sha: patch.sha,
							type: patch.type,
							url: patch.blob_url
						};
					});

					// 按路径排序，需要按字母顺序排列（所以父文件夹在子项之前）
					// 注意：这仍然是上述转换的一部分，以模仿get tree的行为
					tree.sort((a, b) => a.path.localeCompare(b.path));

					cb(null, tree);
				}
			});
		}

		// @override
		_getSubmodules(tree, opts, cb) {
			const item = tree.filter((item) => /^\.gitmodules$/i.test(item.path))[0];
			if(!item) return cb();

			this._get(`/git/blobs/${item.sha}`, opts, (err, res) => {
				if(err) return cb(err);
				const data = atob(res.content.replace(/\n/g, ''));
				cb(null, parseGitmodules(data));
			});
		}

		_get(path, opts, cb) {
			const host =
				location.protocol + '//' + (location.host === 'github.com' ? 'api.github.com' : location.host + '/api/v3');
			const url = `${host}/repos/${opts.repo.username}/${opts.repo.reponame}${path || ''}`;
			const cfg = {
				url,
				method: 'GET',
				cache: false
			};

			if(opts.token) {
				cfg.headers = {
					Authorization: 'token ' + opts.token
				};
			}

			$.ajax(cfg)
				.done((data) => {
					if(path && path.indexOf('/git/trees') === 0 && data.truncated) {
						const hugeRepos = this.store.get(STORE.HUGE_REPOS);
						const repo = `${opts.repo.username}/${opts.repo.reponame}`;
						const repos = Object.keys(hugeRepos);
						if(!hugeRepos[repo]) {
							// 如果备忘录的repos太多，请删除最旧的repos
							if(repos.length >= GH_MAX_HUGE_REPOS_SIZE) {
								const oldestRepo = repos.reduce((min, p) => (hugeRepos[p] < hugeRepos[min] ? p : min));
								delete hugeRepos[oldestRepo];
							}
							hugeRepos[repo] = new Date().getTime();
							this.store.set(STORE.HUGE_REPOS, hugeRepos);
						}
						this._handleError(cfg, {
							status: 206
						}, cb);
					} else cb(null, data);
				})
				.fail((jqXHR) => this._handleError(cfg, jqXHR, cb));
		}
	}

	/**
	 * 帮助popup
	 */
	class HelpPopup {
		constructor($dom, store) {
			this.$view = $dom.find('.popup');
			this.store = store;
			this.showInstallationWarning = false;
		}

		init() {
			const $view = this.$view;
			const store = this.store;
			const popupShown = store.get(STORE.POPUP);
			const sidebarVisible = $('html').hasClass(SHOW_CLASS);

			if(this.showInstallationWarning) {
				$view
					.find('.content')
					.text('您当前安装了2个54Helper版本。请卸载其中一个。');
			} else if(popupShown || sidebarVisible) {
				return hideAndDestroy();
			}

			$(document).one(EVENT.TOGGLE, hideAndDestroy);

			setTimeout(() => {
				setTimeout(hideAndDestroy, 10000);
				$view.addClass('show').click(hideAndDestroy);
			}, 500);

			/**
			 * 隐藏和销毁
			 */
			function hideAndDestroy() {
				store.set(STORE.POPUP, true);
				if($view.hasClass('show')) {
					$view.removeClass('show').one('transitionend', () => $view.remove());
				} else {
					$view.remove();
				}
			}
		}

		/**
		 * 设置显示安装警告
		 */
		setShowInstallationWarning() {
			this.showInstallationWarning = true;
		}
	}

	class ErrorView {
		constructor($dom) {
			this.$this = $(this);
			this.$view = $dom.find('.c54dxs-error-view');
		}

		show(err) {
			this.$view.find('.c54dxs-view-header').html(err.error);
			this.$view.find('.message').html(err.message);
			this.$view.find('.settings-btn').click((event) => {
				event.preventDefault();
				this.$this.trigger(EVENT.VIEW_CLOSE, {
					showSettings: true
				});
			});
			this.$this.trigger(EVENT.VIEW_READY);
		}
	}

	class TreeView {
		constructor($dom, store, adapter) {
			this.store = store;
			this.adapter = adapter;
			this.$view = $dom.find('.c54dxs-tree-view');
			this.$tree = this.$view
				.find('.c54dxs-view-body')
				.on('click.jstree', '.jstree-open>a', ({
					target
				}) => {
					setTimeout(() => this.$jstree.close_node(target));
				})
				.on('click.jstree', '.jstree-closed>a', ({
					target
				}) => {
					setTimeout(() => this.$jstree.open_node(target));
				})
				.on('click', this._onItemClick.bind(this))
				.jstree({
					core: {
						multiple: false,
						animation: 50,
						worker: false,
						themes: {
							responsive: false
						}
					},
					plugins: ['wholerow', 'search']
				});
		}

		get $jstree() {
			return this.$tree.jstree(true);
		}

		focus() {
			this.$jstree.get_container().focus();
		}

		show(repo, token) {
			const $jstree = this.$jstree;

			$jstree.settings.core.data = (node, cb) => {
				const prMode = this.store.get(STORE.PR) && repo.pullNumber;
				const loadAll = this.adapter.canLoadEntireTree(repo) && (prMode || this.store.get(STORE.LOADALL));

				node = !loadAll && (node.id === '#' ? {
					path: ''
				} : node.original);

				this.adapter.loadCodeTree({
					repo,
					token,
					node
				}, (err, treeData) => {
					if(err) {
						if(err.status === 206 && loadAll) {
							// repo太大了无法加载所有，需要重试
							$jstree.refresh(true);
						} else {
							$(this).trigger(EVENT.FETCH_ERROR, [err]);
						}
					} else {
						treeData = this._sort(treeData);
						if(loadAll) {
							treeData = this._collapse(treeData);
						}
						cb(treeData);
					}
				});
			};

			this.$tree.one('refresh.jstree', () => {
				this.syncSelection(repo);
				$(this).trigger(EVENT.VIEW_READY);
			});

			this._showHeader(repo);
			$jstree.refresh(true);
		}

		_showHeader(repo) {
			const adapter = this.adapter;

			this.$view
				.find('.c54dxs-view-header')
				.html(
					`<div class="c54dxs-header-summary">
			          <div class="c54dxs-header-repo">
			            <i class="c54dxs-icon-repo"></i>
			            <a href="/${repo.username}">${repo.username}</a> /
			            <a data-pjax href="/${repo.username}/${repo.reponame}">${repo.reponame}</a>
			          </div>
			          <div class="c54dxs-header-branch">
			            <i class="c54dxs-icon-branch"></i>
			            ${this._deXss(repo.branch.toString())}
			          </div>
			        </div>`
				)
				.on('click', 'a[data-pjax]', function(event) {
					event.preventDefault();
					// A.href始终返回绝对URL，不希望如此
					const href = $(this).attr('href');
					const newTab = event.shiftKey || event.ctrlKey || event.metaKey;
					newTab ? adapter.openInNewTab(href) : adapter.selectFile(href);
				});
		}

		_deXss(str) {
			return str && str.replace(/[<>'"&]/g, '-');
		}

		_sort(folder) {
			folder.sort((a, b) => {
				if(a.type === b.type) return a.text === b.text ? 0 : a.text < b.text ? -1 : 1;
				return a.type === 'blob' ? 1 : -1;
			});

			folder.forEach((item) => {
				if(item.type === 'tree' && item.children !== true && item.children.length > 0) {
					this._sort(item.children);
				}
			});

			return folder;
		}

		_collapse(folder) {
			return folder.map((item) => {
				if(item.type === 'tree') {
					item.children = this._collapse(item.children);
					if(item.children.length === 1 && item.children[0].type === 'tree') {
						const onlyChild = item.children[0];
						onlyChild.text = item.text + '/' + onlyChild.text;
						return onlyChild;
					}
				}
				return item;
			});
		}

		_onItemClick(event) {
			let $target = $(event.target);
			let download = false;

			// 处理鼠标中键单击
			if(event.which === 2) return;

			// 处理图标单击，修复 #122
			if($target.is('i.jstree-icon')) {
				$target = $target.parent();
				download = true;
			}

			if(!$target.is('a.jstree-anchor')) return;

			// 完成后重新聚焦以便键盘导航工作，修复 #158
			const refocusAfterCompletion = () => {
				$(document).one('pjax:success page:load', () => {
					this.$jstree.get_container().focus();
				});
			};

			const adapter = this.adapter;
			const newTab = event.shiftKey || event.ctrlKey || event.metaKey;
			const href = $target.attr('href');
			// 第二条路径用于子模块子链接
			const $icon = $target.children().length ? $target.children(':first') : $target.siblings(':first');

			if($icon.hasClass('commit')) {
				refocusAfterCompletion();
				newTab ? adapter.openInNewTab(href) : adapter.selectSubmodule(href);
			} else if($icon.hasClass('blob')) {
				if(download) {
					const downloadUrl = $target.attr('data-download-url');
					const downloadFileName = $target.attr('data-download-filename');
					adapter.downloadFile(downloadUrl, downloadFileName);
				} else {
					refocusAfterCompletion();
					newTab ? adapter.openInNewTab(href) : adapter.selectFile(href);
				}
			}
		}

		syncSelection(repo) {
			const $jstree = this.$jstree;
			if(!$jstree) return;

			// 将 /username/reponame/object_type/branch/path 转换为 path
			const path = decodeURIComponent(location.pathname);
			const match = path.match(/(?:[^\/]+\/){4}(.*)/);
			if(!match) return;

			const currentPath = match[1];
			const loadAll = this.adapter.canLoadEntireTree(repo) && this.store.get(STORE.LOADALL);

			selectPath(loadAll ? [currentPath] : breakPath(currentPath));

			// 转换 ['a/b'] to ['a', 'a/b']
			function breakPath(fullPath) {
				return fullPath.split('/').reduce((res, path, idx) => {
					res.push(idx === 0 ? path : `${res[idx - 1]}/${path}`);
					return res;
				}, []);
			}

			function selectPath(paths, index = 0) {
				const nodeId = NODE_PREFIX + paths[index];

				if($jstree.get_node(nodeId)) {
					$jstree.deselect_all();
					$jstree.select_node(nodeId);
					$jstree.open_node(nodeId, () => {
						if(++index < paths.length) {
							selectPath(paths, index);
						}
					});
				}
			}
		}
	}

	class OptionsView {
		constructor($dom, store, adapter) {
			this.store = store;
			this.adapter = adapter;
			this.$toggler = $dom.find('.c54dxs-settings').click(this.toggle.bind(this));
			this.$view = $dom.find('.c54dxs-settings-view').submit((event) => {
				event.preventDefault();
				this.toggle(false);
			});
			this.$view.find('a.c54dxs-create-token').attr('href', this.adapter.getCreateTokenUrl());

			this.loadElements();

			// 隐藏侧边栏时隐藏选项视图
			$(document).on(EVENT.TOGGLE, (event, visible) => {
				if(!visible) this.toggle(false);
			});
		}

		/**
		 * 使用[data-store]属性加载元素。 
		 * 如果有动态添加的元素，则调用它，以便可以加载和保存它们。
		 */
		loadElements() {
			this.elements = this.$view.find('[data-store]').toArray();
		}

		/**
		 * 切换此屏幕的可见性
		 */
		toggle(visibility) {
			if(visibility !== undefined) {
				if(this.$view.hasClass('current') === visibility) return;
				return this.toggle();
			}

			if(this.$toggler.hasClass('selected')) {
				this._save();
				this.$toggler.removeClass('selected');
				$(this).trigger(EVENT.VIEW_CLOSE);
			} else {
				this._load();
			}
		}

		_load() {
			this._eachOption(
				($elm, key, value, cb) => {
					if($elm.is(':checkbox')) $elm.prop('checked', value);
					else $elm.val(value);
					cb();
				},
				() => {
					this.$toggler.addClass('selected');
					$(this).trigger(EVENT.VIEW_READY);
				}
			);
		}

		_save() {
			const changes = {};
			this._eachOption(
				($elm, key, value, cb) => {
					const newValue = $elm.is(':checkbox') ? $elm.is(':checked') : $elm.val();
					if(value === newValue) return cb();
					changes[key] = [value, newValue];
					this.store.set(key, newValue, cb);
				},
				() => {
					if(Object.keys(changes).length) {
						$(this).trigger(EVENT.OPTS_CHANGE, changes);
					}
				}
			);
		}

		_eachOption(processFn, completeFn) {
			parallel(
				this.elements,
				(elm, cb) => {
					const $elm = $(elm);
					const key = STORE[$elm.data('store')];

					this.store.get(key, (value) => {
						processFn($elm, key, value, () => cb());
					});
				},
				completeFn
			);
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