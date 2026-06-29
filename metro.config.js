const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Lisätään tuki .wasm-tiedostoille, joita expo-sqlite käyttää web-alustalla
config.resolver.assetExts.push('wasm');

module.exports = config;
