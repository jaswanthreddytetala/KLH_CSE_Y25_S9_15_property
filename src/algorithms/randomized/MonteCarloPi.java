package algorithms.randomized;

public class MonteCarloPi {
    public static double estimatePi(int samples) {
        if (samples <= 0) {
            return 0.0;
        }

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
