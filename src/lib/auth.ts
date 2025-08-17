// Simple authentication with hardcoded credentials
const VALID_CREDENTIALS = {
  username: 'Himalika',
  password: 'Rishi'
};

export interface LoginCredentials {
  username: string;
  password: string;
}

export const authenticateUser = (credentials: LoginCredentials): boolean => {
  return (
    credentials.username === VALID_CREDENTIALS.username &&
    credentials.password === VALID_CREDENTIALS.password
  );
};

export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('isAuthenticated') === 'true';
};

export const login = (credentials: LoginCredentials): boolean => {
  const isValid = authenticateUser(credentials);
  if (isValid && typeof window !== 'undefined') {
    localStorage.setItem('isAuthenticated', 'true');
  }
  return isValid;
};

export const logout = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('isAuthenticated');
  }
}; 