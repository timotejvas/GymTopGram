import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { SigninValidation } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Loader from "@/components/shared/Loader";
import { Link, useNavigate } from "react-router-dom";
import { useSignInAccount } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";

const SigninForm = () => {
  // ALERT
  const { toast } = useToast();

  // CONTEXT HOOK
  const { checkAuthUser } = useUserContext();

  // MUTATION HOOK - CREATE SESSION
  const { mutateAsync: signInAccount, isPending: isSigningIn } =
    useSignInAccount();

  const navigate = useNavigate();

  // 1. Define your form.
  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SigninValidation>) {
    const session = await signInAccount({
      email: values.email,
      password: values.password,
    });

    // CHECKING FOR SESSION
    if (!session) {
      return toast({
        title: " Pri prihlásení nastala chyba. Prosím skúsťe to znova",
      });
    }

    const isLoggedIn = await checkAuthUser();

    if (isLoggedIn) {
      form.reset();
      navigate("/");
    } else {
      return toast({
        title: " Pri prihlásení nastala chyba. Prosím skúsťe to znova",
      });
    }
  }

  return (
    <Form {...form}>
      <div className="w-[300px] sm:w-420 flex-center flex-col">
        <img src="/assets/images/logo.png" alt="logo" className="w-40" />

        <h2 className="h3-bold md:h2-bold pt-3  text-center">
          Prihlásťe sa do svojho účtu
        </h2>

        <p className="text-light-3 small-medium md:base-regular mt-2 text-center">
          Vitajte späť!, zadajte prosím svoje použivateľské údaje
        </p>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full mt-5"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Email</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Heslo</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="shad-button_primary">
            {isSigningIn ? (
              <div className="flex-center gap-2">
                <Loader /> Načítava sa
              </div>
            ) : (
              "Prihlásiť sa"
            )}
          </Button>
          <p className="text-small-regular text-light-2 text-center">
            Ešte nemáte účet?{" "}
            <Link
              to={"/sign-up"}
              className="text-primary-500 text-small-semibold ml-1"
            >
              Vytvoriť účet
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SigninForm;
