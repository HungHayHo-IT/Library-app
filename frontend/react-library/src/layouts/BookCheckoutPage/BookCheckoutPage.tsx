import { useEffect, useState } from "react";
import BookModel from "../../models/BookModels";
import { SprinnerLoading } from "../Utils/SpinnerLoading";
import { StarsReview } from "../Utils/StarsReview";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";
import ReviewModel from "../../models/ReviewModel";
import { LatestReviews } from "./LastReviews";

export const BookCheckoutPage = () => {
    // 1. TẤT CẢ HOOKS useState và useEffect phải ở trên cùng
    const [book, setBook] = useState<BookModel>();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    const [reviews, setReviews] = useState<ReviewModel[]>([]);
    const [totalStars, setTotalStars] = useState(0);
    const [isLoadingReview, setIsLoadingReview] = useState(true);

    const bookId = window.location.pathname.split("/checkout/")[1];

    // Effect 1: Fetch book
    useEffect(() => {
        const fetchBook = async () => {
            try {
                const baseUrl: string = `http://localhost:8082/api/books/${bookId}`;
                const response = await fetch(baseUrl);

                if (!response.ok) {
                    throw new Error("Something went wrong!");
                }

                const responseJson = await response.json();
                const responseData = responseJson;
                const loadedBooks: BookModel = {
                    id: responseData.id,
                    title: responseData.title,
                    author: responseData.author,
                    description: responseData.description,
                    copies: responseData.copies,
                    copiesAvailable: responseData.copiesAvailable,
                    category: responseData.category,
                    img: responseData.img
                };

                setBook(loadedBooks);
                setIsLoading(false);
            } catch (error: any) {
                setIsLoading(false);
                setHttpError(error.message);
            }
        };

        fetchBook();
    }, [bookId]); // Thêm bookId vào dependency

    // Effect 2: Fetch reviews
    useEffect(() => {
        const fetchBookReviews = async () => {
            try {
                setIsLoadingReview(true); // Bắt đầu loading

                const reviewUrl = `http://localhost:8082/api/reviews/search/findByBookId?bookId=${bookId}`;
                const response = await fetch(reviewUrl);

                if (!response.ok) {
                    throw new Error("Something went wrong!");
                }

                const responseJson = await response.json();
                const responseData = responseJson._embedded?.reviews || [];

                const loadedReviews: ReviewModel[] = [];
                let weightedStarReview = 0;

                for (const key in responseData) {
                    const review = responseData[key];
                    loadedReviews.push({
                        id: review.id,
                        userEmail: review.userEmail,
                        date: review.date,
                        rating: review.rating,
                        book_id: review.book_id,
                        reviewDescription: review.reviewDescription
                    });
                    weightedStarReview += review.rating;
                }

                // Tính điểm trung bình
                if (loadedReviews.length > 0) {
                    const round = (Math.round((weightedStarReview / loadedReviews.length) * 2) / 2).toFixed(1);
                    setTotalStars(Number(round));
                }

                setReviews(loadedReviews);
                setIsLoadingReview(false);

            } catch (error: any) {
                setIsLoadingReview(false);
                setHttpError(error.message);
            }
        };

        fetchBookReviews();
    }, [bookId]);

    // 2. SAU ĐÓ mới đến các điều kiện return
    if (isLoading || isLoadingReview) {
        return <SprinnerLoading />;
    }

    if (httpError) {
        return (
            <div className="container mt-5">
                <p>{httpError}</p>
            </div>
        );
    }

    // 3. CUỐI CÙNG là return JSX
    return (
        <div>
            <div className='container d-none d-lg-block'>
                <div className='row mt-5'>
                    <div className='col-sm-2 col-md-2'>
                        {book?.img ?
                            <img src={book?.img} width='226' height='349' alt='Book' />
                            :
                            <img src={require('./../../Images/BooksImages/book-luv2code-1000.png')} width='226'
                                height='349' alt='Book' />
                        }
                    </div>
                    <div className='col-4 col-md-4 container'>
                        <div className='ml-2'>
                            <h2>{book?.title}</h2>
                            <h5 className='text-primary'>{book?.author}</h5>
                            <p className='lead'>{book?.description}</p>
                            {/* Sửa: dùng totalStars thay vì hardcode 4 */}
                            <StarsReview rating={totalStars} size={32} />
                        </div>
                    </div>
                    <CheckoutAndReviewBox book={book} mobile={false} />
                </div>
                <hr />
                <LatestReviews reviews={reviews} bookId={book?.id} mobile={false} />
            </div>

            <div className='container d-lg-none mt-5'>
                <div className='d-flex justify-content-center alighn-items-center'>
                    {book?.img ?
                        <img src={book?.img} width='226' height='349' alt='Book' />
                        :
                        <img src={require('./../../Images/BooksImages/book-luv2code-1000.png')} width='226'
                            height='349' alt='Book' />
                    }
                </div>
                <div className='mt-4'>
                    <div className='ml-2'>
                        <h2>{book?.title}</h2>
                        <h5 className='text-primary'>{book?.author}</h5>
                        <p className='lead'>{book?.description}</p>
                        {/* Sửa: dùng totalStars thay vì hardcode 4.5 */}
                        <StarsReview rating={totalStars} size={32} />
                    </div>
                </div>
                <CheckoutAndReviewBox book={book} mobile={true} />
                <hr />
                <LatestReviews reviews={reviews} bookId={book?.id} mobile={true} />
            </div>
        </div>
    );
};