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
import UserProfilePage from "@/features/users/pages/UserProfilePage";
import EditUserProfilePage from "@/features/users/pages/EditUserProfilePage";
import NotFoundPage from "@/features/auth/pages/NotFoundPage";
import DashboardPage from "@/features/dashboards/pages/DashBoardPage";
import ManageUserList from "@/features/users/pages/ManageUserList";
import ManageUserCreate from "@/features/users/pages/ManageUserCreate";
import ManageUserEdit from "@/features/users/pages/ManageUserEdit";
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

import ManageContactLensSpecList from "@/features/contactLensSpecs/pages/ManageContactLensSpecList";
import ManageContactLensSpecCreate from "@/features/contactLensSpecs/pages/ManageContactLensSpecCreate";
import ManageContactLensSpecEdit from "@/features/contactLensSpecs/pages/ManageContactLensSpecEdit";
import ManageFrameSpecList from "@/features/FrameSpecs/pages/ManageFrameSpecList";
import ManageFrameSpecCreate from "@/features/FrameSpecs/pages/ManageFrameSpecCreate";
import ManageFrameSpecEdit from "@/features/FrameSpecs/pages/ManageFrameSpecEdit";
import ManageRxLensSpecList from "@/features/RxLenSpecs/pages/ManageRxLensSpecList";
import ManageRxLensSpecCreate from "@/features/RxLenSpecs/pages/ManageRxLensSpecCreate";
import ManageRxLensSpecEdit from "@/features/RxLenSpecs/pages/ManageRxLensSpecEdit";
import { ManageContactLensAxisList } from "@/features/ContactLensAxis/pages/ManageContactLensAxisList";
import { ManageContactLensAxisCreate } from "@/features/ContactLensAxis/pages/ManageContactLensAxisCreate";
import { ManageContactLensAxisEdit } from "@/features/ContactLensAxis/pages/ManageContactLensAxisEdit";
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
            <UserProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile/edit",
        element: (
          <ProtectedRoute>
            <EditUserProfilePage />
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
      { path: "users", element: <ManageUserList /> },
      { path: "users/create", element: <ManageUserCreate /> },
      { path: "users/:id", element: <ManageUserEdit /> },
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
      { path: "contact-lens-specs", element: <ManageContactLensSpecList /> },
      {
        path: "contact-lens-specs/create",
        element: <ManageContactLensSpecCreate />,
      },
      {
        path: "contact-lens-specs/:id",
        element: <ManageContactLensSpecEdit />,
      },
      { path: "contact-lens-axis", element: <ManageContactLensAxisList /> },
      {
        path: "contact-lens-axis/create",
        element: <ManageContactLensAxisCreate />,
      },
      { path: "contact-lens-axis/:id", element: <ManageContactLensAxisEdit /> },
    ],
  },
]);
