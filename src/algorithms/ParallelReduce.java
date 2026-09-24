package algorithms;

public class ParallelReduce {
    public static int reduce(int[] data) {
        int sum = 0;
        for (int value : data) {
            sum += value;
        }
        return sum;
    }
}
