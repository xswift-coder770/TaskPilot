import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle2, XCircle, ArrowRight, Loader2 } from "lucide-react";
import { authApi } from "../../api/authApi";
import { getErrorMessage } from "../../utils/helpers";
import { BrandLogo } from "../../components/common/BrandLogo";

export default function VerifyEmail() {
  const { verificationToken } = useParams();
  const [status, setStatus] = useState("loading"); // "loading" | "success" | "error"
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      if (!verificationToken) {
        setStatus("error");
        setErrorMessage("Verification token is missing.");
        return;
      }

      try {
        await authApi.verifyEmail(verificationToken);
        setStatus("success");
      } catch (err) {
        setStatus("error");
        setErrorMessage(getErrorMessage(err));
      }
    };

    verify();
  }, [verificationToken]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-slate-950">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-lg dark:border-slate-800 dark:bg-slate-900">
        {/* Brand Header */}
        <div className="text-center">
          <div className="mb-2 flex justify-center">
            <BrandLogo to="/" />
          </div>
        </div>
        {status === "loading" && (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Verifying your email...
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Please wait while we validate your token.
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Email Verified Successfully!
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Your account is fully activated. You can now sign in to your
              workspace.
            </p>
            <Link
              to="/login"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 shadow-sm transition-colors"
            >
              <span>Continue to Sign In</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
              <XCircle className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Verification Failed
            </h2>
            <p className="text-xs text-rose-600 dark:text-rose-400">
              {errorMessage ||
                "The verification link is invalid or has expired."}
            </p>
            <div className="mt-4 flex w-full flex-col gap-2">
              <Link
                to="/login"
                className="inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 shadow-sm transition-colors"
              >
                Back to Sign In
              </Link>
              <Link
                to="/"
                className="inline-flex w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Go to Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
