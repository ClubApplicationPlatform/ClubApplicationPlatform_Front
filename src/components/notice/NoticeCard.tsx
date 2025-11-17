import { Bell } from "lucide-react";

import type { Notice } from "../../types/notice";
import { Badge } from "../../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";

interface NoticeCardProps {
  notice: Notice;
}

export function NoticeCard({ notice }: NoticeCardProps) {
  return (
    <Card key={notice.id} className="cursor-pointer hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {notice.isImportant && <Bell className="h-5 w-5 text-red-600" />}
            <CardTitle className="text-lg">{notice.title}</CardTitle>
          </div>
          {notice.isImportant && <Badge className="bg-red-600">중요</Badge>}
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-3 text-gray-600">{notice.content}</p>
        <p className="text-sm text-gray-400">{notice.date}</p>
      </CardContent>
    </Card>
  );
}

