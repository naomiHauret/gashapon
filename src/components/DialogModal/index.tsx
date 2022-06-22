import { IconClose } from '@components/Icons'
import styles from './styles.module.css'
export const DialogModal = (props) => {
    return <div class="fixed inset-0 z-10 overflow-y-auto">
    <div class="min-h-screen px-4 flex items-center justify-center">
    <div  class="bg-black bg-opacity-50 fixed inset-0" {...props.api().backdropProps} />
    <span class="inline-block h-screen align-middle" aria-hidden="true">
        &#8203;
    </span>
    <div class={`${styles.dialogContentBody} bg-black z-10 rounded-xl inline-block w-full max-w-screen-xs my-8 overflow-hidden align-middle`} {...props.api().underlayProps}>
      <div {...props.api().contentProps}>
        <div class="border-b-2 border-white border-opacity-10">
        <h2 class="px-4 pt-3 pb-2 font-semibold font-display tracking-widest text-ex" {...props.api().titleProps}>{props.title}</h2>
        </div>
        <p class="sr-only"{...props.api().descriptionProps}>
          {props.description}
        </p>
        <button class="absolute rounded-full flex items-center justify-center inline-end-2 top-2" {...props.api().closeButtonProps}>
        <IconClose />
        </button>
        <div class='px-6 pt-4 pb-6'>
            {props.children}
        </div>
      </div>
    </div>
    </div></div>
}

export default DialogModal