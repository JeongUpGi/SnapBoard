// 이메일 유효성 검사
export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 비밀번호 유효성 검사 (대문자, 소문자, 숫자, 특수기호 포함 6자 이상)
export const validatePassword = (password: string) => {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isLongEnough = password.length >= 6;

  return (
    hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar && isLongEnough
  );
};
