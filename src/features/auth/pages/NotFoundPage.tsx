import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Home, Search, ArrowLeft } from "lucide-react";
import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-background via-muted/20 to-background flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl border-border/50 shadow-2xl">
        <CardHeader className="text-center space-y-6 pt-12">
          <div className="mx-auto">
            <div className="text-9xl font-black text-primary/20">404</div>
          </div>
          <div className="space-y-3">
            <CardTitle className="text-4xl font-black">
              Page Not Found
            </CardTitle>
            <CardDescription className="text-lg">
              Oops! The page you're looking for doesn't exist or has been moved.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pb-12 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button size="lg" className="gap-2 w-full sm:w-auto">
                <Home className="h-5 w-5" />
                Go Home
              </Button>
            </Link>
            <Link to="/ritual">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 w-full sm:w-auto"
              >
                <Search className="h-5 w-5" />
                Browse EyeWear
              </Button>
            </Link>
          </div>
          <div className="text-center">
            <Button
              variant="link"
              onClick={() => window.history.back()}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Go back to previous page
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
