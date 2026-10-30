import { useEffect, useState } from 'react';
import { getPhoto } from '../api/client.js';

/**
 * The profile photo for the header. Telegram puts photo_url into initData only sometimes (never when the app is
 * opened from the bot's bottom keyboard), so then the photo comes from the server (/api/me/photo), as a blob URL.
 */
export function useAvatar({ user, initData, isTelegram }) {
  const [url, setUrl] = useState(null);
  const own = user?.photo_url;
  useEffect(() => {
    if (own || !isTelegram) return undefined;
    let made = null, stop = false;
    getPhoto({ initData }).then((blob) => {
      if (blob && !stop) { made = URL.createObjectURL(blob); setUrl(made); }
    }).catch(() => {}); // no photo / hidden by privacy settings: the initial letter stays
    return () => { stop = true; if (made) URL.revokeObjectURL(made); };
  }, [own, isTelegram, initData]);
  return own || url;
}
