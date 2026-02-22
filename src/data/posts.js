import heDisappeared from '../posts/he-disappeared-let-go.md?raw';
import welcomeToMusing from '../posts/welcome-to-musing.md?raw';

export const POSTS = [
  {
    title: "He Disappeared. Let Go",
    slug: "he-disappeared-let-go",
    date: "2026-02-21",
    displayDate: "February 21, 2026",
    description: "A quiet story about a boy who learned to disappear — not all at once, but slowly, until no one noticed.",
    tags: ["personal", "loneliness", "story"],
    type: "essay",
    readingTime: 4,
    content: heDisappeared,
  },
  {
    title: "Welcome to Musing",
    slug: "welcome-to-musing",
    date: "2026-02-14",
    displayDate: "February 14, 2026",
    description: "The very first post — why I built this space, what you can expect, and a little about how it all works under the hood.",
    tags: ["personal", "intro"],
    type: "essay",
    readingTime: 3,
    content: welcomeToMusing,
  }
];
