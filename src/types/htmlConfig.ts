export interface HtmlTagConfig {
  tag: string
  content?: string
  attributes?: Record<string, string>
}

export interface TableConfig extends HtmlTagConfig {
  tag: 'table'
  rows: number
  cols: number
  headers?: string[]
  data?: string[][]
}

export interface LinkConfig extends HtmlTagConfig {
  tag: 'a'
  href: string
  text: string
}

export interface ImageConfig extends HtmlTagConfig {
  tag: 'img'
  src: string
  alt: string
}

export interface HeadingConfig extends HtmlTagConfig {
  tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  text: string
}

export interface ParagraphConfig extends HtmlTagConfig {
  tag: 'p'
  text: string
}

export interface ListConfig extends HtmlTagConfig {
  tag: 'ul' | 'ol'
  items: string[]
}

export interface BlockquoteConfig extends HtmlTagConfig {
  tag: 'blockquote'
  text: string
}

export interface CodeConfig extends HtmlTagConfig {
  tag: 'pre' | 'code'
  code: string
  language?: string
}

export type AnyHtmlConfig =
  | TableConfig
  | LinkConfig
  | ImageConfig
  | HeadingConfig
  | ParagraphConfig
  | ListConfig
  | BlockquoteConfig
  | CodeConfig

export const HTML_TAGS = [
  { value: 'table', label: 'Table' },
  { value: 'a', label: 'Link' },
  { value: 'img', label: 'Image' },
  { value: 'h1', label: 'Heading 1' },
  { value: 'h2', label: 'Heading 2' },
  { value: 'h3', label: 'Heading 3' },
  { value: 'p', label: 'Paragraph' },
  { value: 'ul', label: 'Unordered List' },
  { value: 'ol', label: 'Ordered List' },
  { value: 'blockquote', label: 'Blockquote' },
  { value: 'pre', label: 'Code Block' },
  { value: 'code', label: 'Inline Code' },
] as const
