import { Navigate, useParams } from 'react-router-dom';
import { ParentHome } from '../parent/ParentHome';
import { KidsLanding } from '../landing/KidsLanding';
import { useAuth } from './AuthContext';
import { useExperienceMode } from './ExperienceModeContext';
import { defaultCourse, findCourse } from '../courses/courseCatalog';

// Home: the featured course's landing page. A signed-in grown-up who switched to the
// parent view sees the parent dashboard for Course 1.
export function LandingPage() {
  const { user } = useAuth();
  const { mode } = useExperienceMode();
  if (user && mode === 'parent') return <ParentHome />;
  return <KidsLanding course={defaultCourse()} />;
}

// Each course has its own landing page at /courses/:slug.
export function CourseLandingPage() {
  const { slug } = useParams();
  const course = findCourse(slug);
  if (!course) return <Navigate to="/courses" replace />;
  return <KidsLanding key={course.slug} course={course} />;
}
