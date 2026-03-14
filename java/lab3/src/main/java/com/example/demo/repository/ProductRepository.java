package com.example.demo.repository;

import com.example.demo.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.math.BigDecimal;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    /** Продукты с ценой больше указанной */
    List<Product> findByPriceGreaterThan(BigDecimal price);

    /** Поиск по имени (содержит) */
    List<Product> findByNameContainingIgnoreCase(String name);

    /** Фильтр по диапазону цены */
    List<Product> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);
}
