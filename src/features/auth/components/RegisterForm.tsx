import { useForm } from "react-hook-form";
import { useRegisterMutation } from "../hooks/useAuthMutation";
import {
  registerSchema,
  type RegisterFormInput,
  type RegisterSchemaType,
} from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

export function RegisterForm() {
  //React query mutation
  const registerMutation = useRegisterMutation();

  const {
    register, // Function de dang ki input vs RHF
    handleSubmit, // wrapper cho submit handler
    formState: {
      errors, // object chua validation error tu zod
      isSubmitting,
    },
  } = useForm<RegisterFormInput>({
    mode: "onTouched",
    //OnSubmit
    //OnChange
    //onBlur
    //onTouched

    //resolver
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      gender: undefined,
      birthday: undefined,
    },
  });

  //onSubmit
  const onSubmit = async (data: RegisterSchemaType) => {
    registerMutation.mutate(data);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          type="text"
          placeholder="khachhang01"
          {...register("username")}
          className={errors.username ? "border-destructive" : ""}
          required
        />
        {errors.username && (
          <p className="text-destructive text-xs">{errors.username.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="fullName">Full name</Label>
        <Input
          id="fullName"
          type="text"
          placeholder="Nguyễn Văn A"
          {...register("fullName")}
          className={errors.fullName ? "border-destructive" : ""}
          required
        />
        {errors.fullName && (
          <p className="text-destructive text-xs">{errors.fullName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="example@gmail.com"
          {...register("email")}
          className={errors.email ? "border-destructive" : ""}
          required
        />
        {errors.email && (
          <p className="text-destructive text-xs">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          {...register("password")}
          className={errors.password ? "border-destructive" : ""}
          required
        />
        {errors.password && (
          <p className="text-destructive text-xs">{errors.password.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          {...register("confirmPassword")}
          className={errors.confirmPassword ? "border-destructive" : ""}
        />
        {errors.confirmPassword && (
          <p className="text-destructive text-xs">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>
      {/* GENDER */}
      <div className="space-y-2">
        <Label htmlFor="gender">Giới tính</Label>
        <select
          id="gender"
          {...register("gender")}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="">Chọn giới tính</option>
          <option value="M">Nam</option>
          <option value="F">Nữ</option>
        </select>
        {errors.gender && (
          <p className="text-destructive text-xs">{errors.gender.message}</p>
        )}
      </div>
      {/* BIRTHDAY */}
      <div className="space-y-2">
        <Label htmlFor="birthday">Ngày sinh</Label>
        <Input id="birthday" type="date" {...register("birthday")} />
        {errors.birthday && (
          <p className="text-destructive text-xs">{errors.birthday.message}</p>
        )}
      </div>
      <Button
        type="submit"
        className="w-full flex items-center justify-center"
        disabled={registerMutation.isPending || isSubmitting}
      >
        {registerMutation.isPending || isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Đang đăng ký...
          </>
        ) : (
          "Register"
        )}
      </Button>

      <div className="text-center text-sm">
        <span className="text-muted-foreground">Đã có tài khoản? </span>
        <Link to="/login" className="text-primary hover:underline font-medium">
          Đăng nhập
        </Link>
      </div>
    </form>
  );
}
