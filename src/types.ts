export interface TimelineDataPoint {
  date: string;
  value: number;
}

export interface RelatedTopic {
  title: string;
  value: number;
}

export interface TrendData {
  timelineData: TimelineDataPoint[];
  relatedTopics: RelatedTopic[];
  keyword: string;
}

export interface RawTimelinePoint {
  [key: string]: number | string | boolean;
  date: string;
  isPartial: boolean;
}

export interface ComparisonDataPoint {
  date: string;
  [key: string]: number | string;
}

export interface ComparisonData {
  timelineData: ComparisonDataPoint[];
  keywords: string[];
}

export interface APIResponse {
  timeline_data: RawTimelinePoint[];
  related_topics: RelatedTopic[];
}

export interface RegionalData {
  [region: string]: number;
}