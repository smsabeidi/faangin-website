import LegalPage from "@/components/legal/LegalPage";
import { legalPageMetadata, refundPolicy } from "@/lib/legal-content";

export const metadata = legalPageMetadata(refundPolicy);

export default function RefundPolicyPage() {
  return <LegalPage document={refundPolicy} />;
}
