import { useAuth } from "./useAuth";

export const AuthLayout = ({ children }) => {
  const isLoggedIn = useAuth();

  return isLoggedIn ? (
    <div>
      <header>Home</header>
      <main>{children}</main>
    </div>
  ) : (
    <div>Login</div>
  );
};
