import babel from 'rollup-plugin-babel';

const banner = 
`/*
 * Web Mapping Components
 * https://github.com/CSBP-CPSE/web-mapping-components/blob/master/LICENCE.md
 * v1.0 - 2021-02-04
 */
`;

export default {
    input: '../web-mapping-components/src/main.js',
    output: [
		{
	        file: '../web-mapping-components/dist/web-mapping-components.min.js',
			format: 'es',
			banner: banner
		}
	],
    plugins: [
        babel({
            exclude: 'node_modules/**',
			configFile: './config/babel.config.cjs'
        })
    ]
}
