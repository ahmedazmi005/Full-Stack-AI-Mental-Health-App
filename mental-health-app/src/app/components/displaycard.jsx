
const DisplayCard = (props) => {
    return (
        <>

        <div className="display-card">
            <img src={props.image} alt={props.alt}className="card-img"></img>
            <h2>{props.name}</h2>
            <p>{props.desc}</p>
            <a href={props.link} ><button className="button">Learn More</button></a>
           
            </div>

      </>
    )
  }

  export default DisplayCard;