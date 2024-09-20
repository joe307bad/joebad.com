export const flickrApi = () => {
  return {
    async getMostRecentPhoto(): Promise<PhotoDetails> {
      const flickrApiKey = process.env.FLICKR_API_KEY || "";
      const photos = await fetch(
        `https://api.flickr.com/services/rest/?method=flickr.people.getPublicPhotos&api_key=${flickrApiKey}&user_id=201450104@N05&per_page=1&page=1&format=json&nojsoncallback=1`
      ).then((res) => res.json());

      const {id, server, secret} =  photos?.photos?.photo?.[0] ?? {};

      return {
        url: `https://live.staticflickr.com/${server}/${id}_${secret}.jpg`,
      };
    },
  };
};

export type PhotoDetails = {
  url: string;
};
