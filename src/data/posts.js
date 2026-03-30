import aTrekAndAThought from '../posts/a-trek-and-a-thought.md?raw';
import goTouchGrass from '../posts/go-touch-some-grass.md?raw';
import theRide from '../posts/the-ride-the-road-the-chai.md?raw';
import heDisappeared from '../posts/he-disappeared-let-go.md?raw';
import welcomeToMusing from '../posts/welcome-to-musing.md?raw';

export const POSTS = [
  {
    title: "A Trek and a Thought",
    slug: "a-trek-and-a-thought",
    date: "2026-03-31",
    displayDate: "March 31, 2026",
    time: "12:41 AM",
    description: "A sunrise trek in the rain — and the quiet space where someone should have been.",
    tags: ["personal", "travel", "story"],
    type: "essay",
    readingTime: 3,
    content: aTrekAndAThought,
  },
  {
    title: "Go Touch Some Grass",
    slug: "go-touch-some-grass",
    date: "2026-03-31",
    displayDate: "March 31, 2026",
    time: "12:00 AM",
    description: "A week without social media, and what your attention span doesn't want you to know.",
    tags: ["personal", "social-media", "reflection"],
    type: "short",
    readingTime: 3,
    content: goTouchGrass,
  },
  {
    title: "The Ride, the Road, the Chai",
    slug: "the-ride-the-road-the-chai",
    date: "2026-03-14",
    displayDate: "March 14, 2026",
    time: "8:47 PM",
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
    time: "1:23 AM",
    description: "A quiet story about a boy who learned to disappear — not all at once, but slowly, until no one noticed.",
    tags: ["personal", "loneliness", "story"],
    type: "essay",
    readingTime: 4,
    content: heDisappeared,
  },
  {
    title: "Welcome to Musing",
    slug: "welcome-to-musing",
    date: "2026-02-21",
    displayDate: "February 21, 2026",
    time: "1:10 AM",
    description: "The very first post — why I built this space, what you can expect, and a little about how it all works under the hood.",
    tags: ["personal", "intro"],
    type: "essay",
    readingTime: 3,
    content: welcomeToMusing,
  }
];
