import { cva } from 'class-variance-authority'
import styles from './styles.module.css'

export const button = cva(
  [
    'inline-flex items-center justify-center',
    'focus:outline-none',
    'font-sans',
    'rounded-full',
    'transition-colors transition-500',
    'disabled:opacity-50',
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
        danger: ['bg-negative-400 text-black'],
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
