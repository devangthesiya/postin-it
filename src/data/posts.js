import goTouchGrass from '../posts/go-touch-some-grass.md?raw';
import theRide from '../posts/the-ride-the-road-the-chai.md?raw';
import heDisappeared from '../posts/he-disappeared-let-go.md?raw';
import welcomeToMusing from '../posts/welcome-to-musing.md?raw';

export const POSTS = [
  {
    title: "Go Touch Some Grass",
    slug: "go-touch-some-grass",
    date: "2026-03-22",
    displayDate: "March 22, 2026",
    time: "12:30 AM",
    description: "A week without social media, and what your attention span doesn't want you to know.",
    tags: ["personal", "social-media", "reflection"],
    type: "short",
    readingTime: 3,
    content: goTouchGrass,
  },
  {
    title: "The Ride, the Road, the Chai",
    slug: "the-ride-the-road-the-chai",
    date: "2026-02-22",
    displayDate: "February 22, 2026",
    time: "10:15 PM",
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
    time: "11:45 PM",
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
    time: "8:00 PM",
    description: "The very first post — why I built this space, what you can expect, and a little about how it all works under the hood.",
    tags: ["personal", "intro"],
    type: "essay",
    readingTime: 3,
    content: welcomeToMusing,
  }
];
