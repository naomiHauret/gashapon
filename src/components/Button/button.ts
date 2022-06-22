import { cva } from 'class-variance-authority'
import styles from './styles.module.css'
import type { VariantProps } from 'class-variance-authority'

export const button = cva(
  [
    'inline-flex items-center justify-center',
    'focus:outline-none',
    'font-sans',
    'rounded-full',
    'transition-colors transition-500',
  ],
  {
    variants: {
      intent: {
        primary: [
          'bg-brand-pink text-black',
          'border-white border-solid',
        ],
        'wallet-MetaMask': [
          'text-white hover:text-black',
          'hover:bg-[#F6851B]',
          'border-solid border-[#F6851B] focus:ring-[#F6851B]',
        ],
      },
      aspect: {
        default: '',
        'popout-primary': `${styles['aspect-popout-primary']}`,
        'outline-sm': 'border-2',
        'outline-default': 'border-4'
      },
      scale: {
        sm: ['text-xs', 'px-3 py-1.5', 'font-bold'],
        default: ['text-xs', 'py-2 px-3', 'font-bold'],
      },
    },
    defaultVariants: {
      intent: 'primary',
      scale: 'default',
      aspect: 'default',
    },
  },
)

export type SystemUiButtonProps = VariantProps<typeof button>

export default button