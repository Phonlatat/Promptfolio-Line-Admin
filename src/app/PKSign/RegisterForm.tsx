"use client";

import { useActionState } from "react";
import { registerAdmin } from "./actions";

export default function RegisterForm() {
  const [state, action, pending] = useActionState(registerAdmin, null);

  return (
    <form action={action} className="flex flex-col gap-4">
      {state?.error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {state.error}
        </p>
      )}

      <div>
        <label htmlFor="username" className="mb-1.5 block text-xs font-medium text-stone-600">
          Username
        </label>
        <input
          id="username"
          name="username"
          required
          autoComplete="username"
          className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition-all focus:border-stone-400 focus:ring-2 focus:ring-stone-200"
        />
      </div>

      <div>
        <label htmlFor="displayName" className="mb-1.5 block text-xs font-medium text-stone-600">
          Display Name <span className="text-stone-400">(ไม่บังคับ)</span>
        </label>
        <input
          id="displayName"
          name="displayName"
          autoComplete="name"
          className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition-all focus:border-stone-400 focus:ring-2 focus:ring-stone-200"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-stone-600">
          Password <span className="text-stone-400">(อย่างน้อย 8 ตัวอักษร)</span>
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="new-password"
          className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition-all focus:border-stone-400 focus:ring-2 focus:ring-stone-200"
        />
      </div>

      <div>
        <label htmlFor="confirm" className="mb-1.5 block text-xs font-medium text-stone-600">
          Confirm Password
        </label>
        <input
          id="confirm"
          name="confirm"
          type="password"
          required
          autoComplete="new-password"
          className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition-all focus:border-stone-400 focus:ring-2 focus:ring-stone-200"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-1 rounded-lg bg-stone-900 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-stone-700 disabled:opacity-50"
      >
        {pending ? "กำลังสร้างบัญชี..." : "สร้างบัญชี Admin"}
      </button>
    </form>
  );
}
