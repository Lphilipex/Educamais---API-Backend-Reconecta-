
package com.educamais.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.educamais.model.Curso;

public interface CursoRepository extends JpaRepository<Curso, Long> {
}
