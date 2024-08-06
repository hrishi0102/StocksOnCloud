import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { InputBox } from "../components/InputBox";

export const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isUser, setIsUser] = useState(false);
  const navigate = useNavigate();

  //User successfully Log-in
  if (isUser) {
    return (
      <div className="bg-black h-screen flex justify-center">
        <div className="flex flex-col justify-center">
          <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
            <div className="font-bold text-4xl pt-6">OTP Verification</div>
            <div className="text-slate-500 text-md pt-1 px-4 pb-4">
              Enter OTP received on your Email
            </div>
            <InputBox
              onChange={(e) => {
                setOtp(e.target.value);
              }}
              placeholder="Enter OTP"
              label={"OTP"}
              value={otp}
            />
            <div className="pt-4">
              <Button
                onClick={async () => {
                  const response = await axios.post(
                    "http://127.0.0.1:5000/verifyOTP",
                    {
                      email,
                      otp,
                    }
                  );
                  if (response.data == true) {
                    localStorage.setItem("Email", email);
                    navigate("/home");
                  }
                }}
                label={"Verify"}
              />
            </div>
            <BottomWarning
              label={"Don't have an account?"}
              buttonText={"Sign up"}
              to={"/signup"}
            />
          </div>
        </div>
      </div>
    );
  }

  //User needs to signin
  else {
    return (
      <div className="bg-black h-screen flex justify-center">
        <div className="flex flex-col justify-center">
          <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
            <div className="font-bold text-4xl pt-6">Sign in</div>
            <div className="text-slate-500 text-md pt-1 px-4 pb-4">
              Enter your credentials to access your account
            </div>
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
                    "http://localhost:5000/login",
                    {
                      email,
                      password,
                    }
                  );
                  // localStorage.setItem("token", response.data.token);
                  if (response.data == true) {
                    setIsUser(true);
                    setOtp("");
                  }
                }}
                label={"Sign in"}
              />
            </div>
            <BottomWarning
              label={"Don't have an account?"}
              buttonText={"Sign up"}
              to={"/signup"}
            />
          </div>
        </div>
      </div>
    );
  }
};
