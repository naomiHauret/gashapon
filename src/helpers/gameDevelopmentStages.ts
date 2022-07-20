export const IN_DEVELOPMENT = 'in-development'
export const EARLY = 'early-access'
export const STABLE = 'stable'
export const COMPLETE = 'complete'
export const END_OF_LIFE = 'end-of-life'
export const ABANDONWARE_STABLE = 'abandonware-stable'
export const ABANDONWARE_UNSTABLE = 'abandonware-unstable'

export default {
  [IN_DEVELOPMENT]: {
    label: 'In development',
    description: 'The game is not playable yet and is in active development.',
    value: IN_DEVELOPMENT,
  },
  [EARLY]: {
    label: 'Early access',
    description: 'The game is playable but may not be feature-complete, or may still have several bugs.',
    value: [EARLY],
  },
  [STABLE]: {
    label: 'Released - in stable development',
    description:
      'A playable version of the game is released. The game is maintained and has passed all verifications/tests.\nNew features and/or content are likely to be added in the future.',
    value: 'stable',
  },
  [COMPLETE]: {
    label: 'Complete',
    description:
      'A playable version of the game is released. The game is maintained and has passed all verifications/tests.\nNo new features are planned, but the eventual remaining bugs, defects and vulnerabilities will be actively fixed by the original development team.',
    value: COMPLETE,
  },
  [END_OF_LIFE]: {
    label: 'Complete - end-of-life',
    description:
      'The game is playable and has passed all verifications/tests.\nNo further updates and/or bugfix are planned by the original development team.',
    value: END_OF_LIFE,
  },
  [ABANDONWARE_STABLE]: {
    label: 'Abandonware - stable',
    description:
      "The game is playable but not complete.\nThe original development team has abandoned the development of this game and doesn't maintain it anymore.",
    value: ABANDONWARE_STABLE,
  },
  [ABANDONWARE_UNSTABLE]: {
    label: 'Abandonware - unstable',
    description:
      "The game is riddled with bugs and unlikely to offer an enjoyable experience.\nThe original development team has abandoned the development of this game and doesn't maintain it anymore.",
    value: ABANDONWARE_UNSTABLE,
  },
}
