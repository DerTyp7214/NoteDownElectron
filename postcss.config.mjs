import autoprefixer from 'autoprefixer'
import tailwind from 'tailwindcss'
import cssnano from 'cssnano'

/** @type {import('postcss-load-config').Config} */
const config = (configContext) => ({
  plugins: [
    tailwind,
    autoprefixer,
    cssnano({
      preset: [
        'default',
        {
          discardComments: {
            removeAll: true,
          },
        },
      ],
    }),
  ],
})

export default config