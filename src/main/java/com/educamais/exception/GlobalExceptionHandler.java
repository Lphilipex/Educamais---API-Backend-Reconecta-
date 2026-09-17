package com.educamais.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> tratarErrosValidacao(
            MethodArgumentNotValidException erro) {

        Map<String, Object> resposta = new HashMap<>();

        Map<String, String> erros = new HashMap<>();

        erro.getBindingResult().getFieldErrors().forEach(error ->
                erros.put(error.getField(), error.getDefaultMessage())
        );

        resposta.put("status", 400);
        resposta.put("mensagem", "Existem dados inválidos");
        resposta.put("erros", erros);

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(resposta);
    }
    @ExceptionHandler(RecursoNaoEncontradoException.class)
    public ResponseEntity<Map<String, Object>> tratarRecursoNaoEncontrado(
            RecursoNaoEncontradoException erro) {

        Map<String, Object> resposta = new HashMap<>();

        resposta.put("status", 404);
        resposta.put("mensagem", erro.getMessage());

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(resposta);
    }
}
