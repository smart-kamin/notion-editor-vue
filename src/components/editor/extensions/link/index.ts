import Link from '@tiptap/extension-link'

export const linkExtension = Link.configure({
  openOnClick: false,
  autolink: true,
  linkOnPaste: true,
  HTMLAttributes: { class: 'ed-link', rel: 'noopener noreferrer' },
})
