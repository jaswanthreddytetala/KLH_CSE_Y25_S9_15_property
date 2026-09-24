package algorithms.string;

import java.util.ArrayList;
import java.util.List;

public class ZAlgorithm {
    public static int[] zValues(String s) {
        if (s == null || s.isEmpty()) {
            return new int[0];
        }

        int[] z = new int[s.length()];
        int left = 0;
        int right = 0;

        for (int i = 1; i < s.length(); i++) {
            if (i <= right) {
                z[i] = Math.min(right - i + 1, z[i - left]);
            }

            while (i + z[i] < s.length() && s.charAt(z[i]) == s.charAt(i + z[i])) {
                z[i]++;
            }

            if (i + z[i] - 1 > right) {
                left = i;
                right = i + z[i] - 1;
            }
        }

        return z;
    }

    public static List<Integer> findMatches(String text, String pattern) {
        List<Integer> matches = new ArrayList<>();
        if (text == null || pattern == null || pattern.isEmpty()) {
            return matches;
        }

        String combined = pattern + "#" + text;
        int[] z = zValues(combined);
        for (int i = 0; i < z.length; i++) {
            if (z[i] >= pattern.length()) {
                matches.add(i - pattern.length() - 1);
            }
        }
        return matches;
    }
}
