"use client";

import { useActionState, useEffect } from "react";
import Form from "next/form";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

type SignInProps = {
  action: (
    prevState: any,
    formData: FormData
  ) => Promise<{ message: string } | undefined>;
};

const initialState = {
  message: "",
};

const Signin = ({ action }: SignInProps) => {
  const [state, formAction, isPending] = useActionState(action, initialState);
  useEffect(() => {
    if(state?.message){
      toast.error(state.message);
    }
  },[state])
  return (
    <Form
      action={formAction}
      className="max-w-md mx-auto my-5 sm:my-10 p-8 bg-white rounded-lg shadow-md"
    >
      <h1 className="text-2xl font-bold text-center mb-2">
        Welcome Back!
      </h1>
      <p className="text-center text-sm text-rose-600 font-semibold mb-2">
        🔥 MEMBER EXCLUSIVE 🔥
      </p>
      <p className="text-center text-sm text-gray-600 mb-6">
        Sign in to access your exclusive member deals.
      </p>
      <div className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            autoComplete="email"
            required
            placeholder="Enter your email"
            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            autoComplete="new-password"
            required
            placeholder="Create a password"
            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
          />
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-2">
            ⚡ Members save an extra 15% on all orders!
          </p>
          <p className="text-xs text-gray-500 mb-4">
          🚛 Plug get free shipping on order over Rs. 300 
          </p>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className={`w-full bg-rose-600 text-white py-3 rounded-md hover:bg-rose-700 transition-colors font-medium flex items-center justify-center gap-2 ${
            isPending ? " cursor-not-allowed " : " "
          }`}
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> SIGNING IN...
            </>
          ) : (
            "SIGN IN"
          )}
        </button>
      </div>
    </Form>
  );
};

export default Signin;
