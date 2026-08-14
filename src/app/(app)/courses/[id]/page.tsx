import { CourseDetail } from "../course-detail";

export default async function CoursePage(props: PageProps<"/courses/[id]">) {
  const { id } = await props.params;
  return <CourseDetail id={id} />;
}
