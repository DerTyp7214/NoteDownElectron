import type { CustomThemeConfig } from '@skeletonlabs/tw-plugin'
import { skeleton } from '@skeletonlabs/tw-plugin'
import tailwindTypography from '@tailwindcss/typography'
import type { Config } from 'tailwindcss'
import { join } from 'path'

export const notedown: CustomThemeConfig = {
  name: 'notedown',
  properties: {
    // =~= Theme Properties =~=
    '--theme-font-family-base': `system-ui`,
    '--theme-font-family-heading': `system-ui`,
    '--theme-font-color-base': '0 0 0',
    '--theme-font-color-dark': '255 255 255',
    '--theme-rounded-base': '12px',
    '--theme-rounded-container': '8px',
    '--theme-border-base': '2px',
    // =~= Theme On-X Colors =~=
    '--on-primary': '0 0 0',
    '--on-secondary': '255 255 255',
    '--on-tertiary': '255 255 255',
    '--on-success': '0 0 0',
    '--on-warning': '0 0 0',
    '--on-error': '255 255 255',
    '--on-surface': '0 0 0',
    // =~= Theme Colors  =~=
    // primary | #5abdc9
    '--color-primary-50': '230 245 247', // #e6f5f7
    '--color-primary-100': '222 242 244', // #def2f4
    '--color-primary-200': '214 239 242', // #d6eff2
    '--color-primary-300': '189 229 233', // #bde5e9
    '--color-primary-400': '140 209 217', // #8cd1d9
    '--color-primary-500': '90 189 201', // #5abdc9
    '--color-primary-600': '81 170 181', // #51aab5
    '--color-primary-700': '68 142 151', // #448e97
    '--color-primary-800': '54 113 121', // #367179
    '--color-primary-900': '44 93 98', // #2c5d62
    // secondary | #7a227f
    '--color-secondary-50': '235 222 236', // #ebdeec
    '--color-secondary-100': '228 211 229', // #e4d3e5
    '--color-secondary-200': '222 200 223', // #dec8df
    '--color-secondary-300': '202 167 204', // #caa7cc
    '--color-secondary-400': '162 100 165', // #a264a5
    '--color-secondary-500': '122 34 127', // #7a227f
    '--color-secondary-600': '110 31 114', // #6e1f72
    '--color-secondary-700': '92 26 95', // #5c1a5f
    '--color-secondary-800': '73 20 76', // #49144c
    '--color-secondary-900': '60 17 62', // #3c113e
    // tertiary | #595192
    '--color-tertiary-50': '230 229 239', // #e6e5ef
    '--color-tertiary-100': '222 220 233', // #dedce9
    '--color-tertiary-200': '214 212 228', // #d6d4e4
    '--color-tertiary-300': '189 185 211', // #bdb9d3
    '--color-tertiary-400': '139 133 179', // #8b85b3
    '--color-tertiary-500': '89 81 146', // #595192
    '--color-tertiary-600': '80 73 131', // #504983
    '--color-tertiary-700': '67 61 110', // #433d6e
    '--color-tertiary-800': '53 49 88', // #353158
    '--color-tertiary-900': '44 40 72', // #2c2848
    // success | #00ff11
    '--color-success-50': '217 255 219', // #d9ffdb
    '--color-success-100': '204 255 207', // #ccffcf
    '--color-success-200': '191 255 196', // #bfffc4
    '--color-success-300': '153 255 160', // #99ffa0
    '--color-success-400': '77 255 88', // #4dff58
    '--color-success-500': '0 255 17', // #00ff11
    '--color-success-600': '0 230 15', // #00e60f
    '--color-success-700': '0 191 13', // #00bf0d
    '--color-success-800': '0 153 10', // #00990a
    '--color-success-900': '0 125 8', // #007d08
    // warning | #e68600
    '--color-warning-50': '251 237 217', // #fbedd9
    '--color-warning-100': '250 231 204', // #fae7cc
    '--color-warning-200': '249 225 191', // #f9e1bf
    '--color-warning-300': '245 207 153', // #f5cf99
    '--color-warning-400': '238 170 77', // #eeaa4d
    '--color-warning-500': '230 134 0', // #e68600
    '--color-warning-600': '207 121 0', // #cf7900
    '--color-warning-700': '173 101 0', // #ad6500
    '--color-warning-800': '138 80 0', // #8a5000
    '--color-warning-900': '113 66 0', // #714200
    // error | #e60000
    '--color-error-50': '251 217 217', // #fbd9d9
    '--color-error-100': '250 204 204', // #facccc
    '--color-error-200': '249 191 191', // #f9bfbf
    '--color-error-300': '245 153 153', // #f59999
    '--color-error-400': '238 77 77', // #ee4d4d
    '--color-error-500': '230 0 0', // #e60000
    '--color-error-600': '207 0 0', // #cf0000
    '--color-error-700': '173 0 0', // #ad0000
    '--color-error-800': '138 0 0', // #8a0000
    '--color-error-900': '113 0 0', // #710000
    // surface | #2c2c2c
    '--color-surface-50': '223 223 223', // #dfdfdf
    '--color-surface-100': '213 213 213', // #d5d5d5
    '--color-surface-200': '202 202 202', // #cacaca
    '--color-surface-300': '171 171 171', // #ababab
    '--color-surface-400': '107 107 107', // #6b6b6b
    '--color-surface-500': '44 44 44', // #2c2c2c
    '--color-surface-600': '40 40 40', // #282828
    '--color-surface-700': '33 33 33', // #212121
    '--color-surface-800': '26 26 26', // #1a1a1a
    '--color-surface-900': '22 22 22' // #161616
  }
}

const config: Config = {
  content: [
    './src/**/*.{html,js,svelte,ts}',
    join(
      require.resolve('@skeletonlabs/skeleton'),
      '../**/*.{html,js,svelte,ts}'
    ),
    '!src/renderer/node_modules'
  ],

  darkMode: 'class',

  theme: {
    extend: {
      screens: {
        '3xl': '1600px',
        '4xl': '1920px',
        '5xl': '2400px',
        '6xl': '2560px'
      }
    }
  },

  safelist: [
    'checkbox',
    'p-8',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6'
  ],

  plugins: [
    tailwindTypography({
      className: 'markdown'
    }),
    skeleton({
      themes: {
        preset: [
          {
            name: 'skeleton',
            enhancements: true
          },
          {
            name: 'modern',
            enhancements: true
          },
          {
            name: 'seafoam',
            enhancements: true
          },
          {
            name: 'sahara',
            enhancements: true
          },
          {
            name: 'gold-nouveau',
            enhancements: true
          },
          {
            name: 'wintry',
            enhancements: true
          },
          {
            name: 'rocket',
            enhancements: true
          },
          {
            name: 'vintage',
            enhancements: true
          },
          {
            name: 'hamlindigo',
            enhancements: true
          },
          {
            name: 'crimson',
            enhancements: true
          }
        ],
        custom: [notedown]
      }
    })
  ]
}

export default config
