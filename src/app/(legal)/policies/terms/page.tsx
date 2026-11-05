import LegalPage from "@/components/legal/LegalPage";
import { legalPageMetadata, termsOfService } from "@/lib/legal-content";

export const metadata = legalPageMetadata(termsOfService);

export default function TermsOfServicePage() {
  return <LegalPage document={termsOfService} />;
}
