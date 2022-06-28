import { cva } from 'class-variance-authority'
import styles from './styles.module.css'
export const toastLayer = cva([`${styles.toast} bg-black font-medium rounded-md relative border-4 text-white`], {
  variants: {
    intent: {
      info: styles['toast--info'],
      loading: styles['toast--loading'],
      success: styles['toast--success'],
      error: styles['toast--error'],
    },
  },
  defaultVariants: {
    intent: 'info',
  },
})

export const toastIcon = cva('', {
  variants: {
    intent: {
      info: 'text-white',
      loading: 'text-white',
      success: 'text-positive-300',
      error: 'text-negative-400',
    },
  },
})
