import { useState } from "react";
import { useAuth } from "../../context/auth";
import { login } from "../../lib/auth";
import { Button } from "@chakra-ui/react";
import { CardUser } from "../Cards/CardUser";

export const ButtonSignIn = () => {
  const user = useAuth();
  const [waiting, setWaiting] = useState<boolean>(false);

  const signIn = () => {
    setWaiting(true);

    login()
      .catch((error) => {
        console.error(error?.code);
      })
      .finally(() => {
        setWaiting(false);
      });
  };

  return (
    <>
      {user === null && !waiting && <Button onClick={signIn}>ログイン</Button>}
      {user && <Button>ユーザーメニュー</Button>}
      {user && <CardUser />}
    </>
  );
};
