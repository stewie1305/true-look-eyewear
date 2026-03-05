import { UserLayout } from "@/shared/layouts/UserLayout";
import { createBrowserRouter } from "react-router-dom";
// import MainLayout from "./components/layouts/MainLayout";
import HomePage from "@/features/landing/pages/HomePage";
import LoginPage from "@/features/auth/pages/LoginPage";
import { GuestRoute } from "@/shared/components/common/GuestRoute";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import { ProtectedRoute } from "@/shared/components/common/ProtectedRoute";
import AdminLayout from "@/shared/layouts/AdminLayout";
import UnauthorizedPage from "@/features/auth/pages/UnauthorizedPage";
import ProfilePage from "@/features/auth/pages/ProfilePage";
import NotFoundPage from "@/features/auth/pages/NotFoundPage";
import DashboardPage from "@/features/dashboards/pages/DashBoardPage";
import UserManagementPage from "@/features/users/pages/UserManagementPage";
import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage";
import { ProductsCatalog } from "@/features/products/pages/ProductsCatalog";
import { ProductDetail } from "@/features/products/pages/ProductDetail";
import ManageProductList from "@/features/products/pages/ManageProductList";
import ManageProductCreate from "@/features/products/pages/ManageProductCreate";
import ManageProductEdit from "@/features/products/pages/ManageProductEdit";
import ManageBrandList from "@/features/brands/pages/ManageBrandList";
import ManageBrandCreate from "@/features/brands/pages/ManageBrandCreate";
import ManageBrandEdit from "@/features/brands/pages/ManageBrandEdit";
import CartPage from "@/features/cart/pages/CartPage";
import ManageCategoryList from "@/features/categories/pages/ManageCategoryList";
import ManageCategoryCreate from "@/features/categories/pages/ManageCategoryCreate";
import ManageCategoryEdit from "@/features/categories/pages/ManageCategoryEdit";
import ManageFrameSpecList from "@/features/FrameSpecs/pages/ManageFrameSpecList";
import ManageFrameSpecCreate from "@/features/FrameSpecs/pages/ManageFrameSpecCreate";
import ManageFrameSpecEdit from "@/features/FrameSpecs/pages/ManageFrameSpecEdit";
import ManageRxLensSpecList from "@/features/RxLenSpecs/pages/ManageRxLensSpecList";
import ManageRxLensSpecCreate from "@/features/RxLenSpecs/pages/ManageRxLensSpecCreate";
import ManageRxLensSpecEdit from "@/features/RxLenSpecs/pages/ManageRxLensSpecEdit";
//1. Su dung createBrowserRouter - API moi nhat cua v6
export const router = createBrowserRouter([
  //Public layout (User)
  {
    element: <UserLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "products", element: <ProductsCatalog /> },
      { path: "products/:id", element: <ProductDetail /> },
      {
        path: "cart",
        element: (
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "login",
        element: (
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        ),
      },
      {
        path: "register",
        element: (
          <GuestRoute>
            <RegisterPage />
          </GuestRoute>
        ),
      },
      {
        path: "forgot-password",
        element: (
          <GuestRoute>
            <ForgotPasswordPage />
          </GuestRoute>
        ),
      },
      { path: "unauthorized", element: <UnauthorizedPage /> },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      //404 fallback
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  //Admin Layout (Admin)
  {
    path: "admin",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "users", element: <UserManagementPage /> },
      { path: "products", element: <ManageProductList /> },
      { path: "products/create", element: <ManageProductCreate /> },
      { path: "products/:id", element: <ManageProductEdit /> },
      { path: "brands", element: <ManageBrandList /> },
      { path: "brands/create", element: <ManageBrandCreate /> },
      { path: "brands/:id", element: <ManageBrandEdit /> },
      { path: "categories", element: <ManageCategoryList /> },
      { path: "categories/create", element: <ManageCategoryCreate /> },
      { path: "categories/:id", element: <ManageCategoryEdit /> },
      { path: "frame-specs", element: <ManageFrameSpecList /> },
      { path: "frame-specs/create", element: <ManageFrameSpecCreate /> },
      { path: "frame-specs/:id", element: <ManageFrameSpecEdit /> },
      { path: "rx-lens-specs", element: <ManageRxLensSpecList /> },
      { path: "rx-lens-specs/create", element: <ManageRxLensSpecCreate /> },
      { path: "rx-lens-specs/:id", element: <ManageRxLensSpecEdit /> },
    ],
  },
]);
