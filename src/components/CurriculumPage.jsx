import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { UdemyCourseOverview } from './UdemyCourseOverview';
import { UdemyCoursePlayer } from './UdemyCoursePlayer';

export const CurriculumPage = ({ activeSubscription }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read URL query parameters
  const viewParam = searchParams.get('view'); // 'overview' | 'player'
  const unitParam = parseInt(searchParams.get('unit'), 10);
  const lectureParam = searchParams.get('lecture');

  // Mode: 'overview' (Screenshot 2) or 'player' (Screenshot 1)
  const [viewMode, setViewMode] = useState(viewParam === 'player' ? 'player' : 'overview');
  const [selectedUnitId, setSelectedUnitId] = useState(unitParam || 1);
  const [selectedLectureId, setSelectedLectureId] = useState(lectureParam || null);

  // Sync state if URL search params change
  useEffect(() => {
    if (viewParam === 'player') {
      setViewMode('player');
    } else if (viewParam === 'overview') {
      setViewMode('overview');
    }
    if (unitParam && !isNaN(unitParam)) {
      setSelectedUnitId(unitParam);
    }
    if (lectureParam) {
      setSelectedLectureId(lectureParam);
    }
  }, [viewParam, unitParam, lectureParam]);

  // Handler to launch player from overview
  const handleStartCourse = (unitId = 1, lectureId = null) => {
    setSelectedUnitId(unitId);
    setSelectedLectureId(lectureId);
    setViewMode('player');
    setSearchParams({ view: 'player', unit: String(unitId), ...(lectureId ? { lecture: lectureId } : {}) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler to return to course overview
  const handleBackToOverview = () => {
    setViewMode('overview');
    setSearchParams({ view: 'overview' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      {viewMode === 'player' ? (
        <UdemyCoursePlayer
          initialUnitId={selectedUnitId}
          initialLectureId={selectedLectureId}
          onBackToOverview={handleBackToOverview}
          activeSubscription={activeSubscription}
        />
      ) : (
        <UdemyCourseOverview
          onStartCourse={handleStartCourse}
          onSelectLecture={(unitId, lectureId) => handleStartCourse(unitId, lectureId)}
        />
      )}
    </div>
  );
};
