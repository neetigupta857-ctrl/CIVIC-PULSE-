import { NextResponse } from 'next/server';
import { ALL_INDIAN_CITIES } from '@/data/indianCities';

interface GeocodeSuggestion {
  displayName: string;
  shortName: string;
  lat: number;
  lng: number;
  city?: string;
  state?: string;
}

// Known landmark database for Indian cities to guarantee high-accuracy geocoding
// for prominent colonies, streets, and zones, including Vijay Nagar Colony Agra
const KNOWN_INDIAN_LOCALITIES: Array<{
  keywords: string[];
  city: string;
  displayName: string;
  lat: number;
  lng: number;
}> = [
  {
    keywords: ['vijay nagar', 'vijay nagar colony', 'north vijay nagar'],
    city: 'Agra',
    displayName: 'North Vijay Nagar Colony, Civil Lines, Agra, Uttar Pradesh 282004',
    lat: 27.2023,
    lng: 78.0210
  },
  {
    keywords: ['sanjay place'],
    city: 'Agra',
    displayName: 'Sanjay Place Commercial Hub, Civil Lines, Agra, Uttar Pradesh 282003',
    lat: 27.2010,
    lng: 78.0053
  },
  {
    keywords: ['balkeshwar'],
    city: 'Agra',
    displayName: 'Balkeshwar Colony & River Ghat, Agra, Uttar Pradesh 282004',
    lat: 27.2088,
    lng: 78.0286
  },
  {
    keywords: ['kamla nagar'],
    city: 'Agra',
    displayName: 'Kamla Nagar Main Market & Colony, Agra, Uttar Pradesh 282004',
    lat: 27.2136,
    lng: 78.0187
  },
  {
    keywords: ['taj ganj', 'fatehabad road'],
    city: 'Agra',
    displayName: 'Fatehabad Road, Taj Ganj, Agra, Uttar Pradesh 282001',
    lat: 27.1602,
    lng: 78.0427
  },
  {
    keywords: ['civil lines'],
    city: 'Agra',
    displayName: 'Civil Lines, MG Road, Agra, Uttar Pradesh 282003',
    lat: 27.1994,
    lng: 78.0059
  },
  {
    keywords: ['bodla'],
    city: 'Agra',
    displayName: 'Bodla Market / Crossing, Agra, Uttar Pradesh 282007',
    lat: 27.1876,
    lng: 77.9615
  },
  {
    keywords: ['dayalbagh', 'dayal bagh'],
    city: 'Agra',
    displayName: 'Dayalbagh Educational Zone, Agra, Uttar Pradesh 282005',
    lat: 27.2289,
    lng: 78.0156
  },
  {
    keywords: ['lajpat nagar'],
    city: 'New Delhi',
    displayName: 'Lajpat Nagar Central Market, Ring Road, New Delhi 110024',
    lat: 28.5678,
    lng: 77.2416
  },
  {
    keywords: ['connaught place', 'cp'],
    city: 'New Delhi',
    displayName: 'Connaught Place Central Circle, New Delhi 110001',
    lat: 28.6318,
    lng: 77.2194
  },
  {
    keywords: ['hauz khas'],
    city: 'New Delhi',
    displayName: 'Hauz Khas Village & Enclave, New Delhi 110016',
    lat: 28.5541,
    lng: 77.1945
  },
  {
    keywords: ['bellandur', 'outer ring road', 'ecospace'],
    city: 'Bengaluru',
    displayName: 'Outer Ring Road, Bellandur, Bengaluru, Karnataka 560103',
    lat: 12.9260,
    lng: 77.6834
  },
  {
    keywords: ['koramangala'],
    city: 'Bengaluru',
    displayName: 'Koramangala 5th Block, Bengaluru, Karnataka 560095',
    lat: 12.9357,
    lng: 77.6241
  },
  {
    keywords: ['whitefield'],
    city: 'Bengaluru',
    displayName: 'Whitefield Main Road, Bengaluru, Karnataka 560066',
    lat: 12.9698,
    lng: 77.7500
  },
  {
    keywords: ['andheri', 'andheri west'],
    city: 'Mumbai',
    displayName: 'Andheri West, SV Road, Mumbai, Maharashtra 400058',
    lat: 19.1172,
    lng: 72.8340
  },
  {
    keywords: ['bandra', 'bandra west'],
    city: 'Mumbai',
    displayName: 'Bandra West, Linking Road, Mumbai, Maharashtra 400050',
    lat: 19.0583,
    lng: 72.8303
  }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get('q') || '').trim();
  const city = (searchParams.get('city') || '').trim();

  if (!query || query.length < 2) {
    return NextResponse.json({ success: true, suggestions: [] });
  }

  const queryLower = query.toLowerCase();
  const cityLower = city.toLowerCase();
  const suggestions: GeocodeSuggestion[] = [];

  // 1. Check verified curated localities database first
  for (const loc of KNOWN_INDIAN_LOCALITIES) {
    const cityMatches =
      !city ||
      cityLower === 'all india (national)' ||
      loc.city.toLowerCase() === cityLower ||
      loc.city.toLowerCase().includes(cityLower) ||
      cityLower.includes(loc.city.toLowerCase());

    const keywordMatches = loc.keywords.some((kw) => queryLower.includes(kw) || kw.includes(queryLower));

    if (cityMatches && keywordMatches) {
      suggestions.push({
        displayName: loc.displayName,
        shortName: loc.displayName.split(',')[0],
        lat: loc.lat,
        lng: loc.lng,
        city: loc.city
      });
    }
  }

  // 2. Query Nominatim OpenStreetMap with robust city context and India country boundary
  try {
    let cleanQuery = query;
    if (city && city.toLowerCase() !== 'all india (national)' && !queryLower.includes(cityLower)) {
      cleanQuery = `${query}, ${city}`;
    }

    const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      cleanQuery
    )}&format=json&countrycodes=in&limit=6&addressdetails=1`;

    const res = await fetch(nominatimUrl, {
      headers: {
        'User-Agent': 'CivicPulseApp/1.0 (contact: admin@civicpulse.org)'
      },
      next: { revalidate: 60 }
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        for (const item of data) {
          const lat = parseFloat(item.lat);
          const lng = parseFloat(item.lon);

          const addr = item.address || {};
          const itemCity = addr.city || addr.town || addr.county || addr.state_district || '';
          const itemState = addr.state || '';

          // If city was specified, filter out obvious mismatches from another state
          if (city && city.toLowerCase() !== 'all india (national)') {
            const cityInfo = ALL_INDIAN_CITIES.find(
              (c) => c.name.toLowerCase() === cityLower || c.name.toLowerCase().includes(cityLower)
            );
            if (cityInfo && cityInfo.state) {
              if (itemState && !itemState.toLowerCase().includes(cityInfo.state.toLowerCase()) && !cityInfo.state.toLowerCase().includes(itemState.toLowerCase())) {
                continue; // Skip out-of-state Nominatim false positive
              }
            }
          }

          // Avoid duplicate entries
          const isDuplicate = suggestions.some(
            (s) => Math.abs(s.lat - lat) < 0.001 && Math.abs(s.lng - lng) < 0.001
          );

          if (!isDuplicate) {
            suggestions.push({
              displayName: item.display_name,
              shortName: item.name || item.display_name.split(',')[0],
              lat: Number(lat.toFixed(5)),
              lng: Number(lng.toFixed(5)),
              city: itemCity,
              state: itemState
            });
          }
        }
      }
    }
  } catch (err) {
    console.error('Nominatim geocode fetch error:', err);
  }

  // 3. Query Photon Geocoder as complementary fallback
  if (suggestions.length < 3) {
    try {
      let photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(
        city && city.toLowerCase() !== 'all india (national)' ? `${query} ${city}` : query
      )}&limit=5`;

      const cityInfo = ALL_INDIAN_CITIES.find(
        (c) => c.name.toLowerCase() === cityLower || c.name.toLowerCase().includes(cityLower)
      );
      if (cityInfo) {
        photonUrl += `&lat=${cityInfo.lat}&lon=${cityInfo.lng}`;
      }

      const photonRes = await fetch(photonUrl);
      if (photonRes.ok) {
        const pData = await photonRes.json();
        if (pData?.features && Array.isArray(pData.features)) {
          for (const feat of pData.features) {
            const props = feat.properties || {};
            const coords = feat.geometry?.coordinates || [];
            if (coords.length >= 2 && props.countrycode === 'IN') {
              const lng = coords[0];
              const lat = coords[1];

              // Check state consistency
              if (cityInfo?.state && props.state) {
                if (!props.state.toLowerCase().includes(cityInfo.state.toLowerCase()) && !cityInfo.state.toLowerCase().includes(props.state.toLowerCase())) {
                  continue;
                }
              }

              const isDuplicate = suggestions.some(
                (s) => Math.abs(s.lat - lat) < 0.001 && Math.abs(s.lng - lng) < 0.001
              );

              if (!isDuplicate) {
                const label = [props.name, props.street, props.district, props.city, props.state]
                  .filter(Boolean)
                  .join(', ');
                suggestions.push({
                  displayName: label || props.name || query,
                  shortName: props.name || query,
                  lat: Number(lat.toFixed(5)),
                  lng: Number(lng.toFixed(5)),
                  city: props.city,
                  state: props.state
                });
              }
            }
          }
        }
      }
    } catch (err) {
      console.error('Photon geocode fetch error:', err);
    }
  }

  return NextResponse.json({
    success: true,
    query,
    count: suggestions.length,
    suggestions: suggestions.slice(0, 6)
  });
}

