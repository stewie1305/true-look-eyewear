import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginSchemaType } from "../schema";
import { useForm } from "react-hook-form";
import { useLoginMutation } from "../hooks/useAuthMutation";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

export function LoginForm() {
  const loginMutation = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchemaType>({
    mode: "onSubmit",
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const onSubmit = async (data: LoginSchemaType) => {
    loginMutation.mutate(data);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="username" className="text-sm font-semibold">Tên đăng nhập hoặc Email</Label>
        <Input
          id="username"
          type="text"
          placeholder="example@gmail.com"
          {...register("username")}
          className={`h-11 rounded-xl transition-all ${errors.username ? "border-destructive focus-visible:ring-destructive/30" : "border-border/60 hover:border-border/80 focus-visible:ring-primary/20"}`}
        />
        {errors.username && (
          <p className="text-xs text-destructive">{errors.username.message}</p>
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
        />
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
        
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" className="rounded border-border/50 text-primary focus:ring-primary/30 w-4 h-4 cursor-pointer" />
            <span className="text-sm text-muted-foreground select-none">Ghi nhớ đăng nhập</span>
          </label>
          <Link
            to="/forgot-password"
            className="text-sm text-primary hover:underline font-medium"
          >
            Quên mật khẩu?
          </Link>
        </div>
      </div>
      <Button
        type="submit"
        className="w-full h-11 rounded-xl text-base font-semibold transition-all hover:scale-[1.01] active:scale-[0.99] mt-2"
        disabled={loginMutation.isPending || isSubmitting}
      >
        {loginMutation.isPending || isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Đang đăng nhập...
          </>
        ) : (
          "Đăng nhập"
        )}
      </Button>
      <div className="text-center text-sm pt-2">
        <span className="text-muted-foreground">Chưa có tài khoản? </span>
        <Link
          to="/register"
          className="text-primary hover:underline font-medium"
        >
          Đăng kí ngay
        </Link>
      </div>
    </form>
  );
}
