export type Topic = {
  id: string;
  name: string;
  accuracy: number;
  priority: number;
};

export type Event = {
  id: string;
  title: string;
  dueAt: string;
};

export type Stats = {
  accuracy: number;
  timeMins: number;
  questions: number;
};

export type Subject = {
  id: string;
  name: string;
  topics: Topic[];
  events: Event[];
  stats: Stats;
};

