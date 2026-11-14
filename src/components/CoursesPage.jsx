import React, { useEffect, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { ArrowRight, BookOpen, CheckCircle2, CircleHelp, LockKeyhole, ShieldCheck, Sparkles } from 'lucide-react';
import { Navbar } from './Navbar';
import { useAuth } from './AuthContext';
import { apiRequest } from '../data/apiClient';
import './CoursesPage.css';
import './CoursesPageExtras.css';

function formatPrice(course) {
  if (course.has_subscription && course.subscription_price_paise) {
    const amount = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(course.subscription_price_paise / 100);
    return `${amount} / ${course.subscription_interval_count > 1 ? `${course.subscription_interval_count} ` : ''}${course.subscription_period}`;
  }
  if (course.price_minor === 0) return 'Free';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(course.price_minor / 100);
}

function loadRazorpayCheckout() {
  if (window.Razorpay) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-razorpay-checkout]');
    if (existing) {
      existing.addEventListener('load', resolve, { once: true });
      existing.addEventListener('error', reject, { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.dataset.razorpayCheckout = 'true';
    script.onload = resolve;
    script.onerror = () => reject(new Error('Could not load secure payment checkout. Check your connection and try again.'));
    document.body.appendChild(script);
  });
}

export function CoursesPage() {
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [course, setCourse] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const paymentStatus = searchParams.get('payment');
  const notice = paymentStatus === 'cancelled'
    ? 'Checkout was cancelled. No payment was taken.'
    : paymentStatus === 'processing'
      ? 'Payment submitted. Course access unlocks after Razorpay confirms it. If it does not appear soon, refresh this page.'
      : '';

  useEffect(() => {
    let mounted = true;
    async function load() {
      setError('');
      try {
        const data = await apiRequest('/api/courses/beginner-chess');
        if (mounted) setCourse(data.course);
        if (user) {
          const access = await apiRequest('/api/courses/beginner-chess/access');
          if (mounted) setEnrolled(access.enrolled);
        } else if (mounted) setEnrolled(false);
      } catch (loadError) {
        if (mounted) setError(loadError.message);
      }
    }
    if (!authLoading) load();
    return () => { mounted = false; };
  }, [user, authLoading]);

  async function enroll() {
    if (!user) return;
    setBusy(true);
    setError('');
    try {
      if (course.price_minor === 0 && !course.has_subscription) {
        await apiRequest('/api/payments/free-enrollment', { method: 'POST', body: { courseSlug: course.slug } });
        setEnrolled(true);
      } else {
        const checkout = await apiRequest('/api/payments/checkout', {
          method: 'POST',
          headers: { 'Idempotency-Key': crypto.randomUUID() },
          body: { courseSlug: course.slug, ...(couponCode.trim() ? { couponCode: couponCode.trim() } : {}) },
        });
        await loadRazorpayCheckout();
        const payment = new window.Razorpay({
          key: checkout.keyId,
          name: checkout.name,
          description: course.title,
          prefill: { name: user.name, email: user.email },
          theme: { color: '#2d8db5' },
          modal: { ondismiss: () => setBusy(false) },
          handler: () => window.location.assign('/courses?payment=processing'),
          ...(checkout.mode === 'subscription'
            ? { subscription_id: checkout.subscriptionId }
            : { amount: checkout.amount, currency: checkout.currency, order_id: checkout.orderId }),
        });
        payment.on('payment.failed', (event) => {
          setBusy(false);
          setError(event.error?.description || 'Payment did not complete. Please try again.');
        });
        payment.open();
      }
    } catch (enrollError) {
      setError(enrollError.message);
    } finally {
      setBusy(false);
    }
  }

  const loginState = { from: `${location.pathname}${location.search}` };
  return <div className="courses-page">
    <Navbar />
    <main className="courses-shell">
      <section className="courses-hero">
        <div className="courses-hero-copy">
          <span className="courses-eyebrow"><Sparkles size={15}/> YOUR NEXT CHESS ADVENTURE</span>
          <h1>Learn together.<br/><em>Think a move ahead.</em></h1>
          <p>A calm, step-by-step chess course for families. Learn the pieces, practice each idea on the board, and keep your progress as you go.</p>
          <div className="courses-trust"><span><ShieldCheck size={16}/> Secure course access</span><span><BookOpen size={16}/> Lessons, activities &amp; practice</span></div>
        </div>
        <div className="courses-art" aria-hidden="true"><div className="courses-mini-board">{Array.from({ length: 64 }, (_, i) => <i key={i}>{[10, 19, 28, 37, 46].includes(i) ? ['♟', '♞', '♝', '♜', '♛'][[10, 19, 28, 37, 46].indexOf(i)] : ''}</i>)}</div><span className="courses-float-tag tag-xp">✦ Small steps, big ideas</span><span className="courses-float-tag tag-piece">♞ Ready when you are</span></div>
      </section>

      <section className="course-offer" aria-labelledby="course-title">
        <div className="course-offer-heading"><span className="offer-icon"><BookOpen size={22}/></span><div><span className="courses-eyebrow">THE THINKING ACADEMY COURSE</span><h2 id="course-title">Beginner Chess</h2></div></div>
        {course ? <>
          <p className="course-description">{course.description}</p>
          <div className="course-facts"><span><CheckCircle2 size={16}/> 11 beginner learning units</span><span><CheckCircle2 size={16}/> Interactive piece practice</span><span><CheckCircle2 size={16}/> Activities and progress tracking</span></div>
          {course.price_minor > 0 && !course.has_subscription && <label className="course-coupon-field"><span>Discount code (optional)</span><input value={couponCode} onChange={(event) => setCouponCode(event.target.value.toUpperCase())} maxLength={32} placeholder="Enter a code" autoComplete="off"/></label>}
            <div className="course-buy-row"><div><span className="course-price">{formatPrice(course)}</span><small>{course.has_subscription ? 'Recurring course access' : 'One-time course enrollment'}</small></div>
            {enrolled
              ? <Link className="course-primary" to="/curriculum?view=player&unit=1&lecture=u1-l2&puzzle=1">Continue learning <ArrowRight size={17}/></Link>
              : user
                ? <button className="course-primary" onClick={enroll} disabled={busy}>{busy ? 'Preparing secure checkout…' : course.price_minor === 0 && !course.has_subscription ? 'Enroll in course' : 'Continue to secure checkout'} {!busy && <ArrowRight size={17}/>}</button>
                : <div className="course-auth-actions"><Link className="course-primary" to="/login" state={loginState}>Sign in to enroll <ArrowRight size={17}/></Link><Link className="course-signup" to="/signup" state={loginState}>Create an account</Link></div>}
          </div>
        </> : <div className="course-loading">{error ? <><p role="alert">{error}</p><button type="button" onClick={() => window.location.reload()}>Try again</button></> : 'Loading course details…'}</div>}
        {notice && <p className="course-notice" role="status">{notice}</p>}
        {error && course && <p className="course-inline-error" role="alert"><CircleHelp size={16}/>{error}</p>}
      </section>
      <section className="course-how"><div><span className="courses-eyebrow">BUILT FOR FAMILIES</span><h2>One clear step at a time.</h2></div><p>Sign in once, enroll securely, then move naturally between each lesson, its resources, and the practice board. Your access is checked by the academy whenever protected course content is requested.</p></section>
      <p className="course-security-note"><LockKeyhole size={14}/> Payments are handled by a secure payment provider. Card details are never collected by this site.</p>
    </main>
  </div>;
}
