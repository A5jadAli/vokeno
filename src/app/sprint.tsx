import { CourseView } from '@/components/course-view';
import { TabHeader } from '@/components/tab-header';
import { AppScreen } from '@/components/voka-ui';
import { useSelectedLanguage } from '@/features/language/selection';

/** Course: where the learner is going. Practice tools live in Practice. */
export default function CourseScreen() {
  const [track, setTrack] = useSelectedLanguage();
  return (
    <AppScreen activeNav="course">
      <TabHeader title="Course" track={track} onTrack={setTrack} />
      <CourseView track={track} />
    </AppScreen>
  );
}
