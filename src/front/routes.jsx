import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";

import { Users } from "./pages/Users";
import { CreateUser } from "./pages/CreateUser";
import { UpdateUser } from "./pages/UpdateUser";

import { Category } from "./pages/Category";
import { CreateCategory } from "./pages/CreateCategory";
import { UpdateCategory } from "./pages/UpdateCategory";

import { Products } from "./pages/Products";
import { CreateProducts } from "./pages/CreateProducts";
import { UpdateProducts } from "./pages/UpdateProducts";

import { ShoppingList } from "./pages/ShoppingList";
import { CreateShoppingList } from "./pages/CreateShoppingList";
import { UpdateShoppingList } from "./pages/UpdateShoppingList";

import Login from "./pages/Login";
import { AdminLogin } from "./pages/AdminLogin";

import { Admins } from "./pages/Admins";
import { CreateAdmin } from "./pages/CreateAdmin";
import { UpdateAdmin } from "./pages/UpdateAdmin";

import { Profile } from "./pages/Profile";

import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>}>

      {/* 🏠 HOME */}
      <Route index element={<Home />} />
      <Route path="single/:theId" element={<Single />} />
      <Route path="demo" element={<Demo />} />

      {/* 🔐 AUTH */}
      <Route path="login" element={<Login />} />
      <Route path="admin-login" element={<AdminLogin />} />

      {/* 🆕 REGISTER */}
      <Route path="register" element={<CreateUser />} />

      {/* 👤 USERS (ADMIN ONLY) */}
      <Route
        path="users"
        element={
          <ProtectedRoute roleRequired="admin">
            <Users />
          </ProtectedRoute>
        }
      />

      <Route
        path="users/create"
        element={
          <ProtectedRoute roleRequired="admin">
            <CreateUser />
          </ProtectedRoute>
        }
      />

      <Route
        path="users/edit/:id"
        element={
          <ProtectedRoute roleRequired="admin">
            <UpdateUser />
          </ProtectedRoute>
        }
      />

      {/* 🗂 CATEGORIES (ADMIN ONLY) */}
      <Route
        path="categories"
        element={
          <ProtectedRoute roleRequired="admin">
            <Category />
          </ProtectedRoute>
        }
      />

      <Route
        path="categories/create"
        element={
          <ProtectedRoute roleRequired="admin">
            <CreateCategory />
          </ProtectedRoute>
        }
      />

      <Route
        path="categories/edit/:id"
        element={
          <ProtectedRoute roleRequired="admin">
            <UpdateCategory />
          </ProtectedRoute>
        }
      />

      {/* 📦 PRODUCTS (ADMIN ONLY) */}
      <Route
        path="products"
        element={
          <ProtectedRoute roleRequired="admin">
            <Products />
          </ProtectedRoute>
        }
      />

      <Route
        path="products/create"
        element={
          <ProtectedRoute roleRequired="admin">
            <CreateProducts />
          </ProtectedRoute>
        }
      />

      <Route
        path="products/edit/:id"
        element={
          <ProtectedRoute roleRequired="admin">
            <UpdateProducts />
          </ProtectedRoute>
        }
      />

      {/* 🛒 SHOPPING LIST (USER ONLY) */}
      <Route
        path="lists"
        element={
          <ProtectedRoute roleRequired="user">
            <ShoppingList />
          </ProtectedRoute>
        }
      />

      <Route
        path="lists/create"
        element={
          <ProtectedRoute roleRequired="user">
            <CreateShoppingList />
          </ProtectedRoute>
        }
      />

      <Route
        path="lists/edit/:id"
        element={
          <ProtectedRoute roleRequired="user">
            <UpdateShoppingList />
          </ProtectedRoute>
        }
      />

      {/* 👑 ADMINS (ADMIN ONLY) */}
      <Route
        path="admins"
        element={
          <ProtectedRoute roleRequired="admin">
            <Admins />
          </ProtectedRoute>
        }
      />

      <Route
        path="admins/create"
        element={
          <ProtectedRoute roleRequired="admin">
            <CreateAdmin />
          </ProtectedRoute>
        }
      />

      <Route
        path="admins/edit/:id"
        element={
          <ProtectedRoute roleRequired="admin">
            <UpdateAdmin />
          </ProtectedRoute>
        }
      />

      {/* 👤 PROFILE (USER ONLY) */}
      <Route
        path="profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

    </Route>
  )
);