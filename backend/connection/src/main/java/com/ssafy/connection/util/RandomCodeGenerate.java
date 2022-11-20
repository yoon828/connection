package com.ssafy.connection.util;

import java.util.Random;

public class RandomCodeGenerate {
    public static String generate() {

        Random random = new Random();
        StringBuffer buf =new StringBuffer();

        for (int i=0; i<6; i++) {
            if (random.nextBoolean()) {
                buf.append((char)((int)(random.nextInt(26))+97));
            }
            else {
                buf.append((random.nextInt(10)));
            }
        }
        String studyCode = String.valueOf(buf);

        return studyCode;
    }
}
