import { QuizInterface } from "../quiz-interface";

export default async function QuizPage(props: PageProps<"/quiz/[id]">) {
  const { id } = await props.params;
  return <QuizInterface id={id} />;
}
