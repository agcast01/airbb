import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { singleSpot } from "../../store/spot"
import * as reviewActions from '../../store/review';
import EditSpotForm from "./EditSpotFrom";
import DeleteSpotForm from "./DeleteSpotForm";
import AddReviewForm from "../Reviews/AddReviewForm";
import EditReviewForm from "../Reviews/EditReviewForm";
import DeleteReviewForm from "../Reviews/DeleteReviewForm";
import spot1 from '../../images/spot-1.jpg'
import spot2 from '../../images/spot-2.jpg'
import spot3 from '../../images/spot-3.jpg'
import spot4 from '../../images/spot-4.jpg'
import spot5 from '../../images/spot-5.png'

const images = [spot1, spot2, spot3, spot4, spot5]
const SpotDetails = () => {
    const { spotId } = useParams()
    const dispatch = useDispatch()
    const [edit, setEdit] = useState(false);
    const [deletePage, setDeletePage] = useState(false);
    const [addReview, setAddReview] = useState(false);
    const [editReview, setEditReview] = useState(false);
    const [deleteReview, setDeleteReview] = useState(false);

    useEffect(() => {
        dispatch(singleSpot(spotId));
        dispatch(reviewActions.spotReviews(spotId));
    }, [dispatch, spotId, addReview, editReview, deleteReview, edit])

    const spots = useSelector(state => state.spots);
    let spot;
    if(spots && spots[spotId]) spot = spots[spotId]


    
    const session = useSelector(state => state.session)
    let user;
    if(session.user) user = session.user


    let reviews = useSelector(state => state.review);

    let avgRating;
    let reviewers = [];
    if(reviews) {
        console.log(reviews)
        let stars = [...Object.values(reviews).map(review => review.stars)]
        let total;
        if(stars.length)total = stars.reduce((acc, cur) => acc + cur)
        avgRating = total / Object.keys(reviews).length;

        reviewers = Object.values(reviews).map(review => review.userId);
    }



    return (
        <>
        <div className='details'>
        {spot && reviews && spot.User &&  (
        <>  
            <h2>{spot.name} - {spot.description}</h2>
            <div className="info">
                <p>★{avgRating || 5} · {Object.keys(reviews).length} reviews · {spot.city}, {spot.state}, {spot.country}</p>
            </div>
            <div className='images'>

                {images[spotId - 1] && (<img className="previewImage" src={images[spotId - 1]}/>) ||
                    (<i className="fa-solid fa-house" id="preview"/>)
                }
            </div>
            <div style={{position: 'relative'}}>
            <h3>House hosted by {spot.User.firstName}</h3>
            <h4 style= {{position: 'absolute', top: '-20px', right: 0}}>Price: ${spot.price} night</h4>
            </div>

        </>)}
        {reviews && Object.keys(reviews).length &&(
            <>
            <h3>★{avgRating || 5} · {Object.keys(reviews).length} reviews</h3>
            <ul>
                {Object.keys(reviews).map(id => (
                    <li key={id}>
                        {reviews[id].User && reviews[id].User.firstName && (
                        <>
                        <h4>{`${reviews[id].User.firstName} ${reviews[id].User.lastName}`}</h4>
                        {`${reviews[id].stars} Stars: ${reviews[id].review}`}
                        {reviews && user && user.user.id === reviews[id].userId && (
                            <>
                            <button onClick={() => setEditReview(!editReview)}>Edit Review</button>
                            {editReview && (
                                <EditReviewForm isOpen={editReview} setOpen={setEditReview} currentReview={reviews[id]}/>
                            )}
                            <button onClick={() => setDeleteReview(!deleteReview)}>Delete Review</button>
                            {deleteReview && (
                                <DeleteReviewForm isOpen={deleteReview} setOpen={setDeleteReview} reviewId={id} />
                            )}
                            </>
                        )}
                        </>
                )}
                    </li>
                ))}
            </ul>
            </>
        )}
        {spot && user && user.user.id === spot.ownerId &&
        (<>
            <button onClick={() => setEdit(!edit)}>Edit Spot</button>
            {edit && (
                <EditSpotForm isOpen={edit} setOpen={setEdit} spot={spot}/>
            )}
            <button onClick={() => setDeletePage(!deletePage)}>Delete Spot</button>
            {deletePage && (
                <DeleteSpotForm isOpen={deletePage} setOpen={setDeletePage} spot={spot}/>
            )}
        </>
        )}
        {spot && user && user.user.id !== spot.ownerId && !reviewers.includes(user.user.id) && (
            <>
                <button onClick={() => setAddReview(!addReview)}>Add Review</button>
                {addReview && (
                    <AddReviewForm isOpen={addReview} setOpen={setAddReview} spotId={spotId} />
                )}
            </>
        )}
        </div>
        </>
    )
}

export default SpotDetails;