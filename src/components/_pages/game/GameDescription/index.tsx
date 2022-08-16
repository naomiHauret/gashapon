import { createTiptapEditor } from 'solid-tiptap'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Iframe from '@components/tiptap/Iframe'
import { createEffect } from 'solid-js'

export const GameDescription = (props) => {
  let ref

  createTiptapEditor({
    get element() {
      return ref
    },
    get extensions() {
      return [
        StarterKit,
        Image,
        TextAlign.configure({
          types: ['heading', 'paragraph', 'image'],
          alignments: ['left', 'right', 'center'],
        }),
        Link.configure({
          openOnClick: false,
          HTMLAttributes: {
            class: 'link',
            target: '_blank',
          },
        }),
        Iframe,
      ]
    },
    content: ` ${props?.content}`,
    editable: false,
    editorProps: {
      attributes: {
        class: 'prose prose-invert',
      },
    },
  })

  createEffect(() => {
    const iframes = document.querySelectorAll('iframe')
    for (let i = 0; i < iframes.length; i++) {
      iframes[i].width = iframes[i].contentWindow.document.body.scrollWidth
      if (iframes[i].src.includes('store.steampowered.com/widget/')) {
        iframes[i].style.minHeight = '190px'
      } else {
        iframes[i].height = iframes[i].contentWindow.document.body.scrollHeight
      }
    }
  })

  return <div id="content" ref={ref} />
}

export default GameDescription
