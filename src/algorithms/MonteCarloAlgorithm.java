package algorithms;

public class MonteCarloAlgorithm {
    public static double estimatePi(int samples) {
        int inside = 0;
        for (int i = 0; i < samples; i++) {
            double x = Math.random();
            double y = Math.random();
            if (x * x + y * y <= 1.0) {
                inside++;
            }
        }
        return 4.0 * inside / samples;
    }
}
