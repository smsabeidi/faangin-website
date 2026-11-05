import InterviewTopicPage from "@/components/interviews/InterviewTopicPage";
import { getInterviewTopic } from "@/lib/interview-content";
import { pageMetadata } from "@/lib/seo";

const topic = getInterviewTopic("behavioral-interview");

export const metadata = pageMetadata({ title: topic.metaTitle, description: topic.description, path: `/${topic.slug}` });

export default function BehavioralInterviewPage() {
  return <InterviewTopicPage topic={topic} />;
}
