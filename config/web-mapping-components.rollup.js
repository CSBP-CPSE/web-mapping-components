import babel from 'rollup-plugin-babel';

export default {
    input: '../web-mapping-components/src/main.js',
    output: {
        file: '../web-mapping-components/dist/web-mapping-components.min.js',
        format: 'iife',
        name: 'bundle'
    },
    plugins: [
        babel({
            exclude: 'node_modules/**',
			configFile: './config/babel.config.js'
        })
    ]
}
