"use client";

import { useState, FormEvent, useRef } from "react";
import { Link } from "@inertiajs/react";
import Icon from "../../Components/Icon";

type Intent = "owner" | "customer";
type Stage = "phone" | "code";

export default function Login() {
  const urlParams = new URLSearchParams(window.location.search);
  const intent = (urlParams.get("intent") as Intent) ?? "customer";
  const returnTo = urlParams.get("returnTo") ?? "/";

  const [stage, setStage] = useState<Stage>("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const challengeIdRef = useRef("");

  const normalizeInput = (value: string) =>
    value.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));

  const validatePhone = (p: string) => {
    const normalized = normalizeInput(p).replace(/[^0-9]/g, "");
    return /^09\d{9}$/.test(normalized);
  };

  const startResendCountdown = (resendAt: string) => {
    const target = new Date(resendAt).getTime();
    const tick = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.ceil((target - now) / 1000));
      setResendCooldown(diff);
      if (diff > 0) setTimeout(tick, 1000);
    };
    tick();
  };

  const handlePhoneSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!validatePhone(phone)) {
      setError("شماره موبایل معتبر وارد کنید (مثال: 09123456789)");
      return;
    }
    setLoading(true);
    const normalizedPhone = normalizeInput(phone).replace(/[^0-9]/g, "");
    const purpose = intent === "owner" ? "owner_login" : "customer_login";
    try {
      const res = await fetch("/api/auth/otp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalizedPhone, purpose }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error?.message ?? "خطا در ارسال کد");
        setLoading(false);
        return;
      }
      challengeIdRef.current = data.data.challengeId;
      setPhone(normalizedPhone);
      setStage("code");
      startResendCountdown(data.data.resendAt);
    } catch {
      setError("خطای شبکه. دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    const normalizedCode = normalizeInput(code);
    if (!/^\d{6}$/.test(normalizedCode)) {
      setError("کد شش‌رقمی وارد کنید");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challengeId: challengeIdRef.current, code: normalizedCode, phone: phone, purpose: intent === "owner" ? "owner_login" : "customer_login" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error?.message ?? "کد نامعتبر یا منقضی شده");
        setLoading(false);
        return;
      }
      // successful login – redirect
      window.location.href = data.data.redirectTo ?? returnTo;
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, purpose }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error?.message ?? "خطا در ارسال مجدد");
        return;
      }
      challengeIdRef.current = data.data.challengeId;
      startResendCountdown(data.data.resendAt);
    } catch {
      setError("خطای شبکه. دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  const isOwner = intent === "owner";
  const title = isOwner ? "ورود مالک" : "ورود مشتری";
  const subtitle = isOwner ? "برای مدیریت کسب‌وکار خود وارد شوید" : "برای مشاهده نوبت‌های خود وارد شوید";

  return (
    <div className="nail-page login-page">
      <div className="login-illustration">
        <Icon name={isOwner ? "home" : "mobile"} size={48} />
      </div>
      <h1>{stage === "phone" ? title : "کد تأیید را وارد کنید"}</h1>
      <p>{stage === "phone" ? subtitle : <>کد شش‌رقمی به شماره <b dir="ltr">{phone}</b> ارسال شد</>}</p>
      {error && <p role="alert" className="form-error">{error}</p>}
      {stage === "phone" ? (
        <form onSubmit={handlePhoneSubmit}>
          <label htmlFor="login-phone">شماره موبایل</label>
          <div className="input-with-icon">
            <Icon name="mobile" />
            <input id="login-phone" dir="ltr" inputMode="tel" autoComplete="tel" placeholder="09123456789" value={phone} onChange={(e) => setPhone(e.target.value)} required disabled={loading} autoFocus />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>ارسال کد</button>
        </form>
      ) : (
        <form onSubmit={handleCodeSubmit}>
          <label htmlFor="login-code">کد تایید</label>
          <div className="input-with-icon">
            <Icon name="mobile" />
            <input id="login-code" dir="ltr" inputMode="numeric" placeholder="123456" value={code} onChange={(e) => setCode(e.target.value)} required disabled={loading} />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>تایید</button>
          <button type="button" className="btn-secondary" onClick={handleResend} disabled={loading || resendCooldown > 0}>
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
