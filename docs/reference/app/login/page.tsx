"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Icon, { type IconName } from "@/components/icons";
import { fa } from "@/components/nail-context";

type Intent = "owner" | "customer";
type Stage = "phone" | "code";

interface LoginFormData {
  phone: string;
  code: string;
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const intent = (searchParams.get("intent") as Intent) || "customer";
  const returnTo = searchParams.get("returnTo") || "/";

  const [stage, setStage] = useState<Stage>("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const normalizeInput = (value: string) =>
    value.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));

  const validatePhone = (phone: string): boolean => {
    const normalized = normalizeInput(phone).replace(/[^0-9]/g, "");
    return /^09\d{9}$/.test(normalized);
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
        const msg = data.error?.fieldErrors?.phone?.[0] || data.error?.message || "خطا در ارسال کد";
        setError(msg);
        setLoading(false);
        return;
      }

      setStage("code");
      setPhone(normalizedPhone);
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
        body: JSON.stringify({ challengeId: challengeIdRef.current, code: normalizedCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg = data.error?.fieldErrors?.code?.[0] || data.error?.message || "کد نامعتبر یا منقضی شده";
        setError(msg);
        setLoading(false);
        return;
      }

      router.push(data.data.redirectTo);
      router.refresh();
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
        const msg = data.error?.fieldErrors?.phone?.[0] || data.error?.message || "خطا در ارسال مجدد";
        setError(msg);
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

  const challengeIdRef = { current: "" };

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

  const isOwner = intent === "owner";
  const title = isOwner ? "ورود مالک" : "ورود مشتری";
  const subtitle = isOwner
    ? "برای مدیریت کسب‌وکار خود وارد شوید"
    : "برای مشاهده نوبت‌های خود وارد شوید";

  return (
    <>
      <div className="nail-page login-page">
        <div className="login-illustration">
          <Icon name={isOwner ? "building" : "mobile"} size={48} />
        </div>
        <h1>{stage === "phone" ? title : "کد تأیید را وارد کنید"}</h1>
        <p>
          {stage === "phone" ? (
            subtitle
          ) : (
            <>
              کد شش‌رقمی به شماره <b dir="ltr">{fa(phone)}</b> ارسال شد
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
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                disabled={loading}
                autoFocus
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "در حال ارسال..." : "ارسال کد"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleCodeSubmit}>
            <label htmlFor="login-code">کد تأیید شش‌رقمی</label>
            <input
              id="login-code"
              dir="ltr"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="123456"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={6}
              required
              disabled={loading}
              autoFocus
            />
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "در حال تأیید..." : "تأیید و ورود"}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setStage("phone");
                setCode("");
                setError("");
              }}
            >
              تغییر شماره
            </button>
            <p className="resend-text">
              کد نیامد؟{" "}
              <button
                type="button"
                className="resend-link"
                onClick={handleResend}
                disabled={resendCooldown > 0 || loading}
              >
                {resendCooldown > 0 ? `ارسال مجدد در ${resendCooldown} ثانیه` : "ارسال مجدد کد"}
              </button>
            </p>
          </form>
        )}

        <p className="login-footer">
          <Link href="/">بازگشت به صفحه اصلی</Link>
        </p>
      </div>

      <style jsx>{`
        .nail-page.login-page {
          max-width: 400px;
          margin: 0 auto;
          padding: var(--space-6) var(--space-4);
          text-align: center;
        }
        .login-illustration {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: var(--color-surface);
          box-shadow: var(--shadow-soft);
          margin-bottom: var(--space-4);
          color: var(--color-accent);
        }
        .login-page h1 {
          margin: 0 0 var(--space-2);
          font-size: var(--text-2xl);
          color: var(--color-text);
        }
        .login-page > p {
          margin: 0 0 var(--space-6);
          color: var(--color-text-muted);
          font-size: var(--text-base);
          line-height: 1.6;
        }
        .form-error {
          color: var(--color-error);
          font-size: var(--text-sm);
          margin-bottom: var(--space-3);
          min-height: 1.2em;
        }
        label {
          display: block;
          text-align: right;
          font-weight: 500;
          margin-bottom: var(--space-1);
          color: var(--color-text);
        }
        .input-with-icon {
          position: relative;
          margin-bottom: var(--space-4);
        }
        .input-with-icon Icon {
          position: absolute;
          right: var(--space-3);
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-text-muted);
          pointer-events: none;
        }
        .input-with-icon input {
          width: 100%;
          padding: var(--space-3) var(--space-10) var(--space-3) var(--space-3);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          font-size: var(--text-base);
          background: var(--color-surface);
          color: var(--color-text);
          direction: ltr;
        }
        .input-with-icon input:focus {
          outline: none;
          border-color: var(--color-accent);
          box-shadow: 0 0 0 3px var(--color-accent-light);
        }
        .input-with-icon input:disabled {
          opacity: 0.6;
        }
        input[type="text"], input[type="tel"] {
          width: 100%;
          padding: var(--space-3);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          font-size: var(--text-base);
          background: var(--color-surface);
          color: var(--color-text);
          direction: ltr;
        }
        input[type="text"]:focus, input[type="tel"]:focus {
          outline: none;
          border-color: var(--color-accent);
          box-shadow: 0 0 0 3px var(--color-accent-light);
        }
        .btn-primary, .btn-secondary {
          width: 100%;
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-md);
          font-size: var(--text-base);
          font-weight: 600;
          margin-top: var(--space-2);
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-primary {
          background: var(--color-accent);
          color: white;
          border: none;
        }
        .btn-primary:hover:not(:disabled) {
          filter: brightness(1.05);
        }
        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .btn-secondary {
          background: transparent;
          color: var(--color-accent);
          border: 1px solid var(--color-accent);
        }
        .btn-secondary:hover:not(:disabled) {
          background: var(--color-accent-light);
        }
        .resend-text {
          margin-top: var(--space-4);
          font-size: var(--text-sm);
          color: var(--color-text-muted);
        }
        .resend-link {
          background: none;
          border: none;
          color: var(--color-accent);
          font-weight: 500;
          cursor: pointer;
          padding: 0;
        }
        .resend-link:disabled {
          color: var(--color-text-muted);
          cursor: not-allowed;
        }
        .login-footer {
          margin-top: var(--space-6);
          font-size: var(--text-sm);
        }
        .login-footer a {
          color: var(--color-accent);
          text-decoration: none;
        }
        .login-footer a:hover {
          text-decoration: underline;
        }
      `}</style>
    </>
  );
}