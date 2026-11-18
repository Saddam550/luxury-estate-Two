const U = (id, w = 1600) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

window.IMG = {
  hero: U('photo-1613490493576-7fde63acd811', 2000),
  about: U('photo-1600596542815-ffad4c1539a9', 1600),
  about2: U('photo-1600585154340-be6161a56a0c', 1600),
  interior: U('photo-1600607687939-ce8a6c25118c', 1600),
  interior2: U('photo-1502672260266-1c1ef2d93688', 1600),
  city: U('photo-1486406146926-c627a92ad1ab', 1600),
  pool: U('photo-1512917774080-9991f1c4c750', 1600),
  cta: U('photo-1600566753190-17f0baa2a6c3', 2000),
  contact: U('photo-1600047509807-ba8f99d2cdde', 1600)
};

window.PROPERTIES = [
  { id: 1, title: 'The Obsidian Villa', location: 'Beverly Hills, California', price: 12500000, beds: 7, baths: 9, area: 11200, type: 'Villa', status: 'For Sale', featured: true,
    img: U('photo-1613490493576-7fde63acd811'),
    gallery: [U('photo-1613490493576-7fde63acd811'), U('photo-1600607687939-ce8a6c25118c'), U('photo-1600566753190-17f0baa2a6c3'), U('photo-1512917774080-9991f1c4c750')],
    desc: 'A architectural masterpiece set behind private gates, with panoramic canyon views, an infinity pool, a private cinema and a wine cellar for 2,000 bottles.' },
  { id: 2, title: 'Azure Bay Penthouse', location: 'Miami Beach, Florida', price: 8900000, beds: 4, baths: 5, area: 5400, type: 'Penthouse', status: 'For Sale', featured: true,
    img: U('photo-1545324418-cc1a3fa10c00'),
    gallery: [U('photo-1545324418-cc1a3fa10c00'), U('photo-1502672260266-1c1ef2d93688'), U('photo-1560448204-e02f11c3d0e2'), U('photo-1600585154526-990dced4db0d')],
    desc: 'Full-floor penthouse with 360° ocean views, a private elevator, a wraparound terrace and white-glove concierge service.' },
  { id: 3, title: 'Maison Lumière', location: 'Paris, France', price: 15800000, beds: 6, baths: 6, area: 8300, type: 'Mansion', status: 'For Sale', featured: true,
    img: U('photo-1600596542815-ffad4c1539a9'),
    gallery: [U('photo-1600596542815-ffad4c1539a9'), U('photo-1600585154340-be6161a56a0c'), U('photo-1600607687939-ce8a6c25118c'), U('photo-1600047509807-ba8f99d2cdde')],
    desc: 'A restored hôtel particulier a few steps from the Seine, blending original moulding and parquet with a discreet contemporary spa.' },
  { id: 4, title: 'Skyline Residence 88', location: 'Dubai Marina, UAE', price: 6200000, beds: 5, baths: 6, area: 6100, type: 'Penthouse', status: 'For Sale', featured: false,
    img: U('photo-1486406146926-c627a92ad1ab'),
    gallery: [U('photo-1486406146926-c627a92ad1ab'), U('photo-1560448204-e02f11c3d0e2'), U('photo-1502672260266-1c1ef2d93688'), U('photo-1600585154526-990dced4db0d')],
    desc: 'Double-height living space with floor-to-ceiling glass, smart-home automation and direct access to a private marina.' },
  { id: 5, title: 'Cedar Ridge Estate', location: 'Aspen, Colorado', price: 9750000, beds: 8, baths: 10, area: 12500, type: 'Estate', status: 'For Sale', featured: false,
    img: U('photo-1564013799919-ab600027ffc6'),
    gallery: [U('photo-1564013799919-ab600027ffc6'), U('photo-1600566753190-17f0baa2a6c3'), U('photo-1600047509807-ba8f99d2cdde'), U('photo-1600607687939-ce8a6c25118c')],
    desc: 'Ski-in ski-out mountain estate with a heated driveway, a spa wing, a library and an outdoor fire terrace.' },
  { id: 6, title: 'Villa Serena', location: 'Lake Como, Italy', price: 18400000, beds: 9, baths: 11, area: 14000, type: 'Villa', status: 'For Sale', featured: true,
    img: U('photo-1512917774080-9991f1c4c750'),
    gallery: [U('photo-1512917774080-9991f1c4c750'), U('photo-1613977257363-707ba9348227'), U('photo-1600585154340-be6161a56a0c'), U('photo-1600607687939-ce8a6c25118c')],
    desc: 'A lakefront 19th-century villa with a private dock, terraced gardens and a ballroom with frescoed ceilings.' },
  { id: 7, title: 'Glass House Malibu', location: 'Malibu, California', price: 22000, beds: 5, baths: 6, area: 6800, type: 'Villa', status: 'For Rent', featured: false, rent: true,
    img: U('photo-1600585154340-be6161a56a0c'),
    gallery: [U('photo-1600585154340-be6161a56a0c'), U('photo-1600566753190-17f0baa2a6c3'), U('photo-1512917774080-9991f1c4c750'), U('photo-1600047509807-ba8f99d2cdde')],
    desc: 'Beachfront glass pavilion with direct sand access, an outdoor kitchen and a heated lap pool. Monthly price.' },
  { id: 8, title: 'The Meridian Loft', location: 'New York, USA', price: 5400000, beds: 3, baths: 4, area: 3900, type: 'Apartment', status: 'For Sale', featured: false,
    img: U('photo-1560448204-e02f11c3d0e2'),
    gallery: [U('photo-1560448204-e02f11c3d0e2'), U('photo-1502672260266-1c1ef2d93688'), U('photo-1545324418-cc1a3fa10c00'), U('photo-1600585154526-990dced4db0d')],
    desc: 'Corner loft in a landmark Tribeca building with 14-foot ceilings, a chef kitchen and Hudson River light.' },
  { id: 9, title: 'Palm Jumeirah Signature', location: 'Palm Jumeirah, Dubai', price: 14200000, beds: 7, baths: 8, area: 9600, type: 'Villa', status: 'For Sale', featured: false,
    img: U('photo-1600047509807-ba8f99d2cdde'),
    gallery: [U('photo-1600047509807-ba8f99d2cdde'), U('photo-1613490493576-7fde63acd811'), U('photo-1512917774080-9991f1c4c750'), U('photo-1600607687939-ce8a6c25118c')],
    desc: 'Signature frond villa with 90 metres of private beach, a floating cinema and staff quarters.' }
];

window.AGENTS = [
  { name: 'Alexander Hale', role: 'Founding Partner', deals: '$1.2B sold', img: U('photo-1560250097-0b93528c311a', 800) },
  { name: 'Isabella Moretti', role: 'Senior Luxury Advisor', deals: '$640M sold', img: U('photo-1573496359142-b8d87734a5a2', 800) },
  { name: 'Daniel Okafor', role: 'International Director', deals: '$510M sold', img: U('photo-1507003211169-0a1dd7228f2d', 800) },
  { name: 'Sophie Laurent', role: 'Head of Private Office', deals: '$430M sold', img: U('photo-1494790108377-be9c29b29330', 800) }
];

window.POSTS = [
  { title: 'Why Waterfront Estates Keep Outperforming the Market', cat: 'Market', date: 'Nov 02, 2026', img: U('photo-1512917774080-9991f1c4c750', 1000) },
  { title: 'Inside the Design Trends Shaping Ultra-Luxury Homes', cat: 'Design', date: 'Oct 21, 2026', img: U('photo-1600607687939-ce8a6c25118c', 1000) },
  { title: 'A Buyer’s Guide to Purchasing Property Abroad', cat: 'Guide', date: 'Oct 09, 2026', img: U('photo-1486406146926-c627a92ad1ab', 1000) },
  { title: 'Smart Homes: Technology That Disappears Into the Walls', cat: 'Technology', date: 'Sep 28, 2026', img: U('photo-1600566753190-17f0baa2a6c3', 1000) },
  { title: 'Off-Market Deals: How Private Listings Really Work', cat: 'Insight', date: 'Sep 15, 2026', img: U('photo-1600596542815-ffad4c1539a9', 1000) },
  { title: 'Staging a Villa for a Seven-Figure Offer', cat: 'Selling', date: 'Sep 03, 2026', img: U('photo-1502672260266-1c1ef2d93688', 1000) }
];
