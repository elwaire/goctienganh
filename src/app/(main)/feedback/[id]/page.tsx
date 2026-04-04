import { redirect } from "next/navigation";

// Detail page has been moved to a modal on /feedback
export default function FeedbackDetailPage() {
  redirect("/feedback");
}
