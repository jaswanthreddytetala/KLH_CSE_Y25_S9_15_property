package parallel;

import java.util.ArrayList;
import java.util.List;

public class ParallelPrefixSum {
    public static List<Integer> prefixSum(int[] data) {
        List<Integer> result = new ArrayList<>();
        if (data == null || data.length == 0) {
            return result;
        }

        int running = 0;
        for (int value : data) {
            running += value;
            result.add(running);
        }
        return result;
    }

    public static int reduce(int[] data) {
        if (data == null || data.length == 0) {
            return 0;
        }

        int sum = 0;
        for (int value : data) {
            sum += value;
        }
        return sum;
    }
}
