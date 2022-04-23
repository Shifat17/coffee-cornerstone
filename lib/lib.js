import { createApi } from 'unsplash-js';

const unsplashApi = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_API_KEY,
  //...other fetch options
});

export const getUrlForCoffeeStores = (latlng, limit, query) => {
  return `https://api.foursquare.com/v3/places/nearby?query=${query}&ll=${latlng}&client_id=${process.env.NEXT_PUBLIC_FOURSQUARE_CLIENT_ID}&client_secret=${process.env.NEXT_PUBLIC_FOURSQUARE_CLIENT_SECRET}&limit=${limit}`;
};

const fetchCoffeeStoreImages = async () => {
  const results = await unsplashApi.search.getPhotos({
    query: 'coffee store',
    page: 1,
    perPage: 30,
  });
  const photoResponses = results.response.results;
  const photos = photoResponses.map((photo) => {
    return photo.urls['small'];
  });
  return photos;
};

export const fetchCoffeeStores = async (
  latlng = '43.65267326999575,-79.39545615725015',
  limit = 8
) => {
  const latLong = latlng.replace(' ', '');

  // const lat = myArr[0];
  // const lng = myArr[1];
  try {
    const photos = await fetchCoffeeStoreImages();
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
      },
    };

    const response = await fetch(
      getUrlForCoffeeStores(latLong, limit, 'coffee'),
      options
    );
    const data = await response.json();
    return (
      data.results.map((venue, idx) => {
        const neighbourhood = venue.location.neighbourhood;
        return {
          // ...venue,
          id: venue.fsq_id,
          address: venue.location.address || '',
          name: venue.name,
          neighbourhood:
            (neighbourhood && neighbourhood.length > 0 && neighbourhood[0]) ||
            venue.location.cross_street ||
            '',
          imgUrl: photos[idx],
        };
      }) || []
    );
  } catch (error) {
    if (
      !process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY ||
      !process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY
    ) {
      console.error(
        '🚨 Make sure to setup your API keys, checkout the docs on Github 🚨'
      );
    }
    return [];
  }
};
