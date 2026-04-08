import { motion } from "motion/react";
import { AlertCircle, Loader2, Network } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";

import { useUserStore } from "../../store/useUserStore";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function Register() {
  const navigate = useNavigate();
  const registerUser = useUserStore((state) => state.register);
  const error = useUserStore((state) => state.error);
  const isSubmitting = useUserStore((state) => state.isSubmitting);
  const clearError = useUserStore((state) => state.clearError);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    mode: "onBlur",
  });
  const password = watch("password");

  const onSubmit = async (data: RegisterFormData) => {
    clearError();

    try {
      await registerUser({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      });
      navigate("/tree");
    } catch {}
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2">
            <Network className="h-10 w-10 text-purple-600" />
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-2xl font-bold text-transparent">
              Родинне Дерево
            </span>
          </Link>
        </div>

        <Card className="overflow-hidden rounded-3xl border-0 shadow-2xl">
          <div className="h-2 bg-gradient-to-r from-purple-600 to-pink-600" />

          <CardHeader className="space-y-1 pt-8">
            <CardTitle className="text-center text-3xl">
              Створити акаунт
            </CardTitle>
            <CardDescription className="text-center text-base">
              Почніть будувати своє родинне дерево
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-5 px-8">
              <div className="min-h-[72px]">
                {error ? (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Alert variant="destructive" className="rounded-xl">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  </motion.div>
                ) : null}
              </div>

              <fieldset disabled={isSubmitting} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Ім'я</Label>
                    <Input
                      id="firstName"
                      placeholder="Іван"
                      className="h-11 rounded-xl disabled:cursor-not-allowed disabled:opacity-70"
                      {...register("firstName", {
                        required: "Ім'я обов'язкове",
                        minLength: {
                          value: 2,
                          message: "Мінімум 2 символи",
                        },
                      })}
                    />
                    <div className="min-h-4">
                      {errors.firstName ? (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-xs text-red-600"
                        >
                          {errors.firstName.message}
                        </motion.p>
                      ) : null}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Прізвище</Label>
                    <Input
                      id="lastName"
                      placeholder="Петренко"
                      className="h-11 rounded-xl disabled:cursor-not-allowed disabled:opacity-70"
                      {...register("lastName", {
                        required: "Прізвище обов'язкове",
                        minLength: {
                          value: 2,
                          message: "Мінімум 2 символи",
                        },
                      })}
                    />
                    <div className="min-h-4">
                      {errors.lastName ? (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-xs text-red-600"
                        >
                          {errors.lastName.message}
                        </motion.p>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className="h-11 rounded-xl disabled:cursor-not-allowed disabled:opacity-70"
                    {...register("email", {
                      required: "Email обов'язковий",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Невірний формат email",
                      },
                    })}
                  />
                  <div className="min-h-4">
                    {errors.email ? (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-red-600"
                      >
                        {errors.email.message}
                      </motion.p>
                    ) : null}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Пароль</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="h-11 rounded-xl disabled:cursor-not-allowed disabled:opacity-70"
                    {...register("password", {
                      required: "Пароль обов'язковий",
                      minLength: {
                        value: 6,
                        message: "Пароль повинен містити мінімум 6 символів",
                      },
                    })}
                  />
                  <div className="min-h-4">
                    {errors.password ? (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-red-600"
                      >
                        {errors.password.message}
                      </motion.p>
                    ) : null}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Підтвердіть пароль</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    className="h-11 rounded-xl disabled:cursor-not-allowed disabled:opacity-70"
                    {...register("confirmPassword", {
                      required: "Підтвердження паролю обов'язкове",
                      validate: (value) =>
                        value === password || "Паролі не співпадають",
                    })}
                  />
                  <div className="min-h-4">
                    {errors.confirmPassword ? (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-red-600"
                      >
                        {errors.confirmPassword.message}
                      </motion.p>
                    ) : null}
                  </div>
                </div>
              </fieldset>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 px-8 pb-8">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-11 w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-base font-medium hover:from-purple-700 hover:to-pink-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Створюємо акаунт...
                  </>
                ) : (
                  "Створити акаунт"
                )}
              </Button>

              <p className="text-center text-sm text-gray-600">
                Вже є акаунт?{" "}
                <Link
                  to="/login"
                  className="font-medium text-purple-600 hover:text-purple-700"
                >
                  Увійти
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
