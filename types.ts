export interface PostPreviewResponse {
  hasMore: boolean;
  nextCursor?: string;
  results: PostPreview[];
}

export interface PostPreview {
  id: string;
  date: string;
  type?: string;
  slug: string;
  tags: string;
  summary: string;
  title: string;
  status?: string;
}
