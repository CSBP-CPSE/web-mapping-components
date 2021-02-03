import babel from 'rollup-plugin-babel';

export default {
    input: '../web-mapping-components/src/basic-tools/basic-tools.js',
    output: [
		{
	        file: '../web-mapping-components/dist/basic-tools.min.js',
	        format: 'es'
		}
	],
    plugins: [
        babel({
            exclude: 'node_modules/**',
			configFile: './config/babel.config.cjs'
        })
    ]
}
