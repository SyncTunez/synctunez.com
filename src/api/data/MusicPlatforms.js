export const MusicPlatforms = Object.freeze({
  SPOTIFY: 'Spotify',
  APPLE_MUSIC: 'Apple Music',
  YOUTUBE: 'YouTube',
  TIDAL: 'Tidal',
});

import CIcon from "@coreui/icons-react";
import { cibSpotify, cibTidal } from "@coreui/icons";
import { youtube } from "src/assets/brand/other/youtube";
import { AppleLogo } from "src/assets/brand/other/apple";


export const platformIcons = {
  [MusicPlatforms.SPOTIFY]: <CIcon icon={cibSpotify} height={36} style={{ color: "#1DB954" }} />,
  [MusicPlatforms.APPLE_MUSIC]: <AppleLogo />,
  [MusicPlatforms.YOUTUBE]: <CIcon icon={youtube} height={36} style={{ color: "#FF0000" }} />,
  [MusicPlatforms.TIDAL]: <CIcon icon={cibTidal} height={36} style={{ color: "#000000" }} />,
}; 