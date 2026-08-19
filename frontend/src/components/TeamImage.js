import React, { useState, useEffect } from "react";

const TeamImage = ({ team }) => {
  const [imageUrl, setImageUrl] = useState(
    `http://localhost:8080/images/team/team_${team.id}.jpg`,
  );

  useEffect(() => {
    const checkImageExists = async (url) => {
      try {
        const response = await fetch(url, { method: "HEAD" });
        return response.ok;
      } catch (error) {
        return false;
      }
    };

    const verifyImage = async () => {
      const jpgUrl = `http://localhost:8080/images/team/team_${team.id}.jpg`;
      const pngUrl = `http://localhost:8080/images/team/team_${team.id}.png`;

      const jpgExists = await checkImageExists(jpgUrl);
      if (jpgExists) {
        setImageUrl(jpgUrl);
      } else {
        const pngExists = await checkImageExists(pngUrl);
        if (pngExists) {
          setImageUrl(pngUrl);
        } else {
          setImageUrl("http://localhost:8080/images/team/default-team.png");
        }
      }
    };

    verifyImage();
  }, [team.id]);

  return (
    <img
      src={imageUrl}
      alt={`${team.name}`}
      className="team-picture"
      style={{
        width: "100px",
        height: "100px",
        objectFit: "cover",
        borderRadius: "4px",
      }}
    />
  );
};

export default TeamImage;
