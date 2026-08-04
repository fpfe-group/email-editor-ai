import type { InjectionKey } from 'vue'

export interface EditorLabels {
  // ─── 工具栏与编辑器外壳 ───
  blocks: string
  styles: string
  layers: string
  search_blocks: string
  undo: string
  redo: string
  editor_title: string
  code: string
  mjml_code: string
  html_code: string
  copy_code: string
  code_copied: string
  fullscreen: string
  desktop: string
  tablet: string
  mobile: string
  init_error: string
  templates: string
  starter_templates: string
  no_blocks_found: string

  // ─── 区块分类 ───
  category_layout: string
  category_content: string
  category_composite: string
  category_variable: string

  // ─── 布局区块 ───
  block_layout_1_col: string
  block_layout_2_col: string
  block_layout_3_col: string
  block_layout_4_col: string
  block_layout_sidebar_left: string
  block_layout_sidebar_right: string

  // ─── 内容区块 ───
  block_content_text: string
  block_content_image: string
  block_content_button: string
  block_content_divider: string
  block_content_spacer: string
  block_content_social: string
  block_content_hero: string

  // ─── 组合区块 ───
  block_comp_header: string
  block_comp_header_nav: string
  block_comp_hero_banner: string
  block_comp_hero_gradient: string
  block_comp_image_text: string
  block_comp_text_image: string
  block_comp_cta: string
  block_comp_image_grid: string
  block_comp_features: string
  block_comp_testimonial: string
  block_comp_pricing: string
  block_comp_promo_code: string
  block_comp_video: string
  block_comp_social: string
  block_comp_footer: string
  block_comp_footer_simple: string
  block_comp_separator: string
  block_comp_product_card: string
  block_comp_notification: string
  block_comp_stats: string
  block_comp_announcement: string
  block_comp_steps: string
  block_comp_order: string
  block_comp_faq: string
  block_comp_team: string
  block_comp_countdown: string
  block_comp_review: string
  block_comp_mobile_app: string

  // ─── 节点类型文案 ───
  node_mj_body: string
  node_mj_section: string
  node_mj_column: string
  node_mj_text: string
  node_mj_image: string
  node_mj_button: string
  node_mj_divider: string
  node_mj_spacer: string
  node_mj_social: string
  node_mj_social_element: string
  node_mj_hero: string
  node_mj_raw: string
  node_mj_wrapper: string

  // ─── 属性分组 ───
  group_background: string
  group_spacing: string
  group_border: string
  group_text: string
  group_dimensions: string
  group_layout: string
  group_image: string
  group_link: string
  group_style: string
  group_network: string

  // ─── 属性文案 ───
  prop_background_color: string
  prop_background_url: string
  prop_background_size: string
  prop_background_repeat: string
  prop_background_height: string
  prop_background_width: string
  prop_padding: string
  prop_border: string
  prop_border_radius: string
  prop_border_color: string
  prop_border_width: string
  prop_border_style: string
  prop_full_width: string
  prop_direction: string
  prop_width: string
  prop_height: string
  prop_color: string
  prop_font_family: string
  prop_font_size: string
  prop_font_weight: string
  prop_line_height: string
  prop_letter_spacing: string
  prop_align: string
  prop_vertical_align: string
  prop_src: string
  prop_alt: string
  prop_href: string
  prop_inner_padding: string
  prop_outer_padding: string
  prop_text_transform: string
  prop_inner_background_color: string
  prop_icon_size: string
  prop_mode: string
  prop_social_name: string
  prop_custom_icon: string

  // ─── 属性选项 ───
  align_left: string
  align_center: string
  align_right: string
  vertical_top: string
  vertical_middle: string
  vertical_bottom: string
  border_solid: string
  border_dashed: string
  border_dotted: string
  bg_size_auto: string
  bg_size_cover: string
  bg_size_contain: string
  bg_repeat_none: string
  bg_repeat_repeat: string
  bg_repeat_x: string
  bg_repeat_y: string
  direction_ltr: string
  direction_rtl: string
  mode_horizontal: string
  mode_vertical: string
  mode_fixed: string
  mode_fluid: string
  transform_none: string
  transform_uppercase: string
  transform_lowercase: string
  transform_capitalize: string
  font_default: string

  // ─── 开关 ───
  toggle_yes: string
  toggle_no: string

  // ─── UI 操作 ───
  delete_node: string
  duplicate_node: string
  move_up: string
  move_down: string
  select_parent: string
  content_label: string
  close: string

  // ─── 全局样式面板 ───
  global_styles: string
  inbox_preview: string
  preview_text: string
  preview_text_placeholder: string
  preview_text_hint: string
  colors: string
  email_background: string
  text_color: string
  typography: string
  default_font: string
  select_element_hint: string

  // ─── 图层面板 ───
  section_label: string
  column_label: string
  empty_canvas_hint: string

  // ─── Merge Tags ───
  merge_tags: string
  merge_tags_empty: string
  insert_merge_tag: string

  // ─── 图片上传 ───
  image_upload: string
  image_browse: string
  image_drop_hint: string
  image_uploading: string
  image_upload_error: string
  image_max_size: string
  image_invalid_type: string
  image_remove: string
  image_change: string
  image_no_preview: string

  // ─── 条件内容 ───
  condition: string
  condition_add: string
  condition_remove: string
  condition_variable: string
  condition_operator: string
  condition_value: string
  condition_equals: string
  condition_not_equals: string
  condition_contains: string
  condition_not_contains: string
  condition_exists: string
  condition_not_exists: string
  condition_active: string

  // ─── AI ───
  ai_generate: string
  ai_improve: string
  ai_shorten: string
  ai_expand: string
  ai_translate: string
  ai_prompt_placeholder: string
  ai_loading: string
  ai_error: string
  ai_followup_hint: string

  // ─── AI Chat ───
  ai_chat: string
  ai_chat_placeholder: string
  ai_chat_send: string
  ai_chat_apply: string
  ai_chat_discard: string
  ai_chat_new: string
  ai_chat_thinking: string
  ai_chat_success: string
  ai_chat_parse_error: string
  ai_chat_welcome: string
  ai_chat_welcome_hint: string
  ai_chat_retry: string
  ai_chat_context_sent: string
  ai_chat_attach: string
  ai_chat_attach_hint: string
  ai_chat_file_too_large: string
  ai_chat_preview: string
  ai_chat_preview_hint: string

  // ─── 深色模式预览 ───
  dark_mode_preview: string

  // ─── 状态消息 ───
  loading: string

  // ─── 行内工具栏 ───
  bold: string
  italic: string
  underline: string
  strikethrough: string
  link: string
  unlink: string
  align_text_left: string
  align_text_center: string
  align_text_right: string
  text_color_label: string
  link_url_prompt: string
}

export const DEFAULT_LABELS: EditorLabels = {
  // ─── 工具栏与编辑器外壳 ───
  blocks: '区块',
  styles: '样式',
  layers: '图层',
  search_blocks: '搜索区块...',
  undo: '撤销',
  redo: '重做',
  editor_title: '邮件编辑器',
  code: '源码',
  mjml_code: 'MJML 代码',
  html_code: 'HTML 代码',
  copy_code: '复制代码',
  code_copied: '已复制',
  fullscreen: '全屏',
  desktop: '桌面端',
  tablet: '平板端',
  mobile: '移动端',
  init_error: '编辑器初始化失败',
  templates: '模板',
  starter_templates: '入门模板',
  no_blocks_found: '未找到匹配区块：',

  // ─── 区块分类 ───
  category_layout: '布局',
  category_content: '内容',
  category_composite: '现成区块',
  category_variable: '变量',

  // ─── 布局区块 ───
  block_layout_1_col: '1 列',
  block_layout_2_col: '2 列',
  block_layout_3_col: '3 列',
  block_layout_4_col: '4 列',
  block_layout_sidebar_left: '左侧栏',
  block_layout_sidebar_right: '右侧栏',

  // ─── 内容区块 ───
  block_content_text: '文本',
  block_content_image: '图片',
  block_content_button: '按钮',
  block_content_divider: '分割线',
  block_content_spacer: '间距',
  block_content_social: '社交链接',
  block_content_hero: 'Hero',

  // ─── 组合区块 ───
  block_comp_header: '页头',
  block_comp_header_nav: '页头 + 导航',
  block_comp_hero_banner: 'Hero Banner',
  block_comp_hero_gradient: 'Hero Gradient',
  block_comp_image_text: '图片 + 文本',
  block_comp_text_image: '文本 + 图片',
  block_comp_cta: 'CTA',
  block_comp_image_grid: '图片宫格',
  block_comp_features: '功能亮点',
  block_comp_testimonial: '客户评价',
  block_comp_pricing: '价格方案',
  block_comp_promo_code: '促销码',
  block_comp_video: '视频',
  block_comp_social: '社交链接',
  block_comp_footer: '页脚',
  block_comp_footer_simple: '简洁页脚',
  block_comp_separator: '分隔区',
  block_comp_product_card: '商品卡片',
  block_comp_notification: '通知',
  block_comp_stats: '数据指标',
  block_comp_announcement: '公告',
  block_comp_steps: '步骤',
  block_comp_order: '订单',
  block_comp_faq: 'FAQ',
  block_comp_team: '团队',
  block_comp_countdown: '倒计时',
  block_comp_review: '评价',
  block_comp_mobile_app: '移动应用',

  // ─── 节点类型文案 ───
  node_mj_body: '正文',
  node_mj_section: '区段',
  node_mj_column: '列',
  node_mj_text: '文本',
  node_mj_image: '图片',
  node_mj_button: '按钮',
  node_mj_divider: '分割线',
  node_mj_spacer: '间距',
  node_mj_social: '社交链接',
  node_mj_social_element: '社交账号',
  node_mj_hero: 'Hero',
  node_mj_raw: '原始 HTML',
  node_mj_wrapper: '包裹区',

  // ─── 属性分组 ───
  group_background: '背景',
  group_spacing: '间距',
  group_border: '边框',
  group_text: '文本',
  group_dimensions: '尺寸',
  group_layout: '布局',
  group_image: '图片',
  group_link: '链接',
  group_style: '样式',
  group_network: '社交平台',

  // ─── 属性文案 ───
  prop_background_color: '背景色',
  prop_background_url: '背景图片',
  prop_background_size: '背景尺寸',
  prop_background_repeat: '背景平铺',
  prop_background_height: '背景高度',
  prop_background_width: '背景宽度',
  prop_padding: '内边距',
  prop_border: '边框',
  prop_border_radius: '圆角',
  prop_border_color: '颜色',
  prop_border_width: '宽度',
  prop_border_style: '样式',
  prop_full_width: '全宽',
  prop_direction: '方向',
  prop_width: '宽度',
  prop_height: '高度',
  prop_color: '文本颜色',
  prop_font_family: '字体',
  prop_font_size: '字号',
  prop_font_weight: '字重',
  prop_line_height: '行高',
  prop_letter_spacing: '字距',
  prop_align: '对齐',
  prop_vertical_align: '垂直对齐',
  prop_src: '图片 URL',
  prop_alt: '替代文本',
  prop_href: '链接 URL',
  prop_inner_padding: '内部边距',
  prop_outer_padding: '外部边距',
  prop_text_transform: '大小写',
  prop_inner_background_color: '内部背景',
  prop_icon_size: '图标尺寸',
  prop_mode: '模式',
  prop_social_name: '平台',
  prop_custom_icon: '自定义图标',

  // ─── 属性选项 ───
  align_left: '左对齐',
  align_center: '居中',
  align_right: '右对齐',
  vertical_top: '顶部',
  vertical_middle: '居中',
  vertical_bottom: '底部',
  border_solid: '实线',
  border_dashed: '虚线',
  border_dotted: '点线',
  bg_size_auto: 'Auto',
  bg_size_cover: 'Cover',
  bg_size_contain: 'Contain',
  bg_repeat_none: '不平铺',
  bg_repeat_repeat: '平铺',
  bg_repeat_x: '横向平铺',
  bg_repeat_y: '纵向平铺',
  direction_ltr: 'LTR',
  direction_rtl: 'RTL',
  mode_horizontal: '横向',
  mode_vertical: '纵向',
  mode_fixed: '固定',
  mode_fluid: '自适应',
  transform_none: '无',
  transform_uppercase: '大写',
  transform_lowercase: '小写',
  transform_capitalize: '首字母大写',
  font_default: '— 默认 —',

  // ─── 开关 ───
  toggle_yes: '是',
  toggle_no: '否',

  // ─── UI 操作 ───
  delete_node: '删除',
  duplicate_node: '复制',
  move_up: '上移',
  move_down: '下移',
  select_parent: '选择父级',
  content_label: '内容',
  close: '关闭',

  // ─── 全局样式面板 ───
  global_styles: '全局样式',
  inbox_preview: '收件箱预览',
  preview_text: '预览文本',
  preview_text_placeholder: '打开前可见的摘要...',
  preview_text_hint: '显示在收件人的邮件列表中',
  colors: '颜色',
  email_background: '邮件背景',
  text_color: '文本颜色',
  typography: '排版',
  default_font: '默认字体',
  select_element_hint: '点击画布中的元素即可编辑属性',

  // ─── 图层面板 ───
  section_label: '区段',
  column_label: '列',
  empty_canvas_hint: '拖拽区块到画布，开始搭建邮件',

  // ─── Merge Tags ───
  merge_tags: 'Merge Tags',
  merge_tags_empty: '暂未配置 Merge Tags',
  insert_merge_tag: '插入 Merge Tag',

  // ─── 图片上传 ───
  image_upload: '上传图片',
  image_browse: '浏览素材',
  image_drop_hint: '拖入图片，或点击上传',
  image_uploading: '上传中...',
  image_upload_error: '上传失败',
  image_max_size: '文件最大 5 MB',
  image_invalid_type: '仅支持 JPG、PNG、GIF、SVG 和 WebP',
  image_remove: '移除图片',
  image_change: '更换图片',
  image_no_preview: '未选择图片',

  // ─── 条件内容 ───
  condition: '条件',
  condition_add: '添加条件',
  condition_remove: '移除条件',
  condition_variable: '变量',
  condition_operator: '运算符',
  condition_value: '值',
  condition_equals: '等于',
  condition_not_equals: '不等于',
  condition_contains: '包含',
  condition_not_contains: '不包含',
  condition_exists: '存在',
  condition_not_exists: '不存在',
  condition_active: '已启用条件',

  // ─── AI ───
  ai_generate: '用 AI 生成',
  ai_improve: '优化',
  ai_shorten: '缩短',
  ai_expand: '扩写',
  ai_translate: '翻译',
  ai_prompt_placeholder: '描述你想要的内容...',
  ai_loading: 'AI 思考中...',
  ai_error: 'AI 生成失败',
  ai_followup_hint: 'AI 需要更多信息，请补充你的要求。',

  // ─── AI Chat ───
  ai_chat: 'AI',
  ai_chat_placeholder: '描述你想要的邮件...',
  ai_chat_send: '生成',
  ai_chat_apply: '应用模板',
  ai_chat_discard: '放弃',
  ai_chat_new: '新对话',
  ai_chat_thinking: '正在生成模板...',
  ai_chat_success: '模板已生成',
  ai_chat_parse_error: '无法解析 AI 响应',
  ai_chat_welcome: '描述你想创建的邮件',
  ai_chat_welcome_hint: '可以说明布局、颜色和内容...',
  ai_chat_retry: '重试',
  ai_chat_context_sent: '已将当前模板作为上下文发送',
  ai_chat_attach: '添加图片或文档',
  ai_chat_attach_hint: '添加截图、Figma 导出图或参考文档',
  ai_chat_file_too_large: '文件过大（最大 10 MB）',
  ai_chat_preview: '预览',
  ai_chat_preview_hint: '生成模板预览',

  // ─── 深色模式预览 ───
  dark_mode_preview: '深色模式预览',

  // ─── 状态消息 ───
  loading: '加载中...',

  // ─── 行内工具栏 ───
  bold: '加粗',
  italic: '斜体',
  underline: '下划线',
  strikethrough: '删除线',
  link: '链接',
  unlink: '移除链接',
  align_text_left: '左对齐',
  align_text_center: '居中',
  align_text_right: '右对齐',
  text_color_label: '文本颜色',
  link_url_prompt: '链接 URL：',
}

export const EMAIL_LABELS_KEY: InjectionKey<EditorLabels> = Symbol('email-labels')
