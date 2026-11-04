"use client";

import { useState, FormEvent, useRef } from "react";
import { Link, router, useForm } from "@inertiajs/react";
import Icon from "../../Components/Icon";

type Intent = "owner" | "customer";
type Stage = "phone" | "code";

export default function Login() {
  const urlParams = new URLSearchParams(window.location.search);
  const intent = (urlParams.get("intent") as Intent) ?? "customer";
  const returnTo = urlParams.get("returnTo") ?? "/";
  const { data, setData, post, processing, errors, reset } = useForm({
    phone: "",
    code: "",
    purpose: intent === "owner" ? "owner_login" : "customer_login",
  });

  const [stage, setStage] = useState<Stage>("phone");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const challengeIdRef = useRef("");
  const { redirect } = urlParams.get("redirect")
    ? { redirect: urlParams.get("redirect") as string }
    : { redirect: null };

  const normalizeInput = (value: string) =>
    value.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));

  const validatePhone = (p: string) => {
    const normalized = normalizeInput(p).replace(/[^0-9]/g, "");
    return /^09\d{9}$/.test(normalized);
  };

  const isLocalRedirect = (path: string | null): boolean => {
    if (!path) return false;
    return path.startsWith("/") && !path.startsWith("//");
  };

  const defaultTarget = "/appointments";
  const target = isLocalRedirect(redirect) ? redirect! : defaultTarget;

  const startResendCountdown = (resendAt: string) => {
    const targetTime = new Date(resendAt).getTime();
    const tick = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.ceil((targetTime - now) / 1000));
      setResendCooldown(diff);
      if (diff > 0) setTimeout(tick, 1000);
    };
    tick();
  };

  const getXsrfToken = (): string => {
    const match = document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : "";
  };

  const handlePhoneSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!validatePhone(data.phone)) {
      setError("شماره موبایل معتبر وارد کنید (مثال: 09123456789)");
      return;
    }
    setLoading(true);
    const normalizedPhone = normalizeInput(data.phone).replace(/[^0-9]/g, "");
    const purpose = intent === "owner" ? "owner_login" : "customer_login";
    try {
      const res = await fetch("/api/auth/otp/request", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-XSRF-TOKEN": getXsrfToken(),
        },
        body: JSON.stringify({ phone: normalizedPhone, purpose }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error?.message ?? "خطا در ارسال کد");
        setLoading(false);
        return;
      }
      challengeIdRef.current = data.challenge_id;
      setStage("code");
      startResendCountdown(data.expires_at);
    } catch {
      setError("خطای شبکه. دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    const normalizedCode = normalizeInput(data.code);
    if (!/^\d{6}$/.test(normalizedCode)) {
      setError("کد شش‌رقمی وارد کنید");
      return;
    }
    setLoading(true);
    const phoneVal = normalizeInput(data.phone).replace(/[^0-9]/g, "");
    const purpose = intent === "owner" ? "owner_login" : "customer_login";
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-XSRF-TOKEN": getXsrfToken(),
        },
        body: JSON.stringify({ challenge_id: challengeIdRef.current, code: normalizedCode, phone: phoneVal, purpose }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error?.message ?? "کد نامعتبر یا منقضی شده");
        setLoading(false);
        return;
      }
      router.visit(target);
    } catch {
      setError("خطای شبکه. دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setLoading(true);
    const purpose = intent === "owner" ? "owner_login" : "customer_login";
    try {
      const res = await fetch("/api/auth/otp/request", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-XSRF-TOKEN": getXsrfToken(),
        },
        body: JSON.stringify({ phone: data.phone, purpose }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error?.message ?? "خطا در ارسال مجدد");
        return;
      }
      challengeIdRef.current = data.challenge_id;
      startResendCountdown(data.expires_at);
    } catch {
      setError("خطای شبکه. دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  const isOwner = intent === "owner";
  const title = isOwner ? "ورود مالک" : "ورود مشتری";
  const subtitle = isOwner
    ? "برای مدیریت کسب‌وکار خود وارد شوید"
    : "برای مشاهده نوبت‌های خود وارد شوید";

  return (
    <div className="nail-page login-page">
      <div className="login-illustration">
        <Icon name={isOwner ? "home" : "mobile"} size={48} />
      </div>
      <h1>{stage === "phone" ? title : "کد تأیید را وارد کنید"}</h1>
      <p>
        {stage === "phone" ? (
          subtitle
        ) : (
          <>
            کد شش‌رقمی به شماره <b dir="ltr">{data.phone}</b> ارسال شد
          </>
        )}
      </p>
      {error && <p role="alert" className="form-error">{error}</p>}
      {stage === "phone" ? (
        <form onSubmit={handlePhoneSubmit}>
          <label htmlFor="login-phone">شماره موبایل</label>
          <div className="input-with-icon">
            <Icon name="mobile" />
            <input
              id="login-phone"
              dir="ltr"
              inputMode="tel"
              autoComplete="tel"
              placeholder="09123456789"
              value={data.phone}
              onChange={(e) => setData("phone", e.target.value)}
              required
              disabled={loading}
              autoFocus
            />
          </div>
          <button type="submit" className="button rose full" disabled={loading}>
            {loading ? "در حال ارسال..." : "ارسال کد"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleCodeSubmit}>
          <label htmlFor="login-code">کد تایید</label>
          <div className="input-with-icon">
            <Icon name="mobile" />
            <input
              id="login-code"
              dir="ltr"
              inputMode="numeric"
              placeholder="123456"
              value={data.code}
              onChange={(e) => setData("code", e.target.value)}
              required
              disabled={loading}
              maxLength={6}
              autoFocus
            />
          </div>
          <button type="submit" className="button rose full" disabled={loading}>
            {loading ? "در حال تأیید..." : "تأیید و ورود"}
          </button>
          <button
            type="button"
            className="button rose-outline full"
            onClick={handleResend}
            disabled={loading || resendCooldown > 0}
          >
            {resendCooldown > 0 ? `ارسال مجدد (${resendCooldown}s)` : "ارسال مجدد"}
          </button>
        </form>
      )}
      <p>
        <Link href="/">← بازگشت به صفحه اصلی</Link>
      </p>
    </div>
  );
}
