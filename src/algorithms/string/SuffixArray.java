package algorithms.string;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class SuffixArray {
    public static List<Integer> build(String text) {
        if (text == null || text.isEmpty()) {
            return new ArrayList<>();
        }

        List<String> suffixes = new ArrayList<>();
        for (int i = 0; i < text.length(); i++) {
            suffixes.add(text.substring(i));
        }

        Collections.sort(suffixes);

        List<Integer> result = new ArrayList<>();
        for (String suffix : suffixes) {
            result.add(text.indexOf(suffix));
        }
        return result;
    }

    public static List<String> suffixes(String text) {
        List<String> result = new ArrayList<>();
        if (text == null || text.isEmpty()) {
            return result;
        }

        for (int i = 0; i < text.length(); i++) {
            result.add(text.substring(i));
        }
        return result;
    }
}
