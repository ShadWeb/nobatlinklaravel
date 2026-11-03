import { Link } from '@inertiajs/react';
import Icon from '../Components/Icon';

export default function PreviewNail() {
  return (
    <div className="preview-nail" style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>قالب صورتی ناخن (Preview فقط)</h1>
      <p>این صفحه فقط برای پیش‌نمایش محلی است. ثبت واقعی نوبت انجام نمی‌شود.</p>
      <img src="/images/nails-hero.webp" alt="نقوش ناخن" style={{ maxWidth: '100%', height: 'auto' }} />
      <div style={{ marginTop: '1rem' }}>
        <Link href="/" className="button primary">بازگشت به صفحه اصلی</Link>
      </div>
    </div>
  );
}
