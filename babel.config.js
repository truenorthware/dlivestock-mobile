module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'styled-components',
    [
      'module-resolver',
      {
        root: ['./app'],
        extensions: ['.js', '.ios.js', '.android.js'],
      },
    ],
  ],
}
