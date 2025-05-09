/**
 * Email regex pattern
 * - Must contain an '@' symbol
 * - Must contain a domain name
 * - Must contain a top-level domain (e.g., .com, .net)
 * - Cannot contain spaces
 */
const emailRegex = {};
emailRegex.pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
emailRegex.err = 'Email must be a valid email address.';

/**
 * Username regex pattern
 * - Must be between 3 and 16 characters long
 * - Can contain letters, numbers, underscores, and hyphens
 * - Cannot contain spaces or special characters
 */
const unameRegex = {};
unameRegex.pattern = /^[a-zA-Z0-9_-]{3,16}$/;
unameRegex.err =
	'Username must be between 3 and 16 characters long and can only contain letters, numbers, underscores, and hyphens.';

/**
 * Password regex pattern
 * - Must be at least 8 characters long
 * - Must contain at least one uppercase letter
 * - Must contain at least one lowercase letter
 * - Must contain at least one number
 * - Must contain at least one special character (@, $, !, %, *, ?, &)
 */
const passwordRegex = {};
passwordRegex.pattern =
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
passwordRegex.err =
	'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@, $, !, %, *, ?, &).';

/**
 * URL regex pattern
 * - Must start with http:// or https://
 * - Must contain a valid domain name
 */
const urlRegex = {};
urlRegex.pattern =
	/^(https?:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d{1,5})?(\/.*)?$/;
urlRegex.err =
	'URL must start with http:// or https:// and contain a valid domain name.';

/**
 * Name regex pattern
 * - Must be between 3 and 32 characters long
 * - Can contain letters, numbers, hyphens, underscores, spaces, and full stops
 * - Cannot contain special characters
 */
const nameRegex = {};
nameRegex.pattern = /^[a-zA-Z0-9-_. ]{3,32}$/;
nameRegex.err =
	'Name must be between 3 and 32 characters long and can only contain letters, numbers, hyphens, underscores, and spaces.';

/**
 * Slug regex pattern
 * - Must be between 3 and 32 characters long
 * - can only contain lowercase letters, numbers, and hyphens
 * - Cannot contain spaces or special characters
 */
const slugRegex = {};
slugRegex.pattern = /^[a-z0-9-]{3,32}$/;
slugRegex.err =
	'Slug must be between 3 and 32 characters long and can only contain lowercase letters, numbers, and hyphens.';

/**
 * Status page description regex pattern
 * - Must be between 0 and 500 characters long
 * - Can contain letters, numbers, hyphens, underscores, spaces, full stops, commas, exclamation marks, question marks, colons, semicolons, apostrophes, quotes, parentheses, dashes, slashes, and ampersands
 * - Cannot contain special characters
 */
const descRegex = {};
descRegex.pattern = /^[a-zA-Z0-9-_. ,!?;:'"()&/\\]{0,500}$/;
descRegex.err =
	'Status page description must be no longer than 500 characters and can only contain letters, numbers, hyphens, underscores, spaces, full stops, commas, exclamation marks, question marks, colons, semicolons, apostrophes, quotes, parentheses, dashes, slashes, and ampersands.';

export {
	emailRegex,
	unameRegex,
	passwordRegex,
	urlRegex,
	nameRegex,
	slugRegex,
	descRegex,
};
