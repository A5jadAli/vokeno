/* global jest */
// Screens now use Reanimated (and its Worklets runtime) for motion; use their official mocks.
jest.mock('react-native-worklets', () => require('react-native-worklets/src/mock'));
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));
// The web stylesheet has no meaning in Jest; screens and theme import it.
jest.mock('@/global.css', () => ({}));
// Device-level preferences use AsyncStorage; use its official in-memory mock.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
