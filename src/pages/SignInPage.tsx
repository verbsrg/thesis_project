import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

type FormFields = {
  email: string;
  password: string;
};

const DOMAIN = "@vse.cz";

export default function SignIn() {
  const {
    register,
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

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError("root", {
        message: error.message,
      });
    } else {
      toast({
        title: "Přihlášení",
        description: "Úspěšně jste se přihlásili.",
        variant: "success",
      });
      navigate("/learn");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl mt-4">Přihlášení</h1>
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
          <div className="text-sm text-red-500">{errors.email.message}</div>
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
          <div className="text-sm text-red-500">{errors.password.message}</div>
        )}
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? "Náčítaní..." : "Příhlasit se"}
        </Button>
      </form>
      {errors.root && (
        <div className="text-red-500 mt-2">{errors.root.message}</div>
      )}
      <div className="flex flex-col mt-2 text-center">
        <Link to="/forgot-password" className="underline">
          Nepamatuju si heslo
        </Link>
        <p className="mt-2">Nemáte účet? </p>
        <Link to="/signup" className="underline">
          Zaregistrujte se
        </Link>
      </div>
    </div>
  );
}
