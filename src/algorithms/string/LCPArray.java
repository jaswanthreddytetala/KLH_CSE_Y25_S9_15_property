package algorithms.string;

import java.util.ArrayList;
import java.util.List;

public class LCPArray {
    public static List<Integer> build(String text, List<Integer> suffixArray) {
        List<Integer> lcp = new ArrayList<>();
        if (text == null || text.isEmpty() || suffixArray == null || suffixArray.size() < 2) {
            return lcp;
        }

        int[] rank = new int[text.length()];
        for (int i = 0; i < suffixArray.size(); i++) {
            rank[suffixArray.get(i)] = i;
        }

        int[] lcpValues = new int[text.length()];
        int h = 0;
        for (int i = 0; i < text.length(); i++) {
            if (rank[i] > 0) {
                int j = suffixArray.get(rank[i] - 1);
                while (i + h < text.length() && j + h < text.length() && text.charAt(i + h) == text.charAt(j + h)) {
                    h++;
                }
                lcpValues[rank[i]] = h;
                if (h > 0) {
                    h--;
                }
            }
        }

        for (int value : lcpValues) {
            lcp.add(value);
        }
        return lcp;
    }
}
