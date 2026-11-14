import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, ArrowDownToLine, BookOpen, ChartNoAxesCombined, Check, ChevronDown, CircleAlert, CircleDollarSign, FilePlus2, GraduationCap, LayoutDashboard, LoaderCircle, LockKeyhole, Plus, Save, ShieldCheck, Tags, Trash2, UploadCloud, Users, Video, X } from 'lucide-react';
import { useAuth } from './AuthContext';
import { apiRequest } from '../data/apiClient';
import './AdminDashboard.css';
import './AdminDashboardExtras.css';
import './AdminDashboardProfessional.css';

const money = (paise = 0) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(paise || 0) / 100);
const messageFor = (error) => error instanceof Error ? error.message : 'Something went wrong. Please try again.';

export function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [tab, setTab] = useState('overview');
  const [courses, setCourses] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [detail, setDetail] = useState(null);
  const [orders, setOrders] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [users, setUsers] = useState([]);
  const [overview, setOverview] = useState(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const isAdmin = user?.role === 'admin';

  const loadBase = useCallback(async () => {
    if (!user || !['admin', 'instructor'].includes(user.role)) return;
    setLoading(true);
    setError('');
    try {
      const [courseData, adminData] = await Promise.all([
        apiRequest('/api/admin/courses'),
        user.role === 'admin' ? apiRequest('/api/admin/overview') : Promise.resolve(null),
      ]);
      setCourses(courseData.courses);
      setOverview(adminData);
      setSelectedId((current) => current && courseData.courses.some((course) => course.id === current) ? current : courseData.courses[0]?.id || '');
    } catch (loadError) { setError(messageFor(loadError)); }
    finally { setLoading(false); }
  }, [user]);

  const loadDetail = useCallback(async (id) => {
    if (!id) { setDetail(null); return; }
    try { setDetail(await apiRequest(`/api/admin/courses/${id}`)); }
    catch (loadError) { setError(messageFor(loadError)); }
  }, []);

  const loadCommerce = useCallback(async () => {
    if (!isAdmin) return;
    try {
      const [orderData, couponData, userData] = await Promise.all([
        apiRequest('/api/admin/orders'), apiRequest('/api/admin/coupons'), apiRequest('/api/admin/users'),
      ]);
      setOrders(orderData.orders); setCoupons(couponData.coupons); setUsers(userData.users);
    } catch (loadError) { setError(messageFor(loadError)); }
  }, [isAdmin]);

  useEffect(() => { if (!authLoading) void loadBase(); }, [authLoading, loadBase]);
  useEffect(() => { if (selectedId) void loadDetail(selectedId); }, [selectedId, loadDetail]);
  useEffect(() => { if (tab === 'commerce' || tab === 'team') void loadCommerce(); }, [tab, loadCommerce]);

  async function refresh() {
    await loadBase();
    if (tab === 'commerce' || tab === 'team') await loadCommerce();
    if (selectedId) await loadDetail(selectedId);
  }
  async function act(work, successMessage) {
    setBusy(true); setError(''); setNotice('');
    try { await work(); if (successMessage) setNotice(successMessage); }
    catch (actionError) { setError(messageFor(actionError)); }
    finally { setBusy(false); }
  }

  if (authLoading) return <main className="admin-state"><LoaderCircle className="admin-spin"/> Loading your account…</main>;
  if (!user) return <div className="admin-page"><AdminMasthead/><main className="admin-state"><LockKeyhole/><h1>Sign in to continue</h1><p>The instructor workspace is available to approved academy staff.</p><Link to="/login">Sign in</Link></main></div>;
  if (!['admin', 'instructor'].includes(user.role)) return <div className="admin-page"><AdminMasthead user={user}/><main className="admin-state"><ShieldCheck/><h1>Staff access only</h1><p>Your account doesn’t have an instructor or administrator role yet.</p><Link to="/">Back to the academy</Link></main></div>;

  return <div className="admin-page">
    <AdminMasthead user={user}/>
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-side-title"><span className="admin-mark">TA</span><div><b>Academy studio</b><small>COURSE ADMINISTRATION</small></div></div>
        <div className="admin-side-person"><span>{user.name.slice(0, 1).toUpperCase()}</span><div><b>{user.name}</b><small>{isAdmin ? 'Administrator' : 'Instructor'}</small></div></div>
        <nav aria-label="Administration sections">
          <button className={tab === 'overview' ? 'active' : ''} onClick={() => setTab('overview')}><LayoutDashboard size={17}/> Overview</button>
          <button className={tab === 'courses' ? 'active' : ''} onClick={() => setTab('courses')}><BookOpen size={17}/> Courses</button>
          {isAdmin && <>
            <button className={tab === 'commerce' ? 'active' : ''} onClick={() => setTab('commerce')}><CircleDollarSign size={17}/> Commerce</button>
            <button className={tab === 'team' ? 'active' : ''} onClick={() => setTab('team')}><Users size={17}/> Team</button>
          </>}
        </nav>
        <Link className="admin-back-link" to="/courses">← View learner course page</Link>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar"><div><span className="admin-kicker">THE THINKING ACADEMY</span><h1>{tab === 'overview' ? 'A clear view of learning' : tab === 'courses' ? 'Course studio' : tab === 'commerce' ? 'Sales & promotions' : 'People & permissions'}</h1><p>Manage the learning experience with the same care you teach it.</p></div><button type="button" className="admin-refresh" onClick={refresh} disabled={busy}><Activity size={16}/> Refresh</button></header>
        {error && <div className="admin-alert error" role="alert"><CircleAlert size={17}/>{error}<button onClick={() => setError('')} aria-label="Dismiss error"><X size={15}/></button></div>}
        {notice && <div className="admin-alert success" role="status"><Check size={17}/>{notice}<button onClick={() => setNotice('')} aria-label="Dismiss message"><X size={15}/></button></div>}

        {loading ? <div className="admin-loading"><LoaderCircle className="admin-spin"/> Loading your workspace…</div> : <>
          {tab === 'overview' && <Overview data={overview} courses={courses} onOpenCourses={() => setTab('courses')}/>}
          {tab === 'courses' && <CourseStudio courses={courses} selectedId={selectedId} setSelectedId={setSelectedId} detail={detail} isAdmin={isAdmin} busy={busy} act={act} refresh={refresh} loadDetail={loadDetail} setNotice={setNotice}/>}
          {tab === 'commerce' && isAdmin && <Commerce orders={orders} coupons={coupons} courses={courses} busy={busy} act={act} reload={loadCommerce}/>}
          {tab === 'team' && isAdmin && <Team users={users} courses={courses} busy={busy} act={act} reload={loadCommerce}/>}
        </>}
      </main>
    </div>
  </div>;
}

function AdminMasthead({ user }) {
  const { signOut } = useAuth();
  return <header className="admin-globalbar">
    <Link className="admin-global-brand" to="/admin"><span>TA</span><strong>The Thinking Academy <small>STAFF STUDIO</small></strong></Link>
    <div className="admin-global-actions"><Link to="/" className="admin-site-link">View learning site <ArrowDownToLine size={14}/></Link>{user && <><span className="admin-user-initial">{user.name.slice(0, 1).toUpperCase()}</span><span className="admin-user-name">{user.name}<small>{user.role === 'admin' ? 'Administrator' : 'Instructor'}</small></span><button type="button" onClick={signOut} className="admin-signout">Sign out</button></>}</div>
  </header>;
}

function Overview({ data, courses, onOpenCourses }) {
  const metrics = data?.metrics;
  const bars = useMemo(() => {
    const days = data?.activity?.slice(-14) || [];
    const max = Math.max(1, ...days.map((day) => Number(day.paid_orders)));
    return days.map((day) => ({ ...day, height: Math.max(6, Number(day.paid_orders) / max * 100) }));
  }, [data]);
  return <>
    <section className="admin-welcome"><div><span className="admin-welcome-pill"><ChartNoAxesCombined size={14}/> REAL LEARNER ACTIVITY</span><h2>Good work happens one lesson at a time.</h2><p>Here’s what’s happening across your courses. Counts update from enrolled learners and completed activities.</p></div><div className="admin-welcome-art" aria-hidden="true">♞<span>✦</span><i>♟</i></div></section>
    <section className="admin-metrics" aria-label="Platform metrics">
      <Metric label="Learners" value={metrics?.learners ?? '—'} icon={<Users size={18}/>} tone="blue"/>
      <Metric label="Active enrollments" value={metrics?.active_enrollments ?? '—'} icon={<GraduationCap size={18}/>} tone="green"/>
      <Metric label="Active learners (7d)" value={metrics?.active_learners_7d ?? '—'} icon={<Activity size={18}/>} tone="gold"/>
      <Metric label="Paid course revenue" value={metrics ? money(metrics.revenue_paise) : '—'} icon={<CircleDollarSign size={18}/>} tone="coral"/>
    </section>
    <div className="admin-overview-grid">
      <section className="admin-panel admin-chart-panel"><div className="admin-panel-head"><div><span className="admin-kicker">LAST 14 DAYS</span><h3>Course sales</h3></div><span className="admin-trend-label"><span/> Paid orders</span></div>
        {bars.length ? <div className="admin-bars" role="img" aria-label="Paid course orders over the last fourteen days">{bars.map((day) => <div className="admin-bar-col" key={String(day.day)} title={`${day.paid_orders} paid orders`}><i style={{ height: `${day.height}%` }}/><small>{new Date(day.day).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</small></div>)}</div> : <Empty text="Your daily sales trend will appear after the first paid enrollment."/>}
        <div className="admin-chart-foot"><span><b>{metrics?.paid_orders ?? 0}</b> successful orders</span><span><b>{metrics?.conversion_percent ?? 0}%</b> learner-to-buyer conversion</span><span><b>{metrics?.returning_active_share ?? 0}%</b> of monthly active learners active this week</span></div>
      </section>
      <section className="admin-panel"><div className="admin-panel-head"><div><span className="admin-kicker">COURSE HEALTH</span><h3>Learning paths</h3></div><button className="admin-text-button" onClick={onOpenCourses}>Manage courses →</button></div>
        <div className="admin-course-health">{(data?.courses || []).length ? data.courses.slice(0, 5).map((course) => <div className="admin-health-row" key={course.id}><span className="admin-health-icon">♟</span><div className="admin-health-copy"><b>{course.title}</b><small>{course.enrolled_learners} enrolled · {course.lessons} lessons</small></div><span className={`admin-status ${course.published ? 'published' : 'draft'}`}>{course.published ? 'Live' : 'Draft'}</span></div>) : courses.map((course) => <div key={course.id} className="admin-health-row"><span className="admin-health-icon">♟</span><div className="admin-health-copy"><b>{course.title}</b><small>{course.lesson_count} lessons · {course.learner_count} learners</small></div><span className={`admin-status ${course.published ? 'published' : 'draft'}`}>{course.published ? 'Live' : 'Draft'}</span></div>)}</div>
      </section>
    </div>
    <section className="admin-panel admin-top-lessons"><div className="admin-panel-head"><div><span className="admin-kicker">CONTENT PERFORMANCE</span><h3>Lessons learners complete most</h3></div></div>
      {data?.topLessons?.length ? <div className="admin-top-list">{data.topLessons.map((lesson, index) => <div key={lesson.id}><span className="admin-rank">{String(index + 1).padStart(2, '0')}</span><span><b>{lesson.title}</b><small>{lesson.course_title}</small></span><strong>{lesson.completions} complete</strong></div>)}</div> : <Empty text="Completion insights will appear after learners finish lessons."/>}
    </section>
    <section className="admin-panel"><div className="admin-panel-head"><div><span className="admin-kicker">LEARNER DROP-OFF</span><h3>Completion by lesson</h3></div><span className="admin-trend-label">Compare the number who finish each step</span></div>
      {data?.lessonFunnel?.length ? <div className="admin-funnel-list">{groupFunnel(data.lessonFunnel).map((group) => <div className="admin-funnel-course" key={group.courseId}><h4>{group.courseTitle}</h4>{group.lessons.map((lesson, index) => { const previous = Number(group.lessons[index - 1]?.completions || 0); const current = Number(lesson.completions); const drop = index > 0 && previous > 0 ? Math.max(0, Math.round((previous - current) / previous * 100)) : 0; return <div className="admin-funnel-row" key={lesson.id}><span>Unit {lesson.unit_number} · {lesson.title}</span><div className="admin-funnel-track"><i style={{ width: `${group.max ? Math.min(100, current / group.max * 100) : 0}%` }}/></div><b>{current}</b>{index > 0 && drop > 0 && <small>−{drop}%</small>}</div>;})}</div>)}</div> : <Empty text="Lesson drop-off insights will appear as learners complete curriculum activities."/>}
    </section>
  </>;
}

function Metric({ label, value, icon, tone }) { return <article className="admin-metric-card"><span className={`admin-metric-icon ${tone}`}>{icon}</span><small>{label}</small><strong>{value}</strong><span className="admin-metric-note">Recorded in your course database</span></article>; }
function Empty({ text }) { return <div className="admin-empty"><span>✦</span><p>{text}</p></div>; }
function groupFunnel(rows) {
  const groups = new Map();
  for (const row of rows) {
    if (!groups.has(row.course_id)) groups.set(row.course_id, { courseId: row.course_id, courseTitle: row.course_title, lessons: [] });
    groups.get(row.course_id).lessons.push(row);
  }
  return [...groups.values()].map((group) => ({ ...group, max: Math.max(0, ...group.lessons.map((lesson) => Number(lesson.completions))) }));
}

function CourseStudio({ courses, selectedId, setSelectedId, detail, isAdmin, busy, act, refresh, loadDetail, setNotice }) {
  const [courseDraft, setCourseDraft] = useState(null);
  const [lessonDraft, setLessonDraft] = useState(null);
  const [newCourse, setNewCourse] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadLesson, setUploadLesson] = useState('');
  const [instructorEmail, setInstructorEmail] = useState('');
  const [planDraft, setPlanDraft] = useState({ priceRupees: '', period: 'monthly', intervalCount: 1 });

  useEffect(() => {
    if (!detail) { setCourseDraft(null); return; }
    const course = detail.course;
    setCourseDraft({ ...course, priceRupees: Number(course.price_minor) / 100 });
    if (detail.subscriptionPlan) setPlanDraft({ priceRupees: detail.subscriptionPlan.price_paise / 100, period: detail.subscriptionPlan.period, intervalCount: detail.subscriptionPlan.interval_count });
    else setPlanDraft((draft) => ({ ...draft, priceRupees: '' }));
  }, [detail]);

  async function createCourse(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get('title') || '').trim();
    await act(async () => {
      const data = await apiRequest('/api/admin/courses', { method: 'POST', body: {
        title, slug: String(form.get('slug') || '').trim(), description: String(form.get('description') || ''), pricePaise: Math.round(Number(form.get('priceRupees') || 0) * 100),
      } });
      setNewCourse(false); await refresh(); setSelectedId(data.course.id); await loadDetail(data.course.id);
    }, 'Draft course created. Add lessons and publish it when it’s ready.');
  }
  async function saveCourse(event) {
    event.preventDefault();
    await act(async () => {
      await apiRequest(`/api/admin/courses/${selectedId}`, { method: 'PATCH', body: {
        title: courseDraft.title, slug: courseDraft.slug, description: courseDraft.description,
        pricePaise: Math.round(Number(courseDraft.priceRupees || 0) * 100), ...(isAdmin ? { published: courseDraft.published } : {}),
      } });
      await refresh(); await loadDetail(selectedId);
    }, 'Course details saved.');
  }
  async function saveLesson(event) {
    event.preventDefault();
    let content;
    try { content = JSON.parse(lessonDraft.contentText || '{}'); }
    catch { setNotice('Lesson content must be valid JSON.'); return; }
    const payload = { title: lessonDraft.title, kind: lessonDraft.kind, unitNumber: Number(lessonDraft.unitNumber), position: Number(lessonDraft.position), durationSeconds: Number(lessonDraft.durationSeconds || 0), content };
    await act(async () => {
      if (lessonDraft.id) await apiRequest(`/api/admin/lessons/${encodeURIComponent(lessonDraft.id)}`, { method: 'PATCH', body: payload });
      else await apiRequest(`/api/admin/courses/${selectedId}/lessons`, { method: 'POST', body: payload });
      setLessonDraft(null); await loadDetail(selectedId); await refresh();
    }, 'Lesson saved.');
  }
  function openNewLesson() { setLessonDraft({ title: '', kind: 'video', unitNumber: 1, position: (detail?.lessons?.length || 0) + 1, durationSeconds: 300, contentText: '{\n  "description": ""\n}' }); }
  function editLesson(lesson) { setLessonDraft({ ...lesson, contentText: JSON.stringify(lesson.content || {}, null, 2) }); }
  async function uploadVideo(event, lessonId) {
    const file = event.target.files?.[0]; if (!file) return;
    const body = new FormData(); body.append('file', file);
    await act(async () => { await apiRequest(`/api/admin/lessons/${encodeURIComponent(lessonId)}/video`, { method: 'POST', body }); await loadDetail(selectedId); }, 'Lecture video uploaded.');
    event.target.value = '';
  }
  async function uploadResource(event) {
    event.preventDefault();
    const file = event.currentTarget.elements.file.files?.[0]; if (!file) { setNotice('Choose a PDF or supporting video first.'); return; }
    const body = new FormData(); body.append('file', file); body.append('title', uploadTitle); body.append('lessonId', uploadLesson);
    await act(async () => { await apiRequest(`/api/admin/courses/${encodeURIComponent(detail.course.slug)}/resources`, { method: 'POST', body }); setUploadTitle(''); event.currentTarget.reset(); await loadDetail(selectedId); }, 'Resource uploaded and attached to the course.');
  }
  async function savePlan(event) {
    event.preventDefault();
    await act(async () => { await apiRequest(`/api/admin/courses/${selectedId}/subscription-plan`, { method: 'POST', body: { pricePaise: Math.round(Number(planDraft.priceRupees) * 100), period: planDraft.period, intervalCount: Number(planDraft.intervalCount) } }); await loadDetail(selectedId); }, 'Razorpay subscription plan created.');
  }
  async function assignInstructor(event) {
    event.preventDefault();
    await act(async () => { await apiRequest(`/api/admin/courses/${selectedId}/instructors`, { method: 'POST', body: { email: instructorEmail } }); setInstructorEmail(''); await loadDetail(selectedId); }, 'Instructor assigned to this course.');
  }
  async function deleteLesson(lesson) {
    if (!window.confirm(`Delete “${lesson.title}”? Learner completion records for this lesson will also be removed.`)) return;
    await act(async () => { await apiRequest(`/api/admin/lessons/${encodeURIComponent(lesson.id)}`, { method: 'DELETE' }); await loadDetail(selectedId); }, 'Lesson deleted.');
  }

  return <div className="admin-studio">
    <section className="admin-panel admin-course-picker"><div><span className="admin-kicker">CONTENT LIBRARY</span><h2>Your courses</h2></div><div className="admin-picker-actions"><label className="admin-select-wrap"><span className="sr-only">Choose a course</span><select value={selectedId} onChange={(event) => setSelectedId(event.target.value)}><option value="">Select a course</option>{courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}</select><ChevronDown size={16}/></label>{isAdmin && <button className="admin-primary" onClick={() => setNewCourse((value) => !value)}><Plus size={16}/> New course</button>}</div></section>

    {newCourse && <form className="admin-panel admin-form-card" onSubmit={createCourse}><div className="admin-panel-head"><div><span className="admin-kicker">START A NEW LEARNING PATH</span><h3>Create course</h3></div><button type="button" className="admin-icon-button" onClick={() => setNewCourse(false)} aria-label="Close"><X size={16}/></button></div><div className="admin-form-grid"><Field label="Course name"><input name="title" required minLength="3" maxLength="140" placeholder="e.g. Chess for Curious Beginners"/></Field><Field label="Course URL"><input name="slug" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" placeholder="curious-beginners"/></Field><Field label="Price (₹)"><input name="priceRupees" type="number" min="0" step="1" defaultValue="0"/></Field><Field label="Short description" className="wide"><textarea name="description" rows="3" placeholder="What will learners be able to do?"/></Field></div><button className="admin-primary" disabled={busy}><Plus size={15}/> Create draft</button></form>}

    {detail && courseDraft ? <>
      <div className="admin-studio-grid">
        <form className="admin-panel admin-form-card" onSubmit={saveCourse}><div className="admin-panel-head"><div><span className="admin-kicker">COURSE DETAILS</span><h3>Set up this course</h3></div><span className={`admin-status ${courseDraft.published ? 'published' : 'draft'}`}>{courseDraft.published ? 'Published' : 'Draft'}</span></div><div className="admin-form-grid"><Field label="Course name"><input value={courseDraft.title} onChange={(e) => setCourseDraft({ ...courseDraft, title: e.target.value })} required maxLength="140"/></Field><Field label="Course URL"><input value={courseDraft.slug} onChange={(e) => setCourseDraft({ ...courseDraft, slug: e.target.value })} required pattern="[a-z0-9]+(?:-[a-z0-9]+)*"/></Field><Field label="Price (₹)"><input type="number" min="0" step="1" value={courseDraft.priceRupees} onChange={(e) => setCourseDraft({ ...courseDraft, priceRupees: e.target.value })}/></Field><Field label="Description" className="wide"><textarea rows="4" value={courseDraft.description} onChange={(e) => setCourseDraft({ ...courseDraft, description: e.target.value })}/></Field></div>{isAdmin && <label className="admin-toggle-row"><input type="checkbox" checked={courseDraft.published} onChange={(e) => setCourseDraft({ ...courseDraft, published: e.target.checked })}/><span><b>Publish this course</b><small>Learners can discover published courses on the course page.</small></span></label>}<button className="admin-primary" disabled={busy}><Save size={15}/> Save course</button></form>
        <form className="admin-panel admin-form-card" onSubmit={savePlan}><div className="admin-panel-head"><div><span className="admin-kicker">RECURRING ACCESS</span><h3>Subscription option</h3></div><span className="admin-status draft">Razorpay</span></div><p className="admin-help">Create a recurring plan for this course. Razorpay plans are versioned; changing the price creates a new plan for future subscribers.</p><div className="admin-form-grid"><Field label="Price per cycle (₹)"><input type="number" min="1" step="1" value={planDraft.priceRupees} onChange={(e) => setPlanDraft({ ...planDraft, priceRupees: e.target.value })} required/></Field><Field label="Billing period"><select value={planDraft.period} onChange={(e) => setPlanDraft({ ...planDraft, period: e.target.value })}><option value="weekly">Weekly</option><option value="monthly">Monthly</option><option value="quarterly">Every 3 months</option><option value="yearly">Yearly</option></select></Field></div><button className="admin-secondary" disabled={busy}><CircleDollarSign size={15}/> {detail.subscriptionPlan ? 'Update plan price' : 'Create subscription plan'}</button>{detail.subscriptionPlan && <small className="admin-plan-note">Current plan: {money(detail.subscriptionPlan.price_paise)} / {detail.subscriptionPlan.period} · {detail.subscriptionPlan.razorpay_plan_id}</small>}</form>
      </div>

      <section className="admin-panel admin-lessons-panel"><div className="admin-panel-head"><div><span className="admin-kicker">LESSON PLANNER</span><h3>Lessons & activities <span className="admin-count">{detail.lessons.length}</span></h3></div><button className="admin-primary" onClick={openNewLesson}><Plus size={15}/> Add lesson</button></div>
        {lessonDraft && <form className="admin-lesson-editor" onSubmit={saveLesson}><div className="admin-panel-head"><h4>{lessonDraft.id ? 'Edit lesson' : 'New lesson'}</h4><button type="button" className="admin-icon-button" onClick={() => setLessonDraft(null)} aria-label="Close"><X size={16}/></button></div><div className="admin-form-grid"><Field label="Lesson title"><input value={lessonDraft.title} onChange={(e) => setLessonDraft({ ...lessonDraft, title: e.target.value })} required maxLength="180"/></Field><Field label="Activity type"><select value={lessonDraft.kind} onChange={(e) => setLessonDraft({ ...lessonDraft, kind: e.target.value })}><option value="video">Video lesson</option><option value="game">Chess practice</option><option value="activity">Activity</option><option value="resource">Reading resource</option></select></Field><Field label="Unit"><input type="number" min="1" value={lessonDraft.unitNumber} onChange={(e) => setLessonDraft({ ...lessonDraft, unitNumber: e.target.value })} required/></Field><Field label="Position in unit"><input type="number" min="1" value={lessonDraft.position} onChange={(e) => setLessonDraft({ ...lessonDraft, position: e.target.value })} required/></Field><Field label="Duration (seconds)"><input type="number" min="0" value={lessonDraft.durationSeconds} onChange={(e) => setLessonDraft({ ...lessonDraft, durationSeconds: e.target.value })}/></Field><Field label="Lesson data (JSON)" className="wide"><textarea className="admin-code-field" rows="5" value={lessonDraft.contentText} onChange={(e) => setLessonDraft({ ...lessonDraft, contentText: e.target.value })}/></Field></div><button className="admin-primary" disabled={busy}><Save size={15}/> Save lesson</button></form>}
        <div className="admin-lesson-list">{detail.lessons.map((lesson) => <article className="admin-lesson-row" key={lesson.id}><span className={`admin-kind-icon ${lesson.kind}`}>{lesson.kind === 'video' ? <Video size={17}/> : lesson.kind === 'resource' ? <FilePlus2 size={17}/> : <BookOpen size={17}/>}</span><div className="admin-lesson-main"><b>{lesson.title}</b><small>Unit {lesson.unit_number} · Position {lesson.position} · {lesson.kind} · {Math.ceil(lesson.duration_seconds / 60)} min</small>{lesson.media_storage_key && <span className="admin-media-ready"><Check size={13}/> Video attached</span>}</div><label className="admin-upload-button" title="Upload MP4 or WebM"><UploadCloud size={15}/><span>Video</span><input aria-label={`Upload video for ${lesson.title}`} type="file" accept="video/mp4,video/webm" onChange={(e) => uploadVideo(e, lesson.id)} disabled={busy}/></label><button className="admin-icon-button" onClick={() => editLesson(lesson)} aria-label={`Edit ${lesson.title}`}><Save size={15}/></button><button className="admin-icon-button danger" onClick={() => deleteLesson(lesson)} aria-label={`Delete ${lesson.title}`}><Trash2 size={15}/></button></article>)}{!detail.lessons.length && <Empty text="Add the first lesson to start building this course."/>}</div>
      </section>

      <div className="admin-studio-grid">
        <form className="admin-panel admin-form-card" onSubmit={uploadResource}><div className="admin-panel-head"><div><span className="admin-kicker">COURSE LIBRARY</span><h3>Upload a resource</h3></div><ArrowDownToLine size={19}/></div><div className="admin-form-grid"><Field label="Resource title"><input value={uploadTitle} onChange={(e) => setUploadTitle(e.target.value)} required maxLength="120" placeholder="Printable worksheet"/></Field><Field label="Attach to lesson"><select value={uploadLesson} onChange={(e) => setUploadLesson(e.target.value)}><option value="">Whole course</option>{detail.lessons.map((lesson) => <option key={lesson.id} value={lesson.id}>{lesson.title}</option>)}</select></Field><Field label="Choose file" className="wide"><input type="file" name="file" accept="application/pdf,video/mp4,video/webm" required/></Field></div><button className="admin-secondary" disabled={busy}><UploadCloud size={15}/> Upload resource</button><p className="admin-help">PDF, MP4, or WebM · up to 500 MB</p></form>
        {isAdmin && <section className="admin-panel admin-form-card"><div className="admin-panel-head"><div><span className="admin-kicker">COURSE TEAM</span><h3>Assigned instructors</h3></div><Users size={19}/></div>{detail.instructors.length ? <div className="admin-instructor-list">{detail.instructors.map((instructor) => <span key={instructor.id}>{instructor.name}<small>{instructor.email}</small></span>)}</div> : <p className="admin-help">No instructors assigned to this course yet.</p>}<form className="admin-inline-form" onSubmit={assignInstructor}><input type="email" value={instructorEmail} onChange={(e) => setInstructorEmail(e.target.value)} required placeholder="instructor@example.com"/><button className="admin-secondary" disabled={busy}><Plus size={15}/> Assign</button></form></section>}
      </div>

      <section className="admin-panel"><div className="admin-panel-head"><div><span className="admin-kicker">DOWNLOADS & HANDOUTS</span><h3>Attached resources</h3></div></div>{detail.resources.length ? <div className="admin-resource-list">{detail.resources.map((resource) => <div key={resource.id}><FilePlus2 size={16}/><span><b>{resource.title}</b><small>{resource.lesson_id ? detail.lessons.find((l) => l.id === resource.lesson_id)?.title || 'Attached lesson' : 'Whole course'} · {(Number(resource.byte_size) / 1024 / 1024).toFixed(1)} MB</small></span><button className="admin-icon-button danger" onClick={() => act(async () => { await apiRequest(`/api/admin/resources/${resource.id}`, { method: 'DELETE' }); await loadDetail(selectedId); }, 'Resource removed.')} aria-label={`Delete ${resource.title}`}><Trash2 size={15}/></button></div>)}</div> : <Empty text="Course handouts and worksheets will appear here."/>}</section>
    </> : <section className="admin-panel"><Empty text="Choose a course to edit its curriculum, upload materials, and review access settings."/></section>}
  </div>;
}

function Field({ label, children, className = '' }) { return <label className={`admin-field ${className}`}><span>{label}</span>{children}</label>; }

function Commerce({ orders, coupons, courses, busy, act, reload }) {
  const [couponDraft, setCouponDraft] = useState({ code: '', discountPercent: 10, courseId: '', expiresAt: '', maxRedemptions: '' });
  async function createCoupon(event) {
    event.preventDefault();
    await act(async () => {
      await apiRequest('/api/admin/coupons', { method: 'POST', body: {
        code: couponDraft.code, discountPercent: Number(couponDraft.discountPercent), courseId: couponDraft.courseId || null,
        expiresAt: couponDraft.expiresAt ? new Date(couponDraft.expiresAt).toISOString() : null,
        maxRedemptions: couponDraft.maxRedemptions ? Number(couponDraft.maxRedemptions) : null,
      } });
      setCouponDraft({ code: '', discountPercent: 10, courseId: '', expiresAt: '', maxRedemptions: '' }); await reload();
    }, 'Discount code created.');
  }
  return <div className="admin-commerce">
    <section className="admin-panel admin-com-hero"><div><span className="admin-welcome-pill"><Tags size={14}/> OFFERS & PAYMENTS</span><h2>Make checkout clear and flexible.</h2><p>Create promotional codes, review payment outcomes, and keep learner access tied to confirmed Razorpay events.</p></div><div className="admin-com-hero-icon"><CircleDollarSign size={42}/></div></section>
    <div className="admin-studio-grid">
      <form className="admin-panel admin-form-card" onSubmit={createCoupon}><div className="admin-panel-head"><div><span className="admin-kicker">PROMOTION</span><h3>Create a discount code</h3></div><Tags size={18}/></div><div className="admin-form-grid"><Field label="Code"><input value={couponDraft.code} onChange={(e) => setCouponDraft({ ...couponDraft, code: e.target.value.toUpperCase() })} required maxLength="32" pattern="[A-Za-z0-9_-]+" placeholder="WELCOME10"/></Field><Field label="Discount (%)"><input type="number" min="1" max="99" value={couponDraft.discountPercent} onChange={(e) => setCouponDraft({ ...couponDraft, discountPercent: e.target.value })} required/></Field><Field label="Course restriction"><select value={couponDraft.courseId} onChange={(e) => setCouponDraft({ ...couponDraft, courseId: e.target.value })}><option value="">All courses</option>{courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}</select></Field><Field label="Maximum uses"><input type="number" min="1" value={couponDraft.maxRedemptions} onChange={(e) => setCouponDraft({ ...couponDraft, maxRedemptions: e.target.value })} placeholder="No limit"/></Field><Field label="Expires at" className="wide"><input type="datetime-local" value={couponDraft.expiresAt} onChange={(e) => setCouponDraft({ ...couponDraft, expiresAt: e.target.value })}/></Field></div><button className="admin-primary" disabled={busy}><Plus size={15}/> Create promotion</button></form>
      <section className="admin-panel admin-form-card"><div className="admin-panel-head"><div><span className="admin-kicker">ACTIVE OFFERS</span><h3>Discount codes</h3></div><Tags size={18}/></div>{coupons.length ? <div className="admin-coupon-list">{coupons.map((coupon) => <article key={coupon.id}><div><b>{coupon.code}</b><small>{coupon.course_title || 'All courses'} · {coupon.redeemed_count} used{coupon.max_redemptions ? ` of ${coupon.max_redemptions}` : ''}</small></div><strong>{coupon.discount_percent}%</strong><button className={`admin-status-toggle ${coupon.active ? 'on' : ''}`} disabled={busy} onClick={() => act(async () => { await apiRequest(`/api/admin/coupons/${coupon.id}`, { method: 'PATCH', body: { active: !coupon.active } }); await reload(); }, coupon.active ? 'Discount code paused.' : 'Discount code activated.')}>{coupon.active ? 'Active' : 'Paused'}</button></article>)}</div> : <Empty text="No discount codes yet. Create one for a launch, school, or family offer."/>}</section>
    </div>
    <section className="admin-panel"><div className="admin-panel-head"><div><span className="admin-kicker">RAZORPAY CHECKOUT</span><h3>Recent purchases</h3></div><span className="admin-status published">INR · secure webhook access</span></div>{orders.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Learner</th><th>Course</th><th>Amount charged</th><th>Offer</th><th>Status</th><th>Date</th></tr></thead><tbody>{orders.map((order) => <tr key={order.id}><td><b>{order.learner_name}</b><small>{order.learner_email}</small></td><td>{order.course_title}</td><td><b>{money(order.amount_minor)}</b>{Number(order.discount_minor) > 0 && <small>saved {money(order.discount_minor)}</small>}</td><td>{order.coupon_code || '—'}</td><td><span className={`admin-status ${order.status === 'paid' ? 'published' : 'draft'}`}>{order.status}</span></td><td>{new Date(order.created_at).toLocaleDateString('en-IN')}</td></tr>)}</tbody></table></div> : <Empty text="Paid and pending course checkouts will appear here."/>}</section>
  </div>;
}

function Team({ users, courses, busy, act, reload }) {
  return <section className="admin-panel"><div className="admin-panel-head"><div><span className="admin-kicker">STAFF ACCESS</span><h3>People & permissions</h3></div><ShieldCheck size={20}/></div><p className="admin-help">Promote trusted accounts to instructor or administrator. Instructors can edit only courses assigned to them.</p>{users.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Person</th><th>Joined</th><th>Role</th></tr></thead><tbody>{users.map((person) => <tr key={person.id}><td><b>{person.name}</b><small>{person.email}</small></td><td>{new Date(person.created_at).toLocaleDateString('en-IN')}</td><td><select aria-label={`Role for ${person.email}`} value={person.role} onChange={(event) => act(async () => { await apiRequest(`/api/admin/users/${person.id}/role`, { method: 'PATCH', body: { role: event.target.value } }); await reload(); }, `Updated ${person.name}’s role.`)} disabled={busy || person.id === users.find((u) => u.role === 'admin')?.id && person.role === 'admin'}><option value="learner">Learner</option><option value="instructor">Instructor</option><option value="admin">Administrator</option></select></td></tr>)}</tbody></table></div> : <Empty text="Registered accounts will appear here."/>}<div className="admin-team-foot"><b>How course access works</b><p>Administrators can manage every course. Instructors need an existing account and a course assignment before they can edit curriculum or upload materials.</p><span>Available courses: {courses.length}</span></div></section>;
}
