/**
 * Email regex pattern
 * - Must contain an '@' symbol
 * - Must contain a domain name
 * - Must contain a top-level domain (e.g., .com, .net)
 * - Cannot contain spaces
 */
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Username regex pattern
 * - Must be between 3 and 16 characters long
 * - Can contain letters, numbers, underscores, and hyphens
 * - Cannot contain spaces or special characters
 */
const usernameRegex = /^[a-zA-Z0-9_-]{3,16}$/;

/**
 * Password regex pattern
 * - Must be at least 8 characters long
 * - Must contain at least one uppercase letter
 * - Must contain at least one lowercase letter
 * - Must contain at least one number
 * - Must contain at least one special character (@, $, !, %, *, ?, &)
 */
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export { emailRegex, usernameRegex, passwordRegex };