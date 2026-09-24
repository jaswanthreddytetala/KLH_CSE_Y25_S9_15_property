package algorithms;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class LasVegasAlgorithm {
    public static List<Integer> sort(List<Integer> input) {
        List<Integer> copy = new ArrayList<>(input);
        Collections.shuffle(copy);
        Collections.sort(copy);
        return copy;
    }
}
