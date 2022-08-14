import ToolbarRichTextEditor from '@components/ToolbarRichTextEditor'
import styles from './styles.module.css'
export const RichTextEditor = (props) => {
  return (
    <div class="flex flex-col min-h-[12rem] rounded-md border-2 border-solid border-white border-opacity-20 hover:border-opacity-25 focus-within:border-opacity-40">
      <div class="relative px-1 py-1 border-b-2 border-b-white border-opacity-20">
        <ToolbarRichTextEditor editor={props.editor} ref={props.ref} />
      </div>
      <div
        class={`${styles.editor} flex flex-col flex-grow max-h-[26em] overflow-y-auto`}
        id="editor"
        ref={props.ref}
      />
    </div>
  )
}

export default RichTextEditor
