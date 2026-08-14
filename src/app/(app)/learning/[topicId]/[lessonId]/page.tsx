import { LearningInterface } from "../../learning-interface";

export default async function LessonPage(props: PageProps<"/learning/[topicId]/[lessonId]">) {
  const { topicId, lessonId } = await props.params;
  return <LearningInterface topicId={topicId} lessonId={lessonId} />;
}
