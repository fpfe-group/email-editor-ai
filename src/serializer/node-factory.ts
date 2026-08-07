import type { EmailNode, EmailDocument, EmailNodeType } from '../types'
import { DEFAULT_THEME } from '../types'
import { createId } from '../utils/id'

/** 创建带默认值的节点 */
export function createNode(
  type: EmailNodeType,
  attributes: Record<string, string> = {},
  children: EmailNode[] = [],
  htmlContent?: string,
): EmailNode {
  return {
    id: createId(),
    type,
    attributes,
    children,
    htmlContent,
  }
}

export function createBody(children: EmailNode[] = [], attributes: Record<string, string> = {}): EmailNode {
  return createNode('mj-body', { 'background-color': '#f4f4f4', ...attributes }, children)
}

export function createSection(
  children: EmailNode[] = [],
  attributes: Record<string, string> = {},
): EmailNode {
  return createNode(
    'mj-section',
    { 'background-color': '#ffffff', padding: '20px 0', ...attributes },
    children,
  )
}

export function createGroup(
  children: EmailNode[] = [],
  attributes: Record<string, string> = {},
): EmailNode {
  return createNode('mj-group', attributes, children)
}

export function createColumn(
  children: EmailNode[] = [],
  attributes: Record<string, string> = {},
): EmailNode {
  return createNode('mj-column', attributes, children)
}

export function createText(
  htmlContent: string = '<p>在这里输入正文</p>',
  attributes: Record<string, string> = {},
): EmailNode {
  return createNode(
    'mj-text',
    {
      'font-size': '14px',
      'font-family': 'Helvetica, Arial, sans-serif',
      color: '#555555',
      padding: '10px 25px',
      ...attributes,
    },
    [],
    htmlContent,
  )
}

export function createImage(attributes: Record<string, string> = {}): EmailNode {
  return createNode('mj-image', {
    src: 'https://via.placeholder.com/600x200/e5e7eb/6b7280?text=%E5%9B%BE%E7%89%87',
    alt: '图片',
    padding: '10px 25px',
    ...attributes,
  })
}

export function createButton(
  text: string = '点击这里',
  attributes: Record<string, string> = {},
): EmailNode {
  return createNode(
    'mj-button',
    {
      'background-color': DEFAULT_THEME.primaryColor,
      color: '#ffffff',
      'font-size': '14px',
      'border-radius': '6px',
      'inner-padding': '12px 30px',
      href: '#',
      ...attributes,
    },
    [],
    text,
  )
}

export function createDivider(attributes: Record<string, string> = {}): EmailNode {
  return createNode('mj-divider', {
    'border-color': '#e5e7eb',
    'border-width': '1px',
    padding: '15px 25px',
    ...attributes,
  })
}

export function createSpacer(attributes: Record<string, string> = {}): EmailNode {
  return createNode('mj-spacer', {
    height: '20px',
    ...attributes,
  })
}

export function createSocial(
  elements: EmailNode[] = [],
  attributes: Record<string, string> = {},
): EmailNode {
  const defaultElements =
    elements.length > 0
      ? elements
      : [
          createSocialElement('facebook', 'https://facebook.com/'),
          createSocialElement('twitter', 'https://twitter.com/'),
          createSocialElement('instagram', 'https://instagram.com/'),
        ]
  return createNode(
    'mj-social',
    {
      'font-size': '12px',
      'icon-size': '30px',
      mode: 'horizontal',
      align: 'center',
      padding: '10px 25px',
      ...attributes,
    },
    defaultElements,
  )
}

export function createSocialElement(
  name: string = 'facebook',
  href: string = 'https://facebook.com/',
  attributes: Record<string, string> = {},
): EmailNode {
  return createNode('mj-social-element', { name, href, ...attributes })
}

export function createHero(
  children: EmailNode[] = [],
  attributes: Record<string, string> = {},
): EmailNode {
  return createNode(
    'mj-hero',
    {
      mode: 'fixed',
      'background-height': '400px',
      'background-width': '600px',
      'background-color': '#1a1a2e',
      padding: '60px 20px',
      ...attributes,
    },
    children,
  )
}

export function createWrapper(
  children: EmailNode[] = [],
  attributes: Record<string, string> = {},
): EmailNode {
  return createNode('mj-wrapper', attributes, children)
}

export function createRaw(htmlContent: string = ''): EmailNode {
  return createNode('mj-raw', {}, [], htmlContent)
}

/** 创建默认起始文档 */
export function createDefaultDocument(): EmailDocument {
  return {
    version: 1,
    headAttributes: {
      defaultStyles: {},
      fonts: [],
      previewText: '',
    },
    body: createBody([
      createSection([
        createColumn([
          createText(
            '<h2 style="margin: 0; font-size: 20px; text-align: center;">邮件标题</h2>',
            {
              align: 'center',
              'font-size': '20px',
              color: '#333333',
            },
          ),
          createText(
            '<p style="margin: 0;">从右侧面板拖拽模块，开始搭建你的邮件。</p>',
            {
              'font-size': '14px',
              color: '#555555',
            },
          ),
          createButton('点击这里'),
        ]),
      ]),
    ]),
  }
}
