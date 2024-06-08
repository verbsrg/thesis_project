import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

type FormFields = {
  email: string;
  password: string;
  passwordRepeat: string;
};

const DOMAIN = "@vse.cz";

export default function SignUp() {
  const {
    register,
    watch,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>();
  const { toast } = useToast();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FormFields> = async ({ email, password }) => {
    if (!email.includes("@")) {
      email += DOMAIN;
    } else {
      setError("email", {
        message: "Zadejte pouze xname!",
      });
      return;
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      setError("root", {
        message: error.message,
      });
    } else {
      toast({
        title: "Registrace",
        description:
          "Na vaši emailovou adresu byl zaslan jednorázový aktiváční kód",
        variant: "success",
      });
      navigate(`/verify-otp?type=signup&email=${email}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl mt-4">Registrace</h1>
      <Alert className="w-auto m-2">
        <AlertTitle className="flex">
          <AlertCircle className="h-4 w-4 mr-3" />
          Na zadanou adresu bude zaslán e-mail s jednorázovým kódem.
        </AlertTitle>
        <AlertDescription className="flex justify-center">
          Pokud zpravu nenajdete, podívejte se do spamu.
        </AlertDescription>
      </Alert>
      <form
        className="flex flex-col items-center justify-center w-64 mt-2 space-y-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex">
          <Input
            {...register("email", { required: "Zadejte xname" })}
            type="text"
            placeholder="xname"
            className="basis-2/3 rounded-r-none"
          />
          <Input
            disabled
            placeholder="@vse.cz"
            className="basis-1/3 rounded-l-none text-center disabled:opacity-100"
          />
        </div>
        {errors.email && (
          <div className="text-red-500">{errors.email.message}</div>
        )}
        <Input
          {...register("password", {
            required: "Zadejte heslo",
            minLength: {
              value: 8,
              message: "Heslo musí obsahovat min. 8 znaků",
            },
          })}
          type="password"
          placeholder="Heslo"
        />
        {errors.password && (
          <div className="text-red-500">{errors.password.message}</div>
        )}
        <Input
          {...register("passwordRepeat", {
            required: true,
            validate: (value: string) =>
              value === watch("password") || "Hesla se neshodují",
          })}
          type="password"
          placeholder="Zopakujte heslo"
        />
        {errors.passwordRepeat && (
          <div className="text-red-500">{errors.passwordRepeat.message}</div>
        )}
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? "Náčítaní..." : "Zaregistrovat se"}
        </Button>
      </form>
      {errors.root && <div className="text-red-500">{errors.root.message}</div>}
    </div>
  );
}
