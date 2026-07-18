package com.overthecode.backend.module;

import com.overthecode.backend.chapter.Chapter;
import jakarta.persistence.*;

@Entity
@Table(name = "modules")
public class Module {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @ManyToOne
    @JoinColumn(name = "chapter_id")
    private Chapter chapter;
}