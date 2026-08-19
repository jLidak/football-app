import React, { useState, useEffect } from "react";

const PlayerImage = ({ player }) => {
  const [imageUrl, setImageUrl] = useState(
    `http://localhost:8080/images/player/player_${player.id}.jpg`,
  );

  useEffect(() => {
    // Function to check if an image exists
    const checkImageExists = async (url) => {
      try {
        const response = await fetch(url, { method: "HEAD" });
        return response.ok;
      } catch (error) {
        return false;
      }
    };

    // Verify if JPG or PNG image exists
    const verifyImage = async () => {
      const jpgUrl = `http://localhost:8080/images/player/player_${player.id}.jpg`;
      const pngUrl = `http://localhost:8080/images/player/player_${player.id}.png`;

      const jpgExists = await checkImageExists(jpgUrl);
      if (jpgExists) {
        setImageUrl(jpgUrl);
      } else {
        const pngExists = await checkImageExists(pngUrl);
        if (pngExists) {
          setImageUrl(pngUrl);
        } else {
          // Optionally set a default image if none exist
          setImageUrl("http://localhost:8080/images/player/default-player.png");
        }
      }
    };

    verifyImage();
  }, [player.id]);

  return (
    <img
      src={imageUrl}
      alt={`${player.firstName} ${player.lastName}`}
      className="player-picture"
      style={{
        width: "50px",
        height: "50px",
        objectFit: "cover",
        borderRadius: "4px",
      }}
    />
  );
};

export default PlayerImage;
