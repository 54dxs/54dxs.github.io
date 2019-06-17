$(function() {
	$('#jstree').jstree({
		"core": {
//			"animation": 0,
			"check_callback": true,
			"themes": {
				"stripes": true
			},
			'data': [
				{
					"id": "id_json",
					"parent": "#",
					"text": "JSON相关",
					"icon": "../static/img/icon19.png"
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
				},
				
				
				{
					"id": "id_intimate_tool",
					"parent": "#",
					"text": "贴心工具"
				},
				{
					"id": "id_intimate_tool_qr_code",
					"parent": "id_intimate_tool",
					"text": "二维码生成器"
				},
				{
					"id": "id_intimate_tool_page_capture",
					"parent": "id_intimate_tool",
					"text": "网页滚动截屏"
				},
				{
					"id": "id_intimate_tool_image_base64",
					"parent": "id_intimate_tool",
					"text": "图片转Base64"
				},
				
				
				{
					"id": "id_auxiliary_tools",
					"parent": "#",
					"text": "辅助工具"
				},
				{
					"id": "id_auxiliary_tools_en_decode",
					"parent": "id_auxiliary_tools",
					"text": "字符串编解码"
				},
				{
					"id": "id_auxiliary_tools_html_to_markdown",
					"parent": "id_auxiliary_tools",
					"text": "Markdown转换"
				},
				{
					"id": "id_auxiliary_tools_regexp_tool",
					"parent": "id_auxiliary_tools",
					"text": "Js正则表达式"
				},
				{
					"id": "id_auxiliary_tools_time_stamp",
					"parent": "id_auxiliary_tools",
					"text": "时间(戳)转换"
				},
				{
					"id": "id_auxiliary_tools_random_password",
					"parent": "id_auxiliary_tools",
					"text": "随机密码生成"
				},
				
				
				{
					"id": "id_web_tools",
					"parent": "#",
					"text": "Web前端工具"
				},
				{
					"id": "id_web_tools_color_picker",
					"parent": "id_web_tools",
					"text": "页面取色工具"
				},
				{
					"id": "id_web_tools_fcp_helper_detect",
					"parent": "id_web_tools",
					"text": "编码规范检测"
				},
				{
					"id": "id_web_tools_show_page_load_time",
					"parent": "id_web_tools",
					"text": "页面性能检测"
				},
				{
					"id": "id_web_tools_grid_ruler",
					"parent": "id_web_tools",
					"text": "页面栅格标尺"
				},
				{
					"id": "id_web_tools_ajax_debugger",
					"parent": "id_web_tools",
					"text": "Ajax调试功能"
				},
				{
					"id": "id_web_tools_multi_toolkit",
					"parent": "id_web_tools",
					"text": "多维小工具集"
				},
				
				
				{
					"id": "id_other_tools",
					"parent": "#",
					"text": "其他工具"
				},
				{
					"id": "id_other_tools_sticky_notes",
					"parent": "id_other_tools",
					"text": "我的便签笔记"
				},
				{
					"id": "id_other_tools_remove_bg",
					"parent": "id_other_tools",
					"text": "人像背景移除"
				},
				{
					"id": "id_other_tools_google_assistant",
					"parent": "id_other_tools",
					"text": "谷歌访问助手"
				},
				{
					"id": "id_other_tools_interface_postman",
					"parent": "id_other_tools",
					"text": "接口调试助手"
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