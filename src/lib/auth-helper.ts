export function validateEmail(email?: string) {
  return email && /^\S+@ru\.ac\.bd$/.test(email);
}

export function validatePassword(password?: string) {
  return (
    password && /^[A-Za-z0-9]{6,}$/.test(password)
  );
}

export function validateUsername(username?: string) {
  return username && /^[a-zA-Z0-9_]{3,20}$/.test(username);
}
