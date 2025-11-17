import { FAQList } from "../../components/faq/FAQList";
import { faqItems } from "../../lib/faqData";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";

export function FAQPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-semibold">자주 묻는 질문</h1>
        <p className="text-gray-600">ClubHub 이용에 대한 궁금한 점을 확인하세요</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>FAQ</CardTitle>
        </CardHeader>
        <CardContent>
          <FAQList faqs={faqItems} />
        </CardContent>
      </Card>
    </div>
  );
}

