import React from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTooltip,
  CAvatar,
} from "@coreui/react";

function truncateSmart(text, maxLength) {
  if (text.length <= maxLength) return text;
  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + "...";
}

const formatDuration = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};


function LikedSongsCard({ likedSongs }) {
  return (
    <CCard className="shadow-sm">
      <CCardHeader className="fw-bold">Liked Songs</CCardHeader>
      <CCardBody className="p-0">
        <CTable
          align="middle"
          className="mb-0 table-striped"
          hover
          responsive
          bordered
        >
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell style={{ width: "60px", textAlign: "center" }}>
                Album
              </CTableHeaderCell>
              <CTableHeaderCell>Song</CTableHeaderCell>
              <CTableHeaderCell>Release</CTableHeaderCell>
              <CTableHeaderCell>Artists</CTableHeaderCell>
              <CTableHeaderCell style={{ width: "60px", textAlign: "center" }}>
                Length
              </CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {likedSongs.map((song, index) => (
              <CTableRow key={index}>
                <CTableDataCell>
                  <CTooltip content={song.album}>
                    <a
                      href={`https://open.spotify.com/track/${song.spotifyId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={song.images[0].url}
                        alt={song.album}
                        width="50"
                        className="rounded"
                      />
                    </a>
                  </CTooltip>
                </CTableDataCell>
                <CTableDataCell>
                  <strong>{truncateSmart(song.title, 30)}</strong>
                </CTableDataCell>
                <CTableDataCell>
                  <strong>
                    {/\d{4}-\d{2}-\d{2}/.test(song.releaseDate)
                      ? new Date(song.releaseDate).toLocaleDateString()
                      : song.releaseDate}
                  </strong>
                </CTableDataCell>
                <CTableDataCell>
                  {song.artists.map((artist, index) => (
                    <CTooltip content={artist.artist} key={index}>
                      <CAvatar
                        size="md"
                        src={`https://api.dicebear.com/8.x/personas/svg?seed=${encodeURIComponent(
                          artist
                        )}`}
                        title={artist}
                        className="border"
                        style={{
                          marginLeft: index === 0 ? 0 : -15,
                          zIndex: song.artists.length - index,
                        }}
                      />
                    </CTooltip>
                  ))}
                </CTableDataCell>
                <CTableDataCell>{formatDuration(song.duration)}</CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  );
}

export default LikedSongsCard;
