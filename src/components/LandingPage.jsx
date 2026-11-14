import { Navigate, useParams } from 'react-router-dom';
import { ParentHome } from '../parent/ParentHome';
import { KidsLanding } from '../landing/KidsLanding';
import { useAuth } from './AuthContext';
import { useExperienceMode } from './ExperienceModeContext';
import { findCourse } from '../courses/courseCatalog';
import { AcademyHome } from '../home/AcademyHome';

// Home: the academy's main landing page. A signed-in grown-up in the parent view
// sees the parent dashboard for Course 1 instead.
export function LandingPage() {
  const { user } = useAuth();
  const { mode } = useExperienceMode();
  if (user && mode === 'parent') return <ParentHome />;
  return <AcademyHome />;
}

// Each course has its own landing page at /courses/:slug.
export function CourseLandingPage() {
  const { slug } = useParams();
  const course = findCourse(slug);
  if (!course) return <Navigate to="/courses" replace />;
  return <KidsLanding key={course.slug} course={course} />;
}
