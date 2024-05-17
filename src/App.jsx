import { Provider } from "react-redux";
import { Outlet, useNavigation } from "react-router-dom";
import { store } from "@/store";
import { AuthLayout } from "./components/auth/AuthLayout";

export default function App() {
  const navigation = useNavigation();

  return (
    <Provider store={store}>
      <div id="portal-root"></div>
      <div id="root" className="flex flex-col h-screen w-full overflow-hidden">
        <AuthLayout>
          <Outlet />
        </AuthLayout>
      </div>

      {navigation.state === "loading" ? <div>Loading...</div> : null}
    </Provider>
  );
}
