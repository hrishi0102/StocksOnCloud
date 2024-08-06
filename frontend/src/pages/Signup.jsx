import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { InputBox } from "../components/InputBox";

export const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [text, setText] = useState("**Navigation**: The first new name is dj\n1.)**starting**: new line");
  
  const navigate = useNavigate();
  return (
    <div className="bg-black h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <div className="font-bold text-4xl pt-6">Register Now</div>
          <div className="text-slate-500 text-md pt-1 px-4 pb-4">
            Enter your credentials to access your account
          </div>
          <pre>{text}</pre>
          <InputBox
            onChange={(e) => {
              setName(e.target.value);
            }}
            placeholder="John Deer"
            label={"Name"}
          />
          <InputBox
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="test@gmail.com"
            label={"Email"}
          />
          <InputBox
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="123456"
            label={"Password"}
          />
          <div className="pt-4">
            <Button
              onClick={async () => {
                const response = await axios.post(
                  "http://127.0.0.1:5000/register",
                  {
                    name,
                    email,
                    password,
                  }
                );
                console.log(response);
                console.log(response.data);
                if (response.data) {
                  navigate("/signin");
                }
                // localStorage.setItem("token", response.data.token);
              }}
              label={"Register"}
            />
          </div>
          <BottomWarning
            label={"Already have an account?"}
            buttonText={"Sign in"}
            to={"/signin"}
          />
        </div>
      </div>
    </div>
  );
};
