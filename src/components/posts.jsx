import React, { useState, useEffect, useCallback } from "react";
import Cookies from "universal-cookie";
import Axios from "axios";

export default function Posts() {
  const [user, setUser] = useState();
  const makePost = async () => {
    await getVerification();
    if (user) {
      const cookies = new Cookies();
      cookies.get("user");
      if (cookies)
        Axios.post(
          "http://localhost:5000/blog",
          {
            thing: "test",
          },
          {
            headers: {
              auth: cookies["cookies"]["user"],
            },
          }
        );
    }
  };

  const getVerification = useCallback(async () => {
    const cookies = new Cookies();
    cookies.get("user");
    if (cookies) {
      Axios.post("http://localhost:5000/account/token", {
        authtoken: cookies["cookies"]["user"],
      }).then(function (result) {
        if (result.data === false) {
          cookies.remove("user");
          return setUser(null);
        }
        if (user != result.data) setUser(result.data);
      });
    } else {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    getVerification();
  }, []);

  return <>{user && <button onClick={makePost}>Hello</button>}</>;
}
