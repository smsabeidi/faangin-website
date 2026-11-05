import LegalPage from "@/components/legal/LegalPage";
import { legalPageMetadata, privacyPolicy } from "@/lib/legal-content";

export const metadata = legalPageMetadata(privacyPolicy);

export default function PrivacyPolicyPage() {
  return <LegalPage document={privacyPolicy} />;
}
