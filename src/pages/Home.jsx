import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";

function login() {
  signInWithPopup(auth, provider).then((result) => {
    console.log("Logged in:", result.user);
  });
}
