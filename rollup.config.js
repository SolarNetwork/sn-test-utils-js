import babel from 'rollup-plugin-babel';
import includePaths from 'rollup-plugin-includepaths';

const includePathOptions = {
  include: {},
  paths: ['src'],
  external: [],
  extensions: ['.js']
};

export default {
  external: id => {
    return /(d3-|solarnetwork-api-)/.test(id);
  },
  globals: {
    'd3-request': 'd3',
    'solarnetwork-api-core': 'sn',
  },
  plugins: [
    includePaths(includePathOptions),
    babel({
      exclude: 'node_modules/**',
      babelrc: false,
      plugins: ['external-helpers'],
      presets: [
        ['env', {
          targets: {
            browsers: ['last 2 versions'],
            node: 'current',
          },
          modules: false,
        }]
      ]
    })]
};
