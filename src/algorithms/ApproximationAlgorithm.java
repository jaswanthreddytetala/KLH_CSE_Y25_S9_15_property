package algorithms;

public class ApproximationAlgorithm {
    public static double approximationRatio(int approximateSize, int optimalSize) {
        if (optimalSize <= 0) {
            return 0.0;
        }
        return (double) approximateSize / optimalSize;
    }
}
