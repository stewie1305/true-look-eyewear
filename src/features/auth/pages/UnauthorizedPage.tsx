import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { ShieldAlert, LogIn, Home } from "lucide-react";
import { Link } from "react-router";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-background via-muted/20 to-background flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl border-border/50 shadow-2xl">
        <CardHeader className="text-center space-y-6 pt-12">
          <div className="mx-auto h-24 w-24 rounded-full bg-destructive/10 flex items-center justify-center">
            <ShieldAlert className="h-12 w-12 text-destructive" />
          </div>
          <div className="space-y-3">
            <CardTitle className="text-4xl font-black">
              Unauthorized Access
            </CardTitle>
            <CardDescription className="text-lg">
              You don't have permission to view this page. Please log in with
              the appropriate credentials.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pb-12 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button size="lg" className="gap-2 w-full sm:w-auto">
                <LogIn className="h-5 w-5" />
                Log In
              </Button>
            </Link>
            <Link to="/">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 w-full sm:w-auto"
              >
                <Home className="h-5 w-5" />
                Go Home
              </Button>
            </Link>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            Need help?{" "}
            <Link
              to="/contact"
              className="text-primary hover:underline font-semibold"
            >
              Contact support
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
