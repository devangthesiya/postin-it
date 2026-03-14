import theRide from '../posts/the-ride-the-road-the-chai.md?raw';
import heDisappeared from '../posts/he-disappeared-let-go.md?raw';
import welcomeToMusing from '../posts/welcome-to-musing.md?raw';

export const POSTS = [
  {
    title: "The Ride, the Road, the Chai",
    slug: "the-ride-the-road-the-chai",
    date: "2026-02-22",
    displayDate: "February 22, 2026",
    description: "A motorbike, an open highway, and a roadside chai stall — sometimes the best journeys are the ones with no destination.",
    tags: ["personal", "travel", "story"],
    type: "essay",
    readingTime: 6,
    content: theRide,
  },
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
