import { cva } from 'class-variance-authority'
import styles from './styles.module.css'

export const button = cva(
  [
    'rounded-full inline-flex items-center justify-center',
    'focus:outline-none',
    'font-sans',
    'transition-colors transition-500',
    'disabled:opacity-50 disabled:pointer-events-none',
  ],
  {
    variants: {
      intent: {
        //@ts-ignore
        primary: ['bg-brand-pink text-black', 'border-white border-solid'],
        'wallet-MetaMask': [
          //@ts-ignore
          'text-white hover:text-black',
          //@ts-ignore
          'hover:bg-[#F6851B]',
          //@ts-ignore
          'border-solid border-[#F6851B] focus:ring-[#F6851B]',
        ],
        accent: 'bg--accent text-black',
        'accent-revert': 'text-white bg-black hover:text-black hover:bg--accent border--accent',
        danger: ['bg-negative-400 hover:bg-opacity-90 focus:bg-negative-500 text-black'],
        'danger--revert': [
          'bg-black hover:bg-negative-400 hover:text-black focus:bg-negative-500 focus:text-black text-white focus:border-negative-500 border-negative-400',
        ],
        'primary--revert': [
          'bg-black text-white',
          'border-brand-pink border-solid',
          'hover:bg-brand-pink hover:bg-opacity-90 hover:text-black focus:border-transparent',
          'focus:bg-brand-pink focus:text-black focus:border-transparent',
        ],
        'neutral--revert': [
          'bg-black hover:bg-neutral-100 hover:text-black focus:bg-neutral-300 focus:text-black text-white focus:border-transparent border-neutral-500',
        ],
      },
      aspect: {
        //@ts-ignore
        default: '',
        //@ts-ignore
        'popout-primary': `${styles['aspect-popout-primary']}`,
        //@ts-ignore
        'outline-sm': 'border-2',
        //@ts-ignore
        'outline-default': 'border-4',
      },
      scale: {
        //@ts-ignore
        xs: ['text-2xs', 'px-3 py-1', 'font-bold'],
        //@ts-ignore
        sm: ['text-xs', 'px-3 py-1.5', 'font-bold'],
        //@ts-ignore
        default: ['text-xs', 'py-2 px-3', 'font-bold'],
      },
    },
    defaultVariants: {
      //@ts-ignore
      intent: 'primary',
      //@ts-ignore
      scale: 'default',
      //@ts-ignore
      aspect: 'default',
    },
  },
)

export default button
