export interface TrendData {
  timelineData: TimelinePoint[];
  relatedTopics: string[];
  keyword: string;
}

export interface TimelinePoint {
  date: string;
  value: number;
}

export interface APIResponse {
  timeline_data: {
    date: string;
    value: number;
  }[];
  related_topics: string[];
}