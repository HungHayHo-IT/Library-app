package com.example.Library_app.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "book")
@Data
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name = "author")
    private String author;

    // SỬA Ở ĐÂY: Thêm columnDefinition = "TEXT"
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "copies")
    private int copies;

    @Column(name = "copies_available")
    private int copiesAvailable;

    @Column(name = "category")
    private String category;

    // SỬA Ở ĐÂY: Thêm columnDefinition = "MEDIUMTEXT" hoặc "TEXT"
    @Column(name = "img", columnDefinition = "MEDIUMTEXT")
    private String img;
}