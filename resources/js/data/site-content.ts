export const publicNavigation = [
    { label: 'Home', href: '/' },
    { label: 'Hotels', href: '/rooms' },
    { label: 'Offers', href: '/offers' },
    { label: 'My Bookings', href: '/account/bookings' },
    { label: 'Contact', href: '/contact' },
] as const;

export const heroMedia = [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1505692952047-1a78307da8f2?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1600&q=80',
];

export const immersiveGallery = [
    {
        title: 'Skyline arrival suite',
        category: 'Suite interior',
        image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80',
    },
    {
        title: 'Window lounge panorama',
        category: 'Panorama deck',
        image: 'https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&w=1600&q=80',
    },
    {
        title: 'Curated terrace breakfast',
        category: 'In-room dining',
        image: 'https://images.unsplash.com/photo-1464890100898-a385f744067f?auto=format&fit=crop&w=1600&q=80',
    },
    {
        title: 'Warm neutral residence',
        category: 'Family stay',
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80',
    },
    {
        title: 'Atrium social suite',
        category: 'Shared lounge',
        image: 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1600&q=80',
    },
    {
        title: 'Executive studio desk bay',
        category: 'Work + stay',
        image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=80',
    },
    {
        title: 'Morning light bath ritual',
        category: 'Wellness',
        image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1600&q=80',
    },
    {
        title: 'Immersive sleep lighting',
        category: 'Night ambience',
        image: 'https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?auto=format&fit=crop&w=1600&q=80',
    },
];

export const featuredVideos = [
    {
        title: 'AetherStay brand film',
        subtitle: 'Cinematic arrival, suite reveal, and evening mood',
        provider: 'Vimeo',
        embedUrl: 'https://player.vimeo.com/video/1132147931?title=0&byline=0&portrait=0',
        aspect: 'aspect-video',
    },
    {
        title: 'Resort walkthrough',
        subtitle: 'Lobby, suites, dining, and pool transitions',
        provider: 'YouTube',
        embedUrl: 'https://www.youtube.com/embed/lCF9Ya2qzNw?rel=0',
        aspect: 'aspect-video',
    },
    {
        title: 'Suite mood reel',
        subtitle: 'Editorial room styling and hospitality detail shots',
        provider: 'YouTube',
        embedUrl: 'https://www.youtube.com/embed/TKI3fhfazEo?rel=0',
        aspect: 'aspect-video',
    },
];

export const tourScenes = [
    {
        id: 'aurora',
        title: 'Aurora skyline suite',
        description: 'Drag across the panorama to explore the lounge, bed axis, and marble bath zone.',
        image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=2400&q=80',
        hotspotLabel: 'Glass-edge living zone',
    },
    {
        id: 'lagoon',
        title: 'Lagoon loft',
        description: 'A brighter family layout with layered seating and terrace views.',
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=2400&q=80',
        hotspotLabel: 'Terrace + breakfast nook',
    },
    {
        id: 'executive',
        title: 'Executive studio',
        description: 'A clean business-stay panorama with acoustic work zone and warm night lighting.',
        image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=2400&q=80',
        hotspotLabel: 'Desk bay + media wall',
    },
];

export const virtualTourMedia = [
    {
        title: '360-style suite walkthrough',
        subtitle: 'Interactive panorama scene with cinematic camera-style composition.',
        provider: 'Panorama',
    },
    {
        title: 'Public 360 room video',
        subtitle: 'Reference-style 360 hospitality media.',
        provider: 'Vimeo',
        embedUrl: 'https://player.vimeo.com/video/1123237058?title=0&byline=0&portrait=0',
    },
];

export const experienceMoments = [
    {
        title: 'Rooftop thermal lounge',
        description: 'Private heat therapy, quiet tea service, and skyline recovery sessions at sunset.',
        image: 'https://images.unsplash.com/photo-1505692952047-1a78307da8f2?auto=format&fit=crop&w=1400&q=80',
    },
    {
        title: 'Personal host concierge',
        description: 'Airport coordination, late-night dining requests, and tailored local itineraries.',
        image: 'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&w=1400&q=80',
    },
    {
        title: 'Wellness pool rituals',
        description: 'Morning movement, hydrotherapy sessions, and immersive water-light ambience.',
        image: 'https://images.unsplash.com/photo-1464890100898-a385f744067f?auto=format&fit=crop&w=1400&q=80',
    },
    {
        title: 'Social club evenings',
        description: 'Signature playlists, chef-led tasting menus, and intimate after-dark events.',
        image: 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1400&q=80',
    },
];

export const diningSpaces = [
    {
        title: 'Noir Atelier',
        subtitle: 'Chef-driven tasting room',
        description: 'Low-lit plated dining with seasonal tasting menus and private pairings.',
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=80',
    },
    {
        title: 'Sol Terrace',
        subtitle: 'Sunrise breakfast pavilion',
        description: 'Open-air breakfast with bakery counters, tropical fruit tables, and light live music.',
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1600&q=80',
    },
    {
        title: 'Blue Hour Lounge',
        subtitle: 'Cocktail and listening bar',
        description: 'Night cocktails, vinyl-led sound design, and small-plate service in a deep blue room.',
        image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1600&q=80',
    },
];

export const offerCollections = [
    {
        title: 'Stay 3 Pay 2',
        badge: 'Limited release',
        description: 'Book a three-night stay in a signature suite and the final night is complimentary.',
        image: 'https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?auto=format&fit=crop&w=1600&q=80',
    },
    {
        title: 'Suite + Spa Escape',
        badge: 'Wellness',
        description: 'Daily breakfast, thermal lounge access, and one treatment journey for two guests.',
        image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1600&q=80',
    },
    {
        title: 'Work From Hotel',
        badge: 'Executive',
        description: 'Private transfer, desk-ready suite, pressing service, and meeting credits.',
        image: 'https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&w=1600&q=80',
    },
];

export const contactDetails = {
    phone: '+1 (800) 410 1188',
    email: 'stay@aetherstay.com',
    address: '27 Horizon Marina Drive, Oceanfront District, Miami',
};

export const contactFaq = [
    {
        question: 'Do you offer airport pickup?',
        answer: 'Yes. Premium transfer can be arranged directly from the booking notes or by the concierge team before arrival.',
    },
    {
        question: 'Can guests request room styling for celebrations?',
        answer: 'Yes. Celebration styling, private dining, florals, and curated welcome setups are available by request.',
    },
    {
        question: 'Is the virtual tour representative of live rooms?',
        answer: 'The tour is a design-faithful preview of our signature categories and room mood.',
    },
];

export const destinationCollections = [
    {
        title: 'Oceanfront District',
        label: 'Walkable luxury district',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
        description: 'Waterfront cafes, marina sunsets, and design-led nightlife all within minutes of check-in.',
    },
    {
        title: 'Cultural Arts Mile',
        label: 'Curated city discovery',
        image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1600&q=80',
        description: 'Museums, gallery launches, and intimate chef counters for guests who book around experiences.',
    },
    {
        title: 'Island Escape Route',
        label: 'Private day plans',
        image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1600&q=80',
        description: 'Day charters, coastal drives, and concierge-planned itineraries designed around the stay.',
    },
];

export const signaturePerks = [
    {
        title: 'Instant availability',
        description: 'Live room status and stay totals update around your dates before checkout.',
    },
    {
        title: 'Image-first discovery',
        description: 'Full-width galleries, editorial room cards, brand films, and immersive room media.',
    },
    {
        title: 'Guest-first operations',
        description: 'Account history, payment status, cancellations, and admin controls all stay connected.',
    },
];

export const aboutPillars = [
    {
        title: 'Design-led hospitality',
        description: 'AetherStay blends boutique hotel warmth with modern booking convenience, so every guest touchpoint feels intentional.',
    },
    {
        title: 'Tech-backed operations',
        description: 'Laravel-powered inventory, analytics, and reservation workflows keep the guest and admin experience equally polished.',
    },
    {
        title: 'Human concierge culture',
        description: 'Real service moments, curated dining, and flexible stay planning shape the brand beyond the booking form.',
    },
];

export const teamMembers = [
    {
        name: 'Mira Solis',
        role: 'General Manager',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80',
    },
    {
        name: 'Daniel Ross',
        role: 'Guest Experience Director',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80',
    },
    {
        name: 'Aanya Kapoor',
        role: 'Wellness and Dining Curator',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=900&q=80',
    },
];

export const guestReviews = [
    {
        author: 'Rhea Malhotra',
        location: 'Mumbai',
        rating: 5,
        title: 'Looks and feels like a real luxury booking site',
        review: 'The room photos, quick availability, and payment flow felt closer to an actual travel platform than a portfolio demo.',
        avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=500&q=80',
    },
    {
        author: 'Chris Walker',
        location: 'London',
        rating: 5,
        title: 'Loved the immersive room experience',
        review: 'The panorama, films, and gallery made it easy to understand the room before booking. The checkout flow was smooth too.',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=80',
    },
    {
        author: 'Sana Iqbal',
        location: 'Dubai',
        rating: 4,
        title: 'Modern UI without feeling gimmicky',
        review: 'It has the polish of a commercial hotel website with stronger visuals and better room storytelling than most booking flows.',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80',
    },
    {
        author: 'Marco Bianchi',
        location: 'Milan',
        rating: 5,
        title: 'Booking and account history are both polished',
        review: 'I could browse offers, book a suite, and later review the payment status in one clean dashboard experience.',
        avatar: 'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=500&q=80',
    },
];

export const sitePageCards = [
    {
        title: 'Stay',
        href: '/rooms',
        description: 'Browse all room categories with booking filters and live availability.',
        image: heroMedia[0],
    },
    {
        title: 'About',
        href: '/about',
        description: 'Brand story, mission, leadership team, and a design-led property overview.',
        image: heroMedia[3],
    },
    {
        title: 'Gallery',
        href: '/gallery',
        description: 'Editorial photography, suite details, dining, and social moments.',
        image: immersiveGallery[1].image,
    },
    {
        title: 'Virtual Tour',
        href: '/virtual-tour',
        description: 'Interactive 360-style room scenes plus public tour media.',
        image: tourScenes[0].image,
    },
    {
        title: 'Experiences',
        href: '/experiences',
        description: 'Spa, pool rituals, nightlife, concierge, and signature services.',
        image: experienceMoments[0].image,
    },
    {
        title: 'Dining',
        href: '/dining',
        description: 'Restaurants, rooftop breakfasts, cocktails, and chef-led tastings.',
        image: diningSpaces[0].image,
    },
    {
        title: 'Offers',
        href: '/offers',
        description: 'Seasonal packages, suite upgrades, and limited-edition stays.',
        image: offerCollections[0].image,
    },
    {
        title: 'Reviews',
        href: '/reviews',
        description: 'Guest ratings, stay stories, and hospitality feedback.',
        image: guestReviews[0].avatar,
    },
    {
        title: 'Contact',
        href: '/contact',
        description: 'Reservations, concierge guidance, and travel planning.',
        image: heroMedia[2],
    },
];
