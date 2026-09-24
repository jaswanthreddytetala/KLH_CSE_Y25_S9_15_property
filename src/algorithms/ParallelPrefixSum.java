package algorithms;

import java.util.ArrayList;
import java.util.List;

public class ParallelPrefixSum {
    public static List<Integer> prefixSum(int[] data) {
        List<Integer> result = new ArrayList<>();
        int running = 0;
        for (int value : data) {
            running += value;
            result.add(running);
        }
        return result;
    }
}
