import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import {
  BarChart3,
  Users,
  ShoppingBag,
  Eye,
  Package,
} from "lucide-react";
import { Link } from "react-router";

export default function DashboardPage() {
  const stats = [
    {
      title: "Total Products",
      value: "500+",
      icon: Package,
      description: "Eyewear collection",
      trend: "+12% from last month",
    },
    {
      title: "Active Users",
      value: "10K+",
      icon: Users,
      description: "Happy customers",
      trend: "+8% from last month",
    },
    {
      title: "Total Sales",
      value: "$45.2K",
      icon: ShoppingBag,
      description: "Revenue this month",
      trend: "+15% from last month",
    },
    {
      title: "Store Visits",
      value: "23K",
      icon: Eye,
      description: "Page views",
      trend: "+20% from last month",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-muted/20 to-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            Welcome back! Here's what's happening with your store today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className="border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                  <p className="text-xs text-primary font-semibold mt-2">
                    {stat.trend}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card className="border-border/50 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Quick Actions</CardTitle>
            <CardDescription>
              Manage your eyewear store efficiently
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/ritual">
              <Button
                variant="outline"
                className="w-full h-24 flex flex-col items-center justify-center gap-2 hover:bg-accent hover:border-primary transition-all"
              >
                <Package className="h-6 w-6" />
                <span className="font-semibold">Manage EyeWear</span>
              </Button>
            </Link>
            <Link to="/users">
              <Button
                variant="outline"
                className="w-full h-24 flex flex-col items-center justify-center gap-2 hover:bg-accent hover:border-primary transition-all"
              >
                <Users className="h-6 w-6" />
                <span className="font-semibold">View Customers</span>
              </Button>
            </Link>
            <Button
              variant="outline"
              className="w-full h-24 flex flex-col items-center justify-center gap-2 hover:bg-accent hover:border-primary transition-all"
            >
              <BarChart3 className="h-6 w-6" />
              <span className="font-semibold">View Analytics</span>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-border/50 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Recent Activity</CardTitle>
            <CardDescription>Latest updates from your store</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  text: "New order received for Classic Aviator",
                  time: "2 minutes ago",
                },
                {
                  text: "Product 'Round Vintage Frames' added",
                  time: "1 hour ago",
                },
                {
                  text: "Customer review posted for Blue Light Glasses",
                  time: "3 hours ago",
                },
                {
                  text: "Inventory updated for Sports Sunglasses",
                  time: "5 hours ago",
                },
              ].map((activity, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-3 border-b border-border/50 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span className="text-sm">{activity.text}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
