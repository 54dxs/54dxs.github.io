$(function() {
	$('#jstree').jstree({
		"core": {
			"animation": 0,
			"check_callback": true,
			"themes": {
				"stripes": true
			},
			'data': [
				{
					"id": "id_json",
					"parent": "#",
					"text": "JSON相关"
				},
				{
					"id": "id_json_json_format",
					"parent": "id_json",
					"text": "JSON手动美化"
				},
				{
					"id": "id_json_json_compare",
					"parent": "id_json",
					"text": "JSON比对工具"
				},
				
				
				{
					"id": "id_code_beautify",
					"parent": "#",
					"text": "代码美化/压缩"
				},
				{
					"id": "id_code_beautify_js_css_page_beautify",
					"parent": "id_code_beautify",
					"text": "Js、Css页面自动美化"
				},
				{
					"id": "id_code_beautify_code_beautify",
					"parent": "id_code_beautify",
					"text": "JSON比对工具"
				},
				{
					"id": "id_code_beautify_code_compress",
					"parent": "id_code_beautify",
					"text": "代码压缩工具"
				}
			]
		},
		"types": {
			"#": {
				"max_children": 100,
				"max_depth": 400,
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
			"contextmenu", "dnd", "search",
			"state", "types", "wholerow"
		]
	});
});