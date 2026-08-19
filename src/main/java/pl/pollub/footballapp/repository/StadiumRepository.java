package pl.pollub.footballapp.repository;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import pl.pollub.footballapp.model.City;
import pl.pollub.footballapp.model.Stadium;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface StadiumRepository extends JpaRepository<Stadium, Long> {
    Optional<Stadium> findByNameAndCity_Id(String name, Long cityId);

    boolean existsByNameAndCity(String name, City city);

    @Query("SELECT s FROM Stadium s WHERE LOWER(s.name) LIKE %:query% OR LOWER(s.city.name) LIKE %:query%")
    List<Stadium> findByNameContainingOrCityNameContaining(@Param("query") String query, Sort sort);
}
