import type {
  TableConfig,
  LinkConfig,
  ImageConfig,
  HeadingConfig,
  ParagraphConfig,
  ListConfig,
  BlockquoteConfig,
  CodeConfig,
  AnyHtmlConfig,
} from '../types/htmlConfig'

export function generateHtmlFromConfig(config: AnyHtmlConfig): string {
  switch (config.tag) {
    case 'table':
      return generateTable(config as TableConfig)
    case 'a':
      return generateLink(config as LinkConfig)
    case 'img':
      return generateImage(config as ImageConfig)
    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6':
      return generateHeading(config as HeadingConfig)
    case 'p':
      return generateParagraph(config as ParagraphConfig)
    case 'ul':
    case 'ol':
      return generateList(config as ListConfig)
    case 'blockquote':
      return generateBlockquote(config as BlockquoteConfig)
    case 'pre':
    case 'code':
      return generateCode(config as CodeConfig)
    default:
      return ''
  }
}

function generateTable(config: TableConfig): string {
  const { rows, cols, headers, data } = config
  let html = '<table>\n'

  // Generate headers
  if (headers && headers.length > 0) {
    html += '  <thead>\n    <tr>\n'
    headers.forEach((header) => {
      html += `      <th>${header || 'Header'}</th>\n`
    })
    html += '    </tr>\n  </thead>\n'
  }

  // Generate body
  html += '  <tbody>\n'
  for (let i = 0; i < rows; i++) {
    html += '    <tr>\n'
    for (let j = 0; j < cols; j++) {
      const cellData = data?.[i]?.[j] || `Cell ${i + 1},${j + 1}`
      html += `      <td>${cellData}</td>\n`
    }
    html += '    </tr>\n'
  }
  html += '  </tbody>\n</table>'

  return html
}

function generateLink(config: LinkConfig): string {
  return `<a href="${config.href}">${config.text}</a>`
}

function generateImage(config: ImageConfig): string {
  return `<img src="${config.src}" alt="${config.alt}" />`
}

function generateHeading(config: HeadingConfig): string {
  return `<${config.tag}>${config.text}</${config.tag}>`
}

function generateParagraph(config: ParagraphConfig): string {
  return `<p>${config.text}</p>`
}

function generateList(config: ListConfig): string {
  const { tag, items } = config
  let html = `<${tag}>\n`
  items.forEach((item) => {
    html += `  <li>${item}</li>\n`
  })
  html += `</${tag}>`
  return html
}

function generateBlockquote(config: BlockquoteConfig): string {
  return `<blockquote>${config.text}</blockquote>`
}

function generateCode(config: CodeConfig): string {
  if (config.tag === 'pre') {
    return `<pre><code>${config.code}</code></pre>`
  }
  return `<code>${config.code}</code>`
}
