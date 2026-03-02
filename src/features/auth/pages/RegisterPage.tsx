import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { RegisterForm } from "../components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-background via-muted/30 to-background p-4">
      <Card className="w-full max-w-md shadow-2xl border-border/50">
        <CardHeader className="text-center space-y-3">
          <CardTitle className="text-4xl font-black tracking-tight">
            Create Account
          </CardTitle>
          <CardDescription className="text-base">
            Join True Look and find your perfect eyewear
          </CardDescription>
        </CardHeader>

        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </div>
  );
}
