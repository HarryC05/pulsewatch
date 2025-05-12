module.exports = {
	rules: {
		bem: {
			meta: {
				type: 'suggestion',
				docs: {
					description: 'enforce BEM class naming in JSX className',
					category: 'Stylistic Issues',
					recommended: false,
				},
				fixable: null,
				schema: [],
			},
			/**
			 * Enforce BEM class naming convention in JSX className attributes
			 *
			 * @param {object} context - The ESLint context object
			 *
			 * @returns {object} The ESLint rule object
			 */
			create(context) {
				const BEM_REGEX =
					/^([a-z]+(?:-[a-z]+)*)(__(?:[a-z]+(?:-[a-z]+)*))?(--(?:[a-z]+(?:-[a-z]+)*))?$/;

				return {
					/**
					 * Check if the className attribute follows BEM naming convention
					 *
					 * @param {object} node - The AST node
					 */
					JSXAttribute(node) {
						if (
							node.name.name !== 'className' ||
							node.value?.type !== 'Literal' ||
							typeof node.value.value !== 'string'
						) {
							return;
						}

						const classNames = node.value.value.split(/\s+/);
						for (const className of classNames) {
							if (!BEM_REGEX.test(className)) {
								context.report({
									node,
									message: `Class name '${className}' does not follow BEM (block, block__element, block--modifier, block__element--modifier)`,
								});
							}
						}
					},
				};
			},
		},
	},
};
