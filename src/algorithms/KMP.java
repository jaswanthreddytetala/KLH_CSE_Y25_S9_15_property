package algorithms;

import java.util.List;

public class KMP {
    public static int search(String text, String pattern) {
        if (text == null || pattern == null) {
            return 0;
        }
        return algorithms.string.KMPAlgorithm.search(text, pattern).size();
    }

    public static int[] lps(String pattern) {
        return algorithms.string.KMPAlgorithm.buildLPS(pattern);
    }
}
