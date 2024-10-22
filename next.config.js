const nextConfig = {
    webpack: (config, { isServer }) => {
      if (isServer) {
        config.externals = ['fs', 'path', ...config.externals];
      }
      return config;
    },
  };
  
module.exports = nextConfig;
  