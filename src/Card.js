function Card({ value }) {
  return (
    <div className="Card">
      <img src={`/images/${value}.svg`}  alt={value} />
    </div>
  );
}

export default Card;
