import { Card, CardContent } from "@mui/material";
import React, { FC } from "react";

export type SongCardInfo = {
  id: string;
  label: string;
  artistName?: string;
  trackName?: string;
  artworkUrl?: string;
};
export const SongCard: FC<{ info: SongCardInfo }> = ({ info }) => {
  return (
    <Card style={{ margin: " 1rem 0" }}>
      <CardContent>
        <div style={{ height: "60px", overflow: "hidden" }}>
          <img
            src={info.artworkUrl ?? "https://via.placeholder.com/60"}
            alt="album cover"
            style={{ width: "60px", height: "60px", float: "left" }}
          />
          <div style={{ padding: "0 80px" }}>
            <strong>{info.trackName}</strong>
            <br />
            <small>artist</small> {info.artistName}
            <br />
            <small>album</small> {info.label}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
