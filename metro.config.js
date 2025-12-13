const {getDefaultConfig} = require('expo/metro-config');
const {withNativeWind} = require('nativewind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Ensure react-native-worklets/plugin can be resolved
config.resolver = {
  ...config.resolver,
  extraNodeModules: {
    ...config.resolver?.extraNodeModules,
  },
  // Resolve web-only modules to empty stubs for React Native
  resolveRequest: (context, moduleName, platform) => {
    // Handle web3/ethereum modules that Supabase tries to import
    // This is a relative import from within @supabase/auth-js
    // The file exists but Metro has trouble resolving relative paths in node_modules
    if (
      moduleName === './lib/web3/ethereum' ||
      moduleName === 'lib/web3/ethereum' ||
      moduleName.endsWith('lib/web3/ethereum')
    ) {
      // Try to resolve to the actual file in node_modules first
      const ethereumPath = path.resolve(
        __dirname,
        'node_modules/@supabase/auth-js/dist/main/lib/web3/ethereum.js'
      );
      try {
        if (require('fs').existsSync(ethereumPath)) {
          return {
            type: 'sourceFile',
            filePath: ethereumPath,
          };
        }
      } catch (e) {
        // Fall through to stub
      }
      // Fallback to stub
      return {
        type: 'sourceFile',
        filePath: path.resolve(__dirname, 'polyfills/web3-ethereum.js'),
      };
    }
    // Default resolution - use the default resolver
    if (context.resolveRequest) {
      return context.resolveRequest(context, moduleName, platform);
    }
    // Fallback to default Metro resolution
    return undefined;
  },
};

module.exports = withNativeWind(config, {input: './global.css'});

