export type Attributes = {
  accept?: string
  acceptCharset?: string
  accessKey?: string
  action?: string
  align?: string
  allow?: string
  alt?: string
  async?: boolean
  autoCapitalize?: boolean
  autoComplete?: boolean
  autoFocus?: boolean
  autoPlay?: boolean
  buffered?: string
  capture?: string
  challenge?: string
  charset?: string
  checked?: boolean
  cite?: string
  className?: string
  code?: string
  codebase?: string
  cols?: number
  colSpan?: number
  content?: string
  contentEditable?: boolean
  contextMenu?: string
  controls?: boolean
  coords?: string
  crossOrigin?: string
  csp?: string
  dataset?: Record<string, string>
  dateTime?: string
  decoding?: string
  default?: string
  defer?: boolean
  dir?: string
  dirname?: string
  disabled?: boolean
  download?: boolean
  draggable?: boolean
  enctype?: string
  enterKeyHint?: string
  for?: string
  form?: string
  formAction?: string
  formEnctype?: string
  formMethod?: string
  formNoValidate?: string
  formTarget?: string
  headers?: string
  height?: string
  hidden?: boolean
  high?: string
  href?: string
  hrefLang?: string
  httpEquiv?: string
  icon?: string
  id?: string
  importance?: string
  integrity?: string
  inputMode?: string
  isMap?: boolean
  itemProp?: string
  keytype?: string
  kind?: string
  label?: string
  lang?: string
  loading?: string
  list?: string
  loop?: string
  low?: string
  max?: string
  maxLength?: string
  minLength?: string
  media?: string
  method?: string
  min?: string
  multiple?: string
  muted?: boolean
  name?: string
  noValidate?: boolean
  open?: boolean
  optimum?: string
  pattern?: string
  ping?: string
  placeholder?: string
  poster?: string
  preload?: string
  radioGroup?: string
  readonly?: boolean
  referrerPolicy?: string
  rel?: string
  required?: boolean
  reversed?: boolean
  rows?: number
  rowSpan?: number
  sandbox?: string
  scope?: string
  selected?: boolean
  shape?: string
  size?: string
  sizes?: string
  slot?: string
  span?: number
  spellcheck?: boolean
  src?: string
  srcDoc?: string
  srcLang?: string
  srcSet?: string
  start?: string
  step?: string
  style?: Record<string, string>
  tabIndex?: number
  target?: string
  title?: string
  translate?: boolean
  type?: string
  useMap?: string
  value?: string
  width?: string
  wrap?: boolean
}

export type TagName =
  | 'a'
  | 'abbr'
  | 'address'
  | 'area'
  | 'article'
  | 'aside'
  | 'audio'
  | 'b'
  | 'base'
  | 'bdi'
  | 'bdo'
  | 'blockquote'
  | 'body'
  | 'br'
  | 'button'
  | 'canvas'
  | 'caption'
  | 'cite'
  | 'code'
  | 'col'
  | 'colgroup'
  | 'data'
  | 'datalist'
  | 'dd'
  | 'del'
  | 'details'
  | 'dfn'
  | 'dialogue'
  | 'div'
  | 'dl'
  | 'dt'
  | 'em'
  | 'embed'
  | 'fieldset'
  | 'figcaption'
  | 'figure'
  | 'footer'
  | 'form'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'head'
  | 'header'
  | 'hgroup'
  | 'hr'
  | 'html'
  | 'i'
  | 'iframe'
  | 'img'
  | 'input'
  | 'ins'
  | 'kbd'
  | 'label'
  | 'legend'
  | 'li'
  | 'link'
  | 'main'
  | 'map'
  | 'mark'
  | 'menu'
  | 'meta'
  | 'meter'
  | 'nav'
  | 'noscript'
  | 'object'
  | 'ol'
  | 'optgroup'
  | 'option'
  | 'output'
  | 'p'
  | 'param'
  | 'picture'
  | 'pre'
  | 'progress'
  | 'q'
  | 'rb'
  | 'rp'
  | 'rt'
  | 'rtc'
  | 'ruby'
  | 's'
  | 'samp'
  | 'script'
  | 'section'
  | 'select'
  | 'slot'
  | 'small'
  | 'source'
  | 'span'
  | 'strong'
  | 'style'
  | 'sub'
  | 'summary'
  | 'sup'
  | 'table'
  | 'tbody'
  | 'td'
  | 'template'
  | 'textarea'
  | 'tfoot'
  | 'th'
  | 'thead'
  | 'time'
  | 'title'
  | 'tr'
  | 'track'
  | 'u'
  | 'ul'
  | 'var'
  | 'video'
  | 'wbr'

const selfClosingTags: TagName[] = [
  'br',
  'hr',
  'img',
  'input',
  'link',
  'meta'
]

export const element = (tagName: TagName, attributes: Attributes = {}, content: string | string[] = []) => tagName === 'html'
  ? `<!doctype html>${outerHTML(tagName, attributes, content)}`
  : outerHTML(tagName, attributes, content)

const outerHTML = (tagName: TagName, attributes: Attributes, content: string | string[]) => selfClosingTags.includes(tagName)
  ? openingTag(tagName, attributes)
  : `${openingTag(tagName, attributes)}${Array.isArray(content) ? content.join("") : content}${closingTag(tagName)}`

const openingTag = (tagName: TagName, attributes: Attributes) => Object.keys(attributes).length > 0
  ? `<${tagName} ${(Object.entries(attributes) as Array<[key: keyof Attributes, value: string]>).map(attribute).filter(x => x !== "").join(" ")}>`
  : `<${tagName}>`

const attribute = <K extends keyof Attributes>([key, value]: [K, Attributes[K]]): string => {
  switch (key) {
    case "acceptCharset":
      return `accept-charset="${value}"`
    case "checked":
      return value ? 'checked="checked"' : ""
    case "className":
      return `class="${value}"`
    case "dataset":
      return Object.entries(value as Record<string, string>).map(([key, value]) => `data=${key}="${value}"`).join(" ")
    case "selected":
      return value ? 'selected="selected"' : ""
    case "style":
      return `style="${Object.entries(value as Record<string, string>).map(([key, value]) => `${key}:${value}`).join(";")}`
    case "httpEquiv":
      return `http-equiv="${value}"`
    default:
      return `${key.toLowerCase()}="${value}"`
  }
}

const closingTag = (tagName: TagName) => `</${tagName}>`
