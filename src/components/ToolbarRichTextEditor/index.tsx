import { createEditorTransaction } from 'solid-tiptap'
import type { Editor } from '@tiptap/core'
import { Toggle, Toolbar } from 'solid-headless'
import { JSX, Show } from 'solid-js'
import {
  IconEditorAnchor,
  IconEditorClearFormat,
  IconEditorCode,
  IconEditorCodeBlock,
  IconEditorEmbed,
  IconEditorH1,
  IconEditorH2,
  IconEditorH3,
  IconEditorH4,
  IconEditorH5,
  IconEditorImage,
  IconEditorListOrdered,
  IconEditorListUnordered,
  IconEditorParagraph,
  IconEditorQuote,
  IconEditorRedo,
  IconEditorRemoveAnchor,
  IconEditorStrike,
  IconEditorTextCenter,
  IconEditorTextLeft,
  IconEditorTextRight,
  IconEditorUndo,
} from '@components/Icons'

interface ControlProps {
  class?: string
  editor: Editor
  title: string
  key: string
  onChange: () => void
  isActive?: (editor: Editor) => boolean
  children: JSX.Element
}

const Separator = () => {
  return (
    <div class="flex items-center" aria-hidden="true">
      <div class="h-3/4 border-is-2 border-solid border-white border-opacity-10" />
    </div>
  )
}

const Control = (props: ControlProps) => {
  const flag = createEditorTransaction(
    () => props.editor,
    (instance) => {
      if (props.isActive) {
        return props.isActive(instance)
      }
      return instance.isActive(props.key)
    },
  )

  return (
    <Toggle
      class={`${
        props?.class ?? ''
      } rounded-md border-4 border-black py-1 px-2 flex items-center justify-center focus:outline-none focus-visible:ring focus-visible:ring-brand-pink focus-visible:ring-opacity-75`}
      classList={{
        'text-black bg-brand-pink': flag(),
      }}
      title={props.title}
      onChange={props.onChange}
      type="button"
    >
      {props.children}
    </Toggle>
  )
}

interface ToolbarProps {
  editor: Editor
}

function ToolbarContents(props: ToolbarProps): JSX.Element {
  return (
    <div class="flex flex-wrap">
      <Control
        key="paragraph"
        class="text-sm"
        editor={props.editor}
        onChange={() => props.editor.chain().focus().setParagraph().run()}
        title="Paragraph"
      >
        <IconEditorParagraph />
      </Control>
      <Control
        key="heading-1"
        editor={props.editor}
        onChange={() => props.editor.chain().focus().setHeading({ level: 1 }).run()}
        isActive={(editor) => editor.isActive('heading', { level: 1 })}
        title="Heading 1"
      >
        <IconEditorH1 />
      </Control>
      <Control
        key="heading-2"
        editor={props.editor}
        onChange={() => props.editor.chain().focus().setHeading({ level: 2 }).run()}
        isActive={(editor) => editor.isActive('heading', { level: 2 })}
        title="Heading 2"
      >
        <IconEditorH2 />
      </Control>
      <Control
        key="heading-3"
        editor={props.editor}
        onChange={() => props.editor.chain().focus().setHeading({ level: 3 }).run()}
        isActive={(editor) => editor.isActive('heading', { level: 3 })}
        title="Heading 3"
      >
        <IconEditorH3 />
      </Control>
      <Control
        key="heading-4"
        editor={props.editor}
        onChange={() => props.editor.chain().focus().setHeading({ level: 4 }).run()}
        isActive={(editor) => editor.isActive('heading', { level: 4 })}
        title="Heading 4"
      >
        <IconEditorH4 />
      </Control>
      <Control
        key="heading-5"
        editor={props.editor}
        onChange={() => props.editor.chain().focus().setHeading({ level: 5 }).run()}
        isActive={(editor) => editor.isActive('heading', { level: 5 })}
        title="Heading 5"
      >
        <IconEditorH5 />
      </Control>
      <Separator />
      <Control
        key="bold"
        class="font-bold"
        editor={props.editor}
        onChange={() => props.editor.chain().focus().toggleBold().run()}
        title="Bold"
      >
        B
      </Control>
      <Control
        key="italic"
        class="italic"
        editor={props.editor}
        onChange={() => props.editor.chain().focus().toggleItalic().run()}
        title="Italic"
      >
        I
      </Control>
      <Control
        key="strike"
        class="line-through"
        editor={props.editor}
        onChange={() => props.editor.chain().focus().toggleStrike().run()}
        title="Strike Through"
      >
        <IconEditorStrike />
      </Control>
      <Control
        key="code"
        class="text-lg"
        editor={props.editor}
        onChange={() => props.editor.chain().focus().toggleCode().run()}
        title="Code"
      >
        <IconEditorCode />
      </Control>
      <Control
        key="link"
        class="text-lg"
        editor={props.editor}
        onChange={() => {
          const previousUrl = props.editor.getAttributes('link').href
          const url = window.prompt(previousUrl ? 'Change Link URL' : 'Paste link URL', previousUrl)

          // cancelled
          if (url === null) return

          // empty
          if (url === '') {
            props.editor.chain().focus().extendMarkRange('link').unsetLink().run()
            return
          }

          // update link
          props.editor.chain().focus().extendMarkRange('link').setLink({ href: url, target: '_blank' }).run()
        }}
        title="Link"
      >
        <IconEditorAnchor />
      </Control>

      <Control
        key="unlink"
        class="text-lg"
        editor={props.editor}
        onChange={() => {
          props.editor.commands.unsetLink()
        }}
        title="Remove link"
      >
        <IconEditorRemoveAnchor />
      </Control>
      <Separator />
      <Control
        key="bulletList"
        class="text-lg"
        editor={props.editor}
        onChange={() => props.editor.chain().focus().toggleBulletList().run()}
        title="Bullet List"
      >
        <IconEditorListUnordered />
      </Control>
      <Control
        key="orderedList"
        class="text-lg"
        editor={props.editor}
        onChange={() => props.editor.chain().focus().toggleOrderedList().run()}
        title="Ordered List"
      >
        <IconEditorListOrdered />
      </Control>
      <Control
        key="blockquote"
        class=""
        editor={props.editor}
        onChange={() => props.editor.chain().focus().toggleBlockquote().run()}
        title="Blockquote"
      >
        <IconEditorQuote />
      </Control>
      <Control
        key="codeBlock"
        class="text-lg"
        editor={props.editor}
        onChange={() => props.editor.chain().focus().toggleCodeBlock().run()}
        title="Code Block"
      >
        <IconEditorCodeBlock />
      </Control>
      <Separator />
      <Control
        key="alignLeft"
        class="text-lg"
        editor={props.editor}
        onChange={() => props.editor.chain().focus().setTextAlign('left').run()}
        title="Align left"
      >
        <IconEditorTextLeft />
      </Control>
      <Control
        key="alignCenter"
        class="text-lg"
        editor={props.editor}
        onChange={() => props.editor.chain().focus().setTextAlign('center').run()}
        title="Align center"
      >
        <IconEditorTextCenter />
      </Control>
      <Control
        key="alignRight"
        class="text-lg"
        editor={props.editor}
        onChange={() => props.editor.chain().focus().setTextAlign('right').run()}
        title="Align right"
      >
        <IconEditorTextRight />
      </Control>
      <Separator />
      <Control
        key="image"
        class="text-lg"
        editor={props.editor}
        onChange={() => {
          const url = window.prompt('Image URL')

          if (url) {
            props.editor.chain().focus().setImage({ src: url }).run()
          }
        }}
        title="Image"
      >
        <IconEditorImage />
      </Control>
      <Control
        key="iframe"
        class=""
        editor={props.editor}
        onChange={() => {
          const url = window.prompt('Your iframe URL')

          if (url) {
            props.editor.chain().focus().setIframe({ src: url }).run()
          }
        }}
        title="Iframe URL"
      >
        <span>iframe</span>
      </Control>
      <Separator />
      <div class="flex space-i-1">
        <Control
          key="clear"
          class="text-lg"
          editor={props.editor}
          onChange={() => {
            props.editor.commands.clearNodes()
          }}
          title="Undo"
        >
          <IconEditorClearFormat />
        </Control>

        <Control
          key="undo"
          class="text-lg"
          editor={props.editor}
          onChange={() => {
            props.editor.commands.undo()
          }}
          title="Undo"
        >
          <IconEditorUndo />
        </Control>
        <Control
          key="redo"
          class="text-lg"
          editor={props.editor}
          onChange={() => {
            props.editor.commands.redo()
          }}
          title="Redo"
        >
          <IconEditorRedo />
        </Control>
      </div>
    </div>
  )
}

export const ToolbarRichTextEditor = (props) => {
  // undo styling
  // colors ?
  return (
    <>
      <Toolbar ref={props.ref} horizontal>
        <Show when={props.editor()}>{(instance) => <ToolbarContents editor={instance} />}</Show>
      </Toolbar>
    </>
  )
}

export default ToolbarRichTextEditor
