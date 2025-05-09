/**
 * Email regex pattern
 * - Must contain an '@' symbol
 * - Must contain a domain name
 * - Must contain a top-level domain (e.g., .com, .net)
 * - Cannot contain spaces
 */
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const emailRegexError = 'Email must be a valid email address.';

/**
 * Username regex pattern
 * - Must be between 3 and 16 characters long
 * - Can contain letters, numbers, underscores, and hyphens
 * - Cannot contain spaces or special characters
 */
const usernameRegex = /^[a-zA-Z0-9_-]{3,16}$/;
const usernameRegexError = 'Username must be between 3 and 16 characters long and can only contain letters, numbers, underscores, and hyphens.';

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
 * - Can contain letters, numbers, hyphens, underscores, spaces, and full stops
 * - Cannot contain special characters
 */
const monitorNameRegex = /^[a-zA-Z0-9-_. ]{3,32}$/;
const monitorNameRegexError = 'Monitor name must be between 3 and 32 characters long and can only contain letters, numbers, hyphens, underscores, and spaces.';

/**
 * Status page name regex pattern
 * - Must be between 3 and 32 characters long
 * - Can contain letters, numbers, hyphens, underscores, spaces, and full stops
 * - Cannot contain special characters
 */
const statusPageNameRegex = /^[a-zA-Z0-9-_. ]{3,32}$/;
const statusPageNameRegexError = 'Status page name must be between 3 and 32 characters long and can only contain letters, numbers, hyphens, underscores, and spaces.';

/**
 * Status page slug regex pattern
 * - Must be between 3 and 32 characters long
 * - can only contain lowercase letters, numbers, and hyphens
 * - Cannot contain spaces or special characters
 */
const statusPageSlugRegex = /^[a-z0-9-]{3,32}$/;
const statusPageSlugRegexError = 'Status page slug must be between 3 and 32 characters long and can only contain lowercase letters, numbers, and hyphens.';

/**
 * Status page description regex pattern
 * - Must be between 0 and 500 characters long
 * - Can contain letters, numbers, hyphens, underscores, spaces, full stops, commas, exclamation marks, question marks, colons, semicolons, apostrophes, quotes, parentheses, dashes, slashes, and ampersands
 * - Cannot contain special characters
 */
const statusPageDescriptionRegex = /^[a-zA-Z0-9-_. ,!?;:'"()&/\\]{0,500}$/;
const statusPageDescriptionRegexError = 'Status page description must be no longer than 500 characters and can only contain letters, numbers, hyphens, underscores, spaces, full stops, commas, exclamation marks, question marks, colons, semicolons, apostrophes, quotes, parentheses, dashes, slashes, and ampersands.';

export {
  emailRegex,
  emailRegexError,
  usernameRegex,
  usernameRegexError,
  passwordRegex,
  passwordRegexError,
  monitorNameRegex,
  monitorNameRegexError,
  urlRegex,
  urlRegexError,
  statusPageNameRegex,
  statusPageNameRegexError,
  statusPageSlugRegex,
  statusPageSlugRegexError,
  statusPageDescriptionRegex,
  statusPageDescriptionRegexError,
};
