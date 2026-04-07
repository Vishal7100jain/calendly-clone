"use client";

import { useAuth } from "@/hooks/useAuth";
import { useFormik } from "formik";
import Link from "next/link";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

const loginSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "email must be a string",
    })
    .email("Invalid email address"),
  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "password must be a string",
    })
    .min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const { login, isLoading } = useAuth();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    enableReinitialize: true,
    validationSchema: toFormikValidationSchema(loginSchema),
    onSubmit: async (values, { setSubmitting }) => {
      await login(values);
      setSubmitting(false);
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          Welcome Back
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Login to manage your schedule
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            formik.handleSubmit(e);
          }}
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black ${
                  formik.touched.email && formik.errors.email
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black ${
                  formik.touched.password && formik.errors.password
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
