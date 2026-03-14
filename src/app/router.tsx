import { UserLayout } from "@/shared/layouts/UserLayout";
import { Navigate, createBrowserRouter } from "react-router-dom";
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
import SupersetPage from "@/features/dashboards/pages/SupersetPage";
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
import AddressPage from "@/features/address/pages/AddressPage";
import ManageFrameSpecList from "@/features/frameSpecs/pages/ManageFrameSpecList";
import ManageFrameSpecEdit from "@/features/frameSpecs/pages/ManageFrameSpecEdit";
import ManageFrameSpecCreate from "@/features/frameSpecs/pages/ManageFrameSpecCreate";
import ManageRxLensSpecList from "@/features/rxLenSpecs/pages/ManageRxLensSpecList";
import ManageRxLensSpecCreate from "@/features/rxLenSpecs/pages/ManageRxLensSpecCreate";
import ManageRxLensSpecEdit from "@/features/rxLenSpecs/pages/ManageRxLensSpecEdit";
import ManageUserRoleList from "@/features/user-roles/pages/ManageUserRoleList";
import { ManageContactLensAxisList } from "@/features/contactLensAxis/pages/ManageContactLensAxisList";
import { ManageContactLensAxisCreate } from "@/features/contactLensAxis/pages/ManageContactLensAxisCreate";
import { ManageContactLensAxisEdit } from "@/features/contactLensAxis/pages/ManageContactLensAxisEdit";
import ManagePromotionList from "@/features/promotions/pages/ManagePromotionList";
import ManagePromotionCreate from "@/features/promotions/pages/ManagePromotionCreate";
import ManagePromotionEdit from "@/features/promotions/pages/ManagePromotionEdit";
import ManageOrderList from "@/features/orders/pages/ManageOrderList";
import MyOrdersPage from "@/features/orders/pages/MyOrdersPage";
import OrderDetailPage from "@/features/orders/pages/OrderDetailPage";
import PaymentCheckoutPage from "@/features/payments/pages/PaymentCheckoutPage";
import PaymentFailedPage from "@/features/payments/pages/PaymentFailedPage";
import PaymentSuccessPage from "@/features/payments/pages/PaymentSuccessPage";
import ManageShippingCreateOrderPage from "@/features/shipping/pages/ManageShippingCreateOrderPage";
import ManageShippingLookupOrdersPage from "@/features/shipping/pages/ManageShippingLookupOrdersPage";
import SupportChatPage from "@/features/supports/pages/SupportChatPage";
import ManageSupportList from "@/features/supports/pages/ManageSupportList";
import ManageSupportChat from "@/features/supports/pages/ManageSupportChat";
import { ADMIN_PAGE_ACCESS, ADMIN_PANEL_ROLES } from "@/shared/constants/roles";
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
      {
        path: "addresses",
        element: (
          <ProtectedRoute>
            <AddressPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "orders",
        element: (
          <ProtectedRoute>
            <MyOrdersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "orders/:id",
        element: (
          <ProtectedRoute>
            <OrderDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "orders/:id/support",
        element: (
          <ProtectedRoute>
            <SupportChatPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "checkout",
        element: (
          <ProtectedRoute>
            <PaymentCheckoutPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "payments",
        element: (
          <ProtectedRoute>
            <PaymentCheckoutPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "payment-success",
        element: (
          <ProtectedRoute>
            <PaymentSuccessPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "payment-failed",
        element: (
          <ProtectedRoute>
            <PaymentFailedPage />
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
      <ProtectedRoute allowedRoles={ADMIN_PANEL_ROLES}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute allowedRoles={ADMIN_PAGE_ACCESS["/admin"]}>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "users",
        element: (
          <ProtectedRoute allowedRoles={ADMIN_PAGE_ACCESS["/admin/users"]}>
            <ManageUserList />
          </ProtectedRoute>
        ),
      },
      {
        path: "users/create",
        element: (
          <ProtectedRoute allowedRoles={ADMIN_PAGE_ACCESS["/admin/users"]}>
            <ManageUserCreate />
          </ProtectedRoute>
        ),
      },
      {
        path: "users/:id",
        element: (
          <ProtectedRoute allowedRoles={ADMIN_PAGE_ACCESS["/admin/users"]}>
            <ManageUserEdit />
          </ProtectedRoute>
        ),
      },
      {
        path: "superset",
        element: (
          <ProtectedRoute allowedRoles={ADMIN_PAGE_ACCESS["/admin/superset"]}>
            <SupersetPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "user-roles",
        element: (
          <ProtectedRoute allowedRoles={ADMIN_PAGE_ACCESS["/admin/user-roles"]}>
            <ManageUserRoleList />
          </ProtectedRoute>
        ),
      },
      {
        path: "products",
        element: (
          <ProtectedRoute allowedRoles={ADMIN_PAGE_ACCESS["/admin/products"]}>
            <ManageProductList />
          </ProtectedRoute>
        ),
      },
      {
        path: "products/create",
        element: (
          <ProtectedRoute allowedRoles={ADMIN_PAGE_ACCESS["/admin/products"]}>
            <ManageProductCreate />
          </ProtectedRoute>
        ),
      },
      {
        path: "products/:id",
        element: (
          <ProtectedRoute allowedRoles={ADMIN_PAGE_ACCESS["/admin/products"]}>
            <ManageProductEdit />
          </ProtectedRoute>
        ),
      },
      {
        path: "brands",
        element: (
          <ProtectedRoute allowedRoles={ADMIN_PAGE_ACCESS["/admin/brands"]}>
            <ManageBrandList />
          </ProtectedRoute>
        ),
      },
      {
        path: "brands/create",
        element: (
          <ProtectedRoute allowedRoles={ADMIN_PAGE_ACCESS["/admin/brands"]}>
            <ManageBrandCreate />
          </ProtectedRoute>
        ),
      },
      {
        path: "brands/:id",
        element: (
          <ProtectedRoute allowedRoles={ADMIN_PAGE_ACCESS["/admin/brands"]}>
            <ManageBrandEdit />
          </ProtectedRoute>
        ),
      },
      {
        path: "categories",
        element: (
          <ProtectedRoute allowedRoles={ADMIN_PAGE_ACCESS["/admin/categories"]}>
            <ManageCategoryList />
          </ProtectedRoute>
        ),
      },
      {
        path: "categories/create",
        element: (
          <ProtectedRoute allowedRoles={ADMIN_PAGE_ACCESS["/admin/categories"]}>
            <ManageCategoryCreate />
          </ProtectedRoute>
        ),
      },
      {
        path: "categories/:id",
        element: (
          <ProtectedRoute allowedRoles={ADMIN_PAGE_ACCESS["/admin/categories"]}>
            <ManageCategoryEdit />
          </ProtectedRoute>
        ),
      },
      {
        path: "frame-specs",
        element: (
          <ProtectedRoute
            allowedRoles={ADMIN_PAGE_ACCESS["/admin/frame-specs"]}
          >
            <ManageFrameSpecList />
          </ProtectedRoute>
        ),
      },
      {
        path: "frame-specs/create",
        element: (
          <ProtectedRoute
            allowedRoles={ADMIN_PAGE_ACCESS["/admin/frame-specs"]}
          >
            <ManageFrameSpecCreate />
          </ProtectedRoute>
        ),
      },
      {
        path: "frame-specs/:id",
        element: (
          <ProtectedRoute
            allowedRoles={ADMIN_PAGE_ACCESS["/admin/frame-specs"]}
          >
            <ManageFrameSpecEdit />
          </ProtectedRoute>
        ),
      },
      {
        path: "rx-lens-specs",
        element: (
          <ProtectedRoute
            allowedRoles={ADMIN_PAGE_ACCESS["/admin/rx-lens-specs"]}
          >
            <ManageRxLensSpecList />
          </ProtectedRoute>
        ),
      },
      {
        path: "rx-lens-specs/create",
        element: (
          <ProtectedRoute
            allowedRoles={ADMIN_PAGE_ACCESS["/admin/rx-lens-specs"]}
          >
            <ManageRxLensSpecCreate />
          </ProtectedRoute>
        ),
      },
      {
        path: "rx-lens-specs/:id",
        element: (
          <ProtectedRoute
            allowedRoles={ADMIN_PAGE_ACCESS["/admin/rx-lens-specs"]}
          >
            <ManageRxLensSpecEdit />
          </ProtectedRoute>
        ),
      },
      {
        path: "contact-lens-specs",
        element: (
          <ProtectedRoute
            allowedRoles={ADMIN_PAGE_ACCESS["/admin/contact-lens-specs"]}
          >
            <ManageContactLensSpecList />
          </ProtectedRoute>
        ),
      },
      {
        path: "contact-lens-specs/create",
        element: (
          <ProtectedRoute
            allowedRoles={ADMIN_PAGE_ACCESS["/admin/contact-lens-specs"]}
          >
            <ManageContactLensSpecCreate />
          </ProtectedRoute>
        ),
      },
      {
        path: "contact-lens-specs/:id",
        element: (
          <ProtectedRoute
            allowedRoles={ADMIN_PAGE_ACCESS["/admin/contact-lens-specs"]}
          >
            <ManageContactLensSpecEdit />
          </ProtectedRoute>
        ),
      },
      {
        path: "contact-lens-axis",
        element: (
          <ProtectedRoute
            allowedRoles={ADMIN_PAGE_ACCESS["/admin/contact-lens-axis"]}
          >
            <ManageContactLensAxisList />
          </ProtectedRoute>
        ),
      },
      {
        path: "contact-lens-axis/create",
        element: (
          <ProtectedRoute
            allowedRoles={ADMIN_PAGE_ACCESS["/admin/contact-lens-axis"]}
          >
            <ManageContactLensAxisCreate />
          </ProtectedRoute>
        ),
      },
      {
        path: "contact-lens-axis/:id",
        element: (
          <ProtectedRoute
            allowedRoles={ADMIN_PAGE_ACCESS["/admin/contact-lens-axis"]}
          >
            <ManageContactLensAxisEdit />
          </ProtectedRoute>
        ),
      },
      {
        path: "promotions",
        element: (
          <ProtectedRoute allowedRoles={ADMIN_PAGE_ACCESS["/admin/promotions"]}>
            <ManagePromotionList />
          </ProtectedRoute>
        ),
      },
      {
        path: "promotions/create",
        element: (
          <ProtectedRoute allowedRoles={ADMIN_PAGE_ACCESS["/admin/promotions"]}>
            <ManagePromotionCreate />
          </ProtectedRoute>
        ),
      },
      {
        path: "promotions/:id",
        element: (
          <ProtectedRoute allowedRoles={ADMIN_PAGE_ACCESS["/admin/promotions"]}>
            <ManagePromotionEdit />
          </ProtectedRoute>
        ),
      },
      {
        path: "orders",
        element: (
          <ProtectedRoute allowedRoles={ADMIN_PAGE_ACCESS["/admin/orders"]}>
            <ManageOrderList />
          </ProtectedRoute>
        ),
      },
      {
        path: "shipping-orders",
        element: (
          <ProtectedRoute
            allowedRoles={ADMIN_PAGE_ACCESS["/admin/shipping-orders"]}
          >
            <Navigate to="/admin/shipping-orders/create" replace />
        path: "support",
        element: (
          <ProtectedRoute allowedRoles={ADMIN_PAGE_ACCESS["/admin/support"]}>
            <ManageSupportList />
          </ProtectedRoute>
        ),
      },
      {
        path: "shipping-orders/create",
        element: (
          <ProtectedRoute
            allowedRoles={ADMIN_PAGE_ACCESS["/admin/shipping-orders"]}
          >
            <ManageShippingCreateOrderPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "shipping-orders/lookup",
        element: (
          <ProtectedRoute
            allowedRoles={ADMIN_PAGE_ACCESS["/admin/shipping-orders"]}
          >
            <ManageShippingLookupOrdersPage />
        path: "support/:ticketId",
        element: (
          <ProtectedRoute allowedRoles={ADMIN_PAGE_ACCESS["/admin/support"]}>
            <ManageSupportChat />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
