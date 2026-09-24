package algorithms.string;

import java.util.ArrayList;
import java.util.List;

public class RabinKarp {
    public static List<Integer> search(String text, String pattern, long base, long modulus) {
        List<Integer> matches = new ArrayList<>();
        if (text == null || pattern == null || pattern.isEmpty() || base <= 1 || modulus <= 1) {
            return matches;
        }

        if (pattern.length() > text.length()) {
            return matches;
        }

        long patternHash = 0;
        long windowHash = 0;
        long power = 1;

        for (int i = 0; i < pattern.length(); i++) {
            power = (i == 0) ? 1 : (power * base) % modulus;
        }

        for (int i = 0; i < pattern.length(); i++) {
            patternHash = (patternHash * base + pattern.charAt(i)) % modulus;
            windowHash = (windowHash * base + text.charAt(i)) % modulus;
        }

        for (int i = 0; i <= text.length() - pattern.length(); i++) {
            if (windowHash == patternHash && text.substring(i, i + pattern.length()).equals(pattern)) {
                matches.add(i);
            }

            if (i + pattern.length() < text.length()) {
                windowHash = (windowHash - text.charAt(i) * power % modulus + modulus) % modulus;
                windowHash = (windowHash * base + text.charAt(i + pattern.length())) % modulus;
            }
        }

        return matches;
    }
}
