import React, { useState, useEffect } from "react";

const TeamImageVerySmall = ({ team, style = {} }) => {
  const [imageUrl, setImageUrl] = useState(
    `http://localhost:8080/images/team/team_${team.id}.jpg`,
  );

  useEffect(() => {
    const verifyImage = async () => {
      const jpgUrl = `http://localhost:8080/images/team/team_${team.id}.jpg`;
      const pngUrl = `http://localhost:8080/images/team/team_${team.id}.png`;

      try {
        const response = await fetch(jpgUrl, { method: "HEAD" });
        if (response.ok) {
          setImageUrl(jpgUrl);
        } else {
          const responsePng = await fetch(pngUrl, { method: "HEAD" });
          if (responsePng.ok) {
            setImageUrl(pngUrl);
          } else {
            setImageUrl("http://localhost:8080/images/team/default-team.png");
          }
        }
      } catch (error) {
        setImageUrl("http://localhost:8080/images/team/default-team.png");
      }
    };

    verifyImage();
  }, [team.id]);

  return (
    <img
      src={imageUrl}
      alt={team.name}
      className="team-picture"
      style={{
        width: "20px",
        height: "20px",
        objectFit: "contain",
        borderRadius: "4px",
        ...style,
      }}
    />
  );
};

export default TeamImageVerySmall;
