import babel from 'rollup-plugin-babel';

export default {
    input: '../web-mapping-components/src/mapbox-tools/mapbox-tools.js',
    output: [
		{
	        file: '../web-mapping-components/dist/mapbox-tools.min.js',
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
