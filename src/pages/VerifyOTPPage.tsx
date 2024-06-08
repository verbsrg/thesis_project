import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { supabase } from "@/lib/supabaseClient";
import { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

type FormFields = {
  otp: string;
};

export default function VerifyOTPPage() {
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get("type");
  const email = queryParams.get("email");

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>();

  useEffect(() => {
    if (!type || !email) {
      navigate("/");
    }
  }, [type, email, navigate]);

  const onSubmit: SubmitHandler<FormFields> = async ({ otp }) => {
    if (otp.length !== 6) {
      setError("otp", {
        message: "Jednorázový kód musí obsahovat 6 znaků",
      });
      return;
    }

    const { error } = await supabase.auth.verifyOtp({
      email: email!,
      token: otp,
      type: type as "recovery" | "signup",
    });

    if (error) {
      setError("root", {
        message: error.message,
      });
    } else if (type === "recovery") {
      navigate("/update-password");
    } else if (type === "signup") {
      navigate("/");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl mt-2">Zadejte jednorázový kód</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center justify-center space-y-4"
      >
        <Controller
          control={control}
          name="otp"
          render={({ field: { onChange, value } }) => (
            <InputOTP maxLength={6} value={value} onChange={onChange}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          )}
        />
        {errors.otp && (
          <p className="text-red-500 mt-2">{errors.otp.message}</p>
        )}
        {errors.root && (
          <p className="text-red-500 mt-2">{errors.root.message}</p>
        )}
        <Button type="submit" disabled={isSubmitting}>
          Potvrdit
        </Button>
      </form>
    </div>
  );
}
