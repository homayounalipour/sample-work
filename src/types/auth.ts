export type AuthFormState = {
  email: string;
  password: string;
};

export type RegisterFormState = AuthFormState & {
  firstName: string;
  lastName: string;
  confirmPassword: string;
};
