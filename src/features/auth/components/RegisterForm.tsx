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
      <div className="space-y-1.5">
        <Label htmlFor="username" className="text-sm font-semibold">Tên đăng nhập</Label>
        <Input
          id="username"
          type="text"
          placeholder="khachhang01"
          {...register("username")}
          className={`h-11 rounded-xl transition-all ${errors.username ? "border-destructive focus-visible:ring-destructive/30" : "border-border/60 hover:border-border/80 focus-visible:ring-primary/20"}`}
          required
        />
        {errors.username && (
          <p className="text-destructive text-xs">{errors.username.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="fullName" className="text-sm font-semibold">Họ và tên</Label>
        <Input
          id="fullName"
          type="text"
          placeholder="Nguyễn Văn A"
          {...register("fullName")}
          className={`h-11 rounded-xl transition-all ${errors.fullName ? "border-destructive focus-visible:ring-destructive/30" : "border-border/60 hover:border-border/80 focus-visible:ring-primary/20"}`}
          required
        />
        {errors.fullName && (
          <p className="text-destructive text-xs">{errors.fullName.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-sm font-semibold">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="example@gmail.com"
          {...register("email")}
          className={`h-11 rounded-xl transition-all ${errors.email ? "border-destructive focus-visible:ring-destructive/30" : "border-border/60 hover:border-border/80 focus-visible:ring-primary/20"}`}
          required
        />
        {errors.email && (
          <p className="text-destructive text-xs">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password" className="text-sm font-semibold">Mật khẩu</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          {...register("password")}
          className={`h-11 rounded-xl transition-all ${errors.password ? "border-destructive focus-visible:ring-destructive/30" : "border-border/60 hover:border-border/80 focus-visible:ring-primary/20"}`}
          required
        />
        {errors.password && (
          <p className="text-destructive text-xs">{errors.password.message}</p>
        )}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword" className="text-sm font-semibold">Xác nhận mật khẩu</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          {...register("confirmPassword")}
          className={`h-11 rounded-xl transition-all ${errors.confirmPassword ? "border-destructive focus-visible:ring-destructive/30" : "border-border/60 hover:border-border/80 focus-visible:ring-primary/20"}`}
        />
        {errors.confirmPassword && (
          <p className="text-destructive text-xs">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>
      {/* GENDER */}
      <div className="space-y-1.5">
        <Label htmlFor="gender" className="text-sm font-semibold">Giới tính</Label>
        <select
          id="gender"
          {...register("gender")}
          className={`flex h-11 w-full rounded-xl border bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-0 transition-all ${errors.gender ? "border-destructive" : "border-border/60 hover:border-border/80"}`}
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
      <div className="space-y-1.5">
        <Label htmlFor="birthday" className="text-sm font-semibold">Ngày sinh</Label>
        <Input 
          id="birthday" 
          type="date" 
          {...register("birthday")} 
          className={`h-11 rounded-xl transition-all ${errors.birthday ? "border-destructive focus-visible:ring-destructive/30" : "border-border/60 hover:border-border/80 focus-visible:ring-primary/20"}`}
        />
        {errors.birthday && (
          <p className="text-destructive text-xs">{errors.birthday.message}</p>
        )}
      </div>
      <Button
        type="submit"
        className="w-full h-11 rounded-xl text-base font-semibold transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center mt-4"
        disabled={registerMutation.isPending || isSubmitting}
      >
        {registerMutation.isPending || isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Đang đăng ký...
          </>
        ) : (
          "Đăng ký"
        )}
      </Button>

      <div className="text-center text-sm pt-2">
        <span className="text-muted-foreground">Đã có tài khoản? </span>
        <Link to="/login" className="text-primary hover:underline font-medium">
          Đăng nhập ngay
        </Link>
      </div>
    </form>
  );
}
