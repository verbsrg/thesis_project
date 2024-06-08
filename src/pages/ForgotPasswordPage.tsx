import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

type FormFields = {
  email: string;
};

const DOMAIN = "@vse.cz";

export default function ForgotPassoword() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>();
  const { toast } = useToast();

  const onSubmit: SubmitHandler<FormFields> = async ({ email }) => {
    if (!email.includes("@")) {
      email += DOMAIN;
    } else {
      setError("email", {
        message: "Zadejte pouze xname!",
      });
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      setError("root", {
        message: error.message,
      });
    } else {
      toast({
        title: "Obnovení hesla",
        description:
          "Na váš e-mail byl zaslán jednorázový kód pro obnovení hesla.",
        variant: "success",
      });
      navigate(`/verify-otp?type=recovery&email=${email}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl mt-4">Zapomenuté heslo</h1>
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
        {errors.root && (
          <div className="text-red-500 mt-2">{errors.root.message}</div>
        )}
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? "Náčítaní..." : "Resetovat heslo"}
        </Button>
      </form>
    </div>
  );
}
