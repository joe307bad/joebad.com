import {format, parseISO} from "date-fns";

export const flickrApi = () => {
  return {
    async getMostRecentPhoto(): Promise<PhotoDetails> {
      const flickrApiKey = process.env.FLICKR_API_KEY || "";
      const photos = await fetch(
        `https://api.flickr.com/services/rest/?method=flickr.people.getPublicPhotos&api_key=${flickrApiKey}&user_id=201450104@N05&per_page=1&page=1&format=json&nojsoncallback=1&extras=date_upload`
      ).then((res) => res.json());

      const {id, server, secret, dateupload: date,title} =  photos?.photos?.photo?.[0] ?? {};

      return {
        url: id ? `https://live.staticflickr.com/${server}/${id}_${secret}.jpg` : null,
        date: date ? format(new Date(parseInt(date) * 1000), "LLL do") : '',
        title: title ? title : '',
        myPhotos: 'https://www.flickr.com/photos/joe307bad/'
      };
    },
  };
};

export type PhotoDetails = {
  url: string | null;
  date: string;
  title: string;
  myPhotos: string;
};
