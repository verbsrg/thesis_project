import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

type FormFields = {
  password: string;
  passwordRepeat: string;
};

export default function UpdatePassword() {
  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>();
  const { toast } = useToast();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FormFields> = async ({ password }) => {
    const { error } = await supabase.auth.updateUser({ password: password });
    if (error) {
      setError("root", {
        message: error.message,
      });
    } else {
      toast({
        title: "Obnovení hesla",
        description: "Heslo bylo uspěšně obnoveno.",
        variant: "success",
      });
      navigate("/learn");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl mt-4">Obnova hesla</h1>
      <form
        className="flex flex-col items-center justify-center w-64 mt-2 space-y-2"
        onSubmit={handleSubmit(onSubmit)}
      >
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
        {errors.root && (
          <div className="text-red-500 mt-2">{errors.root.message}</div>
        )}
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? "Náčítaní..." : "Obnovit heslo"}
        </Button>
      </form>
    </div>
  );
}
