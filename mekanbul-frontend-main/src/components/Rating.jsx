
function Rating({ rating }) {
  const stars = []; 


  const safeRating = Math.min(Math.max(0, Math.round(rating)), 5);

  for (let i = 0; i < safeRating; i++) {
    stars.push(
      <span className="glyphicon glyphicon-star" key={i}>
        {" "}
      </span>
    );
  }


  for (let i = safeRating; i < 5; i++) {
    stars.push(
      <span className="glyphicon glyphicon-star-empty" key={i}>
        {" "}
      </span>
    );
  }


  return stars;
}

export default Rating;
