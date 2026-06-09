import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/shared/components/ui/card";
import { LoginForm } from "../components/LoginForm";
import truelookLogo from "@/shared/pictures/trueLookLogotachnen-removebg-preview.png";
export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/20 px-4">
      <Card className="w-full max-w-125 shadow-sm border border-border/40 rounded-3xl p-2 bg-card">
        <CardHeader className="text-center space-y-4 pt-8 pb-4">
          <div className="flex justify-center mb-6">
            <img
              src={truelookLogo}
              alt="True Look Logo"
              className="h-32 w-auto object-contain invert dark:invert-0 scale-125"
            />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">Chào mừng bạn quay trở lại!</h3>
            <CardDescription className="text-sm">
              Đăng nhập để tiếp tục khám phá thế giới kính mắt
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-8">
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
