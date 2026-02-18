package com.example.Library_app.dao;

import com.example.Library_app.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.RequestParam;

// CHÚ Ý DÒNG NÀY:
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    // Hàm này sẽ hết lỗi
    Page<Review> findByBookId(@RequestParam("book_id") Long bookId, Pageable pageable);
}