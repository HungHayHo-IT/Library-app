import { useEffect, useState } from "react";

import { StarsReview } from "../Utils/StarsReview";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";
import BookModel from "../../models/BookModels";
import { SprinnerLoading } from "../Utils/SpinnerLoading";
import ReviewModel from "../../models/ReviewModel";
import { LatestReviews } from "./LastReviews";

export const BookCheckoutPage = () => {
    // --- STATE ---
    const [book, setBook] = useState<BookModel>();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    // Review State
    const [reviews, setReviews] = useState<ReviewModel[]>([]);
    const [totalStars, setTotalStars] = useState(0);
    const [isLoadingReview, setIsLoadingReview] = useState(true);

    // Lấy Book ID từ URL (Giả sử đường dẫn là /checkout/:bookId)
    // Cách này an toàn hơn split("/checkout/")[1] nếu đường dẫn phức tạp
    const bookId = (window.location.pathname).split('/')[2];

    // --- EFFECT 1: FETCH BOOK ---
    useEffect(() => {
        const fetchBook = async () => {
            try {
                const baseUrl: string = `http://localhost:8082/api/books/${bookId}`;
                const response = await fetch(baseUrl);

                if (!response.ok) {
                    throw new Error("Something went wrong!");
                }

                const responseJson = await response.json();

                const loadedBook: BookModel = {
                    id: responseJson.id,
                    title: responseJson.title,
                    author: responseJson.author,
                    description: responseJson.description,
                    copies: responseJson.copies,
                    copiesAvailable: responseJson.copiesAvailable,
                    category: responseJson.category,
                    img: responseJson.img,
                };

                setBook(loadedBook);
                setIsLoading(false);
            } catch (error: any) {
                setIsLoading(false);
                setHttpError(error.message);
            }
        };

        fetchBook();
    }, [bookId]);

    // --- EFFECT 2: FETCH REVIEWS ---
    useEffect(() => {
        const fetchBookReviews = async () => {
            try {
                const reviewUrl = `http://localhost:8082/api/reviews/search/findByBookId?bookId=${bookId}`;
                const response = await fetch(reviewUrl);

                if (!response.ok) {
                    throw new Error("Something went wrong!");
                }

                const responseJson = await response.json();
                const responseData = responseJson._embedded?.reviews || [];

                const loadedReviews: ReviewModel[] = [];
                let weightedStarReviews = 0;

                // Dùng vòng lặp for...of để duyệt mảng object tốt hơn for...in
                for (const review of responseData) {
                    loadedReviews.push({
                        id: review.id,
                        userEmail: review.userEmail,
                        date: review.date,
                        rating: review.rating,
                        book_id: review.bookId, // Chú ý: Backend trả về bookId hay book_id? Kiểm tra lại entity Spring Boot
                        reviewDescription: review.reviewDescription,
                    });
                    weightedStarReviews += review.rating;
                }

                if (loadedReviews.length > 0) {
                    const round = (Math.round((weightedStarReviews / loadedReviews.length) * 2) / 2).toFixed(1);
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

    // --- RENDERING ---

    // 1. Loading
    if (isLoading || isLoadingReview) {
        return <SprinnerLoading />;
    }

    // 2. Error
    if (httpError) {
        return (
            <div className="container mt-5">
                <p>{httpError}</p>
            </div>
        );
    }

    // 3. Main Content
    return (
        <div>
            {/* Desktop View */}
            <div className='container d-none d-lg-block'>
                <div className='row mt-5'>
                    <div className='col-sm-2 col-md-2'>
                        {book?.img ? (
                            <img src={book?.img} width='226' height='349' alt='Book' />
                        ) : (
                            <img
                                src={require('./../../Images/BooksImages/book-luv2code-1000.png')}
                                width='226'
                                height='349'
                                alt='Book'
                            />
                        )}
                    </div>
                    <div className='col-4 col-md-4 container'>
                        <div className='ml-2'>
                            <h2>{book?.title}</h2>
                            <h5 className='text-primary'>{book?.author}</h5>
                            <p className='lead'>{book?.description}</p>
                            <StarsReview rating={totalStars} size={32} />
                        </div>
                    </div>
                    <CheckoutAndReviewBox book={book} mobile={false} />
                </div>
                <hr />
                <LatestReviews reviews={reviews} bookId={book?.id} mobile={false} />
            </div>

            {/* Mobile View */}
            <div className='container d-lg-none mt-5'>
                <div className='d-flex justify-content-center align-items-center'>
                    {book?.img ? (
                        <img src={book?.img} width='226' height='349' alt='Book' />
                    ) : (
                        <img
                            src={require('./../../Images/BooksImages/book-luv2code-1000.png')}
                            width='226'
                            height='349'
                            alt='Book'
                        />
                    )}
                </div>
                <div className='mt-4'>
                    <div className='ml-2'>
                        <h2>{book?.title}</h2>
                        <h5 className='text-primary'>{book?.author}</h5>
                        <p className='lead'>{book?.description}</p>
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