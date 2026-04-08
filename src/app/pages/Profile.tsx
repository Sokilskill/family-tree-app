import { useState } from "react";
import { motion } from "motion/react";
import { Camera, Loader2, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useUserStore } from "../../store/useUserStore";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
}

export function Profile() {
  const user = useUserStore((state) => state.user);
  const updateProfile = useUserStore((state) => state.updateProfile);
  const isSubmitting = useUserStore((state) => state.isSubmitting);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || "");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      avatar: user?.avatar || "",
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        avatar: avatarUrl,
      });

      toast.success("Профіль успішно оновлено!");
    } catch {}
  };

  const handleAvatarChange = () => {
    const seed = `${user?.email || "user"}-${Date.now()}`;
    setAvatarUrl(`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`);
  };

  const getInitials = () => {
    if (!user) return "UN";
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-4xl font-bold text-transparent">
            Налаштування профілю
          </h1>
          <p className="mb-8 text-gray-600">
            Керуйте своїм обліковим записом та персональними даними
          </p>

          <div className="grid gap-6">
            <Card className="overflow-hidden rounded-3xl border-0 shadow-xl">
              <div className="h-2 bg-gradient-to-r from-purple-600 to-pink-600" />
              <CardHeader>
                <CardTitle>Фото профілю</CardTitle>
                <CardDescription>
                  Оновити аватар, який буде використовуватися у вашому профілі.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-4 border-purple-100">
                    <AvatarImage src={avatarUrl} alt={user?.firstName} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-2xl text-white">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <button
                    type="button"
                    onClick={handleAvatarChange}
                    className="absolute bottom-0 right-0 rounded-full bg-purple-600 p-2 text-white shadow-lg transition-colors hover:bg-purple-700"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <div>
                  <p className="mb-2 text-sm text-gray-600">
                    Натисніть на іконку камери для зміни аватара
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAvatarChange}
                    className="rounded-full"
                  >
                    Змінити фото
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden rounded-3xl border-0 shadow-xl">
              <div className="h-2 bg-gradient-to-r from-purple-600 to-pink-600" />
              <CardHeader>
                <CardTitle>Персональна інформація</CardTitle>
                <CardDescription>Оновити свої особисті дані.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Ім'я</Label>
                      <Input
                        id="firstName"
                        className="h-11 rounded-xl"
                        {...register("firstName", {
                          required: "Ім'я обов'язкове",
                          minLength: {
                            value: 2,
                            message: "Мінімум 2 символи",
                          },
                        })}
                      />
                      <div className="min-h-5">
                        {errors.firstName ? (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-sm text-red-600"
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
                        className="h-11 rounded-xl"
                        {...register("lastName", {
                          required: "Прізвище обов'язкове",
                          minLength: {
                            value: 2,
                            message: "Мінімум 2 символи",
                          },
                        })}
                      />
                      <div className="min-h-5">
                        {errors.lastName ? (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-sm text-red-600"
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
                      disabled
                      className="h-11 rounded-xl bg-slate-50"
                      {...register("email", {
                        required: "Email обов'язковий",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Невірний формат email",
                        },
                      })}
                    />
                    <p className="text-xs text-gray-500">
                      Email береться з Firebase Auth і зараз доступний лише для
                      перегляду.
                    </p>
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Збереження...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Зберегти зміни
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="overflow-hidden rounded-3xl border-0 shadow-xl">
              <div className="h-2 bg-gradient-to-r from-purple-600 to-pink-600" />
              <CardHeader>
                <CardTitle>Інформація про акаунт</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between border-b border-gray-100 py-3">
                  <span className="text-gray-600">ID користувача</span>
                  <span className="font-mono text-sm text-gray-900">
                    {user?.id}
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray-100 py-3">
                  <span className="text-gray-600">Дата реєстрації</span>
                  <span className="text-gray-900">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("uk-UA")
                      : "-"}
                  </span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-gray-600">Статус акаунта</span>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                    Активний
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
