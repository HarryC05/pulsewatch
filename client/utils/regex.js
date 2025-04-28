/**
 * URL regex pattern
 * - Must start with http:// or https://
 * - Must contain a valid domain name
 */
const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d{1,5})?(\/.*)?$/;
const urlRegexError = 'URL must start with http:// or https:// and contain a valid domain name.';

/**
 * Monitor name regex pattern
 * - Must be between 3 and 32 characters long
 * - Can contain letters, numbers, hyphens, underscores, and spaces
 * - Cannot contain special characters
 */
const monitorNameRegex = /^[a-zA-Z0-9-_ ]{3,32}$/;
const monitorNameRegexError = 'Monitor name must be between 3 and 32 characters long and can only contain letters, numbers, hyphens, underscores, and spaces.';

export { urlRegex, urlRegexError, monitorNameRegex, monitorNameRegexError };
