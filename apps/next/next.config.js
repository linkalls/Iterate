/** @type {import('next').NextConfig} */
const { withTamagui } = require('@tamagui/next-plugin')

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: [
    'solito',
    'react-native',
    'react-native-web',
    'expo',
    'app',
    'ui',
  ],
}

module.exports = withTamagui(nextConfig, {
  config: '../../packages/ui/tamagui.config.ts',
  components: ['tamagui'],
})
