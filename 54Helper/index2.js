var menu = (function() {
	var _menu = {
		data: {},
		initMenu: function() {
			$.jstree.defaults.core.themes.variant = "large";
			$.jstree.defaults.core.themes.responsive = true;
			$.jstree.defaults.sort = function(a, b) {
				return this.get_node(a).original.order > this.get_node(b).original.order ? 1 : -1;
			}
			var jsTree = $('#tree_1').jstree({
				'core': {
					'data': {
						'url': $.hr_contextUrl() + "menu/list",
						'data': function(node) {
							return node;
						}
					}
				},
				'plugins': ['contextmenu', 'sort'],
				"contextmenu": {
					"items": {
						"create": null,
						"rename": null,
						"remove": null,
						"ccp": null,
						"新建菜单": {
							"label": "新建菜单",
							"action": function(data) {
								var node = _menu.data.jsTree.jstree('get_node', data.reference[0])
								var pid = node.parent;
								_menu.operation.addMenu(pid, node);
							}
						},
						"删除菜单": {
							"label": "删除菜单",
							"action": function(data) {
								var node = _menu.data.jsTree.jstree('get_node', data.reference[0]);
								_menu.operation.delMenu(node);
							}
						},
						"修改菜单": {
							"label": "修改菜单",
							"action": function(data) {
								var node = _menu.data.jsTree.jstree('get_node', data.reference[0]).original;
								_menu.operation.editMenu(node);
							}
						},
						"上移菜单": {
							"label": "上移菜单",
							"action": function(data) {
								var node = _menu.data.jsTree.jstree('get_node', data.reference[0]);
								var prev_dom = $(data.reference[0]).closest("li").prev();
								_menu.operation.sortMenu(node, prev_dom);
							}
						},
						"下移菜单": {
							"label": "下移菜单",
							"action": function(data) {
								var node = _menu.data.jsTree.jstree('get_node', data.reference[0]);
								var next_dom = $(data.reference[0]).closest("li").next();
								_menu.operation.sortMenu(node, next_dom);
							}
						},
						"新建子菜单": {
							"label": "新建子菜单",
							"action": function(data) {
								var node = _menu.data.jsTree.jstree('get_node', data.reference[0]);
								var pid = node.id;
								_menu.operation.addMenu(pid, node);
							}
						}
					}
				}
			});
			this.data.jsTree = jsTree;
		},
		initEvent: function() {
			$("#closeMenu").click(function() {
				_menu.data.jsTree.jstree('close_all');
			});
			_menu.data.jsTree.on('load_node.jstree', function() {
				var root = _menu.data.jsTree.jstree('get_node', "#");
				var children = _menu.data.jsTree.jstree("get_children_dom", root);
				var a = $("a", children);
				$.each(a, function() {
					$(this).bind("contextmenu", function() {
						var parent = _menu.data.jsTree.jstree('get_parent', $(this));
						if(parent !== '#') {
							if(_menu.data.jsTree.jstree(true).settings.contextmenu.items["新建子菜单"]) {
								delete _menu.data.jsTree.jstree(true).settings.contextmenu.items["新建子菜单"];
							}
						} else {
							if(!_menu.data.jsTree.jstree(true).settings.contextmenu.items["新建子菜单"]) {
								_menu.data.jsTree.jstree(true).settings.contextmenu.items["新建子菜单"] = {
									"label": "新建子菜单",
									"action": function(data) {
										var node = _menu.data.jsTree.jstree('get_node', data.reference[0]);
										var pid = node.id;
										_menu.operation.addMenu(pid);
									}
								};
							}
						}
					});
				});
				_menu.data.jsTree.jstree('select_node', root.children[0]);
			});
			_menu.data.jsTree.on('select_node.jstree', function(node, selected, event) {
				$.get($.hr_contextUrl() + "menu/getMenu", {
					id: selected.node.id
				}, function(data) {
					$("#menuForm").resetForm();
					$("#menuForm").disableForm();
					$("#menuForm").loader(data);
					$("#menuForm [name='pMenuName']").val(data.pMenu ? (data.pMenu.text || '') : '');
				}, "json")
			});
			$("#showMenu").click(function() {
				_menu.data.jsTree.jstree('open_all');
			});
		},
		operation: {
			addMenu: function(pid, node) {
				if(pid === "#") {
					$("#menuForm [name=pid]").val("");
				} else {
					$("#menuForm [name=pid]").val(pid);
				}
				$("#menuForm").resetForm();
				this.setOrder(pid);
				$("#menuForm").enableForm();
			},
			editMenu: function(node) {
				$("#menuForm").resetForm();
				$("#menuForm").enableForm().loader(node);
			},
			sortMenu: function(node, dom) {
				if(dom.length > 0) {
					var otherNode = _menu.data.jsTree.jstree('get_node', dom[0]);
					$.post($.hr_contextUrl() + "menu/order", {
						"currId": node.id,
						"otherId": otherNode.id
					}, function() {
						_menu.operation.refresh();
					}, "json");
				}
			},
			setOrder: function(pid) {
				var root = _menu.data.jsTree.jstree('get_node', pid);
				var children = _menu.data.jsTree.jstree("get_children_dom", root);
				var lastNode = _menu.data.jsTree.jstree('get_node', children[children.length - 1]);
				$("#menuForm [name='order']").val(lastNode.original.order + 1);
			},
			refresh: function() {
				_menu.data.jsTree.jstree('refresh');
				$("#menuForm .control-group").removeClass('success')
			},
			delMenu: function(node) {
				var children = _menu.data.jsTree.jstree("get_children_dom", node);
				if(children.length > 0) {
					$.Zebra_Dialog('该菜单下还有子菜单不能删除！', {
						'type': 'error',
						'title': '系统提示'
					});
					return;
				}
				var id = node.id;
				$.Zebra_Dialog('您确认要删除该菜单么？', {
					'type': 'question',
					'title': '系统提示',
					'buttons': [{
							caption: '确定',
							callback: function() {
								$.post($.hr_contextUrl() + "menu/delMenu", {
									'id': id
								}, function(msg) {
									new $.Zebra_Dialog(msg, {
										'buttons': false,
										'modal': false,
										'position': ['right - 20', 'bottom - 20'],
										'auto_close': 2500,
										'animation_speed_show': 500,
										'animation_speed_hide': 500,
										'onClose': function() {
											_menu.operation.refresh();
										}
									});
								}, 'json');
							}
						},
						{
							caption: '取消'
						},
					]
				});
			}
		}
	};
	return {
		init: function() {
			_menu.initMenu();
			_menu.initEvent();
			_menu.initForm();
		}
	};
})();