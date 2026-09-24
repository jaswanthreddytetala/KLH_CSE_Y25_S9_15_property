package algorithms.randomized;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class RandomizedQuickSort {
    public static List<Integer> sort(List<Integer> data) {
        if (data == null) {
            return new ArrayList<>();
        }
        List<Integer> copy = new ArrayList<>(data);
        if (copy.size() <= 1) {
            return copy;
        }
        quickSort(copy, 0, copy.size() - 1);
        return copy;
    }

    private static void quickSort(List<Integer> data, int low, int high) {
        if (low >= high) {
            return;
        }

        int pivotIndex = low + (int) (Math.random() * (high - low + 1));
        int pivotValue = data.get(pivotIndex);
        int left = low;
        int right = high;

        while (left <= right) {
            while (data.get(left) < pivotValue) {
                left++;
            }
            while (data.get(right) > pivotValue) {
                right--;
            }
            if (left <= right) {
                Collections.swap(data, left, right);
                left++;
                right--;
            }
        }

        if (low < right) {
            quickSort(data, low, right);
        }
        if (left < high) {
            quickSort(data, left, high);
        }
    }

    public static List<String> explain() {
        List<String> steps = new ArrayList<>();
        steps.add("Random pivot selection keeps output correct while runtime varies by random choices");
        steps.add("Partition step moves smaller elements left and larger ones right");
        steps.add("Recursive calls continue until array is sorted");
        steps.add("Average time complexity: O(n log n)");
        steps.add("Worst-case time complexity: O(n^2)");
        return steps;
    }
}
