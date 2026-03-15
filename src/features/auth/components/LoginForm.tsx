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
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          type="text"
          placeholder="abc123"
          {...register("username")}
          className={errors.username ? "border-destructive" : ""}
        />
        {errors.username && (
          <p className="text-xs text-destructive">{errors.username.message}</p>
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
        />
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
        <div className="text-right">
          <Link
            to="/forgot-password"
            className="text-xs text-primary hover:underline"
          >
            Quên mật khẩu?
          </Link>
        </div>
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={loginMutation.isPending || isSubmitting}
      >
        {loginMutation.isPending || isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Đang đăng nhập...
          </>
        ) : (
          "Login"
        )}
      </Button>
      <div className="text-center text-sm">
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
