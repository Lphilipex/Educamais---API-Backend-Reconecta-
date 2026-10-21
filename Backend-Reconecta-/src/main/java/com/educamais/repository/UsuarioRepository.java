
package com.educamais.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.educamais.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Verifica se o e-mail já está cadastrado.
    boolean existsByEmail(String email);

    // Busca um usuário pelo e-mail.
    Optional<Usuario> findByEmail(String email);

    // Lista somente os usuários ativos.
    List<Usuario> findAllByAtivoTrue();

    // Busca um usuário ativo pelo ID.
    Optional<Usuario> findByIdAndAtivoTrue(Long id);

    // Busca um usuário ativo pelo e-mail.
    Optional<Usuario> findByEmailAndAtivoTrue(String email);
}
