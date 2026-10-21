
package com.educamais;

import java.security.SecureRandom;
import java.util.Base64;

public class GerarChave {

    public static void main(String[] args) {

        byte[] chave = new byte[32];

        new SecureRandom().nextBytes(chave);

        String chaveBase64 = Base64.getEncoder()
                .encodeToString(chave);

        System.out.println("Chave JWT:");
        System.out.println(chaveBase64);
    }
}
