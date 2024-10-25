import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const ViewReviewStars = ({ rating }) => {
    return (
        <div className="flex">
            {[...Array(5)].map((_, i) => (
                <FontAwesomeIcon
                    key={i}
                    icon={faStar}
                    className={i < rating ? 'text-yellow-400' : 'text-gray-300'}
                />
            ))}
        </div>
    );
};

export default ViewReviewStars;
