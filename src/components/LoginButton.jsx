import { useEffect, useState } from "react";
import { Session } from "@inrupt/solid-client-authn-browser";

const session = new Session();

export default function LoginButton({ onLogin }) {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    session.handleIncomingRedirect().then(() => {
      if (session.info.isLoggedIn) {
        setLoggedIn(true);
        onLogin(session);
      }
    });
  }, []);

  const login = () => {
    session.login({
      oidcIssuer: "https://login.inrupt.com",
      redirectUrl: window.location.href,
      clientName: "Solid Calendar App",
    });
  };

  const logout = () => {
    session.logout();
    setLoggedIn(false);
    window.location.reload();
  };

  return (
    <button onClick={loggedIn ? logout : login}>
      {loggedIn ? "Logout" : "Login"}
    </button>
  );
}

export { session };

