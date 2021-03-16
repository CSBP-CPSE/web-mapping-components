const banner = 
`/*
 * Web Mapping Components
 * https://github.com/CSBP-CPSE/web-mapping-components/blob/master/LICENCE.md
 * v1.0
 */
`;

/**
 * web-mapping-components is an aggregation of multiple modules, and is currently 
 * being used as an imported library into various viewer projects. 
 * As a result the output format is set to ECMAscript (es).
 */
export default {
    input: '../web-mapping-components/src/main.js',
    output: [
		{
	        file: '../web-mapping-components/dist/web-mapping-components.js',
			format: 'es',
			banner: banner
		}
    ]
}
