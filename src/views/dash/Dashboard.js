import React, { useContext, useEffect, useState } from "react";
import {
  CButton, CCol, CRow, CWidgetStatsF,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cibSpotify,
  cibTidal,
  cilUser,
} from "@coreui/icons";

import { youtube } from "src/assets/brand/other/youtube";
import { AppleLogo } from "src/assets/brand/other/apple";
import { UserContext } from "src/api/UserContext";
import SecureContent from "src/components/SecureContent";
import FriendsCard from "src/views/dash/impl/FriendsCard";
import api from "src/api/apiClient";
import { MusicTracks } from "src/api/data/MusicTracks";
import UnlinkModal from "src/views/dash/impl/UnlinkModal";
import {MusicPlatforms} from "src/api/data/MusicPlatforms";
import LikedSongsCard from "src/views/dash/impl/LikedSongsCard";

const platformIcons = {
  [MusicPlatforms.SPOTIFY]: <CIcon icon={cibSpotify} height={36} style={{ color: "#1DB954" }} />,
  [MusicPlatforms.APPLE_MUSIC]: <AppleLogo />,
  [MusicPlatforms.YOUTUBE]: <CIcon icon={youtube} height={36} style={{ color: "#FF0000" }} />,
  [MusicPlatforms.TIDAL]: <CIcon icon={cibTidal} height={36} style={{ color: "#000000" }} />,
};

const DashboardContent = () => {
  const { userAccount } = useContext(UserContext);
  const isLinked = {
    [MusicPlatforms.SPOTIFY]: userAccount?.hasSpotify === true,
    [MusicPlatforms.YOUTUBE]: userAccount?.hasYoutube === true,
    [MusicPlatforms.APPLE_MUSIC]: false, // You can add real logic later
    [MusicPlatforms.TIDAL]: false,
  };

  const [spotifyName, setSpotifyName] = useState(null);
  const [spotifyID, setSpotifyID] = useState(null);
  const [likedSongs, setLikedSongs] = useState([]);

  const [visible, setVisible] = useState(false);
  const [unlinkingPlatform, setUnlinkingPlatform] = useState(null);

  useEffect(() => {
    if (isLinked[MusicPlatforms.SPOTIFY]) {
      api.authorized
        .get("spotify/account", "json")
        .then((res) => {
          if (res.data?.display_name) {
            setSpotifyName(res.data.display_name);
            setSpotifyID(res.data.id);
          }
        })
        .catch((err) => {
          console.error("Error fetching Spotify account:", err);
        });

      api.authorized
        .get("spotify/tracks")
        .then((res) => {
          const parsedSongs = (res.data || []).map(MusicTracks.fromRaw);
          setLikedSongs(parsedSongs);
        })
        .catch((err) => {
          console.error("Failed to fetch Spotify tracks:", err);
        });
    }
  }, [isLinked[MusicPlatforms.SPOTIFY]]);


  const handleUnlinkClick = (platform) => {
    setUnlinkingPlatform(platform);
    setVisible(true);
  };

  const handleUnlinkConfirm = async () => {
    if (!unlinkingPlatform) return;
    try {
      const endpoint = `${unlinkingPlatform.toLowerCase().replace(" ", "")}/unlink`;
      await api.authorized.get(endpoint);
    } catch (error) {
      window.location.reload();
      console.error("Unlink failed", error);
    }
  };

  return (
    <>
      <CRow>
        {Object.values(MusicPlatforms).map((platform) => (
          <CCol key={platform} xs={3}>
            <CWidgetStatsF
              className="mb-3"
              icon={platformIcons[platform]}
              title={
                platform === MusicPlatforms.SPOTIFY
                  ? spotifyName ?? "?"
                  : "?"
              }
              value={platform}
              footer={
                isLinked[platform] ? (
                  <div className="d-flex gap-2">
                    <CButton
                      color="secondary"
                      style={{ width: "50%" }}
                      href={
                        platform === MusicPlatforms.SPOTIFY
                          ? `https://open.spotify.com/user/${spotifyID}`
                          : "#"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <CIcon icon={cilUser} className="me-1" />
                      Profile
                    </CButton>
                    <CButton
                      color="danger"
                      style={{ width: "50%" }}
                      onClick={() => handleUnlinkClick(platform)}
                    >
                      Unlink
                    </CButton>
                  </div>
                ) : (
                  <CButton
                    style={{ width: "100%" }}
                    href={api.buildUrl(
                      `link/${platform.toLowerCase().replace(" ", "")}`
                    )}
                    color="primary"
                  >
                    Link
                  </CButton>
                )
              }
            />
          </CCol>
        ))}
      </CRow>

      <CRow>
        <FriendsCard />
        <CCol xs="12" md="9">
          <LikedSongsCard likedSongs={likedSongs}/>
        </CCol>
      </CRow>

      <UnlinkModal
        visible={visible}
        onClose={() => setVisible(false)}
        platform={unlinkingPlatform}
        onUnlink={handleUnlinkConfirm}
      />
    </>
  );
};

const Dashboard = () => {
  return (
    <SecureContent fallback={<>Hmm NA</>}>
      <DashboardContent />
    </SecureContent>
  );
};

export default Dashboard;
