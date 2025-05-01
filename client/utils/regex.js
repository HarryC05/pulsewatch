/**
 * URL regex pattern
 * - Must start with http:// or https://
 * - Must contain a valid domain name
 */
const urlRegex = /^(https?:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d{1,5})?(\/.*)?$/;
const urlRegexError = 'URL must start with http:// or https:// and contain a valid domain name.';

/**
 * Monitor name regex pattern
 * - Must be between 3 and 32 characters long
 * - Can contain letters, numbers, hyphens, underscores, and spaces
 * - Cannot contain special characters
 */
const monitorNameRegex = /^[a-zA-Z0-9-_ ]{3,32}$/;
const monitorNameRegexError = 'Monitor name must be between 3 and 32 characters long and can only contain letters, numbers, hyphens, underscores, and spaces.';

/**
 * Password regex pattern
 * - Must be at least 8 characters long
 * - Must contain at least one uppercase letter
 * - Must contain at least one lowercase letter
 * - Must contain at least one number
 * - Must contain at least one special character (@, $, !, %, *, ?, &)
 */
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const passwordRegexError = 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@, $, !, %, *, ?, &).';

export { urlRegex, urlRegexError, monitorNameRegex, monitorNameRegexError, passwordRegex, passwordRegexError };
